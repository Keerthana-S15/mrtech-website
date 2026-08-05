// // // import React, { useState, useEffect } from "react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import "./Login.css";

// // // const Login = () => {
// // //   const [isLoginMode, setIsLoginMode] = useState(true);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");
// // //   const navigate = useNavigate();

// // //   // Login Form State
// // //   const [loginData, setLoginData] = useState({
// // //     email: "",
// // //     password: "",
// // //   });

// // //   // Register Form State
// // //   const [registerData, setRegisterData] = useState({
// // //     fullName: "",
// // //     email: "",
// // //     phone: "",
// // //     password: "",
// // //     confirmPassword: "",
// // //   });

// // //   // 🔥 OTP State (Only for Signup)
// // //   const [otpSent, setOtpSent] = useState(false);
// // //   const [otp, setOtp] = useState("");
// // //   const [otpVerified, setOtpVerified] = useState(false);
// // //   const [timer, setTimer] = useState(0);
// // //   const [canResend, setCanResend] = useState(false);

// // //   // ⏱️ Timer Countdown
// // //   useEffect(() => {
// // //     if (timer > 0) {
// // //       const interval = setInterval(() => {
// // //         setTimer((prev) => prev - 1);
// // //       }, 1000);
// // //       return () => clearInterval(interval);
// // //     } else if (timer === 0 && otpSent) {
// // //       setCanResend(true);
// // //     }
// // //   }, [timer, otpSent]);

// // //   // Handle Login Form Change
// // //   const handleLoginChange = (e) => {
// // //     setLoginData({
// // //       ...loginData,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   // Handle Register Form Change
// // //   const handleRegisterChange = (e) => {
// // //     setRegisterData({
// // //       ...registerData,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   // 📱 Send OTP
// // //   const handleSendOTP = async () => {
// // //     if (!registerData.phone || registerData.phone.length < 10) {
// // //       setError("Please enter a valid 10-digit mobile number");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/send-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ phone: registerData.phone }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setOtpSent(true);
// // //         setTimer(60);
// // //         setCanResend(false);
// // //         setSuccess("OTP sent successfully to your mobile!");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Failed to send OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("OTP Send Error:", err);
// // //       setError("Unable to send OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Verify OTP
// // //   const handleVerifyOTP = async () => {
// // //     if (!otp || otp.length !== 6) {
// // //       setError("Please enter a valid 6-digit OTP");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/verify-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ phone: registerData.phone, otp }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setOtpVerified(true);
// // //         setSuccess("Mobile number verified successfully! ✓");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Invalid OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("OTP Verify Error:", err);
// // //       setError("Unable to verify OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 🔄 Resend OTP
// // //   const handleResendOTP = () => {
// // //     setOtp("");
// // //     setCanResend(false);
// // //     handleSendOTP();
// // //   };

// // //   // ✅ Handle Login Submit
// // //   const handleLoginSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setSuccess("");
// // //     setLoading(true);

// // //     if (!loginData.email || !loginData.password) {
// // //       setError("Please enter both email and password");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/login", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(loginData),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         const user = data.user;
// // //         localStorage.setItem("userData", JSON.stringify(user));
// // //         localStorage.setItem("isLoggedIn", "true");
// // //         setSuccess(`Login successful! Welcome ${user.fullName}`);
// // //         window.dispatchEvent(new Event("storage"));

// // //         setTimeout(() => {
// // //           if (user.userType === "admin") {
// // //             navigate("/admin/dashboard");
// // //           } else if (user.userType === "customer") {
// // //             navigate("/customer/dashboard");
// // //           } else {
// // //             setError("Unknown user type. Please contact admin.");
// // //           }
// // //         }, 1000);
// // //       } else {
// // //         setError(data.error || "Login failed. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Login Error:", err);
// // //       setError("Unable to connect to server. Please try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Handle Register Submit
// // //   const handleRegisterSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setSuccess("");

// // //     // 🔒 Check OTP Verification
// // //     if (!otpVerified) {
// // //       setError("Please verify your mobile number first");
// // //       return;
// // //     }

// // //     if (!registerData.fullName || !registerData.email || !registerData.phone || !registerData.password) {
// // //       setError("All fields are required");
// // //       return;
// // //     }

// // //     if (registerData.password !== registerData.confirmPassword) {
// // //       setError("Passwords do not match");
// // //       return;
// // //     }

// // //     if (registerData.password.length < 6) {
// // //       setError("Password must be at least 6 characters long");
// // //       return;
// // //     }

// // //     setLoading(true);

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/register", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(registerData),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setSuccess("Registration successful! Redirecting to login...");
// // //         setRegisterData({
// // //           fullName: "",
// // //           email: "",
// // //           phone: "",
// // //           password: "",
// // //           confirmPassword: "",
// // //         });
// // //         setOtpSent(false);
// // //         setOtpVerified(false);
// // //         setOtp("");

// // //         setTimeout(() => {
// // //           setIsLoginMode(true);
// // //           setSuccess("");
// // //         }, 2000);
// // //       } else {
// // //         setError(data.error || "Registration failed. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Registration Error:", err);
// // //       setError("Unable to connect to server. Please try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Toggle between Login and Register
// // //   const toggleMode = () => {
// // //     setIsLoginMode(!isLoginMode);
// // //     setError("");
// // //     setSuccess("");
// // //     setOtpSent(false);
// // //     setOtpVerified(false);
// // //     setOtp("");
// // //     setTimer(0);
// // //   };

// // //   return (
// // //     <div className="login-container">
// // //       <div className="login-overlay">
// // //         <div className="login-card">
// // //           {/* Left Section */}
// // //           <div className="login-left">
// // //             <div className="brand-section">
// // //               <img src="/MR LOGO.jpeg" alt="MR Tech Logo" className="login-logo" />
// // //               <h2>Myth Reality Technologies</h2>
// // //               <p>AI-Powered Innovation for Healthcare & Agriculture</p>
// // //             </div>
// // //             <div className="feature-list">
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "Secure Login" : "Easy Registration"}</span>
// // //               </div>
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "Order Tracking" : "Secure Account"}</span>
// // //               </div>
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "24/7 Support" : "Exclusive Offers"}</span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Right Section - Form */}
// // //           <div className="login-right">
// // //             <div className="login-form-wrapper">
// // //               <h1 className="login-title">{isLoginMode ? "Welcome Back" : "Create Account"}</h1>
// // //               <p className="login-subtitle">{isLoginMode ? "Login to your account" : "Sign up as a customer"}</p>

// // //               {/* Success/Error Messages */}
// // //               {success && (
// // //                 <div className="success-message" style={{
// // //                   backgroundColor: '#d4edda',
// // //                   color: '#155724',
// // //                   padding: '10px',
// // //                   borderRadius: '5px',
// // //                   marginBottom: '15px',
// // //                   textAlign: 'center'
// // //                 }}>
// // //                   {success}
// // //                 </div>
// // //               )}

// // //               {error && (
// // //                 <div className="error-message" style={{
// // //                   backgroundColor: '#fee',
// // //                   color: '#c33',
// // //                   padding: '10px',
// // //                   borderRadius: '5px',
// // //                   marginBottom: '15px',
// // //                   textAlign: 'center'
// // //                 }}>
// // //                   {error}
// // //                 </div>
// // //               )}

// // //               {isLoginMode ? (
// // //                 /* ========== LOGIN FORM ========== */
// // //                 <form className="login-form" onSubmit={handleLoginSubmit}>
// // //                   <div className="form-group">
// // //                     <label>Email Address</label>
// // //                     <input
// // //                       type="email"
// // //                       name="email"
// // //                       placeholder="Enter your email"
// // //                       value={loginData.email}
// // //                       onChange={handleLoginChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="password"
// // //                       placeholder="Enter your password"
// // //                       value={loginData.password}
// // //                       onChange={handleLoginChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-options">
// // //                     <label className="remember-me">
// // //                       <input type="checkbox" />
// // //                       <span>Remember me</span>
// // //                     </label>
// // //                     <Link to="/forgot-password" className="forgot-link">
// // //                       Forgot Password?
// // //                     </Link>
// // //                   </div>

// // //                   <button type="submit" className="login-btn" disabled={loading}>
// // //                     {loading ? "Logging in..." : "Login"}
// // //                   </button>

// // //                   <div className="signup-link">
// // //                     Don't have an account?{" "}
// // //                     <span onClick={toggleMode} style={{ color: "#007bff", cursor: "pointer", marginLeft: "5px" }}>
// // //                       Sign Up
// // //                     </span>
// // //                   </div>
// // //                 </form>
// // //               ) : (
// // //                 /* ========== SIGNUP FORM WITH OTP ========== */
// // //                 <form className="login-form" onSubmit={handleRegisterSubmit}>
// // //                   <div className="form-group">
// // //                     <label>Full Name</label>
// // //                     <input
// // //                       type="text"
// // //                       name="fullName"
// // //                       placeholder="Enter your full name"
// // //                       value={registerData.fullName}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>Email Address</label>
// // //                     <input
// // //                       type="email"
// // //                       name="email"
// // //                       placeholder="Enter your email"
// // //                       value={registerData.email}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   {/* 📱 MOBILE NUMBER WITH OTP */}
// // //                   <div className="form-group">
// // //                     <label>
// // //                       Phone Number{" "}
// // //                       {otpVerified && <span className="verified-badge">✓ Verified</span>}
// // //                     </label>
// // //                     <div className="phone-otp-wrapper">
// // //                       <input
// // //                         type="tel"
// // //                         name="phone"
// // //                         placeholder="Enter your phone number"
// // //                         value={registerData.phone}
// // //                         onChange={handleRegisterChange}
// // //                         required
// // //                         disabled={loading || otpVerified}
// // //                         maxLength={10}
// // //                         className="phone-input"
// // //                       />
// // //                       {!otpVerified && (
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleSendOTP}
// // //                           disabled={loading || (otpSent && timer > 0)}
// // //                           className="otp-send-btn"
// // //                         >
// // //                           {otpSent ? (canResend ? "Resend" : `${timer}s`) : "Send OTP"}
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   </div>

// // //                   {/* 🔢 OTP INPUT FIELD */}
// // //                   {otpSent && !otpVerified && (
// // //                     <div className="form-group otp-input-group">
// // //                       <label>Enter OTP</label>
// // //                       <div className="phone-otp-wrapper">
// // //                         <input
// // //                           type="text"
// // //                           placeholder="Enter 6-digit OTP"
// // //                           value={otp}
// // //                           onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
// // //                           maxLength={6}
// // //                           disabled={loading}
// // //                           className="otp-input"
// // //                         />
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleVerifyOTP}
// // //                           disabled={loading || otp.length !== 6}
// // //                           className="otp-verify-btn"
// // //                         >
// // //                           Verify
// // //                         </button>
// // //                       </div>
// // //                       {canResend && (
// // //                         <p className="resend-text">
// // //                           Didn't receive OTP?{" "}
// // //                           <span onClick={handleResendOTP} className="resend-link">
// // //                             Resend OTP
// // //                           </span>
// // //                         </p>
// // //                       )}
// // //                     </div>
// // //                   )}

