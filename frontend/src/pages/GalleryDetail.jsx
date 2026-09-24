import React, { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import galleries from "./images";
import GalleryLightbox from "./GalleryLightbox";
import "./Gallery.css";
import { FaArrowLeft, FaExpand } from "react-icons/fa";

export default function GalleryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const gallery = galleries[id];
  // index of the image shown full-size, or null when the grid is showing
  const [lightbox, setLightbox] = useState(null);

  // Step back in history only when the reader actually arrived from the
  // gallery index — that restores their scroll position and category.
  // Arriving any other way (direct link, Solutions, a shared URL) goes to
  // /gallery, so the button never lands somewhere that isn't the gallery.
  const backToGallery = () => {
    if (location.state?.from === "gallery") navigate(-1);
    else navigate("/gallery");
  };

  if (!gallery) {
    return (
      <section className="gallery-section">
        <h2>Gallery not found</h2>
        <div className="detail-actions">
          <Link to="/gallery" className="gallery-back">
            <FaArrowLeft className="gallery-back-icon" aria-hidden="true" />
            <span>Back to Gallery</span>
          </Link>
          <Link to="/solutions" className="gallery-back gallery-back--solutions">
            <FaArrowLeft className="gallery-back-icon" aria-hidden="true" />
            <span>Back to Solutions</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <div className="detail-actions">
        <button type="button" className="gallery-back" onClick={backToGallery}>
          <FaArrowLeft className="gallery-back-icon" aria-hidden="true" />
          <span>Back to Gallery</span>
        </button>
        <Link to="/solutions" className="gallery-back gallery-back--solutions">
          <FaArrowLeft className="gallery-back-icon" aria-hidden="true" />
          <span>Back to Solutions</span>
        </Link>
      </div>

      <h1 className="gallery-title">{gallery.title}</h1>

      <div className="image-grid">
        {gallery.images.map((src, i) => (
          <button
            type="button"
            key={i}
            className="image-grid-item"
            onClick={() => setLightbox(i)}
            aria-label={`View ${gallery.title} image ${i + 1} full size`}
          >
            <img src={src} alt={`${gallery.title} ${i + 1}`} loading="lazy" />
            <span className="image-grid-zoom" aria-hidden="true">
              <FaExpand />
            </span>
          </button>
        ))}
      </div>

      <div className="footer-spacer" />

      {lightbox !== null && (
        <GalleryLightbox
          album={gallery}
          index={lightbox}
          onChange={setLightbox}
          onClose={() => setLightbox(null)}
          backLabel="Back to Gallery"
        />
      )}
    </section>
  );
}
