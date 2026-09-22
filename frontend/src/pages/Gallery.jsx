import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import galleries from "./images";
import "./Gallery.css";
import {
  FaImages,
  FaExpand,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
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

  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null); // { album, index }
  const gridRef = useRef(null);

  const visible = filter === "All" ? items : items.filter((x) => x.category === filter);

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
              aria-selected={filter === c}
              className={`gallery-filter${filter === c ? " is-active" : ""}`}
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

      <div className="gallery-grid" ref={gridRef} key={filter}>
        {visible.map((album, i) => (
          <article
            key={album.id}
            className={`gallery-card gallery-card--${album.accent}${
              i === 0 && filter === "All" ? " gallery-card--featured" : ""
            }`}
            style={{ "--i": i }}
          >
            {/* whole card navigates to the album page (existing route) */}
            <Link to={`/gallery/${album.id}`} className="gallery-card-link" aria-label={`Open ${album.title} album`}>
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
        <Lightbox
          album={lightbox.album}
          index={lightbox.index}
          onChange={(index) => setLightbox({ album: lightbox.album, index })}
          onClose={() => setLightbox(null)}
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

/* ================= LIGHTBOX ================= */
function Lightbox({ album, index, onChange, onClose }) {
  const total = album.images.length;
  const src = album.images[index];
  const touchX = useRef(null);

  const prev = useCallback(() => onChange((index - 1 + total) % total), [index, total, onChange]);
  const next = useCallback(() => onChange((index + 1) % total), [index, total, onChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [prev, next, onClose]);

  // preload neighbours for instant navigation
  useEffect(() => {
    [album.images[(index + 1) % total], album.images[(index - 1 + total) % total]].forEach((s) => {
      const im = new Image();
      im.src = s;
    });
  }, [index, total, album.images]);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${album.title} — image ${index + 1} of ${total}`}
      onClick={onClose}
    >
      <div
        className="lightbox-inner"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 50) prev();
          else if (dx < -50) next();
          touchX.current = null;
        }}
      >
        <div className="lightbox-top">
          <div>
            <strong>{album.title}</strong>
            <span className="lightbox-counter">{index + 1} / {total}</span>
          </div>
          <div className="lightbox-actions">
            <Link to={`/gallery/${album.id}`} className="lightbox-open" onClick={onClose}>
              Open album <FaArrowRight />
            </Link>
            <button type="button" className="lightbox-btn" onClick={onClose} aria-label="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="lightbox-stage">
          <button type="button" className="lightbox-nav lightbox-nav--prev" onClick={prev} aria-label="Previous image">
            <FaChevronLeft />
          </button>
          <img key={src} src={src} alt={`${album.title} ${index + 1}`} className="lightbox-img" />
          <button type="button" className="lightbox-nav lightbox-nav--next" onClick={next} aria-label="Next image">
            <FaChevronRight />
          </button>
        </div>

        <div className="lightbox-strip">
          {album.images.map((s, i) => (
            <button
              type="button"
              key={s}
              className={`lightbox-thumb${i === index ? " is-active" : ""}`}
              onClick={() => onChange(i)}
              aria-label={`Image ${i + 1}`}
              aria-current={i === index}
            >
              <img src={s} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