// // //                   <div className="form-group">
// // //                     <label>Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="password"
// // //                       placeholder="Create a password (min 6 characters)"
// // //                       value={registerData.password}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>Confirm Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="confirmPassword"
// // //                       placeholder="Re-enter your password"
// // //                       value={registerData.confirmPassword}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <button type="submit" className="login-btn" disabled={loading || !otpVerified}>
// // //                     {loading ? "Creating Account..." : "Sign Up"}
// // //                   </button>

// // //                   <div className="signup-link">
// // //                     Already have an account?{" "}
// // //                     <span onClick={toggleMode} style={{ color: "#007bff", cursor: "pointer", marginLeft: "5px" }}>
// // //                       Login
// // //                     </span>
// // //                   </div>
// // //                 </form>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;

// // //****************************************** */


// // // import React, { useState, useEffect } from "react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import "./Login.css";

// // // const Login = () => {
// // //   const [isLoginMode, setIsLoginMode] = useState(true);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");
// // //   const navigate = useNavigate();

// // //   // Login Form State
// // //   const [loginData, setLoginData] = useState({
// // //     email: "",
// // //     password: "",
// // //   });

// // //   // Register Form State
// // //   const [registerData, setRegisterData] = useState({
// // //     fullName: "",
// // //     email: "",
// // //     phone: "",
// // //     password: "",
// // //     confirmPassword: "",
// // //   });

// // //   // 🔥 OTP State for Mobile
// // //   const [mobileOtpSent, setMobileOtpSent] = useState(false);
// // //   const [mobileOtp, setMobileOtp] = useState("");
// // //   const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
// // //   const [mobileTimer, setMobileTimer] = useState(0);
// // //   const [mobileCanResend, setMobileCanResend] = useState(false);

// // //   // 🔥 OTP State for Email
// // //   const [emailOtpSent, setEmailOtpSent] = useState(false);
// // //   const [emailOtp, setEmailOtp] = useState("");
// // //   const [emailOtpVerified, setEmailOtpVerified] = useState(false);
// // //   const [emailTimer, setEmailTimer] = useState(0);
// // //   const [emailCanResend, setEmailCanResend] = useState(false);

// // //   // ⏱️ Mobile Timer Countdown
// // //   useEffect(() => {
// // //     if (mobileTimer > 0) {
// // //       const interval = setInterval(() => {
// // //         setMobileTimer((prev) => prev - 1);
// // //       }, 1000);
// // //       return () => clearInterval(interval);
// // //     } else if (mobileTimer === 0 && mobileOtpSent) {
// // //       setMobileCanResend(true);
// // //     }
// // //   }, [mobileTimer, mobileOtpSent]);

// // //   // ⏱️ Email Timer Countdown
// // //   useEffect(() => {
// // //     if (emailTimer > 0) {
// // //       const interval = setInterval(() => {
// // //         setEmailTimer((prev) => prev - 1);
// // //       }, 1000);
// // //       return () => clearInterval(interval);
// // //     } else if (emailTimer === 0 && emailOtpSent) {
// // //       setEmailCanResend(true);
// // //     }
// // //   }, [emailTimer, emailOtpSent]);

// // //   // Handle Login Form Change
// // //   const handleLoginChange = (e) => {
// // //     setLoginData({
// // //       ...loginData,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   // Handle Register Form Change
// // //   const handleRegisterChange = (e) => {
// // //     setRegisterData({
// // //       ...registerData,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   // 📱 Send Mobile OTP
// // //   const handleSendMobileOTP = async () => {
// // //     if (!registerData.phone || registerData.phone.length < 10) {
// // //       setError("Please enter a valid 10-digit mobile number");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/send-mobile-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ phone: registerData.phone }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setMobileOtpSent(true);
// // //         setMobileTimer(60);
// // //         setMobileCanResend(false);
// // //         setSuccess("OTP sent successfully to your mobile!");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Failed to send mobile OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Mobile OTP Send Error:", err);
// // //       setError("Unable to send mobile OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Verify Mobile OTP
// // //   const handleVerifyMobileOTP = async () => {
// // //     if (!mobileOtp || mobileOtp.length !== 6) {
// // //       setError("Please enter a valid 6-digit OTP");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/verify-mobile-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ phone: registerData.phone, otp: mobileOtp }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setMobileOtpVerified(true);
// // //         setSuccess("Mobile number verified successfully! ✓");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Invalid mobile OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Mobile OTP Verify Error:", err);
// // //       setError("Unable to verify mobile OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 🔄 Resend Mobile OTP
// // //   const handleResendMobileOTP = () => {
// // //     setMobileOtp("");
// // //     setMobileCanResend(false);
// // //     handleSendMobileOTP();
// // //   };

// // //   // 📧 Send Email OTP
// // //   const handleSendEmailOTP = async () => {
// // //     if (!registerData.email || !registerData.email.includes("@")) {
// // //       setError("Please enter a valid email address");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/send-email-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ email: registerData.email }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setEmailOtpSent(true);
// // //         setEmailTimer(60);
// // //         setEmailCanResend(false);
// // //         setSuccess("OTP sent successfully to your email!");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Failed to send email OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Email OTP Send Error:", err);
// // //       setError("Unable to send email OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Verify Email OTP
// // //   const handleVerifyEmailOTP = async () => {
// // //     if (!emailOtp || emailOtp.length !== 6) {
// // //       setError("Please enter a valid 6-digit OTP");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/verify-email-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ email: registerData.email, otp: emailOtp }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setEmailOtpVerified(true);
// // //         setSuccess("Email verified successfully! ✓");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Invalid email OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Email OTP Verify Error:", err);
// // //       setError("Unable to verify email OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 🔄 Resend Email OTP
// // //   const handleResendEmailOTP = () => {
// // //     setEmailOtp("");
// // //     setEmailCanResend(false);
// // //     handleSendEmailOTP();
// // //   };

// // //   // ✅ Handle Login Submit
// // //   const handleLoginSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setSuccess("");
// // //     setLoading(true);

// // //     if (!loginData.email || !loginData.password) {
// // //       setError("Please enter both email and password");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/login", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(loginData),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         const user = data.user;
// // //         localStorage.setItem("userData", JSON.stringify(user));
// // //         localStorage.setItem("isLoggedIn", "true");
// // //         setSuccess(`Login successful! Welcome ${user.fullName}`);
// // //         window.dispatchEvent(new Event("storage"));

// // //         setTimeout(() => {
// // //           if (user.userType === "admin") {
// // //             navigate("/admin/dashboard");
// // //           } else if (user.userType === "customer") {
// // //             navigate("/customer/dashboard");
// // //           } else {
// // //             setError("Unknown user type. Please contact admin.");
// // //           }
// // //         }, 1000);
// // //       } else {
// // //         setError(data.error || "Login failed. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Login Error:", err);
// // //       setError("Unable to connect to server. Please try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Handle Register Submit
// // //   const handleRegisterSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setSuccess("");

// // //     // 🔒 Check Both OTP Verifications
// // //     if (!mobileOtpVerified) {
// // //       setError("Please verify your mobile number first");
// // //       return;
// // //     }

// // //     if (!emailOtpVerified) {
// // //       setError("Please verify your email address first");
// // //       return;
// // //     }

// // //     if (!registerData.fullName || !registerData.email || !registerData.phone || !registerData.password) {
// // //       setError("All fields are required");
// // //       return;
// // //     }

// // //     if (registerData.password !== registerData.confirmPassword) {
// // //       setError("Passwords do not match");
// // //       return;
// // //     }

// // //     if (registerData.password.length < 6) {
// // //       setError("Password must be at least 6 characters long");
// // //       return;
// // //     }

// // //     setLoading(true);

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/register", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(registerData),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setSuccess("Registration successful! Redirecting to login...");
// // //         setRegisterData({
// // //           fullName: "",
// // //           email: "",
// // //           phone: "",
// // //           password: "",
// // //           confirmPassword: "",
// // //         });
// // //         setMobileOtpSent(false);
// // //         setMobileOtpVerified(false);
// // //         setMobileOtp("");
// // //         setEmailOtpSent(false);
// // //         setEmailOtpVerified(false);
// // //         setEmailOtp("");

// // //         setTimeout(() => {
// // //           setIsLoginMode(true);
// // //           setSuccess("");
// // //         }, 2000);
// // //       } else {
// // //         setError(data.error || "Registration failed. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Registration Error:", err);
// // //       setError("Unable to connect to server. Please try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Toggle between Login and Register
// // //   const toggleMode = () => {
// // //     setIsLoginMode(!isLoginMode);
// // //     setError("");
// // //     setSuccess("");
// // //     setMobileOtpSent(false);
// // //     setMobileOtpVerified(false);
// // //     setMobileOtp("");
// // //     setMobileTimer(0);
// // //     setEmailOtpSent(false);
// // //     setEmailOtpVerified(false);
// // //     setEmailOtp("");
// // //     setEmailTimer(0);
// // //   };

// // //   return (
// // //     <div className="login-container">
// // //       <div className="login-overlay">
// // //         <div className="login-card">
// // //           {/* Left Section */}
// // //           <div className="login-left">
// // //             <div className="brand-section">
// // //               <img src="/MR LOGO.jpeg" alt="MR Tech Logo" className="login-logo" />
// // //               <h2>Myth Reality Technologies</h2>
// // //               <p>AI-Powered Innovation for Healthcare & Agriculture</p>
// // //             </div>
// // //             <div className="feature-list">
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "Secure Login" : "Easy Registration"}</span>
// // //               </div>
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "Order Tracking" : "Secure Account"}</span>
// // //               </div>
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "24/7 Support" : "Exclusive Offers"}</span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Right Section - Form */}
// // //           <div className="login-right">
// // //             <div className="login-form-wrapper">
// // //               <h1 className="login-title">{isLoginMode ? "Welcome Back" : "Create Account"}</h1>
// // //               <p className="login-subtitle">{isLoginMode ? "Login to your account" : "Sign up as a customer"}</p>

// // //               {/* Success/Error Messages */}
// // //               {success && (
// // //                 <div className="success-message" style={{
// // //                   backgroundColor: '#d4edda',
// // //                   color: '#155724',
// // //                   padding: '10px',
// // //                   borderRadius: '5px',
// // //                   marginBottom: '15px',
// // //                   textAlign: 'center'
// // //                 }}>
// // //                   {success}
// // //                 </div>
// // //               )}

