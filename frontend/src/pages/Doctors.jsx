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
 * `image` is set on the few doctors who have supplied a portrait; every other
 * card falls back to the doctor's initials, drawn in the same circle a photo
 * would occupy. The source archive supplies no portraits of its own - its
 * images are Aadhaar cards, PAN cards, bank details and certificate scans,
 * none of which belong on a public page. To add one, drop the file in
 * public/images/doctors/ and add `image: "/images/doctors/<file>"` to that
 * doctor's entry - nothing else changes.
 *
 * Two emails were withheld because their domains are gmail typosquats
 * (gamail.com, gamil.com); a mailto to those would send a visitor's message to
 * whoever owns the lookalike domain. Fix them in the source sheet and they can
 * be added back.
 */
const doctorsData = [
  { name: "Dr. Sharmila", role: "General Physician", email: "sharmilakuty19@gmail.com" },
  { name: "Dr. Blessy", role: "General Physician", email: "blessymagdalin4@gmail.com" },
  { name: "Dr. Shruthi", role: "General Physician" },
  {
    name: "Dr. Suganya K",
    role: "M.B.B.S",
    email: "dr.suganya92@yahoo.com",
    bio: "General Physician providing patient care at EM Hospital, Erode.",
  },
  {
    name: "Dr. PrinceDevaRuban N",
    role: "M.B.B.S (M.S)",
    email: "emhospi@gmail.com",
    bio: "General Physician with 15 years of experience providing patient care at GM Hospital.",
  },
  {
    name: "Dr. Arun Prasath G",
    role: "M.B.B.S",
    email: "learun11@gmail.com",
    bio: "General Physician with 3 years of experience providing patient care at Roja Hospital, Erode.",
  },
  {
    name: "Dr. Thenmozhi L",
    role: "M.B.B.S",
    email: "priyamanaval83@gmail.com",
    bio: "General Physician with 5 years of experience providing patient care at Aram Health Care (Yazhini Clinic).",
    image: "/images/doctors/thenmozhi.png",
  },
  {
    name: "Dr. Karthik",
    role: "M.B.B.S (M.D)",
    email: "karthikpmcud@gmail.com",
    bio: "M.D. (General Medicine) specialist providing patient-focused medical care.",
  },
  {
    name: "Dr. Thanka raj P",
    role: "M.B.B.S (M.D)",
    email: "drthangarajp@gmail.com",
    bio: "MBBS-qualified physician providing patient-focused medical care.",
  },
  {
    name: "Dr. VinothKumar K",
    role: "M.B.B.S",
    email: "drvinoth1997@gmail.com",
    bio: "MBBS-qualified General Physician with 4 years of experience, currently serving as Chief Medical Officer at Emergency Care Center.",
  },
  {
    name: "Dr. Bharath",
    role: "General Physician",
    email: "bharathmedical94@gmail.com",
    image: "/images/doctors/bharath.png",
  },
  {
    name: "Dr. Shobanbabu M.S",
    role: "M.B.B.S",
    email: "shobanbabu902@gmail.com",
    bio: "General Physician providing patient care at Sree Gurun Clinic, Tiruvallur.",
  },
  { name: "Dr. S.Ashiq rasol", role: "General Physician", email: "drashgh93@gmail.com" },
  {
    name: "Dr. Dheena kumar R",
    role: "M.B.B.S",
    // from his Tamilnadu Medical Council registration (24 Dec 2014) and his
    // IMA/CGP-TN Fellowship in Diabetology (2017). His registration number,
    // home address and family details are on those certificates too and are
    // deliberately left off a public page.
    bio: "MBBS-qualified General Physician registered since 2014, with a Fellowship in Diabetology.",
    // smallest portrait on the page at 97x125, so it is scaled up into the
    // 120px avatar; replace if a larger original turns up
    image: "/images/doctors/dheenakumar.png",
  },
  { name: "Dr. Manivannan", role: "General Physician", email: "manivanant2006@gmail.com" },
  {
    name: "Dr. Sivanesan",
    role: "M.B.B.S",
    // first real portrait on the page; every other card still falls back to
    // initials, which the avatar handles without any layout change
    image: "/images/doctors/sivanesan.png",
  },
  {
    name: "Dr. mohammedanas R",
    role: "M.B.B.S",
    email: "mohammedanas003@gmail.com",
    // from his G Care empanelment form and Tamilnadu Medical Council
    // registration (M.B.B.S., SRM, Aug 2020; registered 01 Oct 2020).
    // That file also contains his Aadhaar and PAN cards, registration
    // number, date of birth and home address — none of which belongs
    // anywhere near this page. The clinic name on the form is handwritten
    // and not legible enough to publish, so it is left out.
    bio: "MBBS-qualified General Physician with 3 years of experience, serving as a Critical Care Consultant.",
    image: "/images/doctors/mohammedanas.png",
  },
  { name: "Dr. Jayaraman", role: "General Physician", email: "drcjayaraman@gmail.com" },
  { name: "Dr. Hari raj", role: "General Physician", email: "hariraj0222@gmail.com" },
  {
    name: "Dr. Agalvizhi E",
    role: "M.B.B.S",
    email: "agalvizhi@gmail.com",
    // from her G Care empanelment form and Tamilnadu Medical Council card:
    // Doctor of Medicine (Davao Medical School Foundation, Dec 2020), which
    // the council records as equivalent to Indian MBBS; registered 10 Jan
    // 2023; practising at K.V. Healthcare, Mittur. Her registration number,
    // date of birth, home address and phone are on those papers and are
    // deliberately left off a public page.
    bio: "General Physician at K.V. Healthcare, Mittur, with a Doctor of Medicine qualification equivalent to Indian MBBS.",
    image: "/images/doctors/agalvizhi.png",
  },
  {
    name: "Dr. Shirin synthiya",
    role: "M.B.B.S",
    email: "shirinsynthiyaw@gmail.com",
    // Tamil Nadu Medical Council certificate: Shirin Synthiya, Wilson Churchil
    // Prabu — M.B.B.S., Meenakshi University 2018, registered 06 Apr 2018.
    bio: "MBBS-qualified General Physician, registered with the Tamil Nadu Medical Council since 2018.",
    image: "/images/doctors/shirin.png",
  },
  {
    name: "Dr. Mohanraj",
    role: "M.B.B.S",
    email: "karnanmohan740@gmail.com",
    // G Care empanelment form: MBBS 2020, registered with the Tamilnadu
    // Medical Council 15 Feb 2023, General Physician at Karnan Clinic, and
    // available for teleconsultation every day of the week.
    bio: "MBBS-qualified General Physician at Karnan Clinic, offering teleconsultation services.",
  },
  {
    name: "Dr. Ranjan ",
    role: "M.B.B.S",
    email: "kkranjan03@gmail.com",
    // G Care empanelment form: Ranjan Karunagaran — MBBS 2022, registered
    // with the Tamilnadu Medical Council 20 Feb 2023, General Physician at
    // his clinic in Mathur. The clinic's name on the form is not legible, so
    // only the location is used.
    bio: "MBBS-qualified General Physician providing patient care at his clinic in Mathur.",
    image: "/images/doctors/ranjan.png",
  },
  {
    name: "Dr. Udhaya Karthikeyan",
    role: "M.B.B.S (M.D)",
    email: "udhaya95.trk@gmail.com",
    // Tamilnadu Medical Council certificate: "Medical Doctor - Equivalent to
    // Indian MBBS", Tbilisi State Medical University, Georgia (May 2018),
    // registered 17 Jun 2021. G Care form: Medical Officer at Jayanthi
    // Clinic, 3 years' experience as at Feb 2025. Her registration number,
    // date of birth, phone and home address stay off the page.
    bio: "Medical Doctor, equivalent to Indian MBBS, with 3 years of experience practising at Jayanthi Clinic.",
  },
  { name: "Dr. Kamali K", role: "M.B.B.S", email: "kamalikumaresan27@gmail.com" },
  { name: "Dr. Praveen kumar", role: "General Physician", email: "praveenveg92@gmail.com" },
  { name: "Dr. Srilekha", role: "General Physician", email: "srilekhapalanesamy06@gmail.com" },
  {
    name: "Dr. Sivakumar M",
    role: "M.B.B.S",
    email: "drsiva.1979@gmail.com",
    bio: "MBBS-qualified physician with 20 years of experience, serving at Government ESI Dispensary, Ambur.",
  },
  {
    name: "Dr. Avinash pandi",
    role: "M.B.B.S (MD)",
    email: "avinash.pandi5@gmail.com",
    bio: "MBBS, MD (General Medicine) specialist with 5 years of experience, practising at Saravanan Hospital.",
  },
  { name: "Dr. Harivarma C.P", role: "M.B.B.S", email: "hariv2529@gmail.com" },
  {
    name: "Dr. Dhayanithi K",
    role: "M.B.B.S",
    // his council card reads "M.D.Physician - Equivalent to Indian MBBS",
    // which is why the badge says M.B.B.S and the bio says M.D. Physician
    bio: "M.D. Physician-qualified doctor registered with the Tamil Nadu Medical Council.",
    email: "dhayakara13@gmail.com",
    // smallest portrait supplied so far at 102x122, so it is scaled up into
    // the 120px avatar rather than down; replace with a larger original when
    // one is available
    image: "/images/doctors/dhayanithi.png",
  },
  {
    name: "Dr. Ariviyalan M",
    role: "B.S.M.S (MD)",
    email: "ariviyalandr22@gmail.com",
    bio: "BSMS-qualified Siddha physician with an M.D. (Siddha) additional qualification, registered with the Tamil Nadu Siddha Medical Council.",
  },
  {
    name: "Dr. Shenbaga priya ",
    role: "B.S.M.S (MD)",
    email: "spshenba@gmail.com",
    bio: "BSMS-qualified Siddha physician with an M.D. (Siddha) in Varma Maruthuvam, registered with the Tamil Nadu Siddha Medical Council, practising at Ayan Siddha Varma Clinic.",
  },
  { name: "Dr. Lakshmi priya", role: "General Physician", email: "lakshmipriyak1202@gmail.com" },
  { name: "Dr. Selvi", role: "General Physician", email: "dhaaraniaps27@gmail.com" },
  { name: "Dr. Vaishnavi", role: "General Physician", email: "vaishnavimoorthy31@gmail.com" },
  {
    name: "Dr. Rakesh V",
    role: "M.B.B.S ",
    email: "meetmeraki369@gmail.com",
    // Tamilnadu Medical Council certificate: M.B.B.S., Thiruvarur Govt.
    // Medical College, Dr. M.G.R. Medical University (Oct 2021), registered
    // 31 Jan 2022. His form also lists FIDM and FIP fellowships.
    bio: "MBBS from Thiruvarur Govt. Medical College (2021), registered with the Tamil Nadu Medical Council since 2022.",
    image: "/images/doctors/rakesh.png",
  },
  {
    name: "Dr. Kandhavadivel",
    role: "General Physician",
    email: "kanvel86@gmail.com",
    // G Care form: MBBS, MD (PESIMSR, Andhra Pradesh, 2013), registered with
    // the Tamilnadu Medical Council 24 Aug 2018, 13 years' experience,
    // Medical Officer at Lakshmi Clinic. His Aadhaar and PAN are in the same
    // file and are deliberately left off a public page.
    bio: "MBBS, MD-qualified Medical Officer with 13 years of experience at Lakshmi Clinic.",
  },
  { name: "Dr. Elavarasan", role: "General Physician", email: "elavarasanv181@gmail.com" },
  {
    name: "Dr. Santhosh Kumar B",
    role: "M.B.B.S (M.D. Physician )",
    email: "mmsanthosh27@gmail.com",
    bio: "M.D. Physician with 8 years of medical experience, practising at RBS Clinic, Kallamathampatti.",
  },
  {
    name: "Dr. Vigneshwaran R.S",
    role: "M.B.B.S",
    email: "vickysundharam@gmail.com",
    bio: "MBBS graduate from Madha Medical College (2019), with 6 years of experience. Registered with TNMC and practising at Shakthi Clinic.",
  },
  { name: "Dr. Aravindan", role: "General Physician", email: "aravindan6620@gmail.com" },
  {
    name: "Dr. Deepika N",
    role: "M.B.B.S(Doctor of Medicine)",
    email: "dpi233811@gmail.com",
    bio: "Doctor of Medicine graduate from Davao Medical School Foundation, Philippines, registered with TNMC in 2022.",
    image: "/images/doctors/deepika.png",
  },
  { name: "Dr. Muthumani", role: "General Physician" },
  {
    name: "Dr. Thangaselvam S",
    role: "M.B.B.S (M.D)",
    email: "thangaselvam193@gmail.com",
    bio: "M.D. (General Medicine) with 7 years of experience, practising as a Consultant Physician at Thangam Clinic, Srivilliputhur.",
  },
  {
    name: "Dr. Nirmalkumar",
    role: "M.D.(Anaesthesiology)",
    email: "drnirmalkumarshr@gmail.com",
    bio: "M.D. (Anaesthesiology) graduate with 2 years of medical experience, registered with TNMC and practising at Shri Yoganarashima Clinic, Sholinghur.",
  },
  {
    name: "Dr. Sibi Raj M",
    role: "M.B.B.S",
    email: "sibiraj000@gmail.com",
    bio: "MBBS graduate from Subbaiah Institute of Medical Sciences, Shimoga, affiliated with Rajiv Gandhi University of Health Sciences (2024). Registered with TNMC, Registration No. 185715.",
    image: "/images/doctors/sibiraj.png",
  },
  { name: "Dr. Soundarajan", role: "General Physician", email: "soundarajdr@gmail.com" },
  { name: "Dr. Sangeetha", role: "General Physician", email: "sangeethambbs90@gmail.com" },
  { name: "Dr. Selvarasi S", role: "M.B.B.S", email: "selvarasisivs@gmail.com" },
  { name: "Dr. Tamilselvan S", role: "M.B.B.S", email: "dr.tamilselvan1992@mail.com" },
  {
    name: "Dr. Kishore",
    role: "M.B.B.S",
    email: "drkishoreraja@yahoo.com",
    // The terms-and-conditions form carries no professional details at all —
    // only his name and the signing date. These come from his G Care
    // application form (Dr. Kishore Rajendiran, same email as this entry):
    // MBBS, Weifang Medical University 2019, Tamil Nadu Medical Council
    // registration, 6 years' experience, Dr. R.S. Multi Speciality Clinic.
    bio: "MBBS graduate from Weifang Medical University (2019) with 6 years of experience. Registered with TNMC and practising at Dr. R.S. Multi Speciality Clinic.",
  },
  {
    name: "Dr. Gowtham M.R",
    role: "M.B.B.S",
    email: "mrirs420@gmail.com",
    bio: "MBBS graduate with 8 years of total medical experience, including 2 years as a General Physician. Registered with TNMC and associated with MR Hospital & Diabetic Foot Care Centre, Mettupalayam.",
  },
  // one of the few doctors the sheet carries a bio for; everyone else falls
  // back to "No bio available." on the back of the card
  {
    name: "Dr. Gokulram",
    role: "M.B.B.S",
    email: "gokulram.r25@gmail.com",
    bio: "General Physician providing patient care at KS Hospital, Vadalur.",
    image: "/images/doctors/gokulram.png",
  },
  { name: "Dr. Santhosh kumar M", role: "M.B.B.S", email: "santhoshanandh004@gmail.com" },
  {
    name: "Dr. Singamsetty srinivas S",
    role: " M.B.B.S",
    email: "srinusingam5009@gmail.com",
    bio: "General Physician providing medical care based on his MBBS qualification and registered medical practitioner status.",
  },
  {
    name: "Dr. A.S.Sobana",
    role: "M.B.B.S",
    email: "shobana53479@gmail.com",
    bio: "Medical Officer providing patient care at Asanur Medical Clinic.",
  },
  { name: "Dr. Senthamizhselvan", role: "M.B.B.S (Doctor of Medicine)", email: "tamilselvam.ssm.mm@gmail.com" },
  {
    name: "Dr. Saranraj Jayabalan",
    role: "M.B.B.S(M.S.General Surgery)",
    email: "saranraj161294@gmail.com",
    bio: "General Surgeon providing specialized surgical care to patients.",
    image: "/images/doctors/saranraj.png",
  },
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
