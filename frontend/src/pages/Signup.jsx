import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState("");

  // ✅ NEW: Show/hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailOtp = async () => {
    if (!formData.email) return alert("Please enter your email!");
    setLoading("emailSend");
    try {
      const res = await fetch("/api/signup/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        alert(data.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      alert("Server error. Please try again.");
    }
    setLoading("");
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) return alert("Please enter the OTP!");
    setLoading("emailVerify");
    try {
      const res = await fetch("/api/signup/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: emailOtp }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailVerified(true);
        alert("Email verified successfully!");
      } else {
        alert(data.error || "Invalid OTP. Please try again.");
      }
    } catch {
      alert("Server error. Please try again.");
    }
    setLoading("");
  };

  const handlePhoneOtp = async () => {
    if (!formData.phone) return alert("Please enter your phone number!");
    setLoading("phoneSend");
    try {
      const res = await fetch("/api/signup/send-phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneOtpSent(true);
        alert("OTP sent to your phone!");
      } else {
        alert(data.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      alert("Server error. Please try again.");
    }
    setLoading("");
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) return alert("Please enter the OTP!");
    setLoading("phoneVerify");
    try {
      const res = await fetch("/api/signup/verify-phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, otp: phoneOtp }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneVerified(true);
        alert("Phone verified successfully!");
      } else {
        alert(data.error || "Invalid OTP. Please try again.");
      }
    } catch {
      alert("Server error. Please try again.");
    }
    setLoading("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) return alert("Please verify your email first!");
    if (!phoneVerified) return alert("Please verify your phone number first!");
    if (formData.password !== formData.confirmPassword) {
      return alert("Password and Confirm Password do not match!");
    }
    if (formData.password.length < 6) {
      return alert("Password must be at least 6 characters!");
    }
    setLoading("signup");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        alert("Account created successfully! Please login.");
        window.location.href = "/login";
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch {
      alert("Server error. Please try again.");
    }
    setLoading("");
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="left-content">
          <div className="logo-circle">
            <img src="/MR LOGO.jpeg" alt="Logo" className="logo-img" />
          </div>
          <h2 className="brand-title">Myth Reality Technologies</h2>
          <p className="brand-subtitle">AI-Powered Innovation for Healthcare & Agriculture</p>
          <div className="features">
            <div className="feature-item"><span className="tick">✔</span><p>Easy Registration</p></div>
            <div className="feature-item"><span className="tick">✔</span><p>Secure Account</p></div>
            <div className="feature-item"><span className="tick">✔</span><p>Exclusive Offers</p></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="form-box">
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Sign up as a customer</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email Address {emailVerified && <span style={{ color: "green" }}>✅ Verified</span>}</label>
              <div className="otp-row">
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required disabled={emailVerified} />
                {!emailVerified && (
                  <button type="button" className="otp-btn" onClick={handleEmailOtp} disabled={loading === "emailSend"}>
                    {loading === "emailSend" ? "Sending..." : "Send OTP"}
                  </button>
                )}
              </div>
              {emailOtpSent && !emailVerified && (
                <div className="otp-row" style={{ marginTop: "8px" }}>
                  <input type="text" placeholder="Enter Email OTP" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} maxLength={6} />
                  <button type="button" className="otp-btn" onClick={handleVerifyEmailOtp} disabled={loading === "emailVerify"}>
                    {loading === "emailVerify" ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}
            </div>

            <div className="input-group">
              <label>Phone Number {phoneVerified && <span style={{ color: "green" }}>✅ Verified</span>}</label>
              <div className="otp-row">
                <input type="text" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required disabled={phoneVerified} />
                {!phoneVerified && (
                  <button type="button" className="otp-btn" onClick={handlePhoneOtp} disabled={loading === "phoneSend"}>
                    {loading === "phoneSend" ? "Sending..." : "Send OTP"}
                  </button>
                )}
              </div>
              {phoneOtpSent && !phoneVerified && (
                <div className="otp-row" style={{ marginTop: "8px" }}>
                  <input type="text" placeholder="Enter Phone OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} maxLength={6} />
                  <button type="button" className="otp-btn" onClick={handleVerifyPhoneOtp} disabled={loading === "phoneVerify"}>
                    {loading === "phoneVerify" ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}
            </div>

            {/* ✅ NEW: Password field with eye icon toggle */}
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "40px", width: "100%" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* ✅ NEW: Confirm Password field with eye icon toggle */}
            <div className="input-group">
              <label>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "40px", width: "100%" }}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="signup-btn" disabled={loading === "signup"}>
              {loading === "signup" ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="bottom-text">Already have an account? <a href="/login">Login</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}