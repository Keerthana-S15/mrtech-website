import React from "react";
import "./CrowdShakiPlatform.css";
import { motion } from "framer-motion";
import { FaUsers, FaHeart, FaShareAlt, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CrowdShakiPage = () => {
  const navigate = useNavigate();

  return (
    <div className="crowdshaki-page">
      {/* Hero Section */}
      <motion.div
        className="crowdshaki-hero"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>CrowdShaki Platform</h1>
        <p>Empowering Communities Through Digital Crowdfunding</p>

        {/* ✅ NEW: Back to Solutions button */}
        <button
          onClick={() => navigate("/solutions")}
          style={{
            marginTop: "20px",
            padding: "10px 22px",
            background: "#00333d",
            border: "2px solid #00333d",
            borderRadius: "30px",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back to Solutions
        </button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="crowdshaki-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p>
          <strong>CrowdShaki</strong> is a digital crowdfunding platform
          developed by <strong>Myth Reality Technologies</strong> to support
          individuals and communities in raising funds for critical needs such
          as <span>medical emergencies</span>, <span>education</span>,{" "}
          <span>social causes</span>, and <span>personal challenges</span>.
        </p>

        <p>
          The platform enables users to easily create fundraising campaigns,
          share them across networks, and directly receive donations into their
          bank accounts. With <strong>category-based browsing</strong>,{" "}
          <strong>real-time campaign tracking</strong>, and{" "}
          <strong>featured success stories</strong>, CrowdShaki aims to make
          fundraising transparent, fast, and accessible for everyone in need.
        </p>

        {/* Features Section */}
        <div className="crowdshaki-features">
          <div className="feature">
            <FaUsers className="feature-icon" />
            <h3>Create Campaigns</h3>
            <p>
              Set up personalized campaigns for any cause in just a few minutes.
            </p>
          </div>
          <div className="feature">
            <FaShareAlt className="feature-icon" />
            <h3>Share Everywhere</h3>
            <p>Spread your campaign through social media and reach supporters.</p>
          </div>
          <div className="feature">
            <FaHeart className="feature-icon" />
            <h3>Receive Donations</h3>
            <p>Securely collect funds directly in your bank account.</p>
          </div>
          <div className="feature">
            <FaChartLine className="feature-icon" />
            <h3>Track Progress</h3>
            <p>Monitor donations in real-time with live dashboards.</p>
          </div>
        </div>

        <blockquote>
          "Together, we can turn small acts of kindness into big transformations."
        </blockquote>

        {/* ✅ NEW: Back to Solutions button (bottom, after reading content) */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={() => navigate("/solutions")}
            style={{
              padding: "10px 22px",
              background: "#00333d",
              border: "none",
              borderRadius: "30px",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back to Solutions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CrowdShakiPage;