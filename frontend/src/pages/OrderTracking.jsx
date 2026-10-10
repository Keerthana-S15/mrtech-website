import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OrderTracking.css";
// Same rule the dashboard uses, so both surfaces agree on what is cancellable.
import { canCancelOrder, cancelTimeLeft } from "../utils/cancelRules";

const OrderTracking = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const receivedOrderId = location.state?.orderId || queryParams.get("orderId") || "";

  const [orderId, setOrderId] = useState(receivedOrderId);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cancelling from here. Tracking needs only an order id, so the customer
  // proves the order is theirs by typing the email it was placed with — the
  // tracking response deliberately does not contain it.
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelEmail, setCancelEmail] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelDone, setCancelDone] = useState("");

  const API_BASE_URL = "/api";

  const fetchOrderDetails = async (searchOrderId) => {
    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/track/${searchOrderId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.order) {
        setOrderData(data.order);
        setError("");
      } else {
        setError("⚠️ Order not found. Please check your Order ID.");
        setOrderData(null);
      }
    } catch (error) {
      if (error.message === "Order not found") {
        setError("⚠️ Order not found. Please check your Order ID.");
      } else {
        setError("❌ Unable to connect to server. Please check if backend is running.");
      }
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receivedOrderId) {
      fetchOrderDetails(receivedOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedOrderId]);

  const handleTrack = () => {
    if (!orderId.trim()) {
      setError("⚠️ Please enter an Order ID");
      return;
    }
    // a fresh lookup starts a fresh cancellation
    setCancelOpen(false);
    setCancelEmail("");
    setCancelError("");
    setCancelDone("");
    fetchOrderDetails(orderId);
  };

  const handleCancelOrder = async () => {
    const email = cancelEmail.trim();
    if (!email) {
      setCancelError("Enter the email address this order was placed with.");
      return;
    }

    setCancelling(true);
    setCancelError("");

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderData.orderId}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        // 403 means the email did not match the order. Say so plainly rather
        // than hinting at what the right address might be.
        setCancelError(
          response.status === 403
            ? "That email does not match this order."
            : data.error || "Could not cancel this order. Please try again."
        );
        return;
      }

      setOrderData((prev) => (prev ? { ...prev, orderStatus: "cancelled" } : prev));
      setCancelOpen(false);
      setCancelEmail("");
      setCancelDone("Your order has been cancelled. A confirmation email is on its way.");
    } catch {
      setCancelError("Network error. Check your connection and try again.");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusStages = () => {
    const allStages = ["pending", "processing", "confirmed", "shipped", "delivered"];
    const currentStatus = orderData?.orderStatus?.toLowerCase() || "";
    const currentIndex = allStages.indexOf(currentStatus);

    return {
      stages: ["Pending", "Processing", "Confirmed", "Shipped", "Delivered"],
      currentIndex: currentIndex
    };
  };

  const { stages, currentIndex } = orderData ? getStatusStages() : { stages: [], currentIndex: -1 };

  return (
    <div className="tracking-page">
      <div className="tracking-card">
        <h1>📦 Order Tracking</h1>
        <p className="subtitle">Track your order status and delivery updates.</p>

        <div className="tracking-form">
          <input
            type="text"
            placeholder="Enter your Order ID (e.g. ORD1762504859625)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleTrack()}
          />
          <button onClick={handleTrack} disabled={loading}>
            {loading ? "Searching..." : "Track Order"}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        )}

        {orderData && !loading && (
          <div className="order-details">
            <h2>Order #{orderData.orderId}</h2>
            <p><strong>Date:</strong> {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}</p>
            <p><strong>Customer:</strong> {orderData.customerName}</p>
            <p><strong>Payment:</strong> {orderData.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {orderData.paymentStatus}</p>
            <p><strong>Total:</strong> ₹{orderData.totalAmount?.toLocaleString('en-IN')}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${orderData.orderStatus}`}>{orderData.orderStatus}</span></p>

            {cancelDone && <p className="cancel-track-done">✅ {cancelDone}</p>}

            {/* Offered only inside the 24-hour window and only while the order
                can still be stopped; the server re-checks both. Tracking needs
                nothing but an order id, so the customer proves the order is
                theirs by typing the email it was placed with. */}
            {canCancelOrder(orderData) && !cancelDone && (
              <div className="cancel-track-box">
                {!cancelOpen ? (
                  <>
                    <button
                      type="button"
                      className="cancel-track-btn"
                      onClick={() => { setCancelOpen(true); setCancelError(""); }}
                    >
                      🚫 Cancel Order
                    </button>
                    <span className="cancel-track-hint">
                      ⏳ {cancelTimeLeft(orderData)}
                    </span>
                  </>
                ) : (
                  <div className="cancel-track-confirm">
                    <h3>Cancel this order?</h3>
                    <p>
                      Order <strong>#{orderData.orderId}</strong> for{" "}
                      <strong>₹{(orderData.totalAmount || 0).toLocaleString("en-IN")}</strong>{" "}
                      will be cancelled. This cannot be undone.
                    </p>
                    <label className="cancel-track-field">
                      <span>Confirm the email used for this order</span>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={cancelEmail}
                        disabled={cancelling}
                        onChange={(e) => { setCancelEmail(e.target.value); setCancelError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleCancelOrder()}
                      />
                    </label>

                    {String(orderData.paymentMethod || "").toUpperCase() !== "COD" && (
                      <p className="cancel-track-note">
                        This order was paid online. Our team will contact you about the refund.
                      </p>
                    )}

                    {cancelError && <p className="cancel-track-error">⚠️ {cancelError}</p>}

                    <div className="cancel-track-actions">
                      <button
                        type="button"
                        className="cancel-track-keep"
                        onClick={() => { setCancelOpen(false); setCancelError(""); setCancelEmail(""); }}
                        disabled={cancelling}
                      >
                        Keep Order
                      </button>
                      <button
                        type="button"
                        className="cancel-track-confirm-btn"
                        onClick={handleCancelOrder}
                        disabled={cancelling || !cancelEmail.trim()}
                      >
                        {cancelling ? "Cancelling…" : "Yes, Cancel Order"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="tracking-progress">
              {stages.map((stage, index) => (
                <div
                  key={stage}
                  className={`stage ${index <= currentIndex ? "active" : ""} ${index === currentIndex ? "current" : ""}`}
                >
                  <div className="dot">
                    {index <= currentIndex ? "✓" : ""}
                  </div>
                  <p>{stage}</p>
                </div>
              ))}
            </div>

            <div className="address-box">
              <h3>📍 Delivery Address</h3>
              <p>{orderData.shippingAddress?.address || orderData.shippingAddress?.line1 || "N/A"}</p>
              <p>
                {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} - {orderData.shippingAddress?.pincode}
              </p>
              {orderData.estimatedDelivery && (
                <p><strong>Est. Delivery:</strong> {orderData.estimatedDelivery}</p>
              )}
              {orderData.phone && (
                <p><strong>Contact:</strong> {orderData.phone}</p>
              )}
            </div>

            <div className="items-box">
              <h3>🛍️ Items Ordered ({orderData.items?.length || 0})</h3>
              <ul>
                {orderData.items?.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.name}</span>
                    <span>
                      ₹{item.price?.toLocaleString('en-IN')} × {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{orderData.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {orderData.shipping && (
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>₹{orderData.shipping?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {orderData.tax && (
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>₹{orderData.tax?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span><strong>Total:</strong></span>
                  <span><strong>₹{orderData.totalAmount?.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!orderData && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>Enter your Order ID to track your order</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;