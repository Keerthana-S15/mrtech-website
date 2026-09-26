import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheck,
  FaShieldAlt,
} from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // UI only

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
      const response = await fetch("/api/login", {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(data.user));

        alert("Login successful!");

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
    <div className="lg-page">
      {/* ================= LEFT — branding ================= */}
      <aside className="lg-brand" aria-hidden="false">
        <div className="lg-brand-grid" aria-hidden="true" />
        <div className="lg-orb lg-orb--orange" aria-hidden="true" />
        <div className="lg-orb lg-orb--emerald" aria-hidden="true" />
        <div className="lg-orb lg-orb--violet" aria-hidden="true" />

        {/* neural-network style nodes */}
        <svg className="lg-net" viewBox="0 0 400 600" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <g className="lg-net-lines">
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
          <g className="lg-net-nodes">
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

        <div className="lg-brand-inner">
          <div className="lg-logo-ring">
            <span className="lg-logo-halo" aria-hidden="true" />
            <div className="lg-logo-circle">
              <img src="/MR LOGO.jpeg" alt="Myth Reality Technologies logo" className="lg-logo-img" />
            </div>
          </div>

          <h2 className="lg-brand-title">Myth Reality Technologies</h2>
          <p className="lg-brand-subtitle">
            AI-Powered Innovation for Healthcare &amp; Agriculture
          </p>

          <ul className="lg-features">
            <li className="lg-feature" style={{ "--i": 0 }}>
              <span className="lg-tick"><FaCheck /></span>
              <p>Secure Login</p>
            </li>
            <li className="lg-feature" style={{ "--i": 1 }}>
              <span className="lg-tick"><FaCheck /></span>
              <p>Fast Access</p>
            </li>
            <li className="lg-feature" style={{ "--i": 2 }}>
              <span className="lg-tick"><FaCheck /></span>
              <p>Trusted Platform</p>
            </li>
          </ul>
        </div>

      </aside>

      {/* ================= RIGHT — form ================= */}
      <main className="lg-panel">
        <div className="lg-panel-tint" aria-hidden="true" />

        <div className="lg-card">
          <div className="lg-card-badge">
            <FaShieldAlt /> Secure sign in
          </div>
          <h1 className="lg-title">Welcome Back</h1>
          <p className="lg-subtitle">Login to continue</p>

          <form onSubmit={handleSubmit} className="lg-form">
            <div className="lg-field" style={{ "--i": 0 }}>
              <label htmlFor="lg-emailOrPhone">Email / Phone</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon"><FaUser /></span>
                <input
                  id="lg-emailOrPhone"
                  type="text"
                  name="emailOrPhone"
                  placeholder="Enter your email or phone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
                <span className="lg-input-line" aria-hidden="true" />
              </div>
            </div>

            <div className="lg-field" style={{ "--i": 1 }}>
              <label htmlFor="lg-password">Password</label>
              <div className="lg-input-wrap">
                <span className="lg-input-icon"><FaLock /></span>
                <input
                  id="lg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <span className="lg-input-line" aria-hidden="true" />
              </div>
            </div>

            <div className="lg-forgot-row" style={{ "--i": 2 }}>
              <Link to="/forgot-password" className="lg-forgot">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`lg-btn${loading ? " is-loading" : ""}`}
              disabled={loading}
              style={{ "--i": 3 }}
            >
              <span className="lg-btn-label">{loading ? "Logging in..." : "Login"}</span>
              {loading ? (
                <span className="lg-spinner" aria-hidden="true" />
              ) : (
                <FaArrowRight className="lg-btn-arrow" aria-hidden="true" />
              )}
              <span className="lg-btn-shine" aria-hidden="true" />
            </button>

            <p className="lg-bottom" style={{ "--i": 4 }}>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
