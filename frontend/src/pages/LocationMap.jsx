// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix default marker icon issue in React (Leaflet's default icons don't load properly with bundlers)
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Default center - set this to your area (Thiruvallur / Chennai)
// const DEFAULT_CENTER = [13.1231, 79.9120]; // Thiruvallur coordinates

// // Component that listens for map clicks and drops a pin
// function LocationMarker({ position, setPosition }) {
//   useMapEvents({
//     click(e) {
//       setPosition([e.latlng.lat, e.latlng.lng]);
//     },
//   });
//   return position ? <Marker position={position} /> : null;
// }

// export default function LocationMap({ onLocationSelect }) {
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [position, setPosition] = useState(DEFAULT_CENTER);
//   const [addressText, setAddressText] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Search addresses via our OWN backend (which proxies Nominatim) — avoids CORS issues
//   const searchAddress = async (text) => {
//     setQuery(text);
//     if (text.length < 3) {
//       setSuggestions([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(text)}`);
//       if (!res.ok) throw new Error("Search request failed");
//       const data = await res.json();
//       setSuggestions(data);
//     } catch (err) {
//       console.error("Address search failed:", err);
//       setSuggestions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // When user picks a suggestion from the dropdown
//   const handleSelectSuggestion = (place) => {
//     const lat = parseFloat(place.lat);
//     const lon = parseFloat(place.lon);
//     setPosition([lat, lon]);
//     setAddressText(place.display_name);
//     setQuery(place.display_name);
//     setSuggestions([]);
//     if (onLocationSelect) {
//       onLocationSelect({ lat, lng: lon, address: place.display_name });
//     }
//   };

//   // When user clicks directly on the map, reverse-geocode to get address text
//   const handleMapClick = async (newPosition) => {
//     setPosition(newPosition);
//     try {
//       const res = await fetch(
//         `/api/geocode/reverse?lat=${newPosition[0]}&lon=${newPosition[1]}`
//       );
//       if (!res.ok) throw new Error("Reverse geocode request failed");
//       const data = await res.json();
//       const address = data.display_name || "Selected location";
//       setAddressText(address);
//       setQuery(address);
//       if (onLocationSelect) {
//         onLocationSelect({ lat: newPosition[0], lng: newPosition[1], address });
//       }
//     } catch (err) {
//       console.error("Reverse geocode failed:", err);
//     }
//   };

//   return (
//     <div style={{ width: "100%" }}>
//       {/* Search box */}
//       <div style={{ position: "relative", marginBottom: "10px" }}>
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => searchAddress(e.target.value)}
//           placeholder="Search your area, street, landmark..."
//           style={{
//             width: "100%",
//             padding: "12px",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             fontSize: "15px",
//             boxSizing: "border-box",
//           }}
//         />
//         {loading && (
//           <div style={{ position: "absolute", right: "12px", top: "12px", fontSize: "13px", color: "#999" }}>
//             Searching...
//           </div>
//         )}

//         {/* Suggestions dropdown */}
//         {suggestions.length > 0 && (
//           <div
//             style={{
//               position: "absolute",
//               top: "100%",
//               left: 0,
//               right: 0,
//               background: "#fff",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               marginTop: "4px",
//               zIndex: 1000,
//               maxHeight: "220px",
//               overflowY: "auto",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             }}
//           >
//             {suggestions.map((place, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => handleSelectSuggestion(place)}
//                 style={{
//                   padding: "10px 12px",
//                   cursor: "pointer",
//                   borderBottom: idx !== suggestions.length - 1 ? "1px solid #eee" : "none",
//                   fontSize: "14px",
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
//                 onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
//               >
//                 {place.display_name}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Map */}
//       <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #ddd" }}>
//         <MapContainer
//           center={position}
//           zoom={15}
//           style={{ height: "350px", width: "100%" }}
//           key={position.join(",")} // re-centers map when position changes
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <LocationMarker position={position} setPosition={handleMapClick} />
//         </MapContainer>
//       </div>

//       {/* Selected address preview */}
//       {addressText && (
//         <div
//           style={{
//             marginTop: "10px",
//             padding: "10px",
//             background: "#f8f8f8",
//             borderRadius: "8px",
//             fontSize: "14px",
//           }}
//         >
//           <strong>Selected:</strong> {addressText}
//         </div>
//       )}

//       <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
//         Tip: Type to search, or click directly on the map to drop a pin.
//       </p>
//     </div>
//   );
// }





import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in React (Leaflet's default icons don't load properly with bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Default center - set this to your area (Thiruvallur / Chennai)
const DEFAULT_CENTER = [13.1231, 79.9120]; // Thiruvallur coordinates
const DEFAULT_ZOOM = 15;
// Building-level zoom, used once a point is actually pinned.
const PRECISE_ZOOM = 18;
// Ceiling when flying to an area match, so a whole district does not fill the map.
const AREA_MAX_ZOOM = 16;

// Geocoding goes through our own backend, which talks to Nominatim with a proper
// User-Agent and paces the calls. Calling Nominatim straight from the browser is
// against its usage policy and gets blocked.
const GEOCODE_SEARCH = "/api/geocode/search";
const GEOCODE_RESOLVE = "/api/geocode/resolve";
const GEOCODE_REVERSE = "/api/geocode/reverse";
const SEARCH_DEBOUNCE_MS = 600; // Nominatim allows ~1 call/sec; do not crowd it

// A result whose bounding box is wider than this is an area, not an address, so
// its centre is not somewhere a courier can deliver to.
const PRECISE_SPAN_M = 400;

// ~0.1 m of precision; enough for a doorstep and short enough to store cleanly.
const round6 = (n) => Math.round(n * 1e6) / 1e6;

// Words that say where something is rather than naming it, so they should not
// count for or against whether a result matches what the customer typed.
const FILLER = new Set(["near", "opposite", "behind", "beside", "india", "landmark"]);

/** Widest side of a Nominatim bounding box, in metres. */
function spanMeters([south, north, west, east]) {
  const midLat = ((south + north) / 2) * (Math.PI / 180);
  return Math.max(
    (north - south) * 111320,
    (east - west) * 111320 * Math.cos(midLat)
  );
}

/** Readable address from Nominatim's structured fields, nearest part first. */
function formatAddress(result) {
  const a = result.address || {};
  const parts = [
    [a.house_number, a.road].filter(Boolean).join(" "),
    a.neighbourhood,
    a.suburb,
    a.village,
    a.town,
    a.city_district,
    a.city,
    a.county,
    a.state,
    a.postcode,
  ].filter(Boolean);
  // country is always India here (the proxy pins countrycodes=in), so drop it
  return [...new Set(parts)].join(", ") || result.display_name || "";
}

/** Flattens one Nominatim hit into what the picker actually needs. */
function toCandidate(result) {
  const bb = (result.boundingbox || []).map(Number);
  const valid = bb.length === 4 && bb.every(Number.isFinite);
  const a = result.address || {};
  return {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    label: formatAddress(result),
    displayName: result.display_name || "",
    postcode: a.postcode || "",
    hasStreet: Boolean(a.road || a.house_number),
    span: valid ? spanMeters(bb) : null,
    bounds: valid ? [[bb[0], bb[2]], [bb[1], bb[3]]] : null,
  };
}

/**
 * Zoom that frames a place of this size while staying close enough to tap a
 * doorstep. Deliberately not fitBounds: a district's bounding box is tens of
 * kilometres across and fitting it zooms out past the point of being useful.
 */
function zoomForSpan(span) {
  if (span == null) return 16;
  if (span <= 500) return 17;
  if (span <= 1500) return 16;
  if (span <= 5000) return 15;
  if (span <= 15000) return 14;
  return 13;
}

/**
 * Decides whether a result is safe to drop a pin on.
 *
 * "mismatch" - nothing that matches what was typed; never move the map for it.
 * "area"     - the right neighbourhood but only that; fly there, but do NOT
 *              pin, because the centre of a suburb is not a doorstep.
 * "precise"  - a street or building matching the address as written; pin it.
 *
 * `c.trust` says how much of the typed address actually had to be given up to
 * find this result. Anything the backend only found by weakening the query is
 * capped at "area" however tidy the result looks, because we matched less than
 * the customer wrote and cannot claim to have found their address.
 */
function assessMatch(query, c) {
  const typed = query.toLowerCase();

  if (c.trust && c.trust !== "exact") return { verdict: "area" };

  // A PIN code is the one part of an Indian address that is unambiguous. If the
  // customer gave one and the result sits under a different one, this is at best
  // the right road in the wrong place - show the area, but never pin it.
  const typedPin = (typed.match(/\b(\d{6})\b/) || [])[1];
  if (typedPin && c.postcode && c.postcode !== typedPin) {
    return { verdict: "area", why: `the closest match is in PIN code ${c.postcode}` };
  }

  const haystack = `${c.displayName} ${c.label}`.toLowerCase();
  const words = typed
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 4 && !FILLER.has(w));
  if (words.length >= 2 && !words.some((w) => haystack.includes(w))) {
    return { verdict: "mismatch", why: "it does not match what you typed" };
  }

  if (c.span != null && c.span > PRECISE_SPAN_M) return { verdict: "area" };
  if (!c.hasStreet) return { verdict: "area" };
  return { verdict: "precise" };
}

