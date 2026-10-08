import React, { useEffect, useRef, useState } from "react";
import { FaCertificate, FaEnvelope, FaLinkedinIn, FaSyncAlt } from "react-icons/fa";
// Deliberately reuses the Team stylesheet rather than adding another one: the
// Doctors page is the same kind of people-grid, so sharing the styles keeps the
// typography, spacing, card behaviour and hover effects identical by
// construction instead of by copy-paste that later drifts.
import "./Team.css";
// Loaded after Team.css so the badge override wins. Doctors-scoped only.
import "./Doctors.css";

// Cache-busting version for doctor photos. Bump this whenever a photo is
// replaced but keeps the same filename, so browsers and CDNs fetch the new file
// instead of serving a previously cached copy. Mirrors TEAM_IMAGE_VERSION.
const DOCTOR_IMAGE_VERSION = "1";

/**
 * Doctor profiles for the public Doctors page.
 *
 * Source: the "GP DOCTORS" sheet of the empanelment list. Only three fields were
 * taken, on the data owner's explicit authorisation: doctor name, designation
 * and email. Mobile numbers, addresses, districts and every identity document in
 * the source archive were deliberately not read and must not be added here.
 *
 * `role` is "General Physician" for all of them: the sheet has no designation
 * column, and GP DOCTORS is what it lists. Specialists live on other sheets and
 * are not included.
 *
 * `image` is absent throughout. The source archive holds no portraits - its
 * images are Aadhaar cards, PAN cards, bank details and certificate scans, none
 * of which belong on a public page. Cards without an image fall back to the
 * doctor's initials, drawn in the same circle a photo would occupy. To add a
 * real portrait later, drop the file in public/images/doctors/ and add
 * `image: "/images/doctors/<file>"` to that doctor's entry - nothing else
 * changes.
 *
 * Two emails were withheld because their domains are gmail typosquats
 * (gamail.com, gamil.com); a mailto to those would send a visitor's message to
 * whoever owns the lookalike domain. Fix them in the source sheet and they can
 * be added back.
 */
