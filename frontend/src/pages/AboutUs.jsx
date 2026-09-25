// // // // // import React from "react";
// // // // // import "./AboutUs.css";
// // // // // import { FaUsers, FaBullseye, FaEye } from "react-icons/fa";

// // // // // export default function AboutUs() {
// // // // //   return (
// // // // //     <section className="about">
// // // // //       <h2>About Us</h2>
// // // // //       <div className="about-cards">
// // // // //         {/* Card 1 */}
// // // // //         <div className="about-card">
// // // // //           <div className="about-icon primary">
// // // // //             <FaUsers />
// // // // //           </div>
// // // // //           <h3>Who we are</h3>
// // // // //           <p>
// // // // //             MRT is a technology-driven enterprise committed to bridging
// // // // //             innovation and human well-being. We design AI-powered healthcare &
// // // // //             agriculture platforms, scalable web/mobile apps, and digital
// // // // //             marketing solutions to empower individuals, enterprises, and
// // // // //             governments.
// // // // //           </p>
// // // // //         </div>

// // // // //         {/* Card 2 */}
// // // // //         <div className="about-card">
// // // // //           <div className="about-icon secondary">
// // // // //             <FaBullseye />
// // // // //           </div>
// // // // //           <h3>Mission</h3>
// // // // //           <ul>
// // // // //             <li>
// // // // //               Harness AI for healthcare diagnostics, preventive care, and
// // // // //               precision farming.
// // // // //             </li>
// // // // //             <li>
// // // // //               Support G Care India’s mission of delivering affordable healthcare
// // // // //               to every household.
// // // // //             </li>
// // // // //             <li>
// // // // //               Connect communities through CrowdShaki for collaborative,
// // // // //               data-driven decision-making.
// // // // //             </li>
// // // // //           </ul>
// // // // //         </div>

// // // // //         {/* Card 3 */}
// // // // //         <div className="about-card">
// // // // //           <div className="about-icon accent">
// // // // //             <FaEye />
// // // // //           </div>
// // // // //           <h3>Vision</h3>
// // // // //           <p>
// // // // //             To use Artificial Intelligence and Data Science to expand healthcare
// // // // //             access, strengthen agricultural productivity, and build inclusive
// // // // //             digital ecosystems.
// // // // //           </p>
// // // // //         </div>
// // // // //       </div>
// // // // //       {/* 🔑 New Our Story button */}
// // // // //       <div className="about-btn-wrapper">
// // // // //         <button className="about-btn">Our Story</button>
// // // // //       </div>
// // // // //     </section>
// // // // //   );
// // // // // }

// // // // import React from "react";
// // // // import "./AboutUs.css";
// // // // import { FaUsers, FaBullseye, FaEye } from "react-icons/fa";

// // // // const ABOUT_CARDS = [
// // // //   {
// // // //     icon: <FaUsers />,
// // // //     title: "Who we are",
// // // //     text: `MRT is a technology-driven enterprise committed to bridging innovation and human well-being. 
// // // //     We design AI-powered healthcare & agriculture platforms, scalable web/mobile apps, and digital marketing solutions 
// // // //     to empower individuals, enterprises, and governments.`,
// // // //   },
// // // //   {
// // // //     icon: <FaBullseye />,
// // // //     title: "Mission",
// // // //     text: (
// // // //       <ul>
// // // //         <li>Harness AI for healthcare diagnostics, preventive care, and precision farming.</li>
// // // //         <li>Support G Care India’s mission of delivering affordable healthcare to every household.</li>
// // // //         <li>Connect communities through CrowdShaki for collaborative, data-driven decision-making.</li>
// // // //       </ul>
// // // //     ),
// // // //   },
// // // //   {
// // // //     icon: <FaEye />,
// // // //     title: "Vision",
// // // //     text: `To use Artificial Intelligence and Data Science to expand healthcare access, 
// // // //     strengthen agricultural productivity, and build inclusive digital ecosystems.`,
// // // //   },
// // // // ];

// // // // export default function AboutUs() {
// // // //   return (
// // // //     <section className="aboutus">
// // // //       <div className="aboutus-inner">
// // // //         <h2 className="aboutus-title">About Us</h2>

// // // //         <div className="aboutus-grid">
// // // //           {ABOUT_CARDS.map((card, i) => (
// // // //             <article className="about-card" key={i}>
// // // //               <div className="about-top">
// // // //                 <div className="about-icon">{card.icon}</div>
// // // //               </div>

// // // //               <div className="about-body">
// // // //                 <h3>{card.title}</h3>
// // // //                 <div className="about-text">{card.text}</div>
// // // //               </div>
// // // //             </article>
// // // //           ))}
// // // //         </div>
// // // //       </div>
// // // //     </section>
// // // //   );
// // // // }





// // // import React from "react";
// // // import "./AboutUs.css";
// // // import { FaUsers, FaBullseye, FaEye } from "react-icons/fa";

