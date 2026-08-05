import React from "react";
import "./SolutionDetail.css";
import { FaGraduationCap, FaUserNurse, FaBriefcase, FaCertificate } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CHATrainingProgram = () => {
  const navigate = useNavigate();

  return (
    <div className="solution-detail-page">
      {/* Hero Section */}
      <div className="solution-hero">
        <div className="solution-hero__content">
          <FaGraduationCap className="solution-hero__icon" />
          <h1>CHA Training Program</h1>
          <p>Community Health Ambassador - Recruit, Train, Deploy Model</p>
          <button className="solution-hero__back" onClick={() => navigate(-1)}>
            ← Back to Solutions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="solution-container">
        <div className="solution-block">
          <h2>👥 Overview</h2>
          <p>
            The <strong>Community Health Ambassador (CHA) Training Program</strong> is a comprehensive 
            initiative designed to create a skilled workforce of healthcare professionals who can serve 
            communities at the grassroots level. Through our <strong>Recruit → Train → Deploy</strong> model, 
            we empower individuals with the knowledge and tools to become healthcare champions in their communities.
          </p>
        </div>

        <div className="solution-block">
          <h2>🎯 Program Structure</h2>
          <ul>
            <li><FaUserNurse /> <strong>Phase 1: Recruitment</strong>
              <ul>
                <li>Identify candidates from local communities</li>
                <li>Preference for rural youth and women</li>
                <li>Minimum qualification: 10th/12th standard</li>
              </ul>
            </li>
            <li><strong>Phase 2: Training (3-6 Months)</strong>
              <ul>
                <li>Basic healthcare concepts and preventive care</li>
                <li>Operation of G Care Health ATM kiosks</li>
                <li>Patient communication and counseling</li>
                <li>Digital health tools and telemedicine</li>
                <li>Emergency response and first aid</li>
              </ul>
            </li>
            <li><FaBriefcase /> <strong>Phase 3: Deployment</strong>
              <ul>
                <li>Placement at G Care Health ATM centers</li>
                <li>Community health outreach programs</li>
                <li>Ongoing mentorship and support</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>📚 Training Curriculum</h2>
          <ul>
            <li><strong>Medical Knowledge:</strong> Basic anatomy, common diseases, health screening procedures</li>
            <li><strong>Technology Skills:</strong> Operating health kiosks, data entry, telemedicine platforms</li>
            <li><strong>Soft Skills:</strong> Communication, empathy, patient handling, community engagement</li>
            <li><strong>Regulatory Compliance:</strong> Health regulations, privacy laws, ethical guidelines</li>
            <li><strong>Business Skills:</strong> Kiosk management, inventory, basic accounting</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>🌟 Benefits for Participants</h2>
          <ul>
            <li><FaCertificate /> <strong>Certification:</strong> Government-recognized CHA certificate</li>
            <li><strong>Employment:</strong> Guaranteed job placement after successful training</li>
            <li><strong>Income:</strong> Competitive salary + performance incentives</li>
            <li><strong>Career Growth:</strong> Pathway to advanced healthcare roles</li>
            <li><strong>Social Impact:</strong> Serve your community and make a difference</li>
            <li><strong>Free Training:</strong> No course fees, fully sponsored by Myth Reality Technologies</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>📊 Program Impact</h2>
          <p>
            Since inception, we have trained and deployed <strong>over 500 Community Health Ambassadors</strong> 
            across Tamil Nadu. Our goal is to create <strong>5,000+ healthcare jobs</strong> in the next 3 years, 
            contributing to both employment generation and improved community health outcomes.
          </p>
        </div>

        <div className="solution-block">
          <h2>📝 How to Apply</h2>
          <p>
            <strong>Eligibility:</strong> Age 18-35 years, 10th/12th pass, basic English/Tamil literacy, 
            willingness to serve rural communities.
          </p>
          <p>
            <strong>Application Process:</strong> Online application → Screening test → Interview → 
            Selection → Training → Deployment
          </p>
        </div>

      </div>
    </div>
  );
};

export default CHATrainingProgram;