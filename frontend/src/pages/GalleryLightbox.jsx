import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

/**
 * Full-screen image viewer shared by the Gallery index and album pages.
 *
 *  - next / previous via arrows, keyboard (←/→), thumbnails and swipe
 *  - "Back to Gallery" button + ✕ + click-outside + Esc all close it
 *  - the page's scroll position is captured on open and restored on close,
 *    so closing returns you to exactly where you were in the same album
 *
 * Props:
 *   album     { title, images[], id? }
 *   index     currently shown image
 *   onChange  (nextIndex) => void
 *   onClose   () => void
 *   backLabel text for the close button (e.g. "Back to Gallery")
 *   albumHref optional link to the album page (shown on the index only)
 */
export default function GalleryLightbox({
  album,
  index,
  onChange,
  onClose,
  backLabel = "Back to Gallery",
  albumHref,
}) {
  const total = album.images.length;
  const src = album.images[index];
  const touchX = useRef(null);

  const prev = useCallback(() => onChange((index - 1 + total) % total), [index, total, onChange]);
  const next = useCallback(() => onChange((index + 1) % total), [index, total, onChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  // Lock the page behind the overlay and put the reader back exactly where
  // they were when it closes. Pinning the body with a negative offset is what
  // stops mobile browsers from jumping to the top.
  useEffect(() => {
    const y = window.scrollY || window.pageYOffset || 0;
    const body = document.body;
    const saved = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = saved.position;
      body.style.top = saved.top;
      body.style.width = saved.width;
      body.style.overflow = saved.overflow;
      window.scrollTo(0, y);
    };
  }, []);

  // Preload neighbours so next/prev feel instant
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
          <div className="lightbox-heading">
            <strong>{album.title}</strong>
            <span className="lightbox-counter">
              {index + 1} / {total}
            </span>
          </div>

          <div className="lightbox-actions">
            <button type="button" className="lightbox-back" onClick={onClose}>
              <FaArrowLeft aria-hidden="true" />
              <span>{backLabel}</span>
            </button>

            {albumHref && (
              <Link to={albumHref} className="lightbox-open" onClick={onClose}>
                Open album <FaArrowRight />
              </Link>
            )}

            <button type="button" className="lightbox-btn" onClick={onClose} aria-label="Close viewer">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="lightbox-stage">
          <button
            type="button"
            className="lightbox-nav lightbox-nav--prev"
            onClick={prev}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>

          <img key={src} src={src} alt={`${album.title} ${index + 1}`} className="lightbox-img" />

          <button
            type="button"
            className="lightbox-nav lightbox-nav--next"
            onClick={next}
            aria-label="Next image"
          >
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