// // // export default function AboutUs() {
// // //   return (
// // //     <section className="aboutus">
// // //       <div className="aboutus-inner">
// // //         <h2 className="aboutus-title">About Us</h2>

// // //         <div className="aboutus-grid">
// // //           {/* Who we are */}
// // //           <article className="about-card">
// // //             <div className="about-top">
// // //               <div className="about-icon"><FaUsers /></div>
// // //             </div>
// // //             <div className="about-body">
// // //               <h3>Who we are</h3>
// // //               <p>
// // //                 MRT is a technology-driven enterprise committed to bridging
// // //                 innovation and human well-being. We design AI-powered healthcare
// // //                 & agriculture platforms, scalable web/mobile apps, and digital
// // //                 marketing solutions to empower individuals, enterprises, and
// // //                 governments.
// // //               </p>
// // //             </div>
// // //           </article>

// // //           {/* Mission */}
// // //           <article className="about-card">
// // //             <div className="about-top">
// // //               <div className="about-icon"><FaBullseye /></div>
// // //             </div>
// // //             <div className="about-body">
// // //               <h3>Mission</h3>
// // //               <ul>
// // //                 <li>Harness AI for healthcare diagnostics, preventive care, and precision farming.</li>
// // //                 <li>Support G Care India’s mission of delivering affordable healthcare to every household.</li>
// // //                 <li>Connect communities through CrowdShaki for collaborative, data-driven decision-making.</li>
// // //               </ul>
// // //             </div>
// // //           </article>

// // //           {/* Vision */}
// // //           <article className="about-card">
// // //             <div className="about-top">
// // //               <div className="about-icon"><FaEye /></div>
// // //             </div>
// // //             <div className="about-body">
// // //               <h3>Vision</h3>
// // //               <p>
// // //                 To use Artificial Intelligence and Data Science to expand
// // //                 healthcare access, strengthen agricultural productivity, and
// // //                 build inclusive digital ecosystems.
// // //               </p>
// // //             </div>
// // //           </article>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // }




// // import React from "react";
// // import "./AboutUs.css";
// // import { FaUsers, FaBullseye, FaEye } from "react-icons/fa";

// // export default function AboutUs() {
// //   return (
// //     <section className="about">
// //       <h2>About Us</h2>
// //       <div className="about-cards">
// //         {/* Card 1 */}
// //         <div className="about-card">
// //           <div className="about-icon primary">
// //             <FaUsers />
// //           </div>
// //           <h3>Who we are</h3>
// //           <p>
// //             MRT is a technology-driven enterprise committed to bridging
// //             innovation and human well-being. We design AI-powered healthcare &
// //             agriculture platforms, scalable web/mobile apps, and digital
// //             marketing solutions to empower individuals, enterprises, and
// //             governments.
// //           </p>
// //         </div>

// //         {/* Card 2 */}
// //         <div className="about-card">
// //           <div className="about-icon secondary">
// //             <FaBullseye />
// //           </div>
// //           <h3>Mission</h3>
// //           <ul>
// //             <li>
// //               Harness AI for healthcare diagnostics, preventive care, and
// //               precision farming.
// //             </li>
// //             <li>
// //               Support G Care India’s mission of delivering affordable healthcare
// //               to every household.
// //             </li>
// //             <li>
// //               Connect communities through CrowdShaki for collaborative,
// //               data-driven decision-making.
// //             </li>
// //           </ul>
// //         </div>

// //         {/* Card 3 */}
// //         <div className="about-card">
// //           <div className="about-icon accent">
// //             <FaEye />
// //           </div>
// //           <h3>Vision</h3>
// //           <p>
// //             To use Artificial Intelligence and Data Science to expand healthcare
// //             access, strengthen agricultural productivity, and build inclusive
// //             digital ecosystems.
// //           </p>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }




// import React from "react";
// import "./AboutUs.css";
// import { FaUsers, FaBullseye, FaEye } from "react-icons/fa";
// import { Link } from "react-router-dom"; // ✅ for routing

// export default function AboutUs() {
//   return (
//     <section className="about">
//       <h2>About Us</h2>

//       <div className="about-cards">
//         {/* Card 1 */}
//         <div className="about-card">
//           <div className="about-icon primary">
//             <FaUsers />
//           </div>
//           <h3>Who we are</h3>
//           <p>
//             MRT is a technology-driven enterprise committed to bridging
//             innovation and human well-being. We design AI-powered healthcare &
//             agriculture platforms, scalable web/mobile apps, and digital
//             marketing solutions to empower individuals, enterprises, and
//             governments.
//           </p>
//         </div>

