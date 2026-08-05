import React from "react";
import "../LegalPage.css";

export default function RefundPolicy() {
  return (
    <div className="legal-page">
      <h1>Refund Policy</h1>
      <p className="last-updated">Last Updated: November 25, 2024</p>

      <p>
        At Myth Reality Technologies Pvt. Ltd., we strive for customer
        satisfaction. This Refund Policy outlines the conditions under which
        refunds may be issued.
      </p>

      <h2>1. Eligibility for Refunds</h2>
      <p>Refunds may be requested under the following conditions:</p>
      <ul>
        <li>Product or service does not match the description</li>
        <li>Technical issues prevent proper usage</li>
        <li>Service was not delivered within the promised timeframe</li>
        <li>Duplicate payment was processed</li>
      </ul>

      <h2>2. Non-Refundable Items</h2>
      <p>The following are not eligible for refunds:</p>
      <ul>
        <li>Customized or personalized products</li>
        <li>Digital downloads after successful delivery</li>
        <li>Services that have been fully rendered</li>
        <li>Products damaged due to misuse or negligence</li>
      </ul>

      <h2>3. Refund Request Process</h2>
      <p>To request a refund:</p>
      <ul>
        <li>Contact us at <a href="mailto:info@mythrealitytech.com">info@mythrealitytech.com</a> within <strong>7 days</strong> of purchase</li>
        <li>Provide your order number and reason for the refund</li>
        <li>Include supporting documentation (screenshots, photos, etc.)</li>
        <li>Our team will review your request within <strong>3-5 business days</strong></li>
      </ul>

      <h2>4. Refund Timeline</h2>
      <p>
        Once your refund is approved:
      </p>
      <ul>
        <li><strong>Credit/Debit Card:</strong> 7-10 business days</li>
        <li><strong>UPI/Net Banking:</strong> 5-7 business days</li>
        <li><strong>Wallet Payments:</strong> 3-5 business days</li>
      </ul>
      <p>
        Refund timelines may vary depending on your bank or payment provider.
      </p>

      <h2>5. Partial Refunds</h2>
      <p>
        In certain cases, we may issue partial refunds if:
      </p>
      <ul>
        <li>Part of the service was delivered successfully</li>
        <li>The product shows signs of use</li>
        <li>Items were not returned in original condition</li>
      </ul>

      <h2>6. Failed Transactions</h2>
      <p>
        If payment was deducted but the order was not confirmed, the amount
        will be automatically refunded within <strong>5-7 business days</strong>.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        For refund-related queries, contact us at:{" "}
        <a href="mailto:info@mythrealitytech.com">info@mythrealitytech.com</a>
      </p>
    </div>
  );
}