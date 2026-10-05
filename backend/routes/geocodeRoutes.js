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
 * Nominatim allows at most one request per second from a source and requires a
 * real contact in the User-Agent. Every customer on the site shares this
 * server's IP, so all of it has to be enforced here, globally, rather than per
 * browser. Three things keep us under the limit:
 *
 *   - one queue, so no two calls are ever in flight at once and consecutive
 *     calls are at least MIN_GAP_MS apart;
 *   - a cache, so a repeated lookup never leaves the process;
 *   - in-flight de-duplication, so N callers asking for the same URL at the same
 *     moment make one request between them rather than N.
 *
 * If Nominatim still answers 429 we back off and, for a short while afterwards,
 * refuse to queue anything new - hammering a rate limiter is what turns a brief
 * throttle into a ban.
 */
const MIN_GAP_MS = 1100; // > 1/sec, with margin for clock jitter
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX = 500;
const MAX_RETRIES = 2;
const COOLDOWN_MS = 20 * 1000;

const CONTACT =
  process.env.NOMINATIM_CONTACT || "contact@mythrealitytechnologies.com";
const USER_AGENT = `mrtech-website/1.0 (${CONTACT})`;

const cache = new Map();
const inflight = new Map();
let chain = Promise.resolve();
let lastCall = 0;
let blockedUntil = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Thrown when we are rate limited; carries how long to wait. */
class RateLimited extends Error {
  constructor(retryAfterMs) {
    super("Nominatim rate limit reached");
    this.name = "RateLimited";
    this.retryAfterMs = retryAfterMs;
  }
}

const cacheGet = (url) => {
  const hit = cache.get(url);
  if (!hit) return undefined;
  if (Date.now() - hit.at >= CACHE_TTL_MS) {
    cache.delete(url);
    return undefined;
  }
  return hit.data;
};

const cacheSet = (url, data) => {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(url, { at: Date.now(), data });
};

/** One paced trip to Nominatim, retrying only on 429. */
async function fetchPaced(url, attempt = 0) {
  const gap = Date.now() - lastCall;
  if (gap < MIN_GAP_MS) await sleep(MIN_GAP_MS - gap);
  lastCall = Date.now();

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "en" },
  });

  if (response.status === 429) {
    // Retry-After is in seconds when present; fall back to doubling
    const header = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(header) && header > 0
      ? header * 1000
      : 1000 * Math.pow(2, attempt);

    if (attempt >= MAX_RETRIES) {
      blockedUntil = Date.now() + Math.max(waitMs, COOLDOWN_MS);
      throw new RateLimited(blockedUntil - Date.now());
    }
    console.warn(`⏳ Nominatim 429, backing off ${waitMs}ms (attempt ${attempt + 1})`);
    await sleep(waitMs);
    return fetchPaced(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Nominatim responded with status ${response.status}`);
  }
  return response.json();
}

async function callNominatim(url) {
  const cached = cacheGet(url);
  if (cached !== undefined) return cached;

  // someone is already asking for exactly this - wait on their answer
  const already = inflight.get(url);
  if (already) return already;

  if (Date.now() < blockedUntil) {
    throw new RateLimited(blockedUntil - Date.now());
  }

  const run = chain.then(() => fetchPaced(url));
  // keep the queue alive even when one call fails
  chain = run.catch(() => {});
  inflight.set(url, run);

  try {
    const data = await run;
    // empty answers are cached too: asking again changes nothing and a miss is
    // exactly the kind of query a customer retypes
    cacheSet(url, data);
    return data;
  } finally {
    inflight.delete(url);
  }
}

/** Turns any failure into the right status and a message a customer can act on. */
function fail(res, error, what) {
  if (error instanceof RateLimited) {
    const seconds = Math.max(1, Math.ceil(error.retryAfterMs / 1000));
    return res.status(429).json({
      error: "rate_limited",
      retryAfter: seconds,
      message: `Address lookup is busy. Try again in about ${seconds} seconds, or tap your spot on the map.`,
    });
  }
  console.error(`🔥 ${what}:`, error.message);
  return res.status(502).json({ error: "Failed to search location" });
}

// addressdetails gives the structured fields the picker needs to judge how
// precise a match is; countrycodes keeps results inside India.
const TAIL = "&format=json&addressdetails=1&limit=5&countrycodes=in";

const searchUrl = (q) => `${NOMINATIM}/search?q=${encodeURIComponent(q)}${TAIL}`;
const postcodeUrl = (pin) => `${NOMINATIM}/search?postalcode=${encodeURIComponent(pin)}${TAIL}`;

router.get("/geocode/search", async (req, res) => {
  const { q, postalcode } = req.query;
  try {
    if (postalcode) {
      return res.json(await callNominatim(postcodeUrl(String(postalcode).trim())));
    }
    if (!q || q.trim().length < 3) return res.json([]);
    res.json(await callNominatim(searchUrl(q.trim())));
  } catch (error) {
    fail(res, error, "Geocode search error");
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
    fail(res, error, "Geocode resolve error");
  }
});

router.get("/geocode/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required" });
  }

  try {
    // Rounded to ~1m before it becomes a cache key: two taps a few centimetres
    // apart are the same doorstep and must not cost two lookups.
    const la = Number(lat).toFixed(5);
    const lo = Number(lon).toFixed(5);
    const url =
      `${NOMINATIM}/reverse?lat=${la}&lon=${lo}` +
      `&format=json&addressdetails=1&zoom=18`;
    res.json(await callNominatim(url));
  } catch (error) {
    fail(res, error, "Reverse geocode error");
  }
});

export default router;