// // //               {error && (
// // //                 <div className="error-message" style={{
// // //                   backgroundColor: '#fee',
// // //                   color: '#c33',
// // //                   padding: '10px',
// // //                   borderRadius: '5px',
// // //                   marginBottom: '15px',
// // //                   textAlign: 'center'
// // //                 }}>
// // //                   {error}
// // //                 </div>
// // //               )}

// // //               {isLoginMode ? (
// // //                 /* ========== LOGIN FORM ========== */
// // //                 <form className="login-form" onSubmit={handleLoginSubmit}>
// // //                   <div className="form-group">
// // //                     <label>Email Address</label>
// // //                     <input
// // //                       type="email"
// // //                       name="email"
// // //                       placeholder="Enter your email"
// // //                       value={loginData.email}
// // //                       onChange={handleLoginChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="password"
// // //                       placeholder="Enter your password"
// // //                       value={loginData.password}
// // //                       onChange={handleLoginChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-options">
// // //                     <label className="remember-me">
// // //                       <input type="checkbox" />
// // //                       <span>Remember me</span>
// // //                     </label>
// // //                     <Link to="/forgot-password" className="forgot-link">
// // //                       Forgot Password?
// // //                     </Link>
// // //                   </div>

// // //                   <button type="submit" className="login-btn" disabled={loading}>
// // //                     {loading ? "Logging in..." : "Login"}
// // //                   </button>

// // //                   <div className="signup-link">
// // //                     Don't have an account?{" "}
// // //                     <span onClick={toggleMode} style={{ color: "#007bff", cursor: "pointer", marginLeft: "5px" }}>
// // //                       Sign Up
// // //                     </span>
// // //                   </div>
// // //                 </form>
// // //               ) : (
// // //                 /* ========== SIGNUP FORM WITH MOBILE + EMAIL OTP ========== */
// // //                 <form className="login-form" onSubmit={handleRegisterSubmit}>
// // //                   <div className="form-group">
// // //                     <label>Full Name</label>
// // //                     <input
// // //                       type="text"
// // //                       name="fullName"
// // //                       placeholder="Enter your full name"
// // //                       value={registerData.fullName}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>
// // //                       Email Address{" "}
// // //                       {emailOtpVerified && <span className="verified-badge">✓ Verified</span>}
// // //                     </label>
// // //                     <div className="phone-otp-wrapper">
// // //                       <input
// // //                         type="email"
// // //                         name="email"
// // //                         placeholder="Enter your email"
// // //                         value={registerData.email}
// // //                         onChange={handleRegisterChange}
// // //                         required
// // //                         disabled={loading || emailOtpVerified}
// // //                       />
// // //                       {!emailOtpVerified && (
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleSendEmailOTP}
// // //                           disabled={loading || (emailOtpSent && emailTimer > 0)}
// // //                           className="otp-send-btn"
// // //                         >
// // //                           {emailOtpSent ? (emailCanResend ? "Resend" : `${emailTimer}s`) : "Send OTP"}
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   </div>

// // //                   {/* 🔢 EMAIL OTP INPUT FIELD */}
// // //                   {emailOtpSent && !emailOtpVerified && (
// // //                     <div className="form-group otp-input-group">
// // //                       <label>Enter Email OTP</label>
// // //                       <div className="phone-otp-wrapper">
// // //                         <input
// // //                           type="text"
// // //                           placeholder="Enter 6-digit OTP"
// // //                           value={emailOtp}
// // //                           onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
// // //                           maxLength={6}
// // //                           disabled={loading}
// // //                           className="otp-input"
// // //                         />
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleVerifyEmailOTP}
// // //                           disabled={loading || emailOtp.length !== 6}
// // //                           className="otp-verify-btn"
// // //                         >
// // //                           Verify
// // //                         </button>
// // //                       </div>
// // //                       {emailCanResend && (
// // //                         <p className="resend-text">
// // //                           Didn't receive OTP?{" "}
// // //                           <span onClick={handleResendEmailOTP} className="resend-link">
// // //                             Resend OTP
// // //                           </span>
// // //                         </p>
// // //                       )}
// // //                     </div>
// // //                   )}

// // //                   {/* 📱 MOBILE NUMBER WITH OTP */}
// // //                   <div className="form-group">
// // //                     <label>
// // //                       Phone Number{" "}
// // //                       {mobileOtpVerified && <span className="verified-badge">✓ Verified</span>}
// // //                     </label>
// // //                     <div className="phone-otp-wrapper">
// // //                       <input
// // //                         type="tel"
// // //                         name="phone"
// // //                         placeholder="Enter your phone number"
// // //                         value={registerData.phone}
// // //                         onChange={handleRegisterChange}
// // //                         required
// // //                         disabled={loading || mobileOtpVerified}
// // //                         maxLength={10}
// // //                         className="phone-input"
// // //                       />
// // //                       {!mobileOtpVerified && (
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleSendMobileOTP}
// // //                           disabled={loading || (mobileOtpSent && mobileTimer > 0)}
// // //                           className="otp-send-btn"
// // //                         >
// // //                           {mobileOtpSent ? (mobileCanResend ? "Resend" : `${mobileTimer}s`) : "Send OTP"}
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   </div>

// // //                   {/* 🔢 MOBILE OTP INPUT FIELD */}
// // //                   {mobileOtpSent && !mobileOtpVerified && (
// // //                     <div className="form-group otp-input-group">
// // //                       <label>Enter Mobile OTP</label>
// // //                       <div className="phone-otp-wrapper">
// // //                         <input
// // //                           type="text"
// // //                           placeholder="Enter 6-digit OTP"
// // //                           value={mobileOtp}
// // //                           onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
// // //                           maxLength={6}
// // //                           disabled={loading}
// // //                           className="otp-input"
// // //                         />
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleVerifyMobileOTP}
// // //                           disabled={loading || mobileOtp.length !== 6}
// // //                           className="otp-verify-btn"
// // //                         >
// // //                           Verify
// // //                         </button>
// // //                       </div>
// // //                       {mobileCanResend && (
// // //                         <p className="resend-text">
// // //                           Didn't receive OTP?{" "}
// // //                           <span onClick={handleResendMobileOTP} className="resend-link">
// // //                             Resend OTP
// // //                           </span>
// // //                         </p>
// // //                       )}
// // //                     </div>
// // //                   )}

// // //                   <div className="form-group">
// // //                     <label>Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="password"
// // //                       placeholder="Create a password (min 6 characters)"
// // //                       value={registerData.password}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>Confirm Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="confirmPassword"
// // //                       placeholder="Re-enter your password"
// // //                       value={registerData.confirmPassword}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <button type="submit" className="login-btn" disabled={loading || !mobileOtpVerified || !emailOtpVerified}>
// // //                     {loading ? "Creating Account..." : "Sign Up"}
// // //                   </button>

// // //                   <div className="signup-link">
// // //                     Already have an account?{" "}
// // //                     <span onClick={toggleMode} style={{ color: "#007bff", cursor: "pointer", marginLeft: "5px" }}>
// // //                       Login
// // //                     </span>
// // //                   </div>
// // //                 </form>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;



// // // import React, { useState, useEffect } from "react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import "./Login.css";

// // // const Login = () => {
// // //   const [isLoginMode, setIsLoginMode] = useState(true);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [success, setSuccess] = useState("");
// // //   const navigate = useNavigate();

// // //   // Login Form State
// // //   const [loginData, setLoginData] = useState({
// // //     email: "",
// // //     password: "",
// // //   });

// // //   // Register Form State
// // //   const [registerData, setRegisterData] = useState({
// // //     fullName: "",
// // //     email: "",
// // //     phone: "",
// // //     password: "",
// // //     confirmPassword: "",
// // //   });

// // //   // 🔥 OTP State for Email
// // //   const [emailOtpSent, setEmailOtpSent] = useState(false);
// // //   const [emailOtp, setEmailOtp] = useState("");
// // //   const [emailOtpVerified, setEmailOtpVerified] = useState(false);
// // //   const [emailTimer, setEmailTimer] = useState(0);
// // //   const [emailCanResend, setEmailCanResend] = useState(false);

// // //   // 🔥 OTP State for Mobile
// // //   const [mobileOtpSent, setMobileOtpSent] = useState(false);
// // //   const [mobileOtp, setMobileOtp] = useState("");
// // //   const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
// // //   const [mobileTimer, setMobileTimer] = useState(0);
// // //   const [mobileCanResend, setMobileCanResend] = useState(false);

// // //   // ⏱️ Email Timer Countdown
// // //   useEffect(() => {
// // //     if (emailTimer > 0) {
// // //       const interval = setInterval(() => {
// // //         setEmailTimer((prev) => prev - 1);
// // //       }, 1000);
// // //       return () => clearInterval(interval);
// // //     } else if (emailTimer === 0 && emailOtpSent) {
// // //       setEmailCanResend(true);
// // //     }
// // //   }, [emailTimer, emailOtpSent]);

// // //   // ⏱️ Mobile Timer Countdown
// // //   useEffect(() => {
// // //     if (mobileTimer > 0) {
// // //       const interval = setInterval(() => {
// // //         setMobileTimer((prev) => prev - 1);
// // //       }, 1000);
// // //       return () => clearInterval(interval);
// // //     } else if (mobileTimer === 0 && mobileOtpSent) {
// // //       setMobileCanResend(true);
// // //     }
// // //   }, [mobileTimer, mobileOtpSent]);

// // //   // Handle Login Form Change
// // //   const handleLoginChange = (e) => {
// // //     setLoginData({
// // //       ...loginData,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   // Handle Register Form Change
// // //   const handleRegisterChange = (e) => {
// // //     setRegisterData({
// // //       ...registerData,
// // //       [e.target.name]: e.target.value,
// // //     });
// // //   };

// // //   // 📧 Send Email OTP
// // //   const handleSendEmailOTP = async () => {
// // //     if (!registerData.email || !registerData.email.includes("@")) {
// // //       setError("Please enter a valid email address");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/signup/send-email-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ email: registerData.email }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setEmailOtpSent(true);
// // //         setEmailTimer(60);
// // //         setEmailCanResend(false);
// // //         setSuccess("OTP sent successfully to your email!");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Failed to send email OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Email OTP Send Error:", err);
// // //       setError("Unable to send email OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Verify Email OTP
// // //   const handleVerifyEmailOTP = async () => {
// // //     if (!emailOtp || emailOtp.length !== 6) {
// // //       setError("Please enter a valid 6-digit OTP");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/signup/verify-email-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ email: registerData.email, otp: emailOtp }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setEmailOtpVerified(true);
// // //         setSuccess("Email verified successfully! ✓");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Invalid email OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Email OTP Verify Error:", err);
// // //       setError("Unable to verify email OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 🔄 Resend Email OTP
// // //   const handleResendEmailOTP = () => {
// // //     setEmailOtp("");
// // //     setEmailCanResend(false);
// // //     handleSendEmailOTP();
// // //   };

