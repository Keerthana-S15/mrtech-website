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
import React from "react";
import "./AboutUs.css";
import { FaUsers, FaBullseye, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <section className="about">
      <h2>About Us</h2>

      <div className="about-cards">
        {/* Card 1 */}
        <div className="about-card">
          <div className="about-icon primary"><FaUsers /></div>
          <h3>Who we are</h3>
          <p>
            MRT is a technology-driven enterprise committed to bridging innovation and
            human well-being. We design AI-powered healthcare & agriculture platforms,
            scalable web/mobile apps, and digital marketing solutions to empower
            individuals, enterprises, and governments.
          </p>
        </div>

        {/* Card 2 */}
        <div className="about-card">
          <div className="about-icon secondary"><FaBullseye /></div>
          <h3>Mission</h3>
          <ul>
            <li>Harness AI for healthcare diagnostics, preventive care, and precision farming.</li>
            <li>Support G Care India’s mission of delivering affordable healthcare to every household.</li>
            <li>Connect communities through CrowdShaki for collaborative, data-driven decision-making.</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="about-card">
          <div className="about-icon accent"><FaEye /></div>
          <h3>Vision</h3>
          <p>
            Use Artificial Intelligence and Data Science to expand healthcare access, strengthen
            agricultural productivity, and build inclusive digital ecosystems.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        {/* ⬇️ now navigates to a dedicated page */}
        <Link to="/our-story" className="about-btn">Our Story</Link>
      </div>
    </section>
  );
}
