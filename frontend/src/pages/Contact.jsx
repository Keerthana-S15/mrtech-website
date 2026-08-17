import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // ✅ FIX: relative path instead of hardcoded http://localhost:3000
      const res = await axios.post("/api/send-enquiry", form);
      if (res.data.success) {
        setSuccess(res.data.message);
        setForm({ name: "", phone: "", email: "", service: "", message: "" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="c-wrap">
      {/* Header */}
      <section className="c-hero">
        <h1>Contact Us</h1>
        <p>We're here to collaborate, partner, and answer your questions.</p>
      </section>

      {/* Cards */}
      <section className="c-grid">
        {/* LEFT — Company info */}
        <article className="c-card c-info">
          <h3 className="c-card-title">
            <span className="c-emoji">🧾</span> Company Information
          </h3>

          <h4 className="c-company">Myth Reality Technologies Private Limited</h4>
          <p className="c-tagline">
            Technology powerhouse for AI-driven healthcare and agriculture
          </p>

          <div className="c-row">
            <div className="c-label c-email">Email:</div>
            <div className="c-value">info@mrtech.co.in</div>
          </div>

          <div className="c-row">
            <div className="c-label c-phone">Phone:</div>
            <div className="c-value">+91-7305152581 / +91-7200704649</div>
          </div>

          <div className="c-row">
            <div className="c-label c-office">Office:</div>
            <div className="c-value">
              Registered Office Address<br />Tamil Nadu, India
            </div>
          </div>

          <a className="c-cta" href="tel:+917305152581">📅 Schedule Call</a>
        </article>

        {/* RIGHT — Form */}
        <article className="c-card c-form">
          <h3 className="c-card-title">
            <span className="c-emoji">💬</span> Quick Enquiry
          </h3>

          {success && <div className="c-success">{success}</div>}
          {error && <div className="c-error">{error}</div>}

          <form onSubmit={onSubmit} className="c-form-grid">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your Name"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Phone Number"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email Address"
              required
            />
            <select
              name="service"
              value={form.service}
              onChange={onChange}
              required
            >
              <option value="">Select Service Interest</option>
              <option>G Care Health ATM</option>
              <option>Health Score App</option>
              <option>SERV Telemedicine</option>
              <option>AI Agriculture</option>
              <option>Partnership</option>
              <option>Other</option>
            </select>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder="Your message"
              rows={4}
              required
            />
            <button type="submit" className="c-send" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}