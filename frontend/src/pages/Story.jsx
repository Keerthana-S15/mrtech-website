import React, { useState } from "react";
import "./Story.css";

const slides = Array.from({ length: 27 }, (_, i) =>
  `${process.env.PUBLIC_URL}/images/story/slide-${i + 1}.jpg`
);

/**
 * NOTE:
 * - Export your PPTX slides as JPG/PNG from PowerPoint:
 *   File → Export → Change File Type → JPEG/PNG → "All Slides".
 * - Put them in: public/images/story/  as  slide-1.jpg, slide-2.jpg, ...
 * - If a file is missing the image just won’t load, but the page still works.
 */

const milestones = [
  {
    year: "2019",
    title: "MOU with Govt. of Puducherry",
    text:
      "Signed for the Telemedicine initiative in Puducherry; G-CARE Diabetic Council and Health Dept. collaboration."
  },
  {
    year: "2019",
    title: "Sensitization Programme",
    text:
      "Programme at NHM Hall, Directorate of Health & Family Welfare; project vision, mission and implementation protocol presented."
  },
  {
    year: "2019",
    title: "Tele-Health Centre Inauguration",
    text:
      "Chief Minister inaugurated the first Tele-Health Centre at Kosapalayam PHC; officials from Health Dept., NUHM, and partners participated."
  },
  {
    year: "2019–2020",
    title: "Health & Wellness Centres + Camps",
    text:
      "HWC inaugurations at Kosapalayam & Lawspet; medical camps at Murugampakkam and Yanam; ongoing kiosk demos & trainings."
  },
  {
    year: "2021",
    title: "COVID-19 Contributions",
    text:
      "Supported vaccination camps; briefed leadership on G-Care’s role in combating COVID-19 and continuity of services."
  },
  {
    year: "2022",
    title: "Continued Partnerships",
    text:
      "Engagements with Puducherry leadership; NCD camps and community programmes; journey of G-Care shared with stakeholders."
  }
];

export default function Story() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((p) => (p === 0 ? slides.length - 1 : p - 1));
  const next = () => setIdx((p) => (p === slides.length - 1 ? 0 : p + 1));

  return (
    <main className="story-wrap">
      <section className="story-hero">
        <h1>Our Story</h1>
        <p>
          A snapshot of the G-CARE journey — partnerships with the Govt. of Puducherry,
          tele-health rollouts, community programmes, and impact milestones.
        </p>

        {/* Download / open the original deck */}
        <div className="story-actions">
          <a
            className="story-btn"
            href={`${process.env.PUBLIC_URL}/docs/gcare-journey.pptx`}
            download
          >
            Download PPTX
          </a>
          {/* If you later export a PDF, place /docs/gcare-journey.pdf and link it here */}
        </div>
      </section>

      {/* Layout: left timeline + right slides */}
      <section className="story-grid">
        {/* Left — timeline content */}
        <article className="story-timeline">
          {milestones.map((m, i) => (
            <div key={i} className="story-item">
              <div className="story-dot" />
              <div className="story-meta">{m.year}</div>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </article>

        {/* Right — simple slide viewer */}
        <aside className="story-viewer">
          <div className="viewer-frame">
            <img
              src={slides[idx]}
              alt={`Slide ${idx + 1}`}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <button className="nav prev" onClick={prev} aria-label="Previous slide">‹</button>
            <button className="nav next" onClick={next} aria-label="Next slide">›</button>
          </div>

          <div className="viewer-thumbs">
            {slides.map((s, i) => (
              <button
                key={i}
                className={`thumb ${i === idx ? "active" : ""}`}
                onClick={() => setIdx(i)}
                title={`Slide ${i + 1}`}
              >
                <img src={s} alt={`Slide ${i + 1}`} onError={(e)=> (e.currentTarget.style.visibility="hidden")} />
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
