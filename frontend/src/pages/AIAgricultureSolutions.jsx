import React from "react";
import "./SolutionDetail.css";
import { FaSeedling, FaLeaf, FaCloudSunRain, FaTractor } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AIAgricultureSolutions = () => {
  const navigate = useNavigate();

  return (
    <div className="solution-detail-page">
      {/* Hero Section */}
      <div className="solution-hero">
        <div className="solution-hero__content">
          <FaSeedling className="solution-hero__icon" />
          <h1>AI Agriculture Solutions</h1>
          <p>Smart Farming Tools with AI-Powered Precision Guidance</p>
          <button className="solution-hero__back" onClick={() => navigate(-1)}>
            ← Back to Solutions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="solution-container">
        <div className="solution-block">
          <h2>🌾 Overview</h2>
          <p>
            Our AI Agriculture Solutions empower farmers with cutting-edge technology to optimize 
            crop yields, reduce costs, and promote sustainable farming practices. Using 
            <strong> artificial intelligence, IoT sensors, and satellite imagery</strong>, we provide 
            real-time insights for data-driven agricultural decisions.
          </p>
        </div>

        <div className="solution-block">
          <h2>🎯 Key Features</h2>
          <ul>
            <li><FaLeaf /> <strong>Crop Health Monitoring:</strong> AI-powered disease and pest detection using image recognition</li>
            <li><FaCloudSunRain /> <strong>Weather Forecasting:</strong> Hyperlocal weather predictions for better planning</li>
            <li><FaTractor /> <strong>Precision Farming:</strong> Soil analysis, nutrient mapping, and irrigation optimization</li>
            <li><strong>Yield Prediction:</strong> AI models forecast crop yields based on historical and real-time data</li>
            <li><strong>Market Intelligence:</strong> Price trends, demand forecasting, and best selling times</li>
            <li><strong>Advisory Services:</strong> Expert recommendations via mobile app in regional languages</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>💡 Technologies Used</h2>
          <ul>
            <li><strong>Computer Vision:</strong> Automated crop monitoring through drone and satellite imagery</li>
            <li><strong>Machine Learning:</strong> Predictive models for pest outbreaks and disease spread</li>
            <li><strong>IoT Sensors:</strong> Real-time monitoring of soil moisture, pH levels, and temperature</li>
            <li><strong>Big Data Analytics:</strong> Historical data analysis for pattern recognition</li>
            <li><strong>Mobile Platform:</strong> Easy access to insights via smartphone apps</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>🌟 Benefits for Farmers</h2>
          <ul>
            <li>Increase crop yields by 20-30% through precision farming</li>
            <li>Reduce water usage by up to 40% with smart irrigation</li>
            <li>Minimize pesticide use through early disease detection</li>
            <li>Lower input costs and maximize profitability</li>
            <li>Access to government schemes and subsidies</li>
            <li>Direct market linkages for better prices</li>
          </ul>
        </div>

        <div className="solution-block">
          <h2>📊 Impact</h2>
          <p>
            Our goal is to support <strong>over 50,000 farmers</strong> across Tamil Nadu and neighboring 
            states, helping them transition to sustainable, technology-driven farming. By integrating 
            traditional knowledge with modern AI, we're building a resilient agricultural ecosystem.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIAgricultureSolutions;