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
const GEOCODE_RESOLVE = "/api/geocode/resolve";
const GEOCODE_REVERSE = "/api/geocode/reverse";
// Two points closer together than this are the same doorstep as far as an
// address is concerned, so moving the pin that little reuses the address we
// already have instead of spending a Nominatim call on it.
const SAME_PLACE_M = 20;

// A result whose bounding box is wider than this is an area, not an address, so
// its centre is not somewhere a courier can deliver to.
const PRECISE_SPAN_M = 400;
// Wider than this and it is a district or a state. Its centre is a starting
// point for nobody, so it gets no pin at all - not even an approximate one.
const MAX_PINNABLE_SPAN_M = 25000;

// ~0.1 m of precision; enough for a doorstep and short enough to store cleanly.
const round6 = (n) => Math.round(n * 1e6) / 1e6;

// Words that appear in every other Indian address - they describe a place
// without naming one, so sharing them is no evidence that two addresses are the
// same place. Only distinctive words count as a match.
const GENERIC = new Set([
  "near", "opposite", "behind", "beside", "india", "landmark", "post", "office",
  "road", "street", "main", "cross", "lane", "avenue", "salai", "nagar", "colony",
  "tamil", "nadu", "district", "state", "taluk", "village", "town", "city", "zone",
  "north", "south", "east", "west", "ward", "block", "phase", "sector",
]);

/**
 * The distinctive words of an address, cut to a six-letter stem.
 *
 * Indian place names transliterate several ways - Kallakurichi, Kallakkurichi
 * and Kallakuruchi are one town - so comparing whole words rejects correct
 * matches. Six letters is long enough to keep Thirukovilur and Thiruvallur
 * apart while still joining those spellings.
 */
function placeKeys(text) {
  return (String(text).toLowerCase().match(/[a-z]{4,}/g) || [])
    .filter((w) => !GENERIC.has(w))
    .map((w) => w.slice(0, 6));
}

/**
 * The part of a result that names the actual locality - deliberately excluding
 * county, state_district and state.
 *
 * Kallakurichi is a district as well as a town, so a road in Sankarapuram 17km
 * away still carries "Kallakurichi" in its full name and would pass a test made
 * against the whole string. Only the town/suburb/street level says where a
 * result really is. Mirrors localityText() in backend/routes/geocodeRoutes.js.
 */
const LOCALITY_FIELDS = [
  "name", "road", "neighbourhood", "suburb", "village", "town", "city_district", "city",
];

function localityText(result) {
  const a = result.address || {};
  const parts = [result.name, ...LOCALITY_FIELDS.map((f) => a[f])].filter(Boolean);
  if (!parts.length && result.display_name) {
    parts.push(String(result.display_name).split(",")[0]);
  }
  return parts.join(" ");
}

