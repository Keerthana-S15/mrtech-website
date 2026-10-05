// // backend/routes/geocode.js
// //
// // This proxies requests to Nominatim (OpenStreetMap's free geocoding service)
// // through our own backend, to avoid CORS/rate-limit blocks that happen when
// // calling Nominatim directly from the browser.

// const express = require("express");
// const router = express.Router();

// // Node 18+ has global fetch. If your Node version is older, install node-fetch
// // and uncomment the next line:
// // const fetch = require("node-fetch");

// // GET /api/geocode/search?q=kallakurichi
// router.get("/search", async (req, res) => {
//   const { q } = req.query;
//   if (!q || q.trim().length < 3) {
//     return res.json([]);
//   }

//   try {
//     const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//       q
//     )}&format=json&addressdetails=1&limit=5&countrycodes=in`;

//     const response = await fetch(url, {
//       headers: {
//         // Nominatim's usage policy requires an identifying User-Agent
//         "User-Agent": "mrtech-website/1.0 (contact: your-email@example.com)",
//         "Accept-Language": "en",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Nominatim responded with status ${response.status}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Geocode search error:", error.message);
//     res.status(500).json({ error: "Failed to search location" });
//   }
// });

// // GET /api/geocode/reverse?lat=12.34&lon=56.78
// router.get("/reverse", async (req, res) => {
//   const { lat, lon } = req.query;
//   if (!lat || !lon) {
//     return res.status(400).json({ error: "lat and lon are required" });
//   }

//   try {
//     const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

//     const response = await fetch(url, {
//       headers: {
//         "User-Agent": "mrtech-website/1.0 (contact: your-email@example.com)",
//         "Accept-Language": "en",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Nominatim responded with status ${response.status}`);
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Reverse geocode error:", error.message);
//     res.status(500).json({ error: "Failed to get address" });
//   }
// });

// module.exports = router;




import express from "express";

const router = express.Router();

const NOMINATIM = "https://nominatim.openstreetmap.org";

/**
 * Nominatim's usage policy allows at most one request per second from a single
 * source and requires a real contact address in the User-Agent. Every customer
 * on the site shares this server's IP, so without pacing a handful of people
 * typing at once would get us blocked outright. Requests are therefore funnelled
 * through one queue with a minimum gap, and repeated lookups are served from a
 * short-lived cache instead of going out again.
 */
const MIN_GAP_MS = 1100;
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX = 500;

const CONTACT =
  process.env.NOMINATIM_CONTACT || "contact@mythrealitytechnologies.com";
const USER_AGENT = `mrtech-website/1.0 (${CONTACT})`;

const cache = new Map();
let chain = Promise.resolve();
let lastCall = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callNominatim(url) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;

  // serialise: each call waits for the previous one, then for the rate gap
  const run = chain.then(async () => {
    const gap = Date.now() - lastCall;
    if (gap < MIN_GAP_MS) await sleep(MIN_GAP_MS - gap);
    lastCall = Date.now();
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
    });
    if (!response.ok) {
      throw new Error(`Nominatim responded with status ${response.status}`);
    }
    return response.json();
  });
  // keep the chain alive even when one call fails
  chain = run.catch(() => {});

  const data = await run;
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(url, { at: Date.now(), data });
  return data;
}

// addressdetails gives the structured fields the picker needs to judge how
// precise a match is; countrycodes keeps results inside India.
const TAIL = "&format=json&addressdetails=1&limit=5&countrycodes=in";

const searchUrl = (q) => `${NOMINATIM}/search?q=${encodeURIComponent(q)}${TAIL}`;
const postcodeUrl = (pin) => `${NOMINATIM}/search?postalcode=${encodeURIComponent(pin)}${TAIL}`;

router.get("/geocode/search", async (req, res) => {
  const { q, postalcode } = req.query;
  if (postalcode) {
    try {
      return res.json(await callNominatim(postcodeUrl(String(postalcode).trim())));
    } catch (error) {
      console.error("🔥 Geocode search error:", error.message);
      return res.status(502).json({ error: "Failed to search location" });
    }
  }
  if (!q || q.trim().length < 3) {
    return res.json([]);
  }
  try {
    res.json(await callNominatim(searchUrl(q.trim())));
  } catch (error) {
    console.error("🔥 Geocode search error:", error.message);
    res.status(502).json({ error: "Failed to search location" });
  }
});

/**
 * Builds the ladder of queries tried for one typed address, most faithful first.
 *
 * Nominatim's free-form search is conjunctive: every token has to match
 * something, so one locality OSM has never heard of ("Gandhipuram, Thiruvallur")
 * returns nothing at all for an address that is otherwise perfectly valid. Each
 * rung therefore asks for less than the one above it.
 *
 * `trust` records how much was given up to get an answer. Only "exact" - the
 * address as the customer wrote it - may ever be turned into a pin; anything
 * found by weakening the query can at best move the map to the right area.
 */
function buildPlan(input) {
  const full = input.trim();
  const pin = (full.match(/\b(\d{6})\b/) || [])[1] || "";

  // a door number or a landmark in brackets is never in OSM and only ever
  // causes the whole query to miss
  const stripped = full
    .replace(/\([^)]*\)/g, " ")
    .replace(/^\s*(no\.?|door|flat|plot|#)?\s*[\d/-]+\s*,\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/^[,\s-]+|[,\s-]+$/g, "");

  const steps = [{ q: full, trust: "exact" }];
  if (stripped && stripped !== full) steps.push({ q: stripped, trust: "exact" });

  // drop the most specific part, then the next
  const parts = stripped.split(",").map((s) => s.trim()).filter(Boolean);
  for (let drop = 1; drop < parts.length && drop <= 2; drop++) {
    const q = parts.slice(drop).join(", ");
    if (q.length >= 3) steps.push({ q, trust: "reduced" });
  }

  // the PIN code is the one part of an Indian address that resolves on its own
  if (pin) steps.push({ postalcode: pin, trust: "pin" });

  return steps;
}

router.get("/geocode/resolve", async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 3) {
    return res.json({ trust: "none", usedQuery: "", results: [] });
  }

  const tried = [];
  try {
    for (const step of buildPlan(String(q))) {
      const url = step.postalcode ? postcodeUrl(step.postalcode) : searchUrl(step.q);
      const label = step.postalcode ? `PIN ${step.postalcode}` : step.q;
      tried.push(label);
      const data = await callNominatim(url);
      if (Array.isArray(data) && data.length) {
        return res.json({ trust: step.trust, usedQuery: label, tried, results: data });
      }
    }
    res.json({ trust: "none", usedQuery: "", tried, results: [] });
  } catch (error) {
    console.error("🔥 Geocode resolve error:", error.message);
    res.status(502).json({ error: "Failed to search location" });
  }
});

router.get("/geocode/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required" });
  }

  try {
    const url =
      `${NOMINATIM}/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}` +
      `&format=json&addressdetails=1&zoom=18`;
    res.json(await callNominatim(url));
  } catch (error) {
    console.error("🔥 Reverse geocode error:", error.message);
    res.status(502).json({ error: "Failed to get address" });
  }
});

export default router;
