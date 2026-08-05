// import React from "react";
// import "./SolutionDetail.css";
// import { FaChartBar, FaMobileAlt, FaBrain, FaCheckCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const HealthScoreApp = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="solution-detail-page">
//       {/* Hero Section */}
//       <div className="solution-hero">
//         <div className="solution-hero__content">
//           <FaChartBar className="solution-hero__icon" />
//           <h1>Health Score App</h1>
//           <p>AI-Based Preventive Health Tool with Personalized Scoring</p>
//           <button className="solution-hero__back" onClick={() => navigate(-1)}>
//             ← Back to Solutions
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="solution-container">
//         <div className="solution-block">
//           <h2>📱 Overview</h2>
//           <p>
//             The Health Score App is an innovative AI-powered mobile application that provides users 
//             with a comprehensive health assessment through personalized health scoring. By analyzing 
//             various health parameters, lifestyle habits, and medical history, the app generates a 
//             <strong> dynamic health score</strong> that helps users track and improve their wellness journey.
//           </p>
//         </div>

//         <div className="solution-block">
//           <h2>🎯 Key Features</h2>
//           <ul>
//             <li><FaBrain /> <strong>AI-Powered Analysis:</strong> Advanced algorithms assess your health risks and predict potential issues</li>
//             <li><FaMobileAlt /> <strong>Easy-to-Use Interface:</strong> Simple, intuitive design for all age groups</li>
//             <li><FaCheckCircle /> <strong>Personalized Recommendations:</strong> Tailored diet, exercise, and lifestyle tips based on your score</li>
//             <li><strong>Real-Time Tracking:</strong> Monitor your health score improvements over time</li>
//             <li><strong>Multi-Parameter Assessment:</strong> Analyzes BMI, blood pressure, glucose, cholesterol, sleep, stress, and more</li>
//             <li><strong>Goal Setting:</strong> Set health goals and track progress with milestones</li>
//           </ul>
//         </div>

//         <div className="solution-block">
//           <h2>💡 How It Works</h2>
//           <ul>
//             <li><strong>Step 1:</strong> Enter your basic health data and lifestyle information</li>
//             <li><strong>Step 2:</strong> The AI engine analyzes your inputs and calculates your health score (0-100)</li>
//             <li><strong>Step 3:</strong> Receive personalized recommendations to improve your score</li>
//             <li><strong>Step 4:</strong> Track daily/weekly progress with visual dashboards</li>
//             <li><strong>Step 5:</strong> Connect with healthcare professionals if needed</li>
//           </ul>
//         </div>

//         <div className="solution-block">
//           <h2>🌟 Benefits</h2>
//           <ul>
//             <li>Proactive health management and disease prevention</li>
//             <li>Early warning system for potential health risks</li>
//             <li>Motivational tool to maintain healthy habits</li>
//             <li>Integration with wearable devices for automatic data sync</li>
//             <li>Family health tracking for up to 5 members</li>
//             <li>Free health tips and educational content</li>
//           </ul>
//         </div>

       
//       </div>
//     </div>
//   );
// };

// export default HealthScoreApp;




import React from "react";
import "./SolutionDetail.css";
import { FaChartBar, FaMobileAlt, FaBrain, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HealthScoreApp = () => {
  const navigate = useNavigate();

  return (
    <div className="solution-detail-page">
      {/* Hero Section */}
      <div className="solution-hero">
        <div className="solution-hero__content">
          <FaChartBar className="solution-hero__icon" />
          <h1>G Score App</h1>
          <p>AI-Based Preventive Health Tool with Personalized Scoring</p>
          <button className="solution-hero__back" onClick={() => navigate(-1)}>
            ← Back to Solutions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="solution-container">
        <div className="solution-block">
          <h2>📱 Overview</h2>
          <p>
            The G Score App is an innovative AI-powered mobile application that provides users 
            with a comprehensive health assessment through personalized health scoring. By analyzing 
            various health parameters, lifestyle habits, and medical history, the app generates a 
            <strong> dynamic health score</strong> that helps users track and improve their wellness journey.
          </p>
        </div>

        <div className="solution-block">
          <h2>🎯 Key Features</h2>
          <ul>
            <li><FaBrain /> <strong>AI-Powered Analysis:</strong> Advanced algorithms assess your health risks and predict potential issues</li>
            <li><FaMobileAlt /> <strong>Easy-to-Use Interface:</strong> Simple, intuitive design for all age groups</li>
            <li><FaCheckCircle /> <strong>Personalized Recommendations:</strong> Tailored diet, exercise, and lifestyle tips based on your score</li>
            <li><strong>Real-Time Tracking:</strong> Monitor your health score improvements over time</li>
            <li><strong>Multi-Parameter Assessment:</strong> Analyzes BMI, blood pressure, glucose, cholesterol, sleep, stress, and more</li>
            <li><strong>Goal Setting:</strong> Set health goals and track progress with milestones</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>💡 How It Works</h2>
          <ul>
            <li><strong>Step 1:</strong> Enter your basic health data and lifestyle information</li>
            <li><strong>Step 2:</strong> The AI engine analyzes your inputs and calculates your health score (0-100)</li>
            <li><strong>Step 3:</strong> Receive personalized recommendations to improve your score</li>
            <li><strong>Step 4:</strong> Track daily/weekly progress with visual dashboards</li>
            <li><strong>Step 5:</strong> Connect with healthcare professionals if needed</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>🌟 Benefits</h2>
          <ul>
            <li>Proactive health management and disease prevention</li>
            <li>Early warning system for potential health risks</li>
            <li>Motivational tool to maintain healthy habits</li>
            <li>Integration with wearable devices for automatic data sync</li>
            <li>Family health tracking for up to 5 members</li>
            <li>Free health tips and educational content</li>
          </ul>
        </div>

       
      </div>
    </div>
  );
};

export default HealthScoreApp;