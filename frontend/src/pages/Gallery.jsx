import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import galleries from "./images";
import GalleryLightbox from "./GalleryLightbox";
import "./Gallery.css";
import {
  FaImages,
  FaExpand,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

/* Category for the filter chips (albums themselves are unchanged) */
const CATEGORY = {
  "gcare-atm": "Healthcare",
  "health-camp": "Healthcare",
  "cha-training": "Training",
  "ai-agri": "Agriculture",
  "tech-conf": "Events",
  "impact-awards": "Events",
};

const ACCENT = ["orange", "emerald", "violet", "teal", "sky", "rose"];

export default function Gallery() {
  const items = useMemo(
    () =>
      Object.entries(galleries).map(([id, g], i) => ({
        id,
        title: g.title,
        images: g.images,
        cover: g.images[0],
        category: CATEGORY[id] || "Events",
        accent: ACCENT[i % ACCENT.length],
      })),
    []
  );
  const categories = useMemo(() => ["All", ...new Set(items.map((x) => x.category))], [items]);

  // Remember the chosen category so returning from an album (Back to Gallery
  // / browser back) lands on the same filter the reader left from.
  const [filter, setFilter] = useState(() => {
    try {
      return sessionStorage.getItem("galleryFilter") || "All";
    } catch {
      return "All";
    }
  });
  const [lightbox, setLightbox] = useState(null); // { album, index }
  const gridRef = useRef(null);

  // A stored filter that no longer exists (e.g. a category was renamed)
  // falls back to "All" so the grid can never come up empty.
  const activeFilter = categories.includes(filter) ? filter : "All";
  const visible =
    activeFilter === "All" ? items : items.filter((x) => x.category === activeFilter);

  useEffect(() => {
    try {
      sessionStorage.setItem("galleryFilter", activeFilter);
    } catch {
      /* private mode / storage disabled — filtering still works, just not remembered */
    }
  }, [activeFilter]);

  /* scroll reveal (data attribute so React re-renders can't clear it) */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".gallery-card"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      cards.forEach((c) => (c.dataset.visible = "1"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.dataset.visible = "1";
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    cards.forEach((c) => io.observe(c));
    const fallback = setTimeout(() => cards.forEach((c) => (c.dataset.visible = "1")), 1500);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [visible]);

  const openLightbox = (album, index = 0) => setLightbox({ album, index });

  return (
    <section className="gallery-section gallery-section--index">
      <div className="gallery-bg gallery-bg--a" aria-hidden="true" />
      <div className="gallery-bg gallery-bg--b" aria-hidden="true" />

      <div className="gallery-nav">
        <Link to="/solutions" className="gallery-back">
          <FaArrowLeft className="gallery-back-icon" aria-hidden="true" />
          <span>Back to Solutions</span>
        </Link>
      </div>

      <header className="gallery-head">
        <span className="gallery-eyebrow">Moments &amp; milestones</span>
        <h1 className="gallery-title">Gallery</h1>
        <p className="gallery-subtitle">
          Explore a rich visual archive of our projects and events.
        </p>

        <div className="gallery-filters" role="tablist" aria-label="Filter albums">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={activeFilter === c}
              className={`gallery-filter${activeFilter === c ? " is-active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
              <span className="gallery-filter-count">
                {c === "All" ? items.length : items.filter((x) => x.category === c).length}
              </span>
            </button>
          ))}
        </div>
      </header>

      <div className="gallery-grid" ref={gridRef} key={activeFilter}>
        {visible.map((album, i) => (
          <article
            key={album.id}
            className={`gallery-card gallery-card--${album.accent}${
              i === 0 && activeFilter === "All" ? " gallery-card--featured" : ""
            }`}
            style={{ "--i": i }}
          >
            {/* whole card navigates to the album page (existing route) */}
            <Link
              to={`/gallery/${album.id}`}
              state={{ from: "gallery" }}
              className="gallery-card-link"
              aria-label={`Open ${album.title} album`}
            >
              <div className="gallery-card-media">
                <Cover src={album.cover} alt={album.title} />
                <span className="gallery-card-shade" aria-hidden="true" />
                <span className="gallery-card-category">{album.category}</span>
                <span className="gallery-card-count">
                  <FaImages /> {album.images.length}
                </span>
              </div>

              <div className="gallery-card-body">
                <h3 className="gallery-tile__title">{album.title}</h3>
                <span className="gallery-card-cta">
                  View album <FaArrowRight />
                </span>
              </div>
            </Link>

            {/* quick-view opens the lightbox without leaving the page */}
            <button
              type="button"
              className="gallery-card-quick"
              onClick={() => openLightbox(album, 0)}
              aria-label={`Quick view ${album.title}`}
            >
              <FaExpand />
            </button>

            <div className="gallery-card-thumbs" aria-hidden="true">
              {album.images.slice(1, 4).map((src, j) => (
                <button
                  type="button"
                  key={src}
                  className="gallery-card-thumb"
                  tabIndex={-1}
                  onClick={() => openLightbox(album, j + 1)}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
              {album.images.length > 4 && (
                <span className="gallery-card-thumb gallery-card-thumb--more">
                  +{album.images.length - 4}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="footer-spacer" />

      {lightbox && (
        <GalleryLightbox
          album={lightbox.album}
          index={lightbox.index}
          onChange={(index) => setLightbox({ album: lightbox.album, index })}
          onClose={() => setLightbox(null)}
          backLabel="Back to Gallery"
          albumHref={`/gallery/${lightbox.album.id}`}
        />
      )}
    </section>
  );
}

/* Cover image with a branded fallback if the file is missing */
function Cover({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="gallery-card-fallback" role="img" aria-label={alt}>
        <FaImages />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
