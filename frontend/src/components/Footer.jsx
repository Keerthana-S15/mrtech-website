import { useEffect, useRef } from "react";
import "./Footer.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGooglePlay,
  FaArrowRight,
  FaArrowUp,
  FaHeartbeat,
  FaSeedling,
  FaNetworkWired,
} from "react-icons/fa";
import { Link } from "react-router-dom";

/* Company social profiles — add the URLs and the icons appear automatically. */
const SOCIALS = [
  { id: "linkedin", label: "LinkedIn", icon: <FaLinkedinIn />, href: "" },
  { id: "facebook", label: "Facebook", icon: <FaFacebookF />, href: "" },
  { id: "instagram", label: "Instagram", icon: <FaInstagram />, href: "" },
  { id: "youtube", label: "YouTube", icon: <FaYoutube />, href: "" },
  { id: "playstore", label: "SERV app on Google Play", icon: <FaGooglePlay />, href: "https://play.google.com/store/apps/details?id=com.serv.serv_app" },
  { id: "email", label: "Email us", icon: <FaEnvelope />, href: "mailto:info@mrtech.co.in" },
  { id: "phone", label: "Call us", icon: <FaPhoneAlt />, href: "tel:+917305152581" },
].filter((s) => s.href);

/* Links — unchanged destinations */
const SOLUTIONS = [
  { to: "/solutions/gcare", label: "G Care Health ATM" },
  { to: "/solutions/health-score", label: "G-Score App" },
  { to: "/solutions/agri", label: "AI Agriculture Solutions" },
  { to: "/crowdshaki", label: "NandaGo Platform" },
  { to: "/solutions/cha", label: "CHA Training Program" },
  { to: "/solutions/serv-attendance", label: "SERV Attendance App" },
];
const COMPANY = [
  { to: "/about", label: "About Us" },
  { to: "/team", label: "Our Team" },
  { to: "/partners", label: "Partner Network" },
  { to: "/gallery", label: "Gallery" },
];
const LEGAL = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-conditions", label: "Terms & Conditions" },
  { to: "/refund-policy", label: "Refund Policy" },
  { to: "/cancellation-policy", label: "Cancellation Policy" },
];

export default function Footer() {
  const ref = useRef(null);

  // reveal the columns when the footer scrolls into view (decorative only)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      el.dataset.visible = "1";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.visible = "1";
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    const fallback = setTimeout(() => (el.dataset.visible = "1"), 2000);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer ft" ref={ref}>
      <div className="ft-line" aria-hidden="true" />
      <div className="ft-orb ft-orb--a" aria-hidden="true" />
      <div className="ft-orb ft-orb--b" aria-hidden="true" />
      <div className="ft-grid-lines" aria-hidden="true" />

      <div className="ft-inner">
        {/* ---- brand ---- */}
        <div className="ft-col ft-col--brand" style={{ "--i": 0 }}>
          <Link to="/" className="ft-brand">
            <img src="/MR LOGO.jpeg" alt="Myth Reality Technologies" className="ft-logo" />
            <h3 className="footer-title ft-title">
              Myth Reality <br />
              Technologies
            </h3>
          </Link>
          <p className="ft-desc">
            AI-powered innovation for healthcare, agriculture &amp; digital transformation
          </p>

          <ul className="ft-domains" aria-label="Focus areas">
            <li><FaHeartbeat /> Healthcare</li>
            <li><FaSeedling /> Agriculture</li>
            <li><FaNetworkWired /> Digital</li>
          </ul>

          <ul className="ft-contact">
            <li>
              <a href="mailto:info@mrtech.co.in">
                <span className="ft-contact-icon"><FaEnvelope /></span>
                <span>info@mrtech.co.in</span>
              </a>
            </li>
            <li>
              <div className="ft-contact-static">
                <span className="ft-contact-icon ft-contact-icon--green"><FaPhoneAlt /></span>
                <span>
                  <a href="tel:+917305152581">+91-7305152581</a> / <a href="tel:+917200704649">+91-7200704649</a>
                </span>
              </div>
            </li>
            <li>
              <div className="ft-contact-static">
                <span className="ft-contact-icon ft-contact-icon--violet"><FaMapMarkerAlt /></span>
                <span>Tamil Nadu, India</span>
              </div>
            </li>
          </ul>
        </div>

        {/* ---- link columns ---- */}
        <FooterColumn title="Solutions" links={SOLUTIONS} index={1} />
        <FooterColumn title="Company" links={COMPANY} index={2} />
        <FooterColumn title="Legal" links={LEGAL} index={3} />
      </div>

      {/* ---- bottom bar ---- */}
      <div className="ft-bottom">
        <div className="ft-bottom-inner">
          <p className="ft-copy">
            © {new Date().getFullYear()} Myth Reality Technologies. All rights reserved.
          </p>

          <div className="ft-social" aria-label="Connect with us">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                className={`ft-social-link ft-social-link--${s.id}`}
                aria-label={s.label}
                title={s.label}
                target={/^https?:/.test(s.href) ? "_blank" : undefined}
                rel={/^https?:/.test(s.href) ? "noopener noreferrer" : undefined}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <button type="button" className="ft-top" onClick={scrollTop} aria-label="Back to top">
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, index }) {
  return (
    <div className="ft-col" style={{ "--i": index }}>
      <h4 className="ft-heading">
        {title}
        <span className="ft-heading-bar" aria-hidden="true" />
      </h4>
      <ul className="ft-links">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to}>
              <FaArrowRight className="ft-link-arrow" aria-hidden="true" />
              <span>{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
