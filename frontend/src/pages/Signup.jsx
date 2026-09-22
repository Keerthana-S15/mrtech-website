import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaKey,
  FaCheck,
  FaCheckCircle,
  FaPaperPlane,
  FaArrowRight,
  FaUserPlus,
  FaHeartbeat,
  FaSeedling,
  FaShieldAlt,
} from "react-icons/fa";
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

  // ---- UI-only helpers (no effect on validation or submission) ----
  const pwd = formData.password;
  const strength =
    pwd.length === 0 ? 0
    : (pwd.length >= 6) + (pwd.length >= 10) + /[A-Z]/.test(pwd) + /\d/.test(pwd) + /[^A-Za-z0-9]/.test(pwd);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][Math.min(strength, 5)];
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const steps = [
    { label: "Details", done: formData.fullName.trim().length > 0 },
    { label: "Email", done: emailVerified },
    { label: "Phone", done: phoneVerified },
    { label: "Password", done: pwd.length >= 6 && passwordsMatch },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="su-page">
      {/* ================= LEFT — branding ================= */}
      <aside className="su-brand">
        <div className="su-brand-grid" aria-hidden="true" />
        <div className="su-orb su-orb--orange" aria-hidden="true" />
        <div className="su-orb su-orb--emerald" aria-hidden="true" />
        <div className="su-orb su-orb--violet" aria-hidden="true" />

        <svg className="su-net" viewBox="0 0 400 600" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <g className="su-net-lines">
            <line x1="60" y1="120" x2="180" y2="60" />
            <line x1="180" y1="60" x2="320" y2="130" />
            <line x1="60" y1="120" x2="140" y2="260" />
            <line x1="140" y1="260" x2="320" y2="130" />
            <line x1="140" y1="260" x2="90" y2="420" />
            <line x1="140" y1="260" x2="300" y2="330" />
            <line x1="300" y1="330" x2="340" y2="480" />
            <line x1="90" y1="420" x2="220" y2="520" />
            <line x1="220" y1="520" x2="340" y2="480" />
            <line x1="300" y1="330" x2="220" y2="520" />
          </g>
          <g className="su-net-nodes">
            <circle cx="60" cy="120" r="4" />
            <circle cx="180" cy="60" r="5" />
            <circle cx="320" cy="130" r="4" />
            <circle cx="140" cy="260" r="6" />
            <circle cx="90" cy="420" r="4" />
            <circle cx="300" cy="330" r="5" />
            <circle cx="340" cy="480" r="4" />
            <circle cx="220" cy="520" r="5" />
          </g>
        </svg>

        <div className="su-brand-inner">
          <div className="su-logo-ring">
            <span className="su-logo-halo" aria-hidden="true" />
            <div className="su-logo-circle">
              <img src="/MR LOGO.jpeg" alt="Myth Reality Technologies logo" className="su-logo-img" />
            </div>
          </div>
          <h2 className="su-brand-title">Myth Reality Technologies</h2>
          <p className="su-brand-subtitle">AI-Powered Innovation for Healthcare &amp; Agriculture</p>

          <ul className="su-features">
            <li className="su-feature" style={{ "--i": 0 }}>
              <span className="su-tick"><FaCheck /></span>
              <p>Easy Registration</p>
            </li>
            <li className="su-feature" style={{ "--i": 1 }}>
              <span className="su-tick"><FaCheck /></span>
              <p>Secure Account</p>
            </li>
            <li className="su-feature" style={{ "--i": 2 }}>
              <span className="su-tick"><FaCheck /></span>
              <p>Exclusive Offers</p>
            </li>
          </ul>

          {/* live progress — mirrors the form state */}
          <div className="su-progress" aria-label={`${doneCount} of ${steps.length} steps complete`}>
            <div className="su-progress-bar">
              <span style={{ width: `${(doneCount / steps.length) * 100}%` }} />
            </div>
            <ol className="su-steps">
              {steps.map((s, i) => (
                <li key={s.label} className={`su-step${s.done ? " is-done" : ""}`}>
                  <span className="su-step-dot">{s.done ? <FaCheck /> : i + 1}</span>
                  <span>{s.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="su-chip su-chip--a" aria-hidden="true"><FaHeartbeat /> AI Healthcare</div>
        <div className="su-chip su-chip--b" aria-hidden="true"><FaSeedling /> Smart Agriculture</div>
        <div className="su-chip su-chip--c" aria-hidden="true"><FaShieldAlt /> Verified accounts</div>
      </aside>

      {/* ================= RIGHT — form ================= */}
      <main className="su-panel">
        <div className="su-panel-tint" aria-hidden="true" />

        <div className="su-card">
          <div className="su-card-badge"><FaUserPlus /> New customer</div>
          <h1 className="su-title">Create Account</h1>
          <p className="su-subtitle">Sign up as a customer</p>

          <form onSubmit={handleSubmit} className="su-form">
            {/* Full name */}
            <div className="su-field" style={{ "--i": 0 }}>
              <label htmlFor="su-fullName">Full Name</label>
              <div className="su-input-wrap">
                <span className="su-input-icon"><FaUser /></span>
                <input id="su-fullName" type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required autoComplete="name" />
                <span className="su-input-line" aria-hidden="true" />
              </div>
            </div>

            {/* Email + OTP */}
            <div className={`su-field${emailVerified ? " is-verified" : ""}`} style={{ "--i": 1 }}>
              <label htmlFor="su-email">
                Email Address
                {emailVerified && <span className="su-verified"><FaCheckCircle /> Verified</span>}
              </label>
              <div className="su-otp-row">
                <div className="su-input-wrap">
                  <span className="su-input-icon"><FaEnvelope /></span>
                  <input id="su-email" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required disabled={emailVerified} autoComplete="email" />
                  <span className="su-input-line" aria-hidden="true" />
                </div>
                {!emailVerified && (
                  <button type="button" className={`su-otp-btn${emailOtpSent ? " is-resend" : ""}`} onClick={handleEmailOtp} disabled={loading === "emailSend"}>
                    {loading === "emailSend" ? <span className="su-spinner su-spinner--dark" /> : <FaPaperPlane />}
                    {loading === "emailSend" ? "Sending..." : emailOtpSent ? "Resend" : "Send OTP"}
                  </button>
                )}
              </div>
              {emailOtpSent && !emailVerified && (
                <div className="su-otp-row su-otp-row--code">
                  <div className="su-input-wrap">
                    <span className="su-input-icon"><FaKey /></span>
                    <input type="text" inputMode="numeric" placeholder="Enter Email OTP" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} maxLength={6} aria-label="Email OTP" />
                    <span className="su-input-line" aria-hidden="true" />
                  </div>
                  <button type="button" className="su-otp-btn su-otp-btn--verify" onClick={handleVerifyEmailOtp} disabled={loading === "emailVerify"}>
                    {loading === "emailVerify" ? <span className="su-spinner" /> : <FaCheck />}
                    {loading === "emailVerify" ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}
            </div>

            {/* Phone + OTP */}
            <div className={`su-field${phoneVerified ? " is-verified" : ""}`} style={{ "--i": 2 }}>
              <label htmlFor="su-phone">
                Phone Number
                {phoneVerified && <span className="su-verified"><FaCheckCircle /> Verified</span>}
              </label>
              <div className="su-otp-row">
                <div className="su-input-wrap">
                  <span className="su-input-icon"><FaPhoneAlt /></span>
                  <input id="su-phone" type="text" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required disabled={phoneVerified} autoComplete="tel" inputMode="tel" />
                  <span className="su-input-line" aria-hidden="true" />
                </div>
                {!phoneVerified && (
                  <button type="button" className={`su-otp-btn${phoneOtpSent ? " is-resend" : ""}`} onClick={handlePhoneOtp} disabled={loading === "phoneSend"}>
                    {loading === "phoneSend" ? <span className="su-spinner su-spinner--dark" /> : <FaPaperPlane />}
                    {loading === "phoneSend" ? "Sending..." : phoneOtpSent ? "Resend" : "Send OTP"}
                  </button>
                )}
              </div>
              {phoneOtpSent && !phoneVerified && (
                <div className="su-otp-row su-otp-row--code">
                  <div className="su-input-wrap">
                    <span className="su-input-icon"><FaKey /></span>
                    <input type="text" inputMode="numeric" placeholder="Enter Phone OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} maxLength={6} aria-label="Phone OTP" />
                    <span className="su-input-line" aria-hidden="true" />
                  </div>
                  <button type="button" className="su-otp-btn su-otp-btn--verify" onClick={handleVerifyPhoneOtp} disabled={loading === "phoneVerify"}>
                    {loading === "phoneVerify" ? <span className="su-spinner" /> : <FaCheck />}
                    {loading === "phoneVerify" ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="su-field" style={{ "--i": 3 }}>
              <label htmlFor="su-password">Password</label>
              <div className="su-input-wrap">
                <span className="su-input-icon"><FaLock /></span>
                <input
                  id="su-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="su-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <span className="su-input-line" aria-hidden="true" />
              </div>
              {pwd.length > 0 && (
                <div className={`su-strength su-strength--${Math.min(strength, 5)}`} aria-live="polite">
                  <div className="su-strength-bars">
                    {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= strength ? "is-on" : ""} />)}
                  </div>
                  <small>{pwd.length < 6 ? "At least 6 characters" : strengthLabel}</small>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className={`su-field${passwordsMatch ? " is-verified" : ""}`} style={{ "--i": 4 }}>
              <label htmlFor="su-confirm">
                Confirm Password
                {passwordsMatch && <span className="su-verified"><FaCheckCircle /> Match</span>}
                {formData.confirmPassword.length > 0 && !passwordsMatch && <span className="su-mismatch">Doesn't match</span>}
              </label>
              <div className="su-input-wrap">
                <span className="su-input-icon"><FaLock /></span>
                <input
                  id="su-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="su-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} aria-pressed={showConfirmPassword}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <span className="su-input-line" aria-hidden="true" />
              </div>
            </div>

            <button type="submit" className={`su-btn${loading === "signup" ? " is-loading" : ""}`} disabled={loading === "signup"} style={{ "--i": 5 }}>
              <span>{loading === "signup" ? "Creating Account..." : "Sign Up"}</span>
              {loading === "signup" ? <span className="su-spinner" aria-hidden="true" /> : <FaArrowRight className="su-btn-arrow" aria-hidden="true" />}
              <span className="su-btn-shine" aria-hidden="true" />
            </button>

            <p className="su-bottom" style={{ "--i": 6 }}>Already have an account? <a href="/login">Login</a></p>
          </form>
        </div>
      </main>
    </div>
  );
}
