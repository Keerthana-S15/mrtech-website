import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

// Component that listens for map clicks and drops a pin
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function LocationMap({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [addressText, setAddressText] = useState("");
  const [loading, setLoading] = useState(false);

  // Search addresses via our OWN backend (which proxies Nominatim) — avoids CORS issues
  const searchAddress = async (text) => {
    setQuery(text);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(text)}`);
      if (!res.ok) throw new Error("Search request failed");
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Address search failed:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // When user picks a suggestion from the dropdown
  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setPosition([lat, lon]);
    setAddressText(place.display_name);
    setQuery(place.display_name);
    setSuggestions([]);
    if (onLocationSelect) {
      onLocationSelect({ lat, lng: lon, address: place.display_name });
    }
  };

  // When user clicks directly on the map, reverse-geocode to get address text
  const handleMapClick = async (newPosition) => {
    setPosition(newPosition);
    try {
      const res = await fetch(
        `/api/geocode/reverse?lat=${newPosition[0]}&lon=${newPosition[1]}`
      );
      if (!res.ok) throw new Error("Reverse geocode request failed");
      const data = await res.json();
      const address = data.display_name || "Selected location";
      setAddressText(address);
      setQuery(address);
      if (onLocationSelect) {
        onLocationSelect({ lat: newPosition[0], lng: newPosition[1], address });
      }
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Search box */}
      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => searchAddress(e.target.value)}
          placeholder="Search your area, street, landmark..."
          style={{
            width: "100%",
            padding: "12px",
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
            {suggestions.map((place, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(place)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderBottom: idx !== suggestions.length - 1 ? "1px solid #eee" : "none",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                {place.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #ddd" }}>
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "350px", width: "100%" }}
          key={position.join(",")} // re-centers map when position changes
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handleMapClick} />
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
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
        Tip: Type to search, or click directly on the map to drop a pin.
      </p>
    </div>
  );
}