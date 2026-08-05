
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state || {};
  const {
    name = "Customer",
    totalAmount = 0,
    paymentMethod = "COD",
    address = {},
    cartItems = [],
  } = orderData;

  const orderId = Math.floor(Math.random() * 1000000);

  // 🔗 Go to Tracking Page function
  const goToTracking = () => {
    navigate("/track-order", { state: { orderId } });
  };

  return (
    <div className="order-confirmation">
      <div className="confirmation-card">
        <div className="success-icon">✅</div>
        <h1>Thank You for Your Purchase!</h1>
        <p className="confirmation-subtitle">
          Your order has been placed successfully.
        </p>

        {/* 🧾 Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p><strong>Order ID:</strong> #{orderId}</p>
          <p><strong>Customer Name:</strong> {name}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
          <p><strong>Estimated Delivery:</strong> 3–5 business days</p>
        </div>

        {/* 📦 Shipping Address */}
        <div className="address-section">
          <h3>Shipping Address</h3>
          <p>{address.fullName || "N/A"}</p>
          <p>{address.street || ""}</p>
          <p>
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p>📞 {address.phone}</p>
        </div>

        {/* 🛍️ Items Ordered */}
        {cartItems.length > 0 && (
          <div className="items-section">
            <h3>Items Ordered</h3>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  <span>{item.image} {item.name}</span>
                  <span>₹{item.price} × {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔘 Buttons */}
        <div className="confirmation-buttons">
          <Link to="/purchase" className="btn-primary">
            Continue Shopping
          </Link>
          <button onClick={goToTracking} className="btn-secondary">
            Track My Order
          </button>
        </div>

        <p className="confirmation-note">
          You will receive a confirmation email and tracking details shortly.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
