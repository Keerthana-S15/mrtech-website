// // src/pages/Solutions.jsx - UPDATED VERSION
// import React, { useEffect, useRef, useState } from "react";
// import "./Solutions.css";
// import {
//   FaHospitalAlt,
//   FaChartBar,
//   FaSeedling,
//   FaUsers,
//   FaGraduationCap,
//   FaCalendarCheck,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// /* ====== SOLUTION CARDS DATA ====== */
// const SOLUTIONS = [
//   {
//     icon: <FaHospitalAlt />,
//     title: "G Care Health ATM",
//     text:
//       "AI-enabled health kiosks for preventive healthcare and diagnostics. Planned 3,300+ locations across Tamil Nadu.",
//     href: "/solutions/gcare", // ✅ UPDATED
//   },
//   {
//     icon: <FaChartBar />,
//     title: "Health Score App",
//     text:
//       "AI-based preventive health tool with personalized scoring and recommendations.",
//     href: "/solutions/health-score", // ✅ UPDATED
//   },
//   {
//     icon: <FaSeedling />,
//     title: "AI Agriculture Solutions",
//     text:
//       "Smart farming tools with AI-powered crop monitoring, soil analysis, and precision guidance.",
//     href: "/solutions/agri", // ✅ UPDATED
//   },
//   {
//     icon: <FaUsers />,
//     title: "CrowdShaki Platform",
//     text:
//       "Community intelligence platform for collaborative, data-driven decision-making and social impact.",
//     href: "/crowdshaki", // ✅ ALREADY CORRECT
//   },
//   {
//     icon: <FaGraduationCap />,
//     title: "CHA Training Program",
//     text:
//       "Community Health Ambassador program – Recruit, Train, Deploy model for healthcare jobs.",
//     href: "/solutions/cha", // ✅ UPDATED
//   },
//   {
//     icon: <FaCalendarCheck />,
//     title: "SERV Attendance App",
//     text:
//       "Smart attendance management system for employee check-ins, time tracking, and reporting.",
//     href: "/solutions/serv-attendance", // ✅ ALREADY CORRECT
//   },
// ];

// export default function Solutions() {
//   const navigate = useNavigate();

//   return (
//     <section className="solutions">
//       <div className="solutions-inner">
//         <h2 className="solutions-title">
//           Our Professional <span>IT Services</span>
//         </h2>

//         <div className="solutions-grid">
//           {SOLUTIONS.map((card, i) => (
//             <article className="sol-card" key={i}>
//               <div className="sol-top">
//                 <div className="sol-icon">{card.icon}</div>
//               </div>

//               <div className="sol-body">
//                 <h3>{card.title}</h3>
//                 <p>{card.text}</p>

//                 <button
//                   className="sol-link"
//                   onClick={() => navigate(card.href)}
//                 >
//                   Read More <span className="arrow">›</span>
//                 </button>
//               </div>
//             </article>
//           ))}
//         </div>

//         <Stats />
//       </div>
//     </section>
//   );
// }

// /* =======================
//    Animated Counters Strip
//    ======================= */
// function Stats() {
//   const ref = useRef(null);
//   const [start, setStart] = useState(false);

//   useEffect(() => {
//     const io = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setStart(true);
//           io.disconnect();
//         }
//       },
//       { threshold: 0.4 }
//     );
//     if (ref.current) io.observe(ref.current);
//     return () => io.disconnect();
//   }, []);

//   const items = [
//     { id: 1, end: 3300, label: "Health ATMs Planned", suffix: "+" },
//     { id: 2, end: 50000, label: "Lives Impacted", suffix: "+" },
//     { id: 3, end: 100, label: "Partner Hospitals", suffix: "+" },
//     { id: 4, end: 2.5, label: "Funds Raised", prefix: "₹", suffix: "Cr+" },
//   ];

//   return (
//     <section className="stats" ref={ref}>
//       <div className="stats-inner">
//         {items.map((it) => (
//           <Counter
//             key={it.id}
//             start={start}
//             end={it.end}
//             label={it.label}
//             prefix={it.prefix}
//             suffix={it.suffix}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// function Counter({ start, end, label, prefix = "", suffix = "" }) {
//   const [val, setVal] = useState(0);

//   useEffect(() => {
//     if (!start) return;
//     let raf;
//     const duration = 1500;
//     const t0 = performance.now();

//     const step = (now) => {
//       const p = Math.min((now - t0) / duration, 1);
//       const eased = easeOutCubic(p);
//       const curr = end * eased;
//       const display = Number.isInteger(end)
//         ? Math.round(curr)
//         : Number(curr.toFixed(1));
//       setVal(display);
//       if (p < 1) raf = requestAnimationFrame(step);
//     };
//     raf = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(raf);
//   }, [start, end]);

//   const show = Number.isInteger(end)
//     ? val.toLocaleString("en-IN")
//     : val.toFixed(1);

//   return (
//     <div className="stat">
//       <div className="stat-number">
//         {prefix}
//         {show}
//         {suffix}
//       </div>
//       <div className="stat-label">{label}</div>
//     </div>
//   );
// }

// src/pages/Solutions.jsx - UPDATED VERSION
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Solutions.css";
import {
  FaHospitalAlt,
  FaChartBar,
  FaSeedling,
  FaUsers,
  FaGraduationCap,
  FaCalendarCheck,
  FaArrowRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

/* ====== SOLUTION CARDS DATA (content + routes unchanged) ====== */
const SOLUTIONS = [
  {
    id: "gcare",
    accent: "orange",
    category: "Healthcare",
    icon: <FaHospitalAlt />,
    title: "G Care Health ATM",
    text:
      "AI-enabled health kiosks for preventive healthcare and diagnostics. Planned 3,300+ locations across Tamil Nadu.",
    href: "/solutions/gcare",
  },
  {
    id: "gscore",
    accent: "emerald",
    category: "Healthcare",
    icon: <FaChartBar />,
    title: "G Score App",
    text:
      "AI-based preventive health tool with personalized scoring and recommendations.",
    href: "/solutions/health-score",
  },
  {
    id: "agri",
    accent: "green",
    category: "Agriculture",
    icon: <FaSeedling />,
    title: "AI Agriculture Solutions",
    text:
      "Smart farming tools with AI-powered crop monitoring, soil analysis, and precision guidance.",
    href: "/solutions/agri",
  },
  {
    id: "nandago",
    accent: "violet",
    category: "Community",
    icon: <FaUsers />,
    title: "Nandago Platform",
    text:
      "Community intelligence platform for collaborative, data-driven decision-making and social impact.",
    href: "/crowdshaki",
  },
  {
    id: "cha",
    accent: "teal",
    category: "Healthcare",
    icon: <FaGraduationCap />,
    title: "CHA Training Program",
    text:
      "Community Health Ambassador program – Recruit, Train, Deploy model for healthcare jobs.",
    href: "/solutions/cha",
  },
  {
    id: "serv",
    accent: "sky",
    category: "Workforce",
    icon: <FaCalendarCheck />,
    title: "SERV Attendance App",
    text:
      "Smart attendance management system for employee check-ins, time tracking, and reporting.",
    href: "/solutions/serv-attendance",
  },
];

const CATEGORIES = ["All", ...new Set(SOLUTIONS.map((s) => s.category))];

export default function Solutions() {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [filter, setFilter] = useState("All");

  const visible = useMemo(
    () => (filter === "All" ? SOLUTIONS : SOLUTIONS.filter((s) => s.category === filter)),
    [filter]
  );

  // Scroll reveal (once per card) + pointer-following highlight.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".sol-card"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-visible"));
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
      { threshold: 0.15 }
    );
    cards.forEach((c) => io.observe(c));

    const onMove = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", onMove));

    return () => {
      io.disconnect();
      cards.forEach((c) => c.removeEventListener("pointermove", onMove));
    };
  }, [visible]);

  return (
    <section className="solutions" aria-labelledby="solutions-title">
      <div className="sol-bg sol-bg--a" aria-hidden="true" />
      <div className="sol-bg sol-bg--b" aria-hidden="true" />

      <div className="solutions-inner">
        <header className="sol-head">
          <span className="sol-eyebrow">
            <i className="sol-eyebrow-dot" aria-hidden="true" />
            What we offer
          </span>
          <h2 id="solutions-title" className="solutions-title">
            Our Professional <span>IT Services</span>
          </h2>
          <p className="sol-lead">
            AI-driven products for healthcare, agriculture and communities —
            built to work where it matters most.
          </p>

          <div className="sol-filters" role="tablist" aria-label="Filter services">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={filter === c}
                className={`sol-filter${filter === c ? " is-active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
                {c !== "All" && (
                  <span className="sol-filter-count">
                    {SOLUTIONS.filter((s) => s.category === c).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        <div className="solutions-grid" ref={gridRef} key={filter}>
          {visible.map((card, i) => (
            <article
              className={`sol-card sol-card--${card.accent}`}
              style={{ "--delay": `${i * 90}ms` }}
              key={card.id}
              onClick={() => navigate(card.href)}
            >
              <div className="sol-top">
                <div className="sol-icon-wrap">
                  <span className="sol-icon-ring" aria-hidden="true" />
                  <div className="sol-icon">{card.icon}</div>
                </div>
                <span className="sol-index">0{i + 1}</span>
              </div>

              <div className="sol-body">
                <span className="sol-category">{card.category}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>

                <Link
                  to={card.href}
                  className="sol-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Read More</span>
                  <FaArrowRight className="arrow" />
                </Link>
              </div>

              <span className="sol-bar" aria-hidden="true" />
            </article>
          ))}
        </div>

        <Stats />
      </div>
    </section>
  );
}

/* =======================
   Animated Counters Strip
   ======================= */
function Stats() {
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const items = [
    { id: 1, end: 3300, label: "Health ATMs Planned", suffix: "+" },
    { id: 2, end: 50000, label: "Lives Impacted", suffix: "+" },
    { id: 3, end: 100, label: "Partner Hospitals", suffix: "+" },
    { id: 4, end: 2.5, label: "Funds Raised", prefix: "₹", suffix: "Cr+" },
  ];

  return (
    <section className="sol-stats" ref={ref} aria-label="Impact numbers">
      <div className="sol-stats-glow" aria-hidden="true" />
      <div className="sol-stats-inner">
        {items.map((it) => (
          <Counter
            key={it.id}
            start={start}
            end={it.end}
            label={it.label}
            prefix={it.prefix}
            suffix={it.suffix}
          />
        ))}
      </div>
    </section>
  );
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function Counter({ start, end, label, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    const duration = 1500;
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = easeOutCubic(p);
      const curr = end * eased;
      const display = Number.isInteger(end)
        ? Math.round(curr)
        : Number(curr.toFixed(1));
      setVal(display);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, end]);

  const show = Number.isInteger(end)
    ? val.toLocaleString("en-IN")
    : val.toFixed(1);

  return (
    <div className={`sol-stat${start ? " is-live" : ""}`}>
      <div className="sol-stat-number">
        {prefix}
        {show}
        {suffix}
      </div>
      <div className="sol-stat-label">{label}</div>
    </div>
  );
}
