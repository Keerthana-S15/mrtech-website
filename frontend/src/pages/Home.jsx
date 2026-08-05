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




import React, { useState } from "react";
import "./Home.css";
import { FaShoppingCart, FaMobileAlt, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import AboutUs from "./AboutUs";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Step 1: Send OTP to both Email & Mobile
  const handleGetOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email,
          mobile: formData.mobile 
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ OTP sent to your Email and Mobile!");
        setOtpSent(true);
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to send OTP");
    }
  };

  // ✅ Step 2: Verify both OTPs
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          emailOtp,
          mobileOtp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Both OTPs Verified! Demo request submitted successfully!");
        setVerified(true);
        setTimeout(() => {
          setShowPopup(false);
          setOtpSent(false);
          setVerified(false);
          setFormData({ name: "", email: "", mobile: "" });
          setEmailOtp("");
          setMobileOtp("");
        }, 2000);
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Verification failed");
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{
          backgroundImage: "url('/digital-art-ai-technology-background.jpg')",
        }}
      >
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title">
              AI-Powered Innovation for <br />
              Healthcare, Agriculture & Digital Transformation
            </h1>
            <p className="hero-sub">
              Welcome to Myth Reality Technologies Private Limited (MRT)—the
              technology powerhouse behind AI-driven healthcare, smart
              agriculture, and next-gen digital ecosystems.
            </p>

            <div className="hero-buttons">
              <Link to="/solutions" className="btn btn-primary">
                <FaShoppingCart className="btn-icon" /> Explore Solutions
              </Link>

              <button
                className="btn btn-outline"
                onClick={() => setShowPopup(true)}
              >
                <FaMobileAlt className="btn-icon" /> Download SERV App
              </button>

              <button className="btn btn-outline">
                <FaChartBar className="btn-icon" /> Health Score Report
              </button>
            </div>
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

                <button type="submit" className="btn btn-primary">
                  Send OTP
                </button>
              </form>
            ) : !verified ? (
              // Step 2: Verify Both OTPs
              <form onSubmit={handleVerifyOtp} className="popup-form">
                <label>
                  Enter Email OTP:
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    placeholder="6-digit email OTP"
                    maxLength="6"
                    required
                  />
                </label>
                <label>
                  Enter Mobile OTP:
                  <input
                    type="text"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    placeholder="6-digit mobile OTP"
                    maxLength="6"
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary">
                  Verify OTPs
                </button>
              </form>
            ) : (
              <p className="success-message">
                🎉 Request submitted successfully!
              </p>
            )}

            <button className="close-btn" onClick={() => setShowPopup(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      <AboutUs />
    </>
  );
}