// // //   // 📱 Send Mobile OTP
// // //   const handleSendMobileOTP = async () => {
// // //     if (!registerData.phone || registerData.phone.length < 10) {
// // //       setError("Please enter a valid 10-digit mobile number");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/signup/send-mobile-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ phone: registerData.phone }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setMobileOtpSent(true);
// // //         setMobileTimer(60);
// // //         setMobileCanResend(false);
// // //         setSuccess("OTP sent successfully to your mobile!");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Failed to send mobile OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Mobile OTP Send Error:", err);
// // //       setError("Unable to send mobile OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Verify Mobile OTP
// // //   const handleVerifyMobileOTP = async () => {
// // //     if (!mobileOtp || mobileOtp.length !== 6) {
// // //       setError("Please enter a valid 6-digit OTP");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/signup/verify-mobile-otp", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ phone: registerData.phone, otp: mobileOtp }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setMobileOtpVerified(true);
// // //         setSuccess("Mobile number verified successfully! ✓");
// // //         setTimeout(() => setSuccess(""), 3000);
// // //       } else {
// // //         setError(data.error || "Invalid mobile OTP. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Mobile OTP Verify Error:", err);
// // //       setError("Unable to verify mobile OTP. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 🔄 Resend Mobile OTP
// // //   const handleResendMobileOTP = () => {
// // //     setMobileOtp("");
// // //     setMobileCanResend(false);
// // //     handleSendMobileOTP();
// // //   };

// // //   // ✅ Handle Login Submit
// // //   const handleLoginSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setSuccess("");
// // //     setLoading(true);

// // //     if (!loginData.email || !loginData.password) {
// // //       setError("Please enter both email and password");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/login", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(loginData),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         const user = data.user;
// // //         localStorage.setItem("userData", JSON.stringify(user));
// // //         localStorage.setItem("isLoggedIn", "true");
// // //         setSuccess(`Login successful! Welcome ${user.fullName}`);
// // //         window.dispatchEvent(new Event("storage"));

// // //         setTimeout(() => {
// // //           if (user.userType === "admin") {
// // //             navigate("/admin/dashboard");
// // //           } else if (user.userType === "customer") {
// // //             navigate("/customer/dashboard");
// // //           } else {
// // //             setError("Unknown user type. Please contact admin.");
// // //           }
// // //         }, 1000);
// // //       } else {
// // //         setError(data.error || "Login failed. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Login Error:", err);
// // //       setError("Unable to connect to server. Please try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ✅ Handle Register Submit
// // //   const handleRegisterSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setSuccess("");

// // //     // 🔒 Check Email OTP Verification
// // //     if (!emailOtpVerified) {
// // //       setError("Please verify your email address first");
// // //       return;
// // //     }

// // //     // 🔒 Check Mobile OTP Verification
// // //     if (!mobileOtpVerified) {
// // //       setError("Please verify your mobile number first");
// // //       return;
// // //     }

// // //     if (!registerData.fullName || !registerData.email || !registerData.phone || !registerData.password) {
// // //       setError("All fields are required");
// // //       return;
// // //     }

// // //     if (registerData.password !== registerData.confirmPassword) {
// // //       setError("Passwords do not match");
// // //       return;
// // //     }

// // //     if (registerData.password.length < 6) {
// // //       setError("Password must be at least 6 characters long");
// // //       return;
// // //     }

// // //     setLoading(true);

// // //     try {
// // //       const response = await fetch("http://localhost:3000/api/register", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(registerData),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok && data.success) {
// // //         setSuccess("Registration successful! Redirecting to login...");
// // //         setRegisterData({
// // //           fullName: "",
// // //           email: "",
// // //           phone: "",
// // //           password: "",
// // //           confirmPassword: "",
// // //         });
// // //         setEmailOtpSent(false);
// // //         setEmailOtpVerified(false);
// // //         setEmailOtp("");
// // //         setMobileOtpSent(false);
// // //         setMobileOtpVerified(false);
// // //         setMobileOtp("");

// // //         setTimeout(() => {
// // //           setIsLoginMode(true);
// // //           setSuccess("");
// // //         }, 2000);
// // //       } else {
// // //         setError(data.error || "Registration failed. Please try again.");
// // //       }
// // //     } catch (err) {
// // //       console.error("Registration Error:", err);
// // //       setError("Unable to connect to server. Please try again later.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Toggle between Login and Register
// // //   const toggleMode = () => {
// // //     setIsLoginMode(!isLoginMode);
// // //     setError("");
// // //     setSuccess("");
// // //     setEmailOtpSent(false);
// // //     setEmailOtpVerified(false);
// // //     setEmailOtp("");
// // //     setEmailTimer(0);
// // //     setMobileOtpSent(false);
// // //     setMobileOtpVerified(false);
// // //     setMobileOtp("");
// // //     setMobileTimer(0);
// // //   };

// // //   return (
// // //     <div className="login-container">
// // //       <div className="login-overlay">
// // //         <div className="login-card">
// // //           {/* Left Section */}
// // //           <div className="login-left">
// // //             <div className="brand-section">
// // //               <img src="/MR LOGO.jpeg" alt="MR Tech Logo" className="login-logo" />
// // //               <h2>Myth Reality Technologies</h2>
// // //               <p>AI-Powered Innovation for Healthcare & Agriculture</p>
// // //             </div>
// // //             <div className="feature-list">
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "Secure Login" : "Easy Registration"}</span>
// // //               </div>
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "Order Tracking" : "Email & Mobile Verification"}</span>
// // //               </div>
// // //               <div className="feature-item">
// // //                 <span className="feature-icon">✓</span>
// // //                 <span>{isLoginMode ? "24/7 Support" : "Secure Account"}</span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Right Section - Form */}
// // //           <div className="login-right">
// // //             <div className="login-form-wrapper">
// // //               <h1 className="login-title">{isLoginMode ? "Welcome Back" : "Create Account"}</h1>
// // //               <p className="login-subtitle">
// // //                 {isLoginMode ? "Login to your account" : "Sign up as a customer"}
// // //               </p>

// // //               {/* Success/Error Messages */}
// // //               {success && (
// // //                 <div
// // //                   className="success-message"
// // //                   style={{
// // //                     backgroundColor: "#d4edda",
// // //                     color: "#155724",
// // //                     padding: "12px 15px",
// // //                     borderRadius: "8px",
// // //                     marginBottom: "15px",
// // //                     textAlign: "center",
// // //                     border: "1px solid #c3e6cb",
// // //                     fontWeight: "500",
// // //                   }}
// // //                 >
// // //                   {success}
// // //                 </div>
// // //               )}

// // //               {error && (
// // //                 <div
// // //                   className="error-message"
// // //                   style={{
// // //                     backgroundColor: "#f8d7da",
// // //                     color: "#721c24",
// // //                     padding: "12px 15px",
// // //                     borderRadius: "8px",
// // //                     marginBottom: "15px",
// // //                     textAlign: "center",
// // //                     border: "1px solid #f5c6cb",
// // //                     fontWeight: "500",
// // //                   }}
// // //                 >
// // //                   {error}
// // //                 </div>
// // //               )}

// // //               {isLoginMode ? (
// // //                 /* ========== LOGIN FORM ========== */
// // //                 <form className="login-form" onSubmit={handleLoginSubmit}>
// // //                   <div className="form-group">
// // //                     <label>Email Address</label>
// // //                     <input
// // //                       type="email"
// // //                       name="email"
// // //                       placeholder="Enter your email"
// // //                       value={loginData.email}
// // //                       onChange={handleLoginChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="password"
// // //                       placeholder="Enter your password"
// // //                       value={loginData.password}
// // //                       onChange={handleLoginChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-options">
// // //                     <label className="remember-me">
// // //                       <input type="checkbox" />
// // //                       <span>Remember me</span>
// // //                     </label>
// // //                     <Link to="/forgot-password" className="forgot-link">
// // //                       Forgot Password?
// // //                     </Link>
// // //                   </div>

// // //                   <button type="submit" className="login-btn" disabled={loading}>
// // //                     {loading ? "Logging in..." : "Login"}
// // //                   </button>

// // //                   <div className="signup-link">
// // //                     Don't have an account?{" "}
// // //                     <span
// // //                       onClick={toggleMode}
// // //                       style={{
// // //                         color: "#007bff",
// // //                         cursor: "pointer",
// // //                         marginLeft: "5px",
// // //                         fontWeight: "600",
// // //                       }}
// // //                     >
// // //                       Sign Up
// // //                     </span>
// // //                   </div>
// // //                 </form>
// // //               ) : (
// // //                 /* ========== SIGNUP FORM WITH EMAIL + MOBILE OTP ========== */
// // //                 <form className="login-form" onSubmit={handleRegisterSubmit}>
// // //                   <div className="form-group">
// // //                     <label>Full Name</label>
// // //                     <input
// // //                       type="text"
// // //                       name="fullName"
// // //                       placeholder="Enter your full name"
// // //                       value={registerData.fullName}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   {/* 📧 EMAIL ADDRESS WITH OTP BUTTON */}
// // //                   <div className="form-group">
// // //                     <label>
// // //                       Email Address{" "}
// // //                       {emailOtpVerified && <span className="verified-badge">✓ Verified</span>}
// // //                     </label>
// // //                     <div className="phone-otp-wrapper">
// // //                       <input
// // //                         type="email"
// // //                         name="email"
// // //                         placeholder="Enter your email"
// // //                         value={registerData.email}
// // //                         onChange={handleRegisterChange}
// // //                         required
// // //                         disabled={loading || emailOtpVerified}
// // //                         style={{ flex: 1 }}
// // //                       />
// // //                       {!emailOtpVerified && (
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleSendEmailOTP}
// // //                           disabled={loading || (emailOtpSent && emailTimer > 0)}
// // //                           className="otp-send-btn"
// // //                         >
// // //                           {emailOtpSent ? (emailCanResend ? "Resend" : `${emailTimer}s`) : "Send OTP"}
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   </div>