/** Metres between two [lat, lng] points. */
function metresBetween(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

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
    locality: localityText(result),
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

  // Too big to be anywhere in particular - a district or a state. Checked first,
  // because the centre of one is not worth showing either.
  if (c.span != null && c.span > MAX_PINNABLE_SPAN_M) {
    return { verdict: "mismatch", why: "it covers too large an area to pin" };
  }

  // A result has to share a distinctive locality name with the address typed.
  // Skipped for a PIN-code lookup, which is matched by its number rather than by
  // name. Checked before the trust shortcut below, because a weakened query can
  // otherwise return somewhere unrelated and be waved straight through as an
  // area - which now means a pin.
  if (c.trust !== "pin") {
    const typedKeys = placeKeys(typed);
    const resultKeys = new Set(placeKeys(c.locality));
    if (typedKeys.length && !typedKeys.some((k) => resultKeys.has(k))) {
      return { verdict: "mismatch", why: "it names a different place" };
    }
  }

  // A PIN code is the one part of an Indian address that is unambiguous.
  const typedPin = (typed.match(/\b(\d{6})\b/) || [])[1];
  if (typedPin && c.postcode) {
    // The first three digits are the sorting district. A result under a
    // different one is tens of kilometres away however well the names line up:
    // "Thirukovilur Road, Kallakurichi 606202" finds a road of that name 33km
    // away in Tirukkoyilur, 605756. Never pin that.
    if (c.postcode.slice(0, 3) !== typedPin.slice(0, 3)) {
      return {
        verdict: "mismatch",
        why: `the closest match is in PIN code ${c.postcode}, a different area`,
      };
    }
    // Same district, neighbouring PIN - the right town, not the right street.
    if (c.postcode !== typedPin) {
      return { verdict: "area", why: `the closest match is in PIN code ${c.postcode}` };
    }
  }

  if (c.trust && c.trust !== "exact") return { verdict: "area" };

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
function LocationMarker({ position, approximate, onPick }) {
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
      // faded while it is only the centre of the matched area, so it does not
      // read as a confirmed address at a glance
      opacity={approximate ? 0.65 : 1}
      title={
        approximate
          ? "Approximate location - drag this pin onto your exact doorstep"
          : "Drag the pin to your exact doorstep"
      }
      alt={approximate ? "Approximate delivery location" : "Selected delivery location"}
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
  // True while the pin sits at the centre of a matched area rather than on a
  // street or building the geocoder could actually resolve.
  const [approximate, setApproximate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState("");

  // Monotonic ticket: a reverse geocode only gets to write state if no newer pick
  // has started. Without it a slow lookup for an old point can land last and
  // overwrite the address of the point the customer actually chose.
  const pickSeqRef = useRef(0);
  // Latest suggestions, readable from the submit handler without re-creating it.
  const suggestionsRef = useRef([]);
  suggestionsRef.current = suggestions;

  // In-flight requests, so a new one can call off the one it replaces rather
  // than letting both reach the geocoder.
  const searchAbortRef = useRef(null);
  const reverseAbortRef = useRef(null);
  // The last point we actually resolved, and what it resolved to.
  const lastResolvedRef = useRef(null);

  // Nothing should outlive the component.
  useEffect(
    () => () => {
      if (searchAbortRef.current) searchAbortRef.current.abort();
      if (reverseAbortRef.current) reverseAbortRef.current.abort();
    },
    []
  );

  const clean = useCallback((list, trust) => {
    return (Array.isArray(list) ? list : [])
      .map((r) => ({ ...toCandidate(r), trust }))
      .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng));
  }, []);

  /**
   * Explicit search: the backend walks its fallback ladder and reports how much
   * of the address it had to drop to find anything. Any previous search is
   * called off first, so only the newest one is ever in flight.
   */
  const resolveAddress = useCallback(
    async (text) => {
      if (searchAbortRef.current) searchAbortRef.current.abort();
      const controller = new AbortController();
      searchAbortRef.current = controller;

      const res = await fetch(`${GEOCODE_RESOLVE}?q=${encodeURIComponent(text)}`, {
        signal: controller.signal,
      });
      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        const err = new Error(body.message || "Address lookup is busy.");
        err.name = "RateLimited";
        err.retryAfter = body.retryAfter || 5;
        throw err;
      }
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


  /**
   * Turns a point into an address. Always resolves to something usable: if the
   * geocoder is unreachable we return the coordinates themselves, because the pin
   * the customer placed must still reach the order.
   */
  const describePoint = useCallback(async (point) => {
    const [lat, lng] = point;
    const fallback = `Pinned location (${round6(lat)}, ${round6(lng)})`;

    // Nudging the pin a few metres does not change the address. Reuse the last
    // one instead of spending a request - a single drag can otherwise fire a
    // lookup per adjustment.
    const last = lastResolvedRef.current;
    if (last && metresBetween(last.point, point) < SAME_PLACE_M) {
      return last.address;
    }

    if (reverseAbortRef.current) reverseAbortRef.current.abort();
    const controller = new AbortController();
    reverseAbortRef.current = controller;

    try {
      const res = await fetch(`${GEOCODE_REVERSE}?lat=${lat}&lon=${lng}`, {
        signal: controller.signal,
      });
      if (res.status === 429) {
        // The pin still stands; it just keeps its coordinates as its label.
        setNotice(
          "Address lookup is busy, so this pin is saved by its coordinates. Your delivery location is still correct."
        );
        return fallback;
      }
      if (!res.ok) throw new Error(`Reverse geocode failed (${res.status})`);
      const data = await res.json();
      if (!data || data.error) return fallback;
      const address = formatAddress(data) || fallback;
      lastResolvedRef.current = { point, address };
      return address;
    } catch (err) {
      if (err.name === "AbortError") throw err;
      console.error("Reverse geocode failed:", err);
      return fallback;
    }
  }, []);

  /**
   * Publishes a confirmed point upwards and syncs the search box to it.
   *
   * `isApproximate` marks a pin we placed at the centre of a matched area. The
   * coordinates are still real and still saved - they are simply not yet the
   * doorstep, and the customer is asked to drag them there.
   */
  const commit = useCallback(
    (lat, lng, address, isApproximate = false) => {
      setAddressText(address);
      setApproximate(isApproximate);
      setQuery(address);
      // an approximate pin keeps the alternatives on screen: another result may
      // be the better starting point
      if (!isApproximate) {
        setSuggestions([]);
        setActiveIndex(-1);
      }
      if (onLocationSelect) {
        onLocationSelect({
          lat: round6(lat),
          lng: round6(lng),
          address,
          accuracy: isApproximate ? "approximate" : "exact",
        });
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
    setApproximate(false);
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
      let address;
      try {
        address = await describePoint(next);
      } catch (err) {
        return; // superseded by a newer pick; that one owns the state now
      }
      if (seq !== pickSeqRef.current) return;
      setLoading(false);
      // placed or dragged by the customer, so it is no longer approximate
      commit(next[0], next[1], address, false);
      setNotice("");
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
        lastResolvedRef.current = { point: [c.lat, c.lng], address: c.label };
        commit(c.lat, c.lng, c.label);
        return;
      }

      // Area-level: the match is sound, it is just not a doorstep. Drop a pin at
      // the returned coordinates so the customer has something real to drag,
      // rather than leaving them to find the place unaided - but say plainly
      // that it is approximate until they move it.
      pickSeqRef.current += 1;
      setPosition([c.lat, c.lng]);
      setView({ center: [c.lat, c.lng], zoom: zoomForSpan(c.span) });
      lastResolvedRef.current = { point: [c.lat, c.lng], address: c.label };
      commit(c.lat, c.lng, c.label, true);
      setNotice(
        `${why ? `Closest match: ` : `Matched the area: `}${c.label}. ` +
          `This pin is approximate - drag it onto your exact delivery point.`
      );
    },
    [clearPin, commit, query]
  );

  // Explicit search: Enter, or the Search button. Geocodes the whole address and
  // moves the map itself, rather than waiting for a suggestion to be clicked.
  const submitSearch = useCallback(async () => {
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

      // Nominatim orders by its own notion of prominence, which puts the
      // district above the town inside it. Take the best result rather than the
      // first: a precise one if there is one, otherwise the tightest area. The
      // first result being too broad to pin is no reason to give up when a
      // usable one is sitting behind it in the same response.
      const ranked = found.map((c) => ({ c, verdict: assessMatch(query, c).verdict }));
      const best =
        ranked.find((r) => r.verdict === "precise") ||
        ranked
          .filter((r) => r.verdict === "area")
          .sort((x, y) => (x.c.span ?? Infinity) - (y.c.span ?? Infinity))[0];

      applyCandidate((best || ranked[0]).c, false);
    } catch (err) {
      if (err.name === "AbortError") return; // a newer search took over
      setLoading(false);
      if (err.name === "RateLimited") {
        setNotice(err.message);
        return;
      }
      console.error("Address search failed:", err);
      setNotice("Search is unavailable right now - tap the map to drop your pin.");
    }
  }, [activeIndex, applyCandidate, clearPin, resolveAddress, query]);

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
          onChange={(e) => setQuery(e.target.value)}
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
          <LocationMarker position={position} approximate={approximate} onPick={handlePick} />
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
          <strong>{approximate ? "Approximate location:" : "Selected:"}</strong>{" "}
          {addressText}
          <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
            Pin: {round6(position[0])}, {round6(position[1])}
            {approximate && " - drag the pin to your exact door"}
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