/**
 * Moves the map without rebuilding it. Takes either a centre+zoom or a bounding
 * box to fit.
 */
function RecenterMap({ view }) {
  const map = useMap();
  useEffect(() => {
    if (!view) return;
    if (view.bounds) {
      map.fitBounds(view.bounds, {
        maxZoom: view.maxZoom || AREA_MAX_ZOOM,
        padding: [24, 24],
        animate: true,
      });
      return;
    }
    // a null zoom means "pan only, leave the customer's zoom alone"
    map.setView(view.center, view.zoom == null ? map.getZoom() : view.zoom, {
      animate: true,
    });
  }, [map, view]);
  return null;
}

/** Click-to-drop plus a draggable pin for fine adjustment. */
function LocationMarker({ position, onPick }) {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });

  const handlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (!marker) return;
        const { lat, lng } = marker.getLatLng();
        onPick([lat, lng]);
      },
    }),
    [onPick]
  );

  if (!position) return null;

  return (
    <Marker
      ref={markerRef}
      position={position}
      draggable
      // pans the map when the pin is dragged towards an edge - the only way to
      // reach an off-screen spot one-handed on a phone
      autoPan
      autoPanPadding={[32, 32]}
      eventHandlers={handlers}
      keyboard
      title="Drag the pin to your exact doorstep"
      alt="Selected delivery location"
    />
  );
}

