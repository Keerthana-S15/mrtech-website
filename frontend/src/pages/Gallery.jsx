import React from "react";
import { Link } from "react-router-dom";
import galleries from "./images";
import "./Gallery.css";

export default function Gallery() {
  const items = Object.entries(galleries).map(([id, g]) => ({ id, title: g.title }));

  return (
    <section className="gallery-section">
      {/* 🔹 Underline removed (no <span className="underline" />) */}
      <h1 className="gallery-title">Gallery</h1>

      <p className="gallery-subtitle">
        Explore a rich visual archive of our projects and events.
      </p>

      <div className="gallery-grid">
        {items.map((x) => (
          <Link key={x.id} className="gallery-tile" to={`/gallery/${x.id}`}>
            <h3 className="gallery-tile__title">{x.title}</h3>
          </Link>
        ))}
      </div>

      <div className="footer-spacer" />
    </section>
  );
}