import React from "react";
import { useParams, Link } from "react-router-dom";
import galleries from "./images";
import "./Gallery.css";

export default function GalleryDetail() {
  const { id } = useParams();
  const gallery = galleries[id];

  if (!gallery) {
    return (
      <section className="gallery-section">
        <h2>Gallery not found</h2>
        {/* <Link to="/gallery" className="back-link">← </Link> */}
      </section>
    );
  }

  return (
    <section className="gallery-section">
      {/* 🔹 Underline removed (no <span className="underline" />) */}
      <h1 className="gallery-title">{gallery.title}</h1>

      <div className="detail-actions">
        {/* <Link to="/gallery" className="back-link">← </Link> */}
      </div>

      <div className="image-grid">
        {gallery.images.map((src, i) => (
          <img key={i} src={src} alt={`${gallery.title} ${i + 1}`} />
        ))}
      </div>

      <div className="footer-spacer" />
    </section>
  );
}