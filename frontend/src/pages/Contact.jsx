import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Contact.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";

const SERVICE_OPTIONS = [
  "G Care Health ATM",
  "Health Score App",
  "SERV Telemedicine",
  "AI Agriculture",
  "Partnership",
  "Other",
];

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
  const rootRef = useRef(null);

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

  // Scroll reveal for the two cards + pointer-following glow (decorative only)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll(".c-card"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((c) => io.observe(c));
    // safety net: never leave the cards hidden if the observer doesn't fire
    const fallback = setTimeout(() => cards.forEach((c) => c.classList.add("is-visible")), 1200);

    const onMove = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", onMove));
    return () => {
      io.disconnect();
      clearTimeout(fallback);
      cards.forEach((c) => c.removeEventListener("pointermove", onMove));
    };
  }, []);

  const messageLen = form.message.length;

  return (
    <main className="c-wrap" ref={rootRef}>
      <div className="c-bg c-bg--a" aria-hidden="true" />
      <div className="c-bg c-bg--b" aria-hidden="true" />
      <div className="c-grid-lines" aria-hidden="true" />

      {/* Header */}
      <section className="c-hero">
        <span className="c-eyebrow">Get in touch</span>
        <h1>Contact Us</h1>
        <p>We're here to collaborate, partner, and answer your questions.</p>
      </section>

      {/* Cards */}
      <section className="c-grid">
        {/* LEFT — Company info */}
        <article className="c-card c-info" style={{ "--delay": "0ms" }}>
          <span className="c-card-glow" aria-hidden="true" />
          <h3 className="c-card-title">
            <span className="c-title-icon">
              <FaMapMarkerAlt />
            </span>
            Company Information
          </h3>

          <h4 className="c-company">Myth Reality Technologies Private Limited</h4>
          <p className="c-tagline">
            Technology powerhouse for AI-driven healthcare and agriculture
          </p>

          <ul className="c-rows">
            <li className="c-row c-row--email">
              <a href="mailto:mrtech05.ai@gmail.com" className="c-row-link">
                <span className="c-row-icon"><FaEnvelope /></span>
                <span className="c-row-body">
                  <span className="c-label">Email:</span>
                  <span className="c-value">mrtech05.ai@gmail.com</span>
                </span>
                <FaArrowRight className="c-row-arrow" />
              </a>
            </li>

            <li className="c-row c-row--phone">
              <div className="c-row-link c-row-link--static">
                <span className="c-row-icon"><FaPhoneAlt /></span>
                <span className="c-row-body">
                  <span className="c-label">Phone:</span>
                  <span className="c-value">
                    <a href="tel:+917305152581">+91-7305152581</a>
                    {" / "}
                    <a href="tel:+917200704649">+91-7200704649</a>
                  </span>
                </span>
              </div>
            </li>

            <li className="c-row c-row--office">
              <div className="c-row-link c-row-link--static">
                <span className="c-row-icon"><FaMapMarkerAlt /></span>
                <span className="c-row-body">
                  <span className="c-label">Office:</span>
                  <span className="c-value">
                    Registered Office Address<br />Tamil Nadu, India
                  </span>
                </span>
              </div>
            </li>
          </ul>

          <a className="c-cta" href="tel:+917305152581">
            <span className="c-cta-icon"><FaCalendarAlt /></span>
            <span>Schedule Call</span>
            <FaArrowRight className="c-cta-arrow" />
            <span className="c-cta-shine" aria-hidden="true" />
          </a>
        </article>

        {/* RIGHT — Form */}
        <article className="c-card c-form" style={{ "--delay": "140ms" }}>
          <span className="c-card-glow" aria-hidden="true" />
          <h3 className="c-card-title">
            <span className="c-title-icon c-title-icon--form">
              <FaPaperPlane />
            </span>
            Quick Enquiry
          </h3>

          {success && (
            <div className="c-success" role="status">
              <FaCheckCircle /> {success}
            </div>
          )}
          {error && (
            <div className="c-error" role="alert">
              <FaExclamationCircle /> {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="c-form-grid" noValidate={false}>
            <div className="c-field">
              <input
                id="c-name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your Name"
                required
                autoComplete="name"
              />
              <label htmlFor="c-name">Your Name</label>
            </div>

            <div className="c-field">
              <input
                id="c-phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone Number"
                required
                autoComplete="tel"
                inputMode="tel"
              />
              <label htmlFor="c-phone">Phone Number</label>
            </div>

            <div className="c-field">
              <input
                id="c-email"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email Address"
                required
                autoComplete="email"
              />
              <label htmlFor="c-email">Email Address</label>
            </div>

            <div className={`c-field c-field--select${form.service ? " has-value" : ""}`}>
              <select
                id="c-service"
                name="service"
                value={form.service}
                onChange={onChange}
                required
              >
                <option value="">Select Service Interest</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <label htmlFor="c-service">Service Interest</label>
            </div>

            <div className="c-field c-field--area">
              <textarea
                id="c-message"
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Your message"
                rows={4}
                required
              />
              <label htmlFor="c-message">Your message</label>
              <span className="c-count" aria-hidden="true">{messageLen}</span>
            </div>

            <button
              type="submit"
              className={`c-send${loading ? " is-loading" : ""}`}
              disabled={loading}
            >
              <span className="c-send-label">
                {loading ? "Sending..." : "Send Message"}
              </span>
              {loading ? (
                <span className="c-spinner" aria-hidden="true" />
              ) : (
                <FaPaperPlane className="c-send-icon" aria-hidden="true" />
              )}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