export default function LocationMap({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  // null until the customer actually settles on a point. The map starts over
  // Thiruvallur but shows no pin, so nothing claims to be chosen that was not.
  const [position, setPosition] = useState(null);
  const [view, setView] = useState(null);
  const [addressText, setAddressText] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState("");

  // Set when the code - not the customer - rewrites the search box, so the
  // debounced search does not immediately re-query the address it just filled in.
  const skipSearchRef = useRef(false);
  // Monotonic ticket: a reverse geocode only gets to write state if no newer pick
  // has started. Without it a slow lookup for an old point can land last and
  // overwrite the address of the point the customer actually chose.
  const pickSeqRef = useRef(0);
  // Latest suggestions, readable from the submit handler without re-creating it.
  const suggestionsRef = useRef([]);
  suggestionsRef.current = suggestions;
  // Handles on the in-flight typeahead so an explicit search can call it off.
  // Pressing Enter lands before the debounce fires, so without this the stale
  // typeahead answers afterwards and wipes the message the search just set.
  const typeTimerRef = useRef(null);
  const typeAbortRef = useRef(null);

  const cancelTypeahead = useCallback(() => {
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
    if (typeAbortRef.current) typeAbortRef.current.abort();
    typeTimerRef.current = null;
    typeAbortRef.current = null;
  }, []);

  const clean = useCallback((list, trust) => {
    return (Array.isArray(list) ? list : [])
      .map((r) => ({ ...toCandidate(r), trust }))
      .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng));
  }, []);

  /** Typeahead: one plain query, for the dropdown only. */
  const fetchCandidates = useCallback(
    async (text, signal) => {
      const res = await fetch(`${GEOCODE_SEARCH}?q=${encodeURIComponent(text)}`, { signal });
      if (!res.ok) throw new Error(`Search request failed (${res.status})`);
      return clean(await res.json(), "exact");
    },
    [clean]
  );

  /**
   * Explicit search: the backend walks its fallback ladder and reports how much
   * of the address it had to drop to find anything.
   */
  const resolveAddress = useCallback(
    async (text) => {
      const res = await fetch(`${GEOCODE_RESOLVE}?q=${encodeURIComponent(text)}`);
      if (!res.ok) throw new Error(`Search request failed (${res.status})`);
      const data = await res.json();
      const found = clean(data.results, data.trust);
      // when the customer gave a PIN, put the results that actually sit in it first
      const typedPin = (text.match(/\b(\d{6})\b/) || [])[1];
      if (typedPin) {
        found.sort((a, b) => (b.postcode === typedPin) - (a.postcode === typedPin));
      }
      return found;
    },
    [clean]
  );

  // Live suggestions while typing. These only populate the dropdown - the map
  // never moves off a keystroke, only off an explicit search or a chosen result.
  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    const text = query.trim();
    if (text.length < 3) {
      setSuggestions([]);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    typeAbortRef.current = controller;
    setLoading(true);
    const timer = setTimeout(async () => {
      typeTimerRef.current = null;
      try {
        const found = await fetchCandidates(text, controller.signal);
        setSuggestions(found);
        setActiveIndex(-1);
        setLoading(false);
        if (!found.length) {
          setNotice("No match for that address yet - keep typing, or tap the map.");
        } else {
          setNotice("");
        }
      } catch (err) {
        // a newer keystroke already owns the spinner - leave it alone
        if (err.name === "AbortError") return;
        console.error("Address search failed:", err);
        setSuggestions([]);
        setNotice("Search is unavailable right now - tap the map to drop your pin.");
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    typeTimerRef.current = timer;
    return () => {
      clearTimeout(timer);
      controller.abort();
      if (typeTimerRef.current === timer) typeTimerRef.current = null;
      if (typeAbortRef.current === controller) typeAbortRef.current = null;
    };
  }, [query, fetchCandidates]);

  /**
   * Turns a point into an address. Always resolves to something usable: if the
   * geocoder is unreachable we return the coordinates themselves, because the pin
   * the customer placed must still reach the order.
   */
  const describePoint = useCallback(async ([lat, lng]) => {
    const fallback = `Pinned location (${round6(lat)}, ${round6(lng)})`;
    try {
      const res = await fetch(`${GEOCODE_REVERSE}?lat=${lat}&lon=${lng}`);
      if (!res.ok) throw new Error(`Reverse geocode failed (${res.status})`);
      const data = await res.json();
      if (!data || data.error) return fallback;
      return formatAddress(data) || fallback;
    } catch (err) {
      console.error("Reverse geocode failed:", err);
      return fallback;
    }
  }, []);

  /** Publishes a confirmed point upwards and syncs the search box to it. */
  const commit = useCallback(
    (lat, lng, address) => {
      setAddressText(address);
      skipSearchRef.current = true;
      setQuery(address);
      setSuggestions([]);
      setActiveIndex(-1);
      if (onLocationSelect) {
        onLocationSelect({ lat: round6(lat), lng: round6(lng), address });
      }
    },
    [onLocationSelect]
  );

  /**
   * Drops the current pin and tells checkout there are no coordinates, used when
   * a search only resolves to an area. Leaves the typed address alone - the
   * customer still needs to read it while they tap their exact spot.
   */
  const clearPin = useCallback(() => {
    pickSeqRef.current += 1;
    setPosition(null);
    setAddressText("");
    if (onLocationSelect) onLocationSelect(null);
  }, [onLocationSelect]);

  /**
   * Map click or marker drag.
   *
   * Deliberately does NOT move the map: a point the customer just tapped or
   * dragged to is already on screen, and sliding the map after every tap makes
   * the spot they are aiming at move while they fine-tune it.
   */
  const handlePick = useCallback(
    async (next) => {
      setPosition(next);
      setNotice("");

      const seq = ++pickSeqRef.current;
      setLoading(true);
      const address = await describePoint(next);
      if (seq !== pickSeqRef.current) return; // a later pick superseded this one
      setLoading(false);
      commit(next[0], next[1], address);
    },
    [commit, describePoint]
  );

  /**
   * Acts on one geocoding result.
   *
   * `chosen` is true when the customer clicked it in the dropdown. A result they
   * picked themselves is honoured even if it looks unrelated to the text in the
   * box - they can see what they clicked. An automatic search is held to the
   * stricter test, so a blind Enter can never pin somewhere unrelated.
   */
  const applyCandidate = useCallback(
    (c, chosen) => {
      const { verdict, why } = assessMatch(query, c);

      if (verdict === "mismatch" && !chosen) {
        // Drop whatever was pinned before: it belongs to an earlier search and
        // is not the address being asked for now.
        clearPin();
        setNotice(
          `No reliable match for that address - ${why}. Pick one of the suggestions, or tap your spot on the map.`
        );
        return;
      }

      if (verdict === "precise" || chosen) {
        pickSeqRef.current += 1;
        setPosition([c.lat, c.lng]);
        setView({ center: [c.lat, c.lng], zoom: PRECISE_ZOOM });
        setNotice(
          verdict === "precise"
            ? ""
            : "That is the right area but not an exact address - drag the pin onto your doorstep."
        );
        commit(c.lat, c.lng, c.label);
        return;
      }

      // Area-only: show them where it is, but do not pretend it is their address.
      clearPin();
      setSuggestions([]);
      setActiveIndex(-1);
      setView({ center: [c.lat, c.lng], zoom: zoomForSpan(c.span) });
      setNotice(
        `${why ? `Closest match: ` : `Only the area matched: `}${c.label}. ` +
          `We could not place your exact address, so no pin was dropped - ` +
          `zoom in and tap your delivery point.`
      );
    },
    [clearPin, commit, query]
  );

  // Explicit search: Enter, or the Search button. Geocodes the whole address and
  // moves the map itself, rather than waiting for a suggestion to be clicked.
  const submitSearch = useCallback(async () => {
    cancelTypeahead();
    const text = query.trim();
    if (text.length < 3) {
      setNotice("Type at least 3 characters of your address.");
      return;
    }
    if (activeIndex >= 0 && suggestionsRef.current[activeIndex]) {
      applyCandidate(suggestionsRef.current[activeIndex], true);
      return;
    }
    setLoading(true);
    setNotice("");
    try {
      const found = await resolveAddress(text);
      setLoading(false);
      if (!found.length) {
        clearPin();
        setSuggestions([]);
        setNotice(
          "No reliable match for that address. Check the spelling or PIN code, or tap your spot on the map."
        );
        return;
      }
      // keep the alternatives on screen so a wrong first guess can be corrected
      setSuggestions(found.length > 1 ? found : []);
      applyCandidate(found[0], false);
    } catch (err) {
      setLoading(false);
      console.error("Address search failed:", err);
      setNotice("Search is unavailable right now - tap the map to drop your pin.");
    }
  }, [activeIndex, applyCandidate, cancelTypeahead, clearPin, resolveAddress, query]);

  /** Device GPS - the most accurate starting point, and one tap on a phone. */
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setNotice("This browser cannot share your location - search or tap the map.");
      return;
    }
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const next = [pos.coords.latitude, pos.coords.longitude];
        setLocating(false);
        setPosition(next);
        setView({ center: next, zoom: PRECISE_ZOOM });
        const seq = ++pickSeqRef.current;
        const address = await describePoint(next);
        if (seq !== pickSeqRef.current) return;
        commit(next[0], next[1], address);
      },
      (err) => {
        setLocating(false);
        setNotice(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied - search or tap the map instead."
            : "Could not read your location - search or tap the map instead."
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      // the picker lives inside the checkout form - never submit it from here
      e.preventDefault();
      submitSearch();
      return;
    }
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Search box */}
      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            skipSearchRef.current = false;
            setQuery(e.target.value);
          }}
          onKeyDown={handleSearchKeyDown}
          placeholder="Type your full address, then press Enter"
          autoComplete="off"
          aria-label="Search for your delivery location"
          style={{
            width: "100%",
            padding: "12px",
            paddingRight: "104px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={submitSearch}
          aria-label="Search this address"
          style={{
            position: "absolute",
            right: "6px",
            top: "6px",
            bottom: "6px",
            padding: "0 14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#f4f4f4",
            fontSize: "13px",
            cursor: "pointer",
            color: "#333",
          }}
        >
          {loading ? "..." : "Search"}
        </button>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div
            role="listbox"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginTop: "4px",
              zIndex: 1000,
              maxHeight: "220px",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {suggestions.map((c, idx) => (
              <div
                key={`${c.lat},${c.lng},${idx}`}
                role="option"
                aria-selected={idx === activeIndex}
                onClick={() => applyCandidate(c, true)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderBottom: idx !== suggestions.length - 1 ? "1px solid #eee" : "none",
                  fontSize: "14px",
                  background: idx === activeIndex ? "#f5f5f5" : "#fff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = idx === activeIndex ? "#f5f5f5" : "#fff")
                }
              >
                {c.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #ddd" }}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "350px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <RecenterMap view={view} />
          <LocationMarker position={position} onPick={handlePick} />
        </MapContainer>
      </div>

      {/* Selected address preview */}
      {addressText && position && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#f8f8f8",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <strong>Selected:</strong> {addressText}
          <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
            Pin: {round6(position[0])}, {round6(position[1])}
          </div>
        </div>
      )}

      {notice && (
        <div style={{ marginTop: "8px", fontSize: "13px", color: "#b4541b" }} role="status">
          {notice}
        </div>
      )}

      <div
        style={{
          marginTop: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
          Tip: search, tap the map, or drag the pin to your exact doorstep.
        </p>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "13px",
            cursor: locating ? "default" : "pointer",
            color: "#333",
            whiteSpace: "nowrap",
          }}
        >
          {locating ? "Locating..." : "Use my current location"}
        </button>
      </div>
    </div>
  );
}
