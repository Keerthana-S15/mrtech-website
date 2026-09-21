// import React, { useState } from "react";
// import "./Home.css";
// import { FaShoppingCart, FaMobileAlt, FaChartBar } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import AboutUs from "./AboutUs";

// export default function Home() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [verified, setVerified] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Step 1: Send OTP
//   const handleGetOtp = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:3000/api/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         alert("✅ OTP sent to your email!");
//         setOtpSent(true);
//       } else {
//         alert("❌ " + data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Failed to send OTP");
//     }
//   };

//   // ✅ Step 2: Verify OTP & Submit demo request automatically
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:3000/api/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           mobile: formData.mobile,
//           otp,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("🎉 OTP Verified! Demo request submitted successfully!");
//         setVerified(true);
//         setTimeout(() => {
//           setShowPopup(false);
//           setOtpSent(false);
//           setVerified(false);
//           setFormData({ name: "", email: "", mobile: "" });
//           setOtp("");
//         }, 2000);
//       } else {
//         alert("❌ " + data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Verification failed");
//     }
//   };

//   return (
//     <>
//       {/* HERO SECTION */}
//       <section
//         className="hero"
//         style={{
//           backgroundImage: "url('/digital-art-ai-technology-background.jpg')",
//         }}
//       >
//         <div className="hero-inner">
//           <div className="hero-left">
//             <h1 className="hero-title">
//               AI-Powered Innovation for <br />
//               Healthcare, Agriculture & Digital Transformation
//             </h1>
//             <p className="hero-sub">
//               Welcome to Myth Reality Technologies Private Limited (MRT)—the
//               technology powerhouse behind AI-driven healthcare, smart
//               agriculture, and next-gen digital ecosystems.
//             </p>

//             <div className="hero-buttons">
//               <Link to="/solutions" className="btn btn-primary">
//                 <FaShoppingCart className="btn-icon" /> Explore Solutions
//               </Link>

//               <button
//                 className="btn btn-outline"
//                 onClick={() => setShowPopup(true)}
//               >
//                 <FaMobileAlt className="btn-icon" /> Download SERV App
//               </button>

//               <button className="btn btn-outline">
//                 <FaChartBar className="btn-icon" /> Health Score Report
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* POPUP FORM */}
//       {showPopup && (
//         <div className="popup-overlay" onClick={() => setShowPopup(false)}>
//           <div
//             className="popup-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>Download SERV App - Request Demo</h2>

//             {!otpSent ? (
//               // Step 1 Form
//               <form onSubmit={handleGetOtp} className="popup-form">
//                 <label>
//                   Name:
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </label>
//                 <label>
//                   Email:
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </label>
//                 <label>
//                   Mobile:
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     required
//                   />
//                 </label>

//                 <button type="submit" className="btn btn-primary">
//                   Get OTP
//                 </button>
//               </form>
//             ) : !verified ? (
//               // Step 2 Verify OTP
//               <form onSubmit={handleVerifyOtp} className="popup-form">
//                 <label>
//                   Enter OTP:
//                   <input
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     required
//                   />
//                 </label>
//                 <button type="submit" className="btn btn-primary">
//                   Verify OTP
//                 </button>
//               </form>
//             ) : (
//               <p className="success-message">🎉 Request submitted successfully!</p>
//             )}

//             <button className="close-btn" onClick={() => setShowPopup(false)}>
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       <AboutUs />
//     </>
//   );
// }




// import React, { useState } from "react";
// import "./Home.css";
// import { FaShoppingCart, FaMobileAlt, FaChartBar } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import AboutUs from "./AboutUs";

// export default function Home() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [verified, setVerified] = useState(false);
//   const [emailOtp, setEmailOtp] = useState("");
//   const [mobileOtp, setMobileOtp] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ Step 1: Send OTP to both Email & Mobile
//   const handleGetOtp = async (e) => {
//     e.preventDefault();

//     try {
//       // ✅ FIX: relative path instead of hardcoded http://localhost:3000
//       const res = await fetch("/api/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           email: formData.email,
//           mobile: formData.mobile 
//         }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         alert("✅ OTP sent to your Email and Mobile!");
//         setOtpSent(true);
//       } else {
//         alert("❌ " + data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Failed to send OTP");
//     }
//   };

//   // ✅ Step 2: Verify both OTPs
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
    