const doctorsData = [
  { name: "Dr. Sharmila", role: "General Physician", email: "sharmilakuty19@gmail.com" },
  { name: "Dr. Karthik", role: "M.B.B.S (MD)", email: "nkarthikmoorthi@gmail.com" },
  { name: "Dr. Blessy", role: "General Physician", email: "blessymagdalin4@gmail.com" },
  { name: "Dr. Shruthi", role: "General Physician" },
  { name: "Dr. Suganya K", role: "M.B.B.S",email: "dr.suganya92@yahoo.com" },
  { name: "Dr. PrinceDevaRuban N", role: "M.B.B.S (M.S)", email: "emhospi@gmail.com"},
  { name: "Dr. Arun Prasath G", role: "M.B.B.S" },
  { name: "Dr. Thenmozhi L", role: "M.B.B.S", email: "priyamanaval83@gmail.com" },
  { name: "Dr. Karthik", role: "General Physician", email: "karthikpmcud@gmail.com" },
  { name: "Dr. Thanka raj", role: "General Physician", email: "drthangarajp@gmail.com" },
  { name: "Dr. VinothKumar K", role: "M.B.B.S", email: "drvinoth1997@gmail.com" },
  { name: "Dr. Bharath", role: "General Physician", email: "bharathmedical94@gmail.com" },
  { name: "Dr. Shobanbabu", role: "General Physician" },
  { name: "Dr. S.Ashiq rasol", role: "General Physician", email: "drashgh93@gmail.com" },
  { name: "Dr. Dheena kumar R", role: "M.B.B.S" },
  { name: "Dr. Manivannan", role: "General Physician", email: "manivanant2006@gmail.com" },
  { name: "Dr. Sivanesan", role: "General Physician" },
  { name: "Dr. mohammedanas R", role: "M.B.B.S" },
  { name: "Dr. Jayaraman", role: "General Physician", email: "drcjayaraman@gmail.com" },
  { name: "Dr. Hari raj", role: "General Physician", email: "hariraj0222@gmail.com" },
  { name: "Dr. Agalvizhi E", role: "M.B.B.S", email: "agalvizhi@gmail.com" },
  { name: "Dr. Shirin synthiya", role: "General Physician", email: "shirinsynthiyaw@gmail.com" },
  { name: "Dr. Mohanraj", role: "M.B.B.S", email: "karnanmohan740@gmail.com" },
  { name: "Dr. Ranjan ", role: "M.B.B.S", email: "kkranjan03@gmail.com" },
  { name: "Dr. Udhaya Karthikeyan", role: "General Physician", email: "udhaya95.trk@gmail.com" },
  { name: "Dr. Kamali", role: "General Physician", email: "kamalikumaresan27@gmail.com" },
  { name: "Dr. Praveen kumar", role: "General Physician", email: "praveenveg92@gmail.com" },
  { name: "Dr. Srilekha", role: "General Physician", email: "srilekhapalanesamy06@gmail.com" },
  { name: "Dr. Sivakumar M", role: "M.B.B.S", email: "drsiva.1979@gmail.com" },
  { name: "Dr. Avinash pandi", role: "M.B.B.S (MD)", email: "avinash.pandi5@gmail.com" },
  { name: "Dr. Harivarma", role: "General Physician", email: "hariv2529@gmail.com" },
  { name: "Dr. Dhayaneedhi K", role: "M.B.B.S", email: "dhayakara13@gmail.com" },
  { name: "Dr. Ariviyalan M", role: "B.S.M.S (MD)", email: "ariviyalandr22@gmail.com" },
  { name: "Dr. Shenbaga priya ", role: "B.S.M.S (MD)", email: "spshenba@gmail.com" },
  { name: "Dr. Lakshmi priya", role: "General Physician", email: "lakshmipriyak1202@gmail.com" },
  { name: "Dr. Selvi", role: "General Physician", email: "dhaaraniaps27@gmail.com" },
  { name: "Dr. Vaishnavi", role: "General Physician", email: "vaishnavimoorthy31@gmail.com" },
  { name: "Dr. Rakesh V", role: "M.B.B.S ", email: "meetmeraki369@gmail.com" },
  { name: "Dr. Kandhavadivel", role: "General Physician", email: "kanvel86@gmail.com" },
  { name: "Dr. Elavarasan", role: "General Physician", email: "elavarasanv181@gmail.com" },
  { name: "Dr. Santhosh Kumar B", role: "M.B.B.S (M.D. Physician )", email: "mmsanthosh27@gmail.com" },
  { name: "Dr. Vigneshwaran R.S", role: "M.B.B.S",email:  "vickysundharam@gmail.com"},
  { name: "Dr. Aravindan", role: "General Physician", email: "aravindan6620@gmail.com" },
  { name: "Dr. Deepika N", role: "M.B.B.S (Doctor of Medicine )", email: "dpi233811@gmail.com" },
  { name: "Dr. Muthumani", role: "General Physician" },
  { name: "Dr. Thangaselvam", role: "General Physician", email: "thangaselvam193@gmail.com" },
  { name: "Dr. Nirmalkumar", role: "M.D.(Anaesthesiology)", email: "drnirmalkumarshr@gmail.com" },
  { name: "Dr. Sibi Raj M", role: "M.B.B.S", email: "sibiraj000@gmail.com" },
  { name: "Dr. Soundarajan", role: "General Physician", email: "soundarajdr@gmail.com" },
  { name: "Dr. Sangeetha", role: "General Physician", email: "sangeethambbs90@gmail.com" },
  { name: "Dr. Selvarasi", role: "General Physician", email: "selvarasisivs@gmail.com" },
  { name: "Dr. Mohammed", role: "General Physician" },
  { name: "Dr. Tamilselvan S", role: "M.B.B.S", email: "dr.tamilselvan1992@mail.com" },
  { name: "Dr. Kishore", role: "M.B.B.S" },
  { name: "Dr. Gokulram", role: "General Physician", email: "gokulram.r25@gmail.com" },
  { name: "Dr. Santhosh kumar", role: "General Physician", email: "santhoshanandh004@gmail.com" },
  { name: "Dr. Singamsetty srinivas", role: "General Physician", email: "srinusingam5009@gmail.com" },
  { name: "Dr. A.S.Sobana", role: "M.B.B.S", email: "shobana53479@gmail.com" },
  { name: "Dr. Senthamizhselvan", role: "M.B.B.S (Doctor of Medicine)", email: "tamilselvam.ssm.mm@gmail.com" },
  { name: "Dr. Saranraj", role: "General Physician", email: "saranraj161294@gmail.com" },
];

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
    <div className="team-page doctors-page">
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
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              // source names are not consistently capitalised, so "Thanka raj"
              // would otherwise show as "Tr"
              .toUpperCase();

            // Qualifications are written as dotted abbreviations - M.B.B.S,
            // M.D., B.S.M.S - so a single capital followed by a period marks a
            // credential. A job title like "General Physician" has none, and
            // neither would "Gen. Physician", since that dot follows three
            // letters rather than one.
            const role = (doctor.role || "").trim();
            const isQualification = /\b[A-Z]\./.test(role);
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
                      {doctor.image ? (
                        <>
                          <img
                            src={`${doctor.image}?v=${DOCTOR_IMAGE_VERSION}`}
                            alt={doctor.name}
                            className="team-img"
                            loading="lazy"
                          />
                          <span className="team-avatar-badge" aria-hidden="true">{initials}</span>
                        </>
                      ) : (
                        /* No portrait: the initials take the circle the photo
                           would have filled. Reusing team-img keeps the size,
                           ring, border, shadow and hover scale identical, so a
                           card without a photo still sits in the grid the same
                           way. The corner badge is dropped here because it would
                           just repeat these initials. */
                        <div
                          className="team-img"
                          style={{
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 700,
                            fontSize: "2rem",
                            letterSpacing: "0.02em",
                            color: "#00313C",
                            background:
                              "linear-gradient(145deg, #e8fdff, #cfeff5)",
                          }}
                          aria-hidden="true"
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    <h3>{doctor.name}</h3>
                    <p
                      className={`team-role ${
                        isQualification ? "team-role--degree" : "team-role--title"
                      }`}
                    >
                      {isQualification && (
                        <span className="team-role-chip" aria-hidden="true">
                          <FaCertificate />
                        </span>
                      )}
                      <span>{role}</span>
                    </p>
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