// // //                   {/* 🔢 EMAIL OTP INPUT FIELD */}
// // //                   {emailOtpSent && !emailOtpVerified && (
// // //                     <div className="form-group otp-input-group">
// // //                       <label>Enter Email OTP</label>
// // //                       <div className="phone-otp-wrapper">
// // //                         <input
// // //                           type="text"
// // //                           placeholder="Enter 6-digit OTP sent to email"
// // //                           value={emailOtp}
// // //                           onChange={(e) =>
// // //                             setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
// // //                           }
// // //                           maxLength={6}
// // //                           disabled={loading}
// // //                           className="otp-input"
// // //                           style={{ flex: 1 }}
// // //                         />
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleVerifyEmailOTP}
// // //                           disabled={loading || emailOtp.length !== 6}
// // //                           className="otp-verify-btn"
// // //                         >
// // //                           Verify
// // //                         </button>
// // //                       </div>
// // //                       {emailCanResend && (
// // //                         <p className="resend-text">
// // //                           Didn't receive OTP?{" "}
// // //                           <span onClick={handleResendEmailOTP} className="resend-link">
// // //                             Resend OTP
// // //                           </span>
// // //                         </p>
// // //                       )}
// // //                     </div>
// // //                   )}

// // //                   {/* 📱 PHONE NUMBER WITH OTP BUTTON */}
// // //                   <div className="form-group">
// // //                     <label>
// // //                       Phone Number{" "}
// // //                       {mobileOtpVerified && <span className="verified-badge">✓ Verified</span>}
// // //                     </label>
// // //                     <div className="phone-otp-wrapper">
// // //                       <input
// // //                         type="tel"
// // //                         name="phone"
// // //                         placeholder="Enter your 10-digit mobile number"
// // //                         value={registerData.phone}
// // //                         onChange={handleRegisterChange}
// // //                         required
// // //                         disabled={loading || mobileOtpVerified}
// // //                         maxLength={10}
// // //                         className="phone-input"
// // //                         style={{ flex: 1 }}
// // //                       />
// // //                       {!mobileOtpVerified && (
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleSendMobileOTP}
// // //                           disabled={loading || (mobileOtpSent && mobileTimer > 0)}
// // //                           className="otp-send-btn"
// // //                         >
// // //                           {mobileOtpSent ? (mobileCanResend ? "Resend" : `${mobileTimer}s`) : "Send OTP"}
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   </div>

// // //                   {/* 🔢 MOBILE OTP INPUT FIELD */}
// // //                   {mobileOtpSent && !mobileOtpVerified && (
// // //                     <div className="form-group otp-input-group">
// // //                       <label>Enter Mobile OTP</label>
// // //                       <div className="phone-otp-wrapper">
// // //                         <input
// // //                           type="text"
// // //                           placeholder="Enter 6-digit OTP sent to mobile"
// // //                           value={mobileOtp}
// // //                           onChange={(e) =>
// // //                             setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
// // //                           }
// // //                           maxLength={6}
// // //                           disabled={loading}
// // //                           className="otp-input"
// // //                           style={{ flex: 1 }}
// // //                         />
// // //                         <button
// // //                           type="button"
// // //                           onClick={handleVerifyMobileOTP}
// // //                           disabled={loading || mobileOtp.length !== 6}
// // //                           className="otp-verify-btn"
// // //                         >
// // //                           Verify
// // //                         </button>
// // //                       </div>
// // //                       {mobileCanResend && (
// // //                         <p className="resend-text">
// // //                           Didn't receive OTP?{" "}
// // //                           <span onClick={handleResendMobileOTP} className="resend-link">
// // //                             Resend OTP
// // //                           </span>
// // //                         </p>
// // //                       )}
// // //                     </div>
// // //                   )}

// // //                   <div className="form-group">
// // //                     <label>Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="password"
// // //                       placeholder="Create a password (min 6 characters)"
// // //                       value={registerData.password}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <div className="form-group">
// // //                     <label>Confirm Password</label>
// // //                     <input
// // //                       type="password"
// // //                       name="confirmPassword"
// // //                       placeholder="Re-enter your password"
// // //                       value={registerData.confirmPassword}
// // //                       onChange={handleRegisterChange}
// // //                       required
// // //                       disabled={loading}
// // //                     />
// // //                   </div>

// // //                   <button
// // //                     type="submit"
// // //                     className="login-btn"
// // //                     disabled={loading || !emailOtpVerified || !mobileOtpVerified}
// // //                   >
// // //                     {loading ? "Creating Account..." : "Sign Up"}
// // //                   </button>

// // //                   <div className="signup-link">
// // //                     Already have an account?{" "}
// // //                     <span
// // //                       onClick={toggleMode}
// // //                       style={{
// // //                         color: "#007bff",
// // //                         cursor: "pointer",
// // //                         marginLeft: "5px",
// // //                         fontWeight: "600",
// // //                       }}
// // //                     >
// // //                       Login
// // //                     </span>
// // //                   </div>
// // //                 </form>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;









// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import "./Login.css";

// // const Login = () => {
// //   const [isLoginMode, setIsLoginMode] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const navigate = useNavigate();

// //   // Login State
// //   const [loginData, setLoginData] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   // Register State
// //   const [registerData, setRegisterData] = useState({
// //     fullName: "",
// //     email: "",
// //     phone: "",
// //     password: "",
// //     confirmPassword: "",
// //   });

// //   // 📧 Email OTP State
// //   const [emailOtpSent, setEmailOtpSent] = useState(false);
// //   const [emailOtp, setEmailOtp] = useState("");
// //   const [emailOtpVerified, setEmailOtpVerified] = useState(false);
// //   const [emailTimer, setEmailTimer] = useState(0);
// //   const [emailCanResend, setEmailCanResend] = useState(false);

// //   // 📱 Mobile OTP State
// //   const [mobileOtpSent, setMobileOtpSent] = useState(false);
// //   const [mobileOtp, setMobileOtp] = useState("");
// //   const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
// //   const [mobileTimer, setMobileTimer] = useState(0);
// //   const [mobileCanResend, setMobileCanResend] = useState(false);

// //   // ⏱️ Email Timer
// //   useEffect(() => {
// //     if (emailTimer > 0) {
// //       const interval = setInterval(() => {
// //         setEmailTimer((prev) => prev - 1);
// //       }, 1000);
// //       return () => clearInterval(interval);
// //     } else if (emailTimer === 0 && emailOtpSent) {
// //       setEmailCanResend(true);
// //     }
// //   }, [emailTimer, emailOtpSent]);

// //   // ⏱️ Mobile Timer
// //   useEffect(() => {
// //     if (mobileTimer > 0) {
// //       const interval = setInterval(() => {
// //         setMobileTimer((prev) => prev - 1);
// //       }, 1000);
// //       return () => clearInterval(interval);
// //     } else if (mobileTimer === 0 && mobileOtpSent) {
// //       setMobileCanResend(true);
// //     }
// //   }, [mobileTimer, mobileOtpSent]);

// //   // Handlers
// //   const handleLoginChange = (e) => {
// //     setLoginData({ ...loginData, [e.target.name]: e.target.value });
// //   };

// //   const handleRegisterChange = (e) => {
// //     setRegisterData({ ...registerData, [e.target.name]: e.target.value });
// //   };

// //   // =========================
// //   // 📧 EMAIL OTP FUNCTIONS
// //   // =========================
// //   const handleSendEmailOTP = async () => {
// //     if (!registerData.email || !registerData.email.includes("@")) {
// //       setError("Please enter a valid email address");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const response = await fetch(
// //         "http://localhost:3000/api/signup/send-email-otp",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ email: registerData.email }),
// //         }
// //       );

// //       const data = await response.json();

// //       if (response.ok && data.success) {
// //         setEmailOtpSent(true);
// //         setEmailTimer(60);
// //         setEmailCanResend(false);
// //         setSuccess("OTP sent successfully to your email!");
// //         setTimeout(() => setSuccess(""), 2500);
// //       } else {
// //         setError(data.error || "Failed to send email OTP.");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError("Unable to send email OTP.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerifyEmailOTP = async () => {
// //     if (!emailOtp || emailOtp.length !== 6) {
// //       setError("Please enter a valid 6-digit email OTP");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const response = await fetch(
// //         "http://localhost:3000/api/signup/verify-email-otp",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ email: registerData.email, otp: emailOtp }),
// //         }
// //       );

// //       const data = await response.json();

// //       if (response.ok && data.success) {
// //         setEmailOtpVerified(true);
// //         setSuccess("Email verified successfully! ✓");
// //         setTimeout(() => setSuccess(""), 2500);
// //       } else {
// //         setError(data.error || "Invalid email OTP.");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError("Unable to verify email OTP.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleResendEmailOTP = () => {
// //     setEmailOtp("");
// //     setEmailCanResend(false);
// //     handleSendEmailOTP();
// //   };

// //   // =========================
// //   // 📱 MOBILE OTP FUNCTIONS
// //   // =========================
// //   const handleSendMobileOTP = async () => {
// //     if (!registerData.phone || registerData.phone.length !== 10) {
// //       setError("Please enter a valid 10-digit mobile number");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const response = await fetch(
// //         "http://localhost:3000/api/signup/send-mobile-otp",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ phone: registerData.phone }),
// //         }
// //       );

// //       const data = await response.json();

// //       if (response.ok && data.success) {
// //         setMobileOtpSent(true);
// //         setMobileTimer(60);
// //         setMobileCanResend(false);
// //         setSuccess("OTP sent successfully to your mobile!");
// //         setTimeout(() => setSuccess(""), 2500);
// //       } else {
// //         setError(data.error || "Failed to send mobile OTP.");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError("Unable to send mobile OTP.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerifyMobileOTP = async () => {
// //     if (!mobileOtp || mobileOtp.length !== 6) {
// //       setError("Please enter a valid 6-digit mobile OTP");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const response = await fetch(
// //         "http://localhost:3000/api/signup/verify-mobile-otp",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ phone: registerData.phone, otp: mobileOtp }),
// //         }
// //       );

// //       const data = await response.json();

// //       if (response.ok && data.success) {
// //         setMobileOtpVerified(true);
// //         setSuccess("Mobile verified successfully! ✓");
// //         setTimeout(() => setSuccess(""), 2500);
// //       } else {
// //         setError(data.error || "Invalid mobile OTP.");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError("Unable to verify mobile OTP.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleResendMobileOTP = () => {
// //     setMobileOtp("");
// //     setMobileCanResend(false);
// //     handleSendMobileOTP();
// //   };

// //   // =========================
// //   // ✅ LOGIN SUBMIT
// //   // =========================
// //   const handleLoginSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");
// //     setLoading(true);

// //     if (!loginData.email || !loginData.password) {
// //       setError("Please enter both email and password");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const response = await fetch("http://localhost:3000/api/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(loginData),
// //       });

// //       const data = await response.json();

// //       if (response.ok && data.success) {
// //         const user = data.user;

// //         localStorage.setItem("userData", JSON.stringify(user));
// //         localStorage.setItem("isLoggedIn", "true");

