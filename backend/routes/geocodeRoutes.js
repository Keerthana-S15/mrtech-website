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

router.get("/geocode/search", async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 3) {
    return res.json([]);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      q
    )}&format=json&addressdetails=1&limit=5&countrycodes=in`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "mrtech-website/1.0 (contact: your-email@example.com)",
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("🔥 Geocode search error:", error.message);
    res.status(500).json({ error: "Failed to search location" });
  }
});

router.get("/geocode/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required" });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "mrtech-website/1.0 (contact: your-email@example.com)",
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("🔥 Reverse geocode error:", error.message);
    res.status(500).json({ error: "Failed to get address" });
  }
});

export default router;