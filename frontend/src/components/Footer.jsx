import React from "react";
import "./Footer.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Column 1 */}
        <div className="footer-col">
          <h3 className="footer-title">
            Myth Reality <br />
            Technologies
          </h3>
          <p className="footer-desc">
            AI-powered innovation for healthcare, agriculture & digital
            transformation
          </p>
          <ul className="footer-contact">
            <li><FaEnvelope className="icon" /> info@mrtech.co.in</li>
            <li><FaPhoneAlt className="icon" /> +91-7305152581 / +91-7200704649 </li>
            <li><FaMapMarkerAlt className="icon" /> Tamil Nadu, India</li>
          </ul>
        </div>

        {/* Column 2 – Solutions ✅ UPDATED */}
        <div className="footer-col">
          <h4>Solutions</h4>
          <ul>
            <li><Link to="/solutions/gcare">G Care Health ATM</Link></li>
            <li><Link to="/solutions/health-score">G-Score App</Link></li>
            <li><Link to="/solutions/agri">AI Agriculture Solutions</Link></li>
            <li><Link to="/crowdshaki">NandaGo Platform</Link></li>
            <li><Link to="/solutions/cha">CHA Training Program</Link></li>
            <li><Link to="/solutions/serv-attendance">SERV Attendance App</Link></li>
          </ul>
        </div>

        {/* Column 3 – Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/team">Our Team</Link></li>
            <li><Link to="/partners">Partner Network</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
          </ul>
        </div>

        {/* Column 4 – Legal */}
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy">Refund Policy</Link></li>
            <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Myth Reality Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}