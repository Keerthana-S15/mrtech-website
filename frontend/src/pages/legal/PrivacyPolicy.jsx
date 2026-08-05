import React from "react";
import "../LegalPage.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last Updated: November 25, 2024</p>

      <p>
        At Myth Reality Technologies Pvt. Ltd., we are committed to protecting
        your privacy. This Privacy Policy explains how we collect, use, and
        safeguard your personal information.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, and billing details.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with our website and services.</li>
        <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide and improve our services</li>
        <li>Process transactions and send order confirmations</li>
        <li>Communicate with you about updates, promotions, and support</li>
        <li>Analyze usage patterns to enhance user experience</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. Data Sharing and Disclosure</h2>
      <p>
        We do not sell your personal information. We may share your data with:
      </p>
      <ul>
        <li><strong>Service Providers:</strong> Third-party vendors who assist in operations (e.g., payment processors)</li>
        <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
        <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data.
        However, no method of transmission over the internet is 100% secure.
      </p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access and update your personal information</li>
        <li>Request deletion of your data</li>
        <li>Opt-out of marketing communications</li>
        <li>Lodge a complaint with data protection authorities</li>
      </ul>

      <h2>6. Cookies</h2>
      <p>
        We use cookies to enhance your browsing experience. You can manage
        cookie preferences through your browser settings.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated "Last Updated" date.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at:{" "}
        <a href="mailto:info@mythrealitytech.com">info@mythrealitytech.com</a>
      </p>
    </div>
  );
}