// //         setSuccess(`Login successful! Welcome ${user.fullName}`);
// //         window.dispatchEvent(new Event("storage"));

// //         setTimeout(() => {
// //           if (user.userType === "admin") navigate("/admin/dashboard");
// //           else if (user.userType === "customer") navigate("/customer/dashboard");
// //           else setError("Unknown user type. Please contact admin.");
// //         }, 1000);
// //       } else {
// //         setError(data.error || "Login failed.");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError("Unable to connect to server.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =========================
// //   // ✅ REGISTER SUBMIT
// //   // =========================
// //   const handleRegisterSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");

// //     if (!emailOtpVerified) {
// //       setError("Please verify your email first");
// //       return;
// //     }

// //     if (!mobileOtpVerified) {
// //       setError("Please verify your mobile number first");
// //       return;
// //     }

// //     if (
// //       !registerData.fullName ||
// //       !registerData.email ||
// //       !registerData.phone ||
// //       !registerData.password ||
// //       !registerData.confirmPassword
// //     ) {
// //       setError("All fields are required");
// //       return;
// //     }

// //     if (registerData.password !== registerData.confirmPassword) {
// //       setError("Passwords do not match");
// //       return;
// //     }

// //     if (registerData.password.length < 6) {
// //       setError("Password must be at least 6 characters");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const response = await fetch("http://localhost:3000/api/register", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(registerData),
// //       });

// //       const data = await response.json();

// //       if (response.ok && data.success) {
// //         setSuccess("Registration successful! Redirecting to login...");

// //         setRegisterData({
// //           fullName: "",
// //           email: "",
// //           phone: "",
// //           password: "",
// //           confirmPassword: "",
// //         });

// //         setEmailOtpSent(false);
// //         setEmailOtpVerified(false);
// //         setEmailOtp("");
// //         setEmailTimer(0);

// //         setMobileOtpSent(false);
// //         setMobileOtpVerified(false);
// //         setMobileOtp("");
// //         setMobileTimer(0);

// //         setTimeout(() => {
// //           setIsLoginMode(true);
// //           setSuccess("");
// //         }, 2000);
// //       } else {
// //         setError(data.error || "Registration failed.");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setError("Unable to connect to server.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Toggle Mode
// //   const toggleMode = () => {
// //     setIsLoginMode(!isLoginMode);
// //     setError("");
// //     setSuccess("");

// //     setEmailOtpSent(false);
// //     setEmailOtpVerified(false);
// //     setEmailOtp("");
// //     setEmailTimer(0);

// //     setMobileOtpSent(false);
// //     setMobileOtpVerified(false);
// //     setMobileOtp("");
// //     setMobileTimer(0);
// //   };

// //   return (
// //     <div className="login-container">
// //       <div className="login-overlay">
// //         <div className="login-card">
// //           {/* LEFT */}
// //           <div className="login-left">
// //             <div className="brand-section">
// //               <img src="/MR LOGO.jpeg" alt="MR Tech Logo" className="login-logo" />
// //               <h2>Myth Reality Technologies</h2>
// //               <p>AI-Powered Innovation for Healthcare & Agriculture</p>
// //             </div>

// //             <div className="feature-list">
// //               <div className="feature-item">
// //                 <span className="feature-icon">✓</span>
// //                 <span>{isLoginMode ? "Secure Login" : "Easy Registration"}</span>
// //               </div>
// //               <div className="feature-item">
// //                 <span className="feature-icon">✓</span>
// //                 <span>{isLoginMode ? "Order Tracking" : "Email & Mobile Verification"}</span>
// //               </div>
// //               <div className="feature-item">
// //                 <span className="feature-icon">✓</span>
// //                 <span>{isLoginMode ? "24/7 Support" : "Secure Account"}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* RIGHT */}
// //           <div className="login-right">
// //             <div className="login-form-wrapper">
// //               <h1 className="login-title">
// //                 {isLoginMode ? "Welcome Back" : "Create Account"}
// //               </h1>
// //               <p className="login-subtitle">
// //                 {isLoginMode ? "Login to your account" : "Sign up as a customer"}
// //               </p>

// //               {/* Messages */}
// //               {success && <div className="success-message">{success}</div>}
// //               {error && <div className="error-message">{error}</div>}

// //               {isLoginMode ? (
// //                 // LOGIN
// //                 <form className="login-form" onSubmit={handleLoginSubmit}>
// //                   <div className="form-group">
// //                     <label>Email Address</label>
// //                     <input
// //                       type="email"
// //                       name="email"
// //                       placeholder="Enter your email"
// //                       value={loginData.email}
// //                       onChange={handleLoginChange}
// //                       required
// //                       disabled={loading}
// //                     />
// //                   </div>

// //                   <div className="form-group">
// //                     <label>Password</label>
// //                     <input
// //                       type="password"
// //                       name="password"
// //                       placeholder="Enter your password"
// //                       value={loginData.password}
// //                       onChange={handleLoginChange}
// //                       required
// //                       disabled={loading}
// //                     />
// //                   </div>

// //                   <div className="form-options">
// //                     <label className="remember-me">
// //                       <input type="checkbox" />
// //                       <span>Remember me</span>
// //                     </label>
// //                     <Link to="/forgot-password" className="forgot-link">
// //                       Forgot Password?
// //                     </Link>
// //                   </div>

// //                   <button type="submit" className="login-btn" disabled={loading}>
// //                     {loading ? "Logging in..." : "Login"}
// //                   </button>

// //                   <div className="signup-link">
// //                     Don't have an account?{" "}
// //                     <span className="switch-link" onClick={toggleMode}>
// //                       Sign Up
// //                     </span>
// //                   </div>
// //                 </form>
// //               ) : (
// //                 // SIGNUP
// //                 <form className="login-form" onSubmit={handleRegisterSubmit}>
// //                   <div className="form-group">
// //                     <label>Full Name</label>
// //                     <input
// //                       type="text"
// //                       name="fullName"
// //                       placeholder="Enter your full name"
// //                       value={registerData.fullName}
// //                       onChange={handleRegisterChange}
// //                       required
// //                       disabled={loading}
// //                     />
// //                   </div>

// //                   {/* EMAIL + SEND OTP */}
// //                   <div className="form-group">
// //                     <label>
// //                       Email Address{" "}
// //                       {emailOtpVerified && <span className="verified-badge">✓ Verified</span>}
// //                     </label>

// //                     <div className="otp-row">
// //                       <input
// //                         type="email"
// //                         name="email"
// //                         placeholder="Enter your email"
// //                         value={registerData.email}
// //                         onChange={handleRegisterChange}
// //                         required
// //                         disabled={loading || emailOtpVerified}
// //                       />

// //                       {!emailOtpVerified && (
// //                         <button
// //                           type="button"
// //                           className="otp-send-btn"
// //                           onClick={handleSendEmailOTP}
// //                           disabled={loading || (emailOtpSent && emailTimer > 0)}
// //                         >
// //                           {emailOtpSent
// //                             ? emailCanResend
// //                               ? "Resend"
// //                               : `${emailTimer}s`
// //                             : "Send OTP"}
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* EMAIL OTP INPUT */}
// //                   {emailOtpSent && !emailOtpVerified && (
// //                     <div className="form-group otp-input-group">
// //                       <label>Enter Email OTP</label>

// //                       <div className="otp-row">
// //                         <input
// //                           type="text"
// //                           placeholder="Enter 6-digit OTP"
// //                           value={emailOtp}
// //                           onChange={(e) =>
// //                             setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
// //                           }
// //                           maxLength={6}
// //                           disabled={loading}
// //                           className="otp-input"
// //                         />

// //                         <button
// //                           type="button"
// //                           className="otp-verify-btn"
// //                           onClick={handleVerifyEmailOTP}
// //                           disabled={loading || emailOtp.length !== 6}
// //                         >
// //                           Verify
// //                         </button>
// //                       </div>

// //                       {emailCanResend && (
// //                         <p className="resend-text">
// //                           Didn't receive OTP?{" "}
// //                           <span onClick={handleResendEmailOTP} className="resend-link">
// //                             Resend OTP
// //                           </span>
// //                         </p>
// //                       )}
// //                     </div>
// //                   )}

// //                   {/* MOBILE + SEND OTP */}
// //                   <div className="form-group">
// //                     <label>
// //                       Phone Number{" "}
// //                       {mobileOtpVerified && <span className="verified-badge">✓ Verified</span>}
// //                     </label>

// //                     <div className="otp-row">
// //                       <input
// //                         type="tel"
// //                         name="phone"
// //                         placeholder="Enter 10-digit mobile number"
// //                         value={registerData.phone}
// //                         onChange={(e) =>
// //                           setRegisterData({
// //                             ...registerData,
// //                             phone: e.target.value.replace(/\D/g, "").slice(0, 10),
// //                           })
// //                         }
// //                         required
// //                         disabled={loading || mobileOtpVerified}
// //                         maxLength={10}
// //                       />

// //                       {!mobileOtpVerified && (
// //                         <button
// //                           type="button"
// //                           className="otp-send-btn"
// //                           onClick={handleSendMobileOTP}
// //                           disabled={loading || (mobileOtpSent && mobileTimer > 0)}
// //                         >
// //                           {mobileOtpSent
// //                             ? mobileCanResend
// //                               ? "Resend"
// //                               : `${mobileTimer}s`
// //                             : "Send OTP"}
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* MOBILE OTP INPUT */}
// //                   {mobileOtpSent && !mobileOtpVerified && (
// //                     <div className="form-group otp-input-group">
// //                       <label>Enter Mobile OTP</label>

// //                       <div className="otp-row">
// //                         <input
// //                           type="text"
// //                           placeholder="Enter 6-digit OTP"
// //                           value={mobileOtp}
// //                           onChange={(e) =>
// //                             setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
// //                           }
// //                           maxLength={6}
// //                           disabled={loading}
// //                           className="otp-input"
// //                         />

// //                         <button
// //                           type="button"
// //                           className="otp-verify-btn"
// //                           onClick={handleVerifyMobileOTP}
// //                           disabled={loading || mobileOtp.length !== 6}
// //                         >
// //                           Verify
// //                         </button>
// //                       </div>

// //                       {mobileCanResend && (
// //                         <p className="resend-text">
// //                           Didn't receive OTP?{" "}
// //                           <span onClick={handleResendMobileOTP} className="resend-link">
// //                             Resend OTP
// //                           </span>
// //                         </p>
// //                       )}
// //                     </div>
// //                   )}

// //                   <div className="form-group">
// //                     <label>Password</label>
// //                     <input
// //                       type="password"
// //                       name="password"
// //                       placeholder="Create password (min 6 characters)"
// //                       value={registerData.password}
// //                       onChange={handleRegisterChange}
// //                       required
// //                       disabled={loading}
// //                     />
// //                   </div>

