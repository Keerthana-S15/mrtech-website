import React from "react";
import "../LegalPage.css";

export default function CancellationPolicy() {
  return (
    <div className="legal-page">
      <h1>Cancellation Policy</h1>
      <p className="last-updated">Last Updated: November 25, 2024</p>

      <p>
        This Cancellation Policy outlines the terms under which orders and
        services can be cancelled at Myth Reality Technologies Pvt. Ltd.
      </p>

      <h2>1. Order Cancellation by Customer</h2>
      <p>You can cancel your order under the following conditions:</p>
      <ul>
        <li><strong>Before Shipment:</strong> Full refund will be issued</li>
        <li><strong>After Shipment:</strong> Cancellation not allowed; refer to our Refund Policy for returns</li>
        <li><strong>Digital Products:</strong> Cancellation allowed within <strong>24 hours</strong> if not accessed</li>
        <li><strong>Services:</strong> Cancellation allowed up to <strong>48 hours</strong> before the scheduled service date</li>
      </ul>

      <h2>2. How to Cancel an Order</h2>
      <p>To cancel your order:</p>
      <ul>
        <li>Log in to your account and go to "My Orders"</li>
        <li>Select the order you wish to cancel</li>
        <li>Click "Cancel Order" and provide a reason</li>
        <li>Alternatively, email us at <a href="mailto:info@mythrealitytech.com">info@mythrealitytech.com</a> with your order details</li>
      </ul>

      <h2>3. Cancellation by Company</h2>
      <p>We reserve the right to cancel orders in the following cases:</p>
      <ul>
        <li>Product is out of stock or unavailable</li>
        <li>Pricing or product information error</li>
        <li>Payment issues or suspected fraud</li>
        <li>Delivery is not possible to the specified location</li>
      </ul>
      <p>
        If we cancel your order, a full refund will be processed within{" "}
        <strong>5-7 business days</strong>.
      </p>

      <h2>4. Cancellation Charges</h2>
      <p>
        In certain cases, cancellation charges may apply:
      </p>
      <ul>
        <li><strong>COD Orders:</strong> No cancellation charges</li>
        <li><strong>Prepaid Orders:</strong> No charges if cancelled before shipment</li>
        <li><strong>Services:</strong> Cancellation within 24 hours of scheduled date may incur a <strong>20% charge</strong></li>
        <li><strong>Customized Products:</strong> Non-cancellable after production starts</li>
      </ul>

      <h2>5. Refund After Cancellation</h2>
      <p>
        Once your cancellation is confirmed, refunds will be processed as per
        our <a href="/refund-policy">Refund Policy</a>.
      </p>

      <h2>6. Non-Cancellable Items</h2>
      <p>The following cannot be cancelled once ordered:</p>
      <ul>
        <li>Personalized or made-to-order products</li>
        <li>Digital downloads that have been accessed</li>
        <li>Services that have already commenced</li>
      </ul>

      <h2>7. Contact Us</h2>
      <p>
        For cancellation assistance, reach out to us at:{" "}
        <a href="mailto:info@mythrealitytech.com">info@mythrealitytech.com</a>
      </p>
    </div>
  );
}