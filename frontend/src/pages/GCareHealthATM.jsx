import React from "react";
import "./SolutionDetail.css";
import { FaHospitalAlt, FaHeartbeat, FaMapMarkedAlt, FaUserMd } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GCareHealthATM = () => {
  const navigate = useNavigate();

  return (
    <div className="solution-detail-page">
      {/* Hero Section */}
      <div className="solution-hero">
        <div className="solution-hero__content">
          <FaHospitalAlt className="solution-hero__icon" />
          <h1>G Care Health ATM</h1>
          <p>AI-Enabled Health Kiosks for Preventive Healthcare Across Tamil Nadu</p>
          <button className="solution-hero__back" onClick={() => navigate(-1)}>
            ← Back to Solutions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="solution-container">
        <div className="solution-block">
          <h2>🏥 Overview</h2>
          <p>
            G Care Health ATM is a revolutionary AI-powered health kiosk network designed to bring 
            preventive healthcare and diagnostics directly to communities across Tamil Nadu. With 
            plans to establish <strong>3,300+ locations</strong>, we aim to make quality healthcare 
            accessible to everyone, especially in rural and underserved areas.
          </p>
        </div>

        <div className="solution-block">
          <h2>🎯 Key Features</h2>
          <ul>
            <li><FaHeartbeat /> <strong>Comprehensive Health Screening:</strong> Blood pressure, glucose, BMI, oxygen saturation, ECG, and more</li>
            <li><FaUserMd /> <strong>AI-Powered Analysis:</strong> Instant health risk assessment and personalized recommendations</li>
            <li><FaMapMarkedAlt /> <strong>Wide Network:</strong> Strategic placement in villages, towns, and urban centers</li>
            <li><strong>Telemedicine Integration:</strong> Connect with doctors remotely for consultations</li>
            <li><strong>Health Records:</strong> Digital storage and tracking of health data over time</li>
            <li><strong>Affordable Access:</strong> Low-cost or free screening for economically weaker sections</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>💡 Benefits</h2>
          <ul>
            <li>Early detection of chronic diseases like diabetes, hypertension, and cardiac issues</li>
            <li>Reduced healthcare costs through preventive care</li>
            <li>Accessible healthcare for remote and rural populations</li>
            <li>Data-driven health insights for better decision-making</li>
            <li>Integration with government health programs</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>📊 Impact Goals</h2>
          <p>
            Our mission is to screen <strong>over 1 million people annually</strong> and reduce 
            the burden of preventable diseases through early intervention. By partnering with 
            <strong> 100+ hospitals</strong>, we ensure seamless referrals for advanced care when needed.
          </p>
        </div>

       
      </div>
    </div>
  );
};

export default GCareHealthATM;