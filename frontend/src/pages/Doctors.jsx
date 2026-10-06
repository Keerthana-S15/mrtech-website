import React, { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaLinkedinIn, FaSyncAlt } from "react-icons/fa";
// Deliberately reuses the Team stylesheet rather than adding another one: the
// Doctors page is the same kind of people-grid, so sharing the styles keeps the
// typography, spacing, card behaviour and hover effects identical by
// construction instead of by copy-paste that later drifts.
import "./Team.css";

// Cache-busting version for doctor photos. Bump this whenever a photo is
// replaced but keeps the same filename, so browsers and CDNs fetch the new file
// instead of serving a previously cached copy. Mirrors TEAM_IMAGE_VERSION.
const DOCTOR_IMAGE_VERSION = "1";

/**
 * Doctor profiles, newest first.
 *
 * Intentionally empty: real medical professionals must not be invented, and
 * nothing in the project carried this data. Add entries in exactly the shape
 * the team lists use and the grid below renders them with no further changes:
 *
 *   {
 *     name: "Dr. Full Name",
 *     role: "Cardiologist",                        // shown under the name
 *     image: "/images/doctors/filename.png",       // put files in public/images/doctors/
 *     bio: "One or two sentences, shown on the back of the card.",
 *     email: "name@example.com",                   // optional
 *     linkedin: "https://www.linkedin.com/in/...", // optional
 *   }
 *
 * Until then the page shows a plain, honest empty state rather than
 * placeholders that could be mistaken for real practitioners.
 */
const doctorsData = [];

const Doctors = () => {
  const gridRef = useRef(null);
  // Tap-to-flip for touch devices (desktop still flips on hover)
  const [flipped, setFlipped] = useState(null);

  useEffect(() => {
    setFlipped(null);
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".team-card"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach((c) => (c.dataset.visible = "1"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.dataset.visible = "1";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((c) => io.observe(c));
    const fallback = setTimeout(() => cards.forEach((c) => (c.dataset.visible = "1")), 1500);

    // Highlight that follows the pointer across a card front.
    const onMove = (e) => {
      const card = e.currentTarget;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", onMove));

    return () => {
      io.disconnect();
      clearTimeout(fallback);
      cards.forEach((c) => c.removeEventListener("pointermove", onMove));
    };
  }, []);

  return (
    <div className="team-page">
      <div className="team-bg team-bg--a" aria-hidden="true" />
      <div className="team-bg team-bg--b" aria-hidden="true" />

      <header className="team-head">
        <span className="team-eyebrow">
          <i className="team-eyebrow-dot" aria-hidden="true" />
          Medical expertise behind MRT
        </span>
        <h1 className="team-title">Our Doctors</h1>
        <p className="team-subtitle">
          The medical professionals guiding our healthcare technology and patient care.
        </p>
        {doctorsData.length > 0 && (
          <span className="team-count-pill">
            <span className="team-count-dot" aria-hidden="true" />
            {doctorsData.length} {doctorsData.length === 1 ? "doctor" : "doctors"}
          </span>
        )}
      </header>

      {doctorsData.length > 0 ? (
        <div className="team-container" ref={gridRef}>
          {doctorsData.map((doctor, index) => {
            const isFlipped = flipped === index;
            const initials = doctor.name
              .replace(/^Dr\.?\s+/i, "")
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("");
            return (
              <div
                className={`team-card team-card--${index % 4}${isFlipped ? " is-flipped" : ""}`}
                style={{ "--i": index }}
                key={index}
                onClick={() => setFlipped(isFlipped ? null : index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFlipped(isFlipped ? null : index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isFlipped}
                aria-label={`${doctor.name}, ${doctor.role}. Show details`}
              >
                <div className="team-card-inner">
                  {/* ---- FRONT ---- */}
                  <div className="team-card-front">
                    <span className="team-card-glow" aria-hidden="true" />
                    <div className="team-avatar">
                      <span className="team-avatar-ring" aria-hidden="true" />
                      <img
                        src={`${doctor.image}?v=${DOCTOR_IMAGE_VERSION}`}
                        alt={doctor.name}
                        className="team-img"
                        loading="lazy"
                      />
                      <span className="team-avatar-badge" aria-hidden="true">{initials}</span>
                    </div>
                    <h3>{doctor.name}</h3>
                    <p className="team-role">{doctor.role}</p>
                    <span className="team-flip-hint" aria-hidden="true">
                      <FaSyncAlt /> View details
                    </span>
                  </div>

                  {/* ---- BACK ---- */}
                  <div className="team-card-back">
                    <h3>{doctor.name}</h3>
                    <p className="team-role team-role--back">{doctor.role}</p>
                    <p className="bio">{doctor.bio || "No bio available."}</p>
                    <div className="team-links">
                      {doctor.email && (
                        <a
                          href={`mailto:${doctor.email}`}
                          className="team-link"
                          onClick={(e) => e.stopPropagation()}
                          title={doctor.email}
                        >
                          <FaEnvelope /> <span>Email</span>
                        </a>
                      )}
                      {doctor.linkedin && (
                        <a
                          href={doctor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="team-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaLinkedinIn /> <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-members">
          Doctor profiles are being added. Please check back soon.
        </p>
      )}
    </div>
  );
};

export default Doctors;
