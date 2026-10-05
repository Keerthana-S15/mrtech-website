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
// Street-level zoom, used when a search result or a GPS fix moves the pin, so the
// customer lands close enough to see individual buildings before fine-tuning.
const PRECISE_ZOOM = 17;
const PHOTON = "https://photon.komoot.io";
const SEARCH_DEBOUNCE_MS = 350;

// ~0.1 m of precision; enough for a doorstep and short enough to store cleanly.
const round6 = (n) => Math.round(n * 1e6) / 1e6;

/**
 * Keeps the map looking at the pin without rebuilding it.
 *
 * The previous version passed `key={position.join(",")}` to <MapContainer>, which
 * unmounted and remounted the entire map on every pick - so each click reset the
 * zoom back to 15 and reloaded every tile, exactly when the customer was zooming
 * in to find their own door.
 */
function RecenterMap({ view }) {
  const map = useMap();
  useEffect(() => {
    if (!view) return;
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

// Helper: build a readable address string from a Photon feature
function formatPhotonAddress(feature) {
  const p = feature.properties;
  const parts = [
    p.name,
    p.street,
    p.district,
    p.city,
    p.state,
    p.postcode,
    p.country,
  ].filter(Boolean);
  // Remove duplicates (Photon sometimes repeats name/city)
  return [...new Set(parts)].join(", ");
}

export default function LocationMap({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState(DEFAULT_CENTER);
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

  // Search addresses using Photon (free, OSM-based, browser-friendly - no CORS/IP blocking issues)
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
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${PHOTON}/api/?q=${encodeURIComponent(text)}&limit=5&lang=en`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Search request failed (${res.status})`);
        const data = await res.json();
        setSuggestions(data.features || []);
        setActiveIndex(-1);
        setNotice("");
        setLoading(false);
      } catch (err) {
        // a newer keystroke already owns the spinner - leave it alone
        if (err.name === "AbortError") return;
        console.error("Address search failed:", err);
        setSuggestions([]);
        setNotice("Search is unavailable right now - tap the map to drop your pin.");
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  /**
   * Turns a point into an address. Always resolves to something usable: if Photon
   * is unreachable we return the coordinates themselves, because the pin the
   * customer placed must still reach the order. The old code swallowed the error
   * and never called onLocationSelect, so a failed lookup silently lost the pick.
   */
  const describePoint = useCallback(async ([lat, lng]) => {
    const fallback = `Pinned location (${round6(lat)}, ${round6(lng)})`;
    try {
      const res = await fetch(`${PHOTON}/reverse?lon=${lng}&lat=${lat}&lang=en`);
      if (!res.ok) throw new Error(`Reverse geocode failed (${res.status})`);
      const data = await res.json();
      const feature = data.features && data.features[0];
      return (feature && formatPhotonAddress(feature)) || fallback;
    } catch (err) {
      console.error("Reverse geocode failed:", err);
      return fallback;
    }
  }, []);

  /** Single place where a chosen point is published upwards. */
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
   * Map click or marker drag.
   *
   * Deliberately does NOT move the map: a point the customer just tapped or
   * dragged to is already on screen, and sliding the map after every tap makes
   * the spot they are aiming at move while they fine-tune it. Only a search hit
   * or a GPS fix - which can be anywhere - recentres the view.
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

  // When user picks a suggestion from the dropdown
  const handleSelectSuggestion = (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    const address = formatPhotonAddress(feature);
    pickSeqRef.current += 1; // discard any reverse geocode still in flight
    setLoading(false);
    setNotice("");
    setPosition([lat, lon]);
    setView({ center: [lat, lon], zoom: PRECISE_ZOOM });
    commit(lat, lon, address);
  };

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
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      // the picker lives inside the checkout form - never submit it from here
      e.preventDefault();
      if (activeIndex >= 0) handleSelectSuggestion(suggestions[activeIndex]);
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
          placeholder="Search your area, street, landmark..."
          autoComplete="off"
          aria-label="Search for your delivery location"
          style={{
            width: "100%",
            padding: "12px",
            paddingRight: "96px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />
        {loading && (
          <div style={{ position: "absolute", right: "12px", top: "12px", fontSize: "13px", color: "#999" }}>
            Searching...
          </div>
        )}

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
            {suggestions.map((feature, idx) => (
              <div
                key={idx}
                role="option"
                aria-selected={idx === activeIndex}
                onClick={() => handleSelectSuggestion(feature)}
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
                {formatPhotonAddress(feature)}
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
      {addressText && (
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
