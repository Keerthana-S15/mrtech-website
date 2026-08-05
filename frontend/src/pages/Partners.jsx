import React from "react";
import "./Partners.css";

export default function Partners() {
  return (
    <main className="partners-wrap">
      <section className="partners-hero">
        <h1>Our Empanelled Associates</h1>
        <p className="subtitle">
          MRT collaborates with a growing network of empanelled associates who
          bring domain expertise, local reach, and community trust.
        </p>

        <div className="cards">
          {/* Technology */}
          <article className="card">
            <div className="card-icon">
              {/* laptop svg */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 5h18v10H3V5zm-2 12h22v2H1v-2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="card-title tech">Technology Partners</h3>
            <ul className="bullets">
              <li>Cloud Service Providers</li>
              <li>AI Research Labs</li>
              <li>Software Development Teams</li>
              <li>Data Analytics Companies</li>
            </ul>
          </article>

          {/* Healthcare */}
          <article className="card">
            <div className="card-icon">
              {/* hospital cross */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M10 2h4v4h4v4h-4v4h-4v-4H6V6h4V2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="card-title health">Healthcare Networks</h3>
            <ul className="bullets">
              <li>Multi-specialty Hospitals</li>
              <li>Diagnostic Centers</li>
              <li>Medical Colleges</li>
              <li>Pharmacy Chains</li>
            </ul>
          </article>

          {/* Agriculture */}
          <article className="card">
            <div className="card-icon">
              {/* leaf */}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 2c6 2 9 6 9 10 0 5-4 9-9 9S3 17 3 12C3 7 6 3 12 2zm0 4c-3 1-5 3-5 6a5 5 0 0 0 10 0c0-3-2-5-5-6z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="card-title agri">Agricultural Institutions</h3>
            <ul className="bullets">
              <li>Farmer Producer Organizations</li>
              <li>AgriTech Startups</li>
              <li>Soil Testing Labs</li>
              
              <li>Agricultural Universities</li>
            </ul>
          </article>
        </div>

        {/* <div className="cta-row">
          <a href="/contact" className="cta-btn">
            <span className="cta-emoji">🤝</span> Become an Associate
          </a>
          <a className="cta-btn outline">
            <span className="cta-emoji">📋</span> View Partner List
          </a>
        </div> */}
      </section>
    </main>
  );
}