// //                   <div className="form-group">
// //                     <label>Confirm Password</label>
// //                     <input
// //                       type="password"
// //                       name="confirmPassword"
// //                       placeholder="Re-enter password"
// //                       value={registerData.confirmPassword}
// //                       onChange={handleRegisterChange}
// //                       required
// //                       disabled={loading}
// //                     />
// //                   </div>

// //                   <button
// //                     type="submit"
// //                     className="login-btn"
// //                     disabled={loading || !emailOtpVerified || !mobileOtpVerified}
// //                   >
// //                     {loading ? "Creating Account..." : "Sign Up"}
// //                   </button>

// //                   <div className="signup-link">
// //                     Already have an account?{" "}
// //                     <span className="switch-link" onClick={toggleMode}>
// //                       Login
// //                     </span>
// //                   </div>
// //                 </form>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;



// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Login.css";

// const Login = () => {
//   const [isLoginMode, setIsLoginMode] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   // Login State
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   // Register State
//   const [registerData, setRegisterData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   // 📧 Email OTP State
//   const [emailOtpSent, setEmailOtpSent] = useState(false);
//   const [emailOtp, setEmailOtp] = useState("");
//   const [emailOtpVerified, setEmailOtpVerified] = useState(false);
//   const [emailTimer, setEmailTimer] = useState(0);
//   const [emailCanResend, setEmailCanResend] = useState(false);

//   // 📱 Mobile OTP State
//   const [mobileOtpSent, setMobileOtpSent] = useState(false);
//   const [mobileOtp, setMobileOtp] = useState("");
//   const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
//   const [mobileTimer, setMobileTimer] = useState(0);
//   const [mobileCanResend, setMobileCanResend] = useState(false);

//   // ⏱️ Email Timer
//   useEffect(() => {
//     if (emailTimer > 0) {
//       const interval = setInterval(() => {
//         setEmailTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (emailTimer === 0 && emailOtpSent) {
//       setEmailCanResend(true);
//     }
//   }, [emailTimer, emailOtpSent]);

//   // ⏱️ Mobile Timer
//   useEffect(() => {
//     if (mobileTimer > 0) {
//       const interval = setInterval(() => {
//         setMobileTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (mobileTimer === 0 && mobileOtpSent) {
//       setMobileCanResend(true);
//     }
//   }, [mobileTimer, mobileOtpSent]);

//   // Handlers
//   const handleLoginChange = (e) => {
//     setLoginData({ ...loginData, [e.target.name]: e.target.value });
//   };

//   const handleRegisterChange = (e) => {
//     setRegisterData({ ...registerData, [e.target.name]: e.target.value });
//   };

//   // =========================
//   // 📧 EMAIL OTP FUNCTIONS
//   // =========================
//   const handleSendEmailOTP = async () => {
//     if (!registerData.email || !registerData.email.includes("@")) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/signup/send-email-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: registerData.email }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setEmailOtpSent(true);
//         setEmailTimer(60);
//         setEmailCanResend(false);
//         setSuccess("OTP sent successfully to your email!");
//         setTimeout(() => setSuccess(""), 2500);
//       } else {
//         setError(data.error || "Failed to send email OTP.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unable to send email OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyEmailOTP = async () => {
//     if (!emailOtp || emailOtp.length !== 6) {
//       setError("Please enter a valid 6-digit email OTP");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/signup/verify-email-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: registerData.email, otp: emailOtp }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setEmailOtpVerified(true);
//         setSuccess("Email verified successfully! ✓");
//         setTimeout(() => setSuccess(""), 2500);
//       } else {
//         setError(data.error || "Invalid email OTP.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unable to verify email OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendEmailOTP = () => {
//     setEmailOtp("");
//     setEmailCanResend(false);
//     handleSendEmailOTP();
//   };

//   // =========================
//   // 📱 MOBILE OTP FUNCTIONS
//   // =========================
//   const handleSendMobileOTP = async () => {
//     if (!registerData.phone || registerData.phone.length !== 10) {
//       setError("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/signup/send-mobile-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone: registerData.phone }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setMobileOtpSent(true);
//         setMobileTimer(60);
//         setMobileCanResend(false);
//         setSuccess("OTP sent successfully to your mobile!");
//         setTimeout(() => setSuccess(""), 2500);
//       } else {
//         setError(data.error || "Failed to send mobile OTP.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unable to send mobile OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyMobileOTP = async () => {
//     if (!mobileOtp || mobileOtp.length !== 6) {
//       setError("Please enter a valid 6-digit mobile OTP");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/signup/verify-mobile-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone: registerData.phone, otp: mobileOtp }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setMobileOtpVerified(true);
//         setSuccess("Mobile verified successfully! ✓");
//         setTimeout(() => setSuccess(""), 2500);
//       } else {
//         setError(data.error || "Invalid mobile OTP.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unable to verify mobile OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendMobileOTP = () => {
//     setMobileOtp("");
//     setMobileCanResend(false);
//     handleSendMobileOTP();
//   };

//   // =========================
//   // ✅ LOGIN SUBMIT
//   // =========================
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     if (!loginData.email || !loginData.password) {
//       setError("Please enter both email and password");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:3000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(loginData),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         const user = data.user;

//         localStorage.setItem("userData", JSON.stringify(user));
//         localStorage.setItem("isLoggedIn", "true");

//         setSuccess(`Login successful! Welcome ${user.fullName}`);
//         window.dispatchEvent(new Event("storage"));

//         setTimeout(() => {
//           if (user.userType === "admin") navigate("/admin/dashboard");
//           else if (user.userType === "customer") navigate("/customer/dashboard");
//           else setError("Unknown user type. Please contact admin.");
//         }, 1000);
//       } else {
//         setError(data.error || "Login failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unable to connect to server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // ✅ REGISTER SUBMIT
//   // =========================
//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!emailOtpVerified) {
//       setError("Please verify your email first");
//       return;
//     }

//     if (!mobileOtpVerified) {
//       setError("Please verify your mobile number first");
//       return;
//     }

//     if (
//       !registerData.fullName ||
//       !registerData.email ||
//       !registerData.phone ||
//       !registerData.password ||
//       !registerData.confirmPassword
//     ) {
//       setError("All fields are required");
//       return;
//     }

//     if (registerData.password !== registerData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (registerData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(registerData),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setSuccess("Registration successful! Redirecting to login...");

//         setRegisterData({
//           fullName: "",
//           email: "",
//           phone: "",
//           password: "",
//           confirmPassword: "",
//         });

//         setEmailOtpSent(false);
//         setEmailOtpVerified(false);
//         setEmailOtp("");
//         setEmailTimer(0);

//         setMobileOtpSent(false);
//         setMobileOtpVerified(false);
//         setMobileOtp("");
//         setMobileTimer(0);

//         setTimeout(() => {
//           setIsLoginMode(true);
//           setSuccess("");
//         }, 2000);
//       } else {
//         setError(data.error || "Registration failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unable to connect to server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle Mode
//   const toggleMode = () => {
//     setIsLoginMode(!isLoginMode);
//     setError("");
//     setSuccess("");

//     setEmailOtpSent(false);
//     setEmailOtpVerified(false);
//     setEmailOtp("");
//     setEmailTimer(0);

//     setMobileOtpSent(false);
//     setMobileOtpVerified(false);
//     setMobileOtp("");
//     setMobileTimer(0);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-overlay">
//         <div className="login-card">
//           {/* LEFT */}
//           <div className="login-left">
//             <div className="brand-section">
//               <img src="/MR LOGO.jpeg" alt="MR Tech Logo" className="login-logo" />
//               <h2>Myth Reality Technologies</h2>
//               <p>AI-Powered Innovation for Healthcare & Agriculture</p>
//             </div>

//             <div className="feature-list">
//               <div className="feature-item">
//                 <span className="feature-icon">✓</span>
//                 <span>{isLoginMode ? "Secure Login" : "Easy Registration"}</span>
//               </div>
//               <div className="feature-item">
//                 <span className="feature-icon">✓</span>
//                 <span>{isLoginMode ? "Order Tracking" : "Email & Mobile Verification"}</span>
//               </div>
//               <div className="feature-item">
//                 <span className="feature-icon">✓</span>
//                 <span>{isLoginMode ? "24/7 Support" : "Secure Account"}</span>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="login-right">
//             <div className="login-form-wrapper">
//               <h1 className="login-title">
//                 {isLoginMode ? "Welcome Back" : "Create Account"}
//               </h1>
//               <p className="login-subtitle">
//                 {isLoginMode ? "Login to your account" : "Sign up as a customer"}
//               </p>

//               {/* Messages */}
//               {success && <div className="success-message">{success}</div>}
//               {error && <div className="error-message">{error}</div>}

//               {isLoginMode ? (
//                 // LOGIN
//                 <form className="login-form" onSubmit={handleLoginSubmit}>
//                   <div className="form-group">
//                     <label>Email Address</label>
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Enter your email"
//                       value={loginData.email}
//                       onChange={handleLoginChange}
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       placeholder="Enter your password"
//                       value={loginData.password}
//                       onChange={handleLoginChange}
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   <div className="form-options">
//                     <label className="remember-me">
//                       <input type="checkbox" />
//                       <span>Remember me</span>
//                     </label>
//                     <Link to="/forgot-password" className="forgot-link">
//                       Forgot Password?
//                     </Link>
//                   </div>

//                   <button type="submit" className="login-btn" disabled={loading}>
//                     {loading ? "Logging in..." : "Login"}
//                   </button>

//                   <div className="signup-link">
//                     Don't have an account?{" "}
//                     <span className="switch-link" onClick={toggleMode}>
//                       Sign Up
//                     </span>
//                   </div>
//                 </form>
//               ) : (
//                 // SIGNUP
//                 <form className="login-form" onSubmit={handleRegisterSubmit}>
//                   <div className="form-group">
//                     <label>Full Name</label>
//                     <input
//                       type="text"
//                       name="fullName"
//                       placeholder="Enter your full name"
//                       value={registerData.fullName}
//                       onChange={handleRegisterChange}
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   {/* EMAIL + SEND OTP */}
//                   <div className="form-group">
//                     <label>
//                       Email Address{" "}
//                       {emailOtpVerified && <span className="verified-badge">✓ Verified</span>}
//                     </label>

//                     <div className="otp-row">
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Enter your email"
//                         value={registerData.email}
//                         onChange={handleRegisterChange}
//                         required
//                         disabled={loading || emailOtpVerified}
//                       />

//                       {!emailOtpVerified && (
//                         <button
//                           type="button"
//                           className="otp-send-btn"
//                           onClick={handleSendEmailOTP}
//                           disabled={loading || (emailOtpSent && emailTimer > 0)}
//                         >
//                           {emailOtpSent
//                             ? emailCanResend
//                               ? "Resend"
//                               : `${emailTimer}s`
//                             : "Send OTP"}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* EMAIL OTP INPUT */}
//                   {emailOtpSent && !emailOtpVerified && (
//                     <div className="form-group otp-input-group">
//                       <label>Enter Email OTP</label>

//                       <div className="otp-row">
//                         <input
//                           type="text"
//                           placeholder="Enter 6-digit OTP"
//                           value={emailOtp}
//                           onChange={(e) =>
//                             setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                           }
//                           maxLength={6}
//                           disabled={loading}
//                           className="otp-input"
//                         />

//                         <button
//                           type="button"
//                           className="otp-verify-btn"
//                           onClick={handleVerifyEmailOTP}
//                           disabled={loading || emailOtp.length !== 6}
//                         >
//                           Verify
//                         </button>
//                       </div>

//                       {emailCanResend && (
//                         <p className="resend-text">
//                           Didn't receive OTP?{" "}
//                           <span onClick={handleResendEmailOTP} className="resend-link">
//                             Resend OTP
//                           </span>
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {/* MOBILE + SEND OTP */}
//                   <div className="form-group">
//                     <label>
//                       Phone Number{" "}
//                       {mobileOtpVerified && <span className="verified-badge">✓ Verified</span>}
//                     </label>

//                     <div className="otp-row">
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="Enter 10-digit mobile number"
//                         value={registerData.phone}
//                         onChange={(e) =>
//                           setRegisterData({
//                             ...registerData,
//                             phone: e.target.value.replace(/\D/g, "").slice(0, 10),
//                           })
//                         }
//                         required
//                         disabled={loading || mobileOtpVerified}
//                         maxLength={10}
//                       />

//                       {!mobileOtpVerified && (
//                         <button
//                           type="button"
//                           className="otp-send-btn"
//                           onClick={handleSendMobileOTP}
//                           disabled={loading || (mobileOtpSent && mobileTimer > 0)}
//                         >
//                           {mobileOtpSent
//                             ? mobileCanResend
//                               ? "Resend"
//                               : `${mobileTimer}s`
//                             : "Send OTP"}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* MOBILE OTP INPUT */}
//                   {mobileOtpSent && !mobileOtpVerified && (
//                     <div className="form-group otp-input-group">
//                       <label>Enter Mobile OTP</label>

//                       <div className="otp-row">
//                         <input
//                           type="text"
//                           placeholder="Enter 6-digit OTP"
//                           value={mobileOtp}
//                           onChange={(e) =>
//                             setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                           }
//                           maxLength={6}
//                           disabled={loading}
//                           className="otp-input"
//                         />

//                         <button
//                           type="button"
//                           className="otp-verify-btn"
//                           onClick={handleVerifyMobileOTP}
//                           disabled={loading || mobileOtp.length !== 6}
//                         >
//                           Verify
//                         </button>
//                       </div>

//                       {mobileCanResend && (
//                         <p className="resend-text">
//                           Didn't receive OTP?{" "}
//                           <span onClick={handleResendMobileOTP} className="resend-link">
//                             Resend OTP
//                           </span>
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   <div className="form-group">
//                     <label>Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       placeholder="Create password (min 6 characters)"
//                       value={registerData.password}
//                       onChange={handleRegisterChange}
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Confirm Password</label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       placeholder="Re-enter password"
//                       value={registerData.confirmPassword}
//                       onChange={handleRegisterChange}
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     className="login-btn"
//                     disabled={loading || !emailOtpVerified || !mobileOtpVerified}
//                   >
//                     {loading ? "Creating Account..." : "Sign Up"}
//                   </button>

//                   <div className="signup-link">
//                     Already have an account?{" "}
//                     <span className="switch-link" onClick={toggleMode}>
//                       Login
//                     </span>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { useState } from "react";
// import "./Login.css";

// export default function Login() {
//   const [formData, setFormData] = useState({
//     emailOrPhone: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Login clicked!");
//   };

//   return (
//     <div className="auth-container">
//       {/* LEFT SIDE */}
//       <div className="auth-left">
//         <div className="left-content">
//           <div className="logo-circle">
//             <img
//               src="https://via.placeholder.com/80"
//               alt="Logo"
//               className="logo-img"
//             />
//           </div>

//           <h2 className="brand-title">Myth Reality Technologies</h2>
//           <p className="brand-subtitle">
//             AI-Powered Innovation for Healthcare & Agriculture
//           </p>

//           <div className="features">
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Secure Login</p>
//             </div>

//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Fast Access</p>
//             </div>

//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Trusted Platform</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="auth-right">
//         <div className="form-box">
//           <h1 className="form-title">Welcome Back</h1>
//           <p className="form-subtitle">Login to continue</p>

//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label>Email / Phone</label>
//               <input
//                 type="text"
//                 name="emailOrPhone"
//                 placeholder="Enter your email or phone"
//                 value={formData.emailOrPhone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button type="submit" className="login-btn">
//               Login
//             </button>

//             <p className="bottom-text">
//               Don’t have an account? <a href="/signup">Sign Up</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import "./Login.css";

// export default function Login() {
//   const [formData, setFormData] = useState({
//     emailOrPhone: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           emailOrPhone: formData.emailOrPhone,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         alert("Login successful!");
//         window.location.href = "/";
//       } else {
//         alert(data.error || data.message || "Login failed!");
//       }
//     } catch (error) {
//       alert("Server error! Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       {/* LEFT SIDE */}
//       <div className="auth-left">
//         <div className="left-content">
//           <div className="logo-circle">
//             <img
//               src="https://via.placeholder.com/80"
//               alt="Logo"
//               className="logo-img"
//             />
//           </div>

//           <h2 className="brand-title">Myth Reality Technologies</h2>
//           <p className="brand-subtitle">
//             AI-Powered Innovation for Healthcare & Agriculture
//           </p>

//           <div className="features">
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Secure Login</p>
//             </div>
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Fast Access</p>
//             </div>
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Trusted Platform</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="auth-right">
//         <div className="form-box">
//           <h1 className="form-title">Welcome Back</h1>
//           <p className="form-subtitle">Login to continue</p>

//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label>Email / Phone</label>
//               <input
//                 type="text"
//                 name="emailOrPhone"
//                 placeholder="Enter your email or phone"
//                 value={formData.emailOrPhone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="login-btn"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p className="bottom-text">
//               Don't have an account? <a href="/signup">Sign Up</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import "./Login.css";

// export default function Login() {
//   const [formData, setFormData] = useState({
//     emailOrPhone: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           emailOrPhone: formData.emailOrPhone,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         alert("Login successful!");
//         window.location.href = "/";
//       } else {
//         alert(data.error || data.message || "Login failed!");
//       }
//     } catch (error) {
//       alert("Server error! Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       {/* LEFT SIDE */}
//       <div className="auth-left">
//         <div className="left-content">
//           <div className="logo-circle">
//             <img
//               src="/MR LOGO.jpeg"
//               alt="Logo"
//               className="logo-img"
//             />
//           </div>

//           <h2 className="brand-title">Myth Reality Technologies</h2>
//           <p className="brand-subtitle">
//             AI-Powered Innovation for Healthcare & Agriculture
//           </p>

//           <div className="features">
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Secure Login</p>
//             </div>
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Fast Access</p>
//             </div>
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Trusted Platform</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="auth-right">
//         <div className="form-box">
//           <h1 className="form-title">Welcome Back</h1>
//           <p className="form-subtitle">Login to continue</p>

//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label>Email / Phone</label>
//               <input
//                 type="text"
//                 name="emailOrPhone"
//                 placeholder="Enter your email or phone"
//                 value={formData.emailOrPhone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="login-btn"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p className="bottom-text">
//               Don't have an account? <a href="/signup">Sign Up</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState } from "react";
// import "./Login.css";

// export default function Login() {
//   const [formData, setFormData] = useState({
//     emailOrPhone: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           emailOrPhone: formData.emailOrPhone,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         alert("Login successful!");

//         // ✅ NEW: Redirect based on user type
//         if (data.user?.userType === "admin") {
//           window.location.href = "/admin/dashboard";
//         } else {
//           window.location.href = "/";
//         }
//       } else {
//         alert(data.error || data.message || "Login failed!");
//       }
//     } catch (error) {
//       alert("Server error! Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       {/* LEFT SIDE */}
//       <div className="auth-left">
//         <div className="left-content">
//           <div className="logo-circle">
//             <img
//               src="/MR LOGO.jpeg"
//               alt="Logo"
//               className="logo-img"
//             />
//           </div>

//           <h2 className="brand-title">Myth Reality Technologies</h2>
//           <p className="brand-subtitle">
//             AI-Powered Innovation for Healthcare & Agriculture
//           </p>

//           <div className="features">
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Secure Login</p>
//             </div>
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Fast Access</p>
//             </div>
//             <div className="feature-item">
//               <span className="tick">✔</span>
//               <p>Trusted Platform</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="auth-right">
//         <div className="form-box">
//           <h1 className="form-title">Welcome Back</h1>
//           <p className="form-subtitle">Login to continue</p>

//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label>Email / Phone</label>
//               <input
//                 type="text"
//                 name="emailOrPhone"
//                 placeholder="Enter your email or phone"
//                 value={formData.emailOrPhone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="login-btn"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <p className="bottom-text">
//               Don't have an account? <a href="/signup">Sign Up</a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ FIX: Save under BOTH sets of keys.
        // - "token" / "user"       → used by ProtectedRoute (admin route guard)
        // - "isLoggedIn" / "userData" → used by Navbar (Login/Logout + profile icon)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(data.user));

        alert("Login successful!");

        // Redirect based on user type
        if (data.user?.userType === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.error || data.message || "Login failed!");
      }
    } catch (error) {
      alert("Server error! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="left-content">
          <div className="logo-circle">
            <img
              src="/MR LOGO.jpeg"
              alt="Logo"
              className="logo-img"
            />
          </div>

          <h2 className="brand-title">Myth Reality Technologies</h2>
          <p className="brand-subtitle">
            AI-Powered Innovation for Healthcare & Agriculture
          </p>

          <div className="features">
            <div className="feature-item">
              <span className="tick">✔</span>
              <p>Secure Login</p>
            </div>
            <div className="feature-item">
              <span className="tick">✔</span>
              <p>Fast Access</p>
            </div>
            <div className="feature-item">
              <span className="tick">✔</span>
              <p>Trusted Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="form-box">
          <h1 className="form-title">Welcome Back</h1>
          <p className="form-subtitle">Login to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email / Phone</label>
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Enter your email or phone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="bottom-text">
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}