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
    <div className="auth-container">
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