//         {/* Card 2 */}
//         <div className="about-card">
//           <div className="about-icon secondary">
//             <FaBullseye />
//           </div>
//           <h3>Mission</h3>
//           <ul>
//             <li>
//               Harness AI for healthcare diagnostics, preventive care, and
//               precision farming.
//             </li>
//             <li>
//               Support G Care India’s mission of delivering affordable
//               healthcare to every household.
//             </li>
//             <li>
//               Connect communities through CrowdShaki for collaborative,
//               data-driven decision-making.
//             </li>
//           </ul>
//         </div>

//         {/* Card 3 */}
//         <div className="about-card">
//           <div className="about-icon accent">
//             <FaEye />
//           </div>
//           <h3>Vision</h3>
//           <p>
//             To use Artificial Intelligence and Data Science to expand healthcare
//             access, strengthen agricultural productivity, and build inclusive
//             digital ecosystems.
//           </p>
//         </div>
//       </div>

//       {/* ✅ New CTA at the bottom */}
//       <div className="about-cta">
//         <Link to="/about#story" className="about-btn">Our Story</Link>
//       </div>
//     </section>
//   );
// }






// src/pages/AboutUs.jsx
import React, { useEffect, useRef } from "react";
import "./AboutUs.css";
import { FaUsers, FaBullseye, FaEye, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

/* ====== CONTENT (unchanged) ====== */
const ABOUT_CARDS = [
  {
    id: "who",
    icon: <FaUsers />,
    label: "01",
    title: "Who we are",
    body: (
      <p>
        MRT is a technology-driven enterprise committed to bridging innovation and
        human well-being. We design AI-powered healthcare &amp; agriculture platforms,
        scalable web/mobile apps, and digital marketing solutions to empower
        individuals, enterprises, and governments.
      </p>
    ),
  },
  {
    id: "mission",
    icon: <FaBullseye />,
    label: "02",
    title: "Mission",
    body: (
      <ul>
        <li>Harness AI for healthcare diagnostics, preventive care, and precision farming.</li>
        <li>Support G Care India’s mission of delivering affordable healthcare to every household.</li>
        <li>Connect communities through CrowdShaki for collaborative, data-driven decision-making.</li>
      </ul>
    ),
  },
  {
    id: "vision",
    icon: <FaEye />,
    label: "03",
    title: "Vision",
    body: (
      <p>
        Use Artificial Intelligence and Data Science to expand healthcare access, strengthen
        agricultural productivity, and build inclusive digital ecosystems.
      </p>
    ),
  },
];

export default function AboutUs() {
  const sectionRef = useRef(null);

  // Reveal cards as they scroll into view (once), and let each card's
  // highlight follow the pointer. Both are purely decorative.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = Array.from(root.querySelectorAll(".about-glass"));

    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((c) => io.observe(c));

    const onMove = (e) => {
      const card = e.currentTarget;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", onMove));

    // Ambient glow that follows the pointer across the section background.
    const onSectionMove = (e) => {
      const r = root.getBoundingClientRect();
      root.style.setProperty("--ax", `${((e.clientX - r.left) / r.width) * 100}%`);
      root.style.setProperty("--ay", `${((e.clientY - r.top) / r.height) * 100}%`);
      root.dataset.pointer = "1";
    };
    const onSectionLeave = () => {
      delete root.dataset.pointer;
    };
    root.addEventListener("pointermove", onSectionMove);
    root.addEventListener("pointerleave", onSectionLeave);

    return () => {
      io.disconnect();
      cards.forEach((c) => c.removeEventListener("pointermove", onMove));
      root.removeEventListener("pointermove", onSectionMove);
      root.removeEventListener("pointerleave", onSectionLeave);
    };
  }, []);

  return (
    <section className="about" ref={sectionRef} aria-labelledby="about-title">
      {/* decorative backdrop for the glass panels */}
      <div className="about-orb about-orb--a" aria-hidden="true" />
      <div className="about-orb about-orb--b" aria-hidden="true" />
      <div className="about-orb about-orb--c" aria-hidden="true" />
      <div className="about-grid-lines" aria-hidden="true" />
      <div className="about-aura" aria-hidden="true" />

      <div className="about-inner">
        <header className="about-head">
          <span className="about-eyebrow">Myth Reality Technologies</span>
          <h2 id="about-title">About Us</h2>
          <p className="about-lead">
            Technology with a human purpose — from hospital diagnostics to the farmer’s field.
          </p>
        </header>

        <div className="about-cards">
          {ABOUT_CARDS.map((card, i) => (
            <article
              className={`about-glass about-glass--${card.id}`}
              style={{ "--delay": `${i * 120}ms` }}
              key={card.id}
            >
              <div className="about-glass-top">
                <div className="about-icon">{card.icon}</div>
                <span className="about-label">{card.label}</span>
              </div>
              <h3>{card.title}</h3>
              <div className="about-body">{card.body}</div>
              <span className="about-glass-shine" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* CTA (unchanged destination) */}
        <div className="about-cta">
          <Link to="/our-story" className="about-btn">
            Our Story <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
