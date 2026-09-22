import React, { useEffect, useRef, useState } from "react";
import "./Partners.css";

/* ====== CONTENT (unchanged) ====== */
const CATEGORIES = [
  {
    id: "tech",
    label: "01",
    title: "Technology Partners",
    icon: (
      /* laptop svg */
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 5h18v10H3V5zm-2 12h22v2H1v-2z" fill="currentColor" />
      </svg>
    ),
    items: [
      "Cloud Service Providers",
      "AI Research Labs",
      "Software Development Teams",
      "Data Analytics Companies",
    ],
  },
  {
    id: "health",
    label: "02",
    title: "Healthcare Networks",
    icon: (
      /* hospital cross */
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 2h4v4h4v4h-4v4h-4v-4H6V6h4V2z" fill="currentColor" />
      </svg>
    ),
    items: [
      "Multi-specialty Hospitals",
      "Diagnostic Centers",
      "Medical Colleges",
      "Pharmacy Chains",
    ],
  },
  {
    id: "agri",
    label: "03",
    title: "Agricultural Institutions",
    icon: (
      /* leaf */
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2c6 2 9 6 9 10 0 5-4 9-9 9S3 17 3 12C3 7 6 3 12 2zm0 4c-3 1-5 3-5 6a5 5 0 0 0 10 0c0-3-2-5-5-6z"
          fill="currentColor"
        />
      </svg>
    ),
    items: [
      "Farmer Producer Organizations",
      "AgriTech Startups",
      "Soil Testing Labs",
      "Agricultural Universities",
    ],
  },
];

export default function Partners() {
  const rootRef = useRef(null);
  // which list item is highlighted per category (tap-to-select on touch,
  // hover on desktop); purely visual
  const [active, setActive] = useState({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll(".pt-panel"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      panels.forEach((p) => p.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    panels.forEach((p) => io.observe(p));

    const onMove = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    panels.forEach((p) => p.addEventListener("pointermove", onMove));

    return () => {
      io.disconnect();
      panels.forEach((p) => p.removeEventListener("pointermove", onMove));
    };
  }, []);

  return (
    <main className="partners-wrap" ref={rootRef}>
      <div className="pt-bg pt-bg--a" aria-hidden="true" />
      <div className="pt-bg pt-bg--b" aria-hidden="true" />

      <section className="partners-hero" aria-labelledby="partners-title">
        <header className="pt-head">
          <span className="pt-eyebrow">Partner ecosystem</span>
          <h1 id="partners-title">Our Empanelled Associates</h1>
          <p className="pt-subtitle">
            MRT collaborates with a growing network of empanelled associates who
            bring domain expertise, local reach, and community trust.
          </p>
        </header>

        <div className="pt-panels">
          {CATEGORIES.map((cat, i) => (
            <article
              className={`pt-panel pt-panel--${cat.id}`}
              style={{ "--delay": `${i * 120}ms` }}
              key={cat.id}
            >
              {/* left: identity */}
              <div className="pt-panel-side">
                <div className="pt-icon-wrap">
                  <span className="pt-icon-ring" aria-hidden="true" />
                  <span className="pt-icon-ring pt-icon-ring--2" aria-hidden="true" />
                  <div className="pt-icon">{cat.icon}</div>
                </div>
                <span className="pt-label">{cat.label}</span>
                <h3 className={`pt-title ${cat.id}`}>{cat.title}</h3>
                <span className="pt-count">{cat.items.length} partner types</span>
              </div>

              {/* right: interactive list */}
              <ul className="pt-list">
                {cat.items.map((item, j) => {
                  const isActive = active[cat.id] === j;
                  return (
                    <li
                      key={item}
                      className={`pt-item${isActive ? " is-active" : ""}`}
                      style={{ "--i": j }}
                      tabIndex={0}
                      onClick={() =>
                        setActive((a) => ({ ...a, [cat.id]: a[cat.id] === j ? null : j }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActive((a) => ({ ...a, [cat.id]: a[cat.id] === j ? null : j }));
                        }
                      }}
                    >
                      <span className="pt-item-marker" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M5 12.5l4.5 4.5L19 7.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="pt-item-text">{item}</span>
                      <span className="pt-item-arrow" aria-hidden="true">
                        →
                      </span>
                    </li>
                  );
                })}
              </ul>

              <span className="pt-panel-glow" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* <div className="cta-row">
          <a href="/contact" className="cta-btn">
            <span className="cta-emoji">🤝</span> Become an Associate
          </a>
          <a className="cta-btn outline">
            <span className="cta-emoji">📋</span> View Partner List
          </a>
        </div> */}
      </section>
    </main>
  );
}