//     try {
//       // ✅ FIX: relative path
//       const res = await fetch("/api/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           mobile: formData.mobile,
//           emailOtp,
//           mobileOtp,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("🎉 Both OTPs Verified! Demo request submitted successfully!");
//         setVerified(true);
//         setTimeout(() => {
//           setShowPopup(false);
//           setOtpSent(false);
//           setVerified(false);
//           setFormData({ name: "", email: "", mobile: "" });
//           setEmailOtp("");
//           setMobileOtp("");
//         }, 2000);
//       } else {
//         alert("❌ " + data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("⚠️ Verification failed");
//     }
//   };

//   return (
//     <>
//       {/* HERO SECTION */}
//       <section
//         className="hero"
//         style={{
//           backgroundImage: "url('/digital-art-ai-technology-background.jpg')",
//         }}
//       >
//         <div className="hero-inner">
//           <div className="hero-left">
//             <h1 className="hero-title">
//               AI-Powered Innovation for <br />
//               Healthcare, Agriculture & Digital Transformation
//             </h1>
//             <p className="hero-sub">
//               Welcome to Myth Reality Technologies Private Limited (MRT)—the
//               technology powerhouse behind AI-driven healthcare, smart
//               agriculture, and next-gen digital ecosystems.
//             </p>

//             <div className="hero-buttons">
//               <Link to="/solutions" className="btn btn-primary">
//                 <FaShoppingCart className="btn-icon" /> Explore Solutions
//               </Link>

//               <button
//                 className="btn btn-outline"
//                 onClick={() => setShowPopup(true)}
//               >
//                 <FaMobileAlt className="btn-icon" /> Download SERV App
//               </button>

//               <button className="btn btn-outline">
//                 <FaChartBar className="btn-icon" /> Health Score Report
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* POPUP FORM */}
//       {showPopup && (
//         <div className="popup-overlay" onClick={() => setShowPopup(false)}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//             <h2>Download SERV App - Request Demo</h2>

//             {!otpSent ? (
//               // Step 1: Get User Details
//               <form onSubmit={handleGetOtp} className="popup-form">
//                 <label>
//                   Name:
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </label>
//                 <label>
//                   Email:
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </label>
//                 <label>
//                   Mobile:
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     pattern="[0-9]{10}"
//                     placeholder="10-digit mobile number"
//                     required
//                   />
//                 </label>

//                 <button type="submit" className="btn btn-primary">
//                   Send OTP
//                 </button>
//               </form>
//             ) : !verified ? (
//               // Step 2: Verify Both OTPs
//               <form onSubmit={handleVerifyOtp} className="popup-form">
//                 <label>
//                   Enter Email OTP:
//                   <input
//                     type="text"
//                     value={emailOtp}
//                     onChange={(e) => setEmailOtp(e.target.value)}
//                     placeholder="6-digit email OTP"
//                     maxLength="6"
//                     required
//                   />
//                 </label>
//                 <label>
//                   Enter Mobile OTP:
//                   <input
//                     type="text"
//                     value={mobileOtp}
//                     onChange={(e) => setMobileOtp(e.target.value)}
//                     placeholder="6-digit mobile OTP"
//                     maxLength="6"
//                     required
//                   />
//                 </label>
//                 <button type="submit" className="btn btn-primary">
//                   Verify OTPs
//                 </button>
//               </form>
//             ) : (
//               <p className="success-message">
//                 🎉 Request submitted successfully!
//               </p>
//             )}

//             <button className="close-btn" onClick={() => setShowPopup(false)}>
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       <AboutUs />
//     </>
//   );
// }





import React, { useState } from "react";
import "./Home.css";
import {
  FaShoppingCart,
  FaMobileAlt,
  FaChartBar,
  FaHeartbeat,
  FaSeedling,
  FaNetworkWired,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AboutUs from "./AboutUs";

/* ====== HOMEPAGE SERVICE CARDS ====== */
const SERVICES = [
  {
    id: "healthcare",
    icon: <FaHeartbeat />,
    title: "AI Healthcare",
    tagline: "Preventive care, powered by intelligence",
    text:
      "AI-enabled health kiosks, personalised health scoring and community health programs that bring affordable diagnostics to every household.",
    points: ["G Care Health ATM", "G Score App", "CHA Training"],
    href: "/solutions/gcare",
  },
  {
    id: "agriculture",
    icon: <FaSeedling />,
    title: "Smart Agriculture",
    tagline: "Precision farming for every field",
    text:
      "Smart farming tools with AI-powered crop monitoring, soil analysis and precision guidance that raise yields and reduce risk for farmers.",
    points: ["Crop monitoring", "Soil analysis", "Precision guidance"],
    href: "/solutions/agri",
  },
  {
    id: "digital",
    icon: <FaNetworkWired />,
    title: "Digital Transformation",
    tagline: "Next-gen digital ecosystems",
    text:
      "Scalable web and mobile platforms, community intelligence and workforce tools that connect people, data and decisions.",
    points: ["Nandago Platform", "SERV Attendance", "Web & Mobile Apps"],
    href: "/solutions",
  },
];

const SERV_APP_LINK = "https://play.google.com/store/apps/details?id=com.serv.serv_app";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  // Which channels the backend actually delivered an OTP to. A Brevo (email)
  // failure no longer blocks the Fast2SMS (mobile) OTP — we just ask for the
  // OTP(s) that were sent.
  const [otpChannels, setOtpChannels] = useState({ emailSent: true, mobileSent: true });
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Step 1: Send OTP — Email via Brevo, Mobile via Fast2SMS (independent)
  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          mobile: formData.mobile,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setOtpChannels({
          emailSent: data.emailSent !== false,
          mobileSent: data.mobileSent !== false,
        });
        alert("✅ " + (data.message || "OTP sent!") + (data.warning ? "\n\n" + data.warning : ""));
        setOtpSent(true);
      } else {
        alert("❌ " + (data.error || "Failed to send OTP"));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to send OTP. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  // ✅ Step 2: Verify the OTP(s) that were delivered
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          ...(otpChannels.emailSent && { emailOtp }),
          ...(otpChannels.mobileSent && { mobileOtp }),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        alert("🎉 OTP verified! Demo request submitted successfully!");
        setVerified(true);
        // ✅ Popup no longer auto-closes — it stays open showing the
        // "Download from Play Store" button (see success-message block
        // in the JSX below). User closes it manually via the ✕ button,
        // which also resets all the form/OTP state.
      } else {
        alert("❌ " + (data.error || "Verification failed"));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Verification failed. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mr-home">
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{
          backgroundImage: "url('/digital-art-ai-technology-background.jpg')",
        }}
      >
        {/* decorative layers */}
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb--orange" aria-hidden="true" />
        <div className="hero-orb hero-orb--emerald" aria-hidden="true" />
        <div className="hero-orb hero-orb--violet" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-left">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Myth Reality Technologies · AI for real-world impact
            </span>

            <h1 className="hero-title">
              AI-Powered Innovation for{" "}
              <span className="hero-title-accent">Healthcare</span>,{" "}
              <span className="hero-title-accent hero-title-accent--green">
                Agriculture
              </span>{" "}
              &amp;{" "}
              <span className="hero-title-accent hero-title-accent--violet">
                Digital Transformation
              </span>
            </h1>

            <p className="hero-sub">
              Welcome to Myth Reality Technologies Private Limited (MRT)—the
              technology powerhouse behind AI-driven healthcare, smart
              agriculture, and next-gen digital ecosystems.
            </p>

            <div className="hero-buttons">
              <Link to="/solutions" className="hero-cta hero-cta--primary">
                <FaShoppingCart className="hero-cta-icon" />
                <span>Explore Solutions</span>
                <FaArrowRight className="hero-cta-arrow" />
              </Link>

              <button
                type="button"
                className="hero-cta hero-cta--glass"
                onClick={() => setShowPopup(true)}
              >
                <FaMobileAlt className="hero-cta-icon" />
                <span>Download SERV App</span>
              </button>

              <Link
                to="/solutions/health-score"
                className="hero-cta hero-cta--ghost"
              >
                <FaChartBar className="hero-cta-icon" />
                <span>Health Score Report</span>
              </Link>
            </div>

            <ul className="hero-trust">
              <li>
                <FaCheckCircle /> 3,300+ Health ATM locations planned
              </li>
              <li>
                <FaCheckCircle /> AI-driven diagnostics &amp; precision farming
              </li>
              <li>
                <FaCheckCircle /> Community-first digital platforms
              </li>
            </ul>
          </div>

          {/* RIGHT: floating brand panel */}
          <div className="hero-right" aria-hidden="true">
            <div className="hero-panel">
              <div className="hero-panel-head">
                <img src="/MR LOGO.jpeg" alt="" className="hero-panel-logo" />
                <div>
                  <strong>MRT Intelligence Stack</strong>
                  <small>Three domains. One AI core.</small>
                </div>
                <span className="hero-panel-live">
                  <span className="hero-panel-live-dot" /> Live
                </span>
              </div>

              <ul className="hero-panel-list">
                <li className="hero-panel-item hero-panel-item--orange">
                  <span className="hero-panel-icon"><FaHeartbeat /></span>
                  <div>
                    <strong>AI Healthcare</strong>
                    <small>Health ATMs · G Score · CHA</small>
                  </div>
                  <span className="hero-panel-bar"><i style={{ width: "86%" }} /></span>
                </li>
                <li className="hero-panel-item hero-panel-item--green">
                  <span className="hero-panel-icon"><FaSeedling /></span>
                  <div>
                    <strong>Smart Agriculture</strong>
                    <small>Crop · Soil · Precision guidance</small>
                  </div>
                  <span className="hero-panel-bar"><i style={{ width: "72%" }} /></span>
                </li>
                <li className="hero-panel-item hero-panel-item--violet">
                  <span className="hero-panel-icon"><FaNetworkWired /></span>
                  <div>
                    <strong>Digital Transformation</strong>
                    <small>Nandago · SERV · Web &amp; Mobile</small>
                  </div>
                  <span className="hero-panel-bar"><i style={{ width: "64%" }} /></span>
                </li>
              </ul>
            </div>

            <div className="hero-float hero-float--a">
              <FaHeartbeat />
              <div>
                <strong>Preventive care</strong>
                <small>for every household</small>
              </div>
            </div>
            <div className="hero-float hero-float--b">
              <FaSeedling />
              <div>
                <strong>Smarter yields</strong>
                <small>AI in the field</small>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-fade" aria-hidden="true" />
      </section>

      {/* SERVICES SECTION */}
      <section className="services" aria-labelledby="services-title">
        <div className="services-inner">
          <header className="services-head">
            <span className="services-eyebrow">What we build</span>
            <h2 id="services-title" className="services-title">
              Intelligent solutions across{" "}
              <span>three critical sectors</span>
            </h2>
            <p className="services-sub">
              From hospital-grade diagnostics to the farmer&rsquo;s field and
              the digital fabric that connects them—MRT builds AI that works
              where it matters most.
            </p>
          </header>

          <div className="services-grid">
            {SERVICES.map((svc, i) => (
              <article
                className={`service-card service-card--${svc.id}`}
                key={svc.id}
              >
                <span className="service-index">0{i + 1}</span>
                <div className="service-icon">{svc.icon}</div>
                <h3 className="service-title">{svc.title}</h3>
                <p className="service-tagline">{svc.tagline}</p>
                <p className="service-text">{svc.text}</p>
                <ul className="service-points">
                  {svc.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <Link to={svc.href} className="service-link">
                  Explore <FaArrowRight />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* POPUP FORM */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Download SERV App - Request Demo</h2>

            {!otpSent ? (
              // Step 1: Get User Details
              <form onSubmit={handleGetOtp} className="popup-form">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Mobile:
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    required
                  />
                </label>

                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : !verified ? (
              // Step 2: Verify the OTP(s) that were delivered
              <form onSubmit={handleVerifyOtp} className="popup-form">
                {!otpChannels.emailSent && (
                  <p className="popup-note">
                    We couldn't send the email OTP — verify with the mobile OTP only.
                  </p>
                )}
                {!otpChannels.mobileSent && (
                  <p className="popup-note">
                    We couldn't send the mobile OTP — verify with the email OTP only.
                  </p>
                )}
                {otpChannels.emailSent && (
                  <label>
                    Enter Email OTP:
                    <input
                      type="text"
                      inputMode="numeric"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit email OTP"
                      maxLength="6"
                      required
                    />
                  </label>
                )}
                {otpChannels.mobileSent && (
                  <label>
                    Enter Mobile OTP:
                    <input
                      type="text"
                      inputMode="numeric"
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit mobile OTP"
                      maxLength="6"
                      required
                    />
                  </label>
                )}
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending
                    ? "Verifying..."
                    : otpChannels.emailSent && otpChannels.mobileSent
                    ? "Verify OTPs"
                    : "Verify OTP"}
                </button>
              </form>
            ) : (
              <div className="success-message">
                <p>🎉 Request submitted successfully!</p>
                <a
                  href={SERV_APP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: "inline-flex", marginTop: "16px" }}
                >
                  <FaMobileAlt className="btn-icon" /> Download SERV App on Play Store
                </a>
              </div>
            )}

            <button
              className="close-btn"
              onClick={() => {
                setShowPopup(false);
                setOtpSent(false);
                setVerified(false);
                setFormData({ name: "", email: "", mobile: "" });
                setEmailOtp("");
                setMobileOtp("");
                setOtpChannels({ emailSent: true, mobileSent: true });
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <AboutUs />
    </div>
  );
}
