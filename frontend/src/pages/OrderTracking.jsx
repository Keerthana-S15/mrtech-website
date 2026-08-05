// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import "./OrderTracking.css";

// const OrderTracking = () => {
//   const location = useLocation();
//   const receivedOrderId = location.state?.orderId || "";
  
//   const [orderId, setOrderId] = useState(receivedOrderId);
//   const [orderData, setOrderData] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ API Base URL
//   const API_BASE_URL = "http://localhost:3000/api";

//   // 🔥 Real API call function
//   const fetchOrderDetails = async (searchOrderId) => {
//     setLoading(true);
//     setError("");
//     setOrderData(null);

//     try {
//       console.log("🔍 Fetching order:", searchOrderId);

//       const response = await fetch(
//         `${API_BASE_URL}/orders/track/${searchOrderId}`
//       );

//       console.log("📡 Response status:", response.status);

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error("Order not found");
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("📦 Response data:", data);

//       if (data.success && data.order) {
//         setOrderData(data.order);
//         setError("");
//       } else {
//         setError("⚠️ Order not found. Please check your Order ID.");
//         setOrderData(null);
//       }
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       if (error.message === "Order not found") {
//         setError("⚠️ Order not found. Please check your Order ID.");
//       } else {
//         setError("❌ Unable to connect to server. Please check if backend is running.");
//       }
//       setOrderData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧠 Auto-load if orderId received from dashboard
//   useEffect(() => {
//     if (receivedOrderId) {
//       fetchOrderDetails(receivedOrderId);
//     }
//   }, [receivedOrderId]);

//   // 📍 Track button click
//   const handleTrack = () => {
//     if (!orderId.trim()) {
//       setError("⚠️ Please enter an Order ID");
//       return;
//     }
//     fetchOrderDetails(orderId);
//   };

//   // 🎨 Status stages mapping
//   const getStatusStages = () => {
//     const allStages = ["pending", "processing", "confirmed", "shipped", "delivered"];
//     const currentStatus = orderData?.orderStatus?.toLowerCase() || "";
//     const currentIndex = allStages.indexOf(currentStatus);
    
//     return {
//       stages: ["Pending", "Processing", "Confirmed", "Shipped", "Delivered"],
//       currentIndex: currentIndex
//     };
//   };

//   const { stages, currentIndex } = orderData ? getStatusStages() : { stages: [], currentIndex: -1 };

//   return (
//     <div className="tracking-page">
//       <div className="tracking-card">
//         <h1>📦 Order Tracking</h1>
//         <p className="subtitle">Track your order status and delivery updates.</p>

//         {/* 🔍 Search Box */}
//         <div className="tracking-form">
//           <input
//             type="text"
//             placeholder="Enter your Order ID (e.g. ORD1762504859625)"
//             value={orderId}
//             onChange={(e) => setOrderId(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleTrack()}
//           />
//           <button onClick={handleTrack} disabled={loading}>
//             {loading ? "Searching..." : "Track Order"}
//           </button>
//         </div>

//         {/* ⚠️ Error Message */}
//         {error && <p className="error-text">{error}</p>}

//         {/* ⏳ Loading State */}
//         {loading && (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading order details...</p>
//           </div>
//         )}

//         {/* 📄 Order Details */}
//         {orderData && !loading && (
//           <div className="order-details">
//             <h2>Order #{orderData.orderId}</h2>
//             <p><strong>Date:</strong> {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
//               day: 'numeric',
//               month: 'short',
//               year: 'numeric'
//             })}</p>
//             <p><strong>Customer:</strong> {orderData.customerName}</p>
//             <p><strong>Payment:</strong> {orderData.paymentMethod}</p>
//             <p><strong>Payment Status:</strong> {orderData.paymentStatus}</p>
//             <p><strong>Total:</strong> ₹{orderData.totalAmount?.toLocaleString('en-IN')}</p>
//             <p><strong>Status:</strong> <span className={`status-badge ${orderData.orderStatus}`}>{orderData.orderStatus}</span></p>

//             {/* 🚀 Progress Bar */}
//             <div className="tracking-progress">
//               {stages.map((stage, index) => (
//                 <div
//                   key={stage}
//                   className={`stage ${index <= currentIndex ? "active" : ""} ${index === currentIndex ? "current" : ""}`}
//                 >
//                   <div className="dot">
//                     {index <= currentIndex ? "✓" : ""}
//                   </div>
//                   <p>{stage}</p>
//                 </div>
//               ))}
//             </div>

//             {/* 📍 Delivery Address */}
//             <div className="address-box">
//               <h3>📍 Delivery Address</h3>
//               <p>{orderData.shippingAddress?.address || orderData.shippingAddress?.line1 || "N/A"}</p>
//               <p>
//                 {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} - {orderData.shippingAddress?.pincode}
//               </p>
//               {orderData.estimatedDelivery && (
//                 <p><strong>Est. Delivery:</strong> {orderData.estimatedDelivery}</p>
//               )}
//               {orderData.phone && (
//                 <p><strong>Contact:</strong> {orderData.phone}</p>
//               )}
//             </div>

//             {/* 🛍️ Items Ordered */}
//             <div className="items-box">
//               <h3>🛍️ Items Ordered ({orderData.items?.length || 0})</h3>
//               <ul>
//                 {orderData.items?.map((item, idx) => (
//                   <li key={idx}>
//                     <span>{item.name}</span>
//                     <span>
//                       ₹{item.price?.toLocaleString('en-IN')} × {item.quantity}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
              
//               {/* Order Summary */}
//               <div className="order-summary">
//                 <div className="summary-row">
//                   <span>Subtotal:</span>
//                   <span>₹{orderData.subtotal?.toLocaleString('en-IN')}</span>
//                 </div>
//                 {orderData.shipping && (
//                   <div className="summary-row">
//                     <span>Shipping:</span>
//                     <span>₹{orderData.shipping?.toLocaleString('en-IN')}</span>
//                   </div>
//                 )}
//                 {orderData.tax && (
//                   <div className="summary-row">
//                     <span>Tax:</span>
//                     <span>₹{orderData.tax?.toLocaleString('en-IN')}</span>
//                   </div>
//                 )}
//                 <div className="summary-row total">
//                   <span><strong>Total:</strong></span>
//                   <span><strong>₹{orderData.totalAmount?.toLocaleString('en-IN')}</strong></span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 📭 Empty State */}
//         {!orderData && !loading && !error && (
//           <div className="empty-state">
//             <div className="empty-icon">📦</div>
//             <p>Enter your Order ID to track your order</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderTracking;






import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OrderTracking.css";

const OrderTracking = () => {
  const location = useLocation();

  // ✅ NEW: Support orderId coming from either:
  // 1) React Router state (when navigated from within the app), OR
  // 2) A URL query param like /track-order?orderId=ORD123 (used in emails)
  const queryParams = new URLSearchParams(location.search);
  const receivedOrderId = location.state?.orderId || queryParams.get("orderId") || "";

  const [orderId, setOrderId] = useState(receivedOrderId);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ API Base URL
  const API_BASE_URL = "http://localhost:3000/api";

  // 🔥 Real API call function
  const fetchOrderDetails = async (searchOrderId) => {
    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      console.log("🔍 Fetching order:", searchOrderId);

      const response = await fetch(
        `${API_BASE_URL}/orders/track/${searchOrderId}`
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (data.success && data.order) {
        setOrderData(data.order);
        setError("");
      } else {
        setError("⚠️ Order not found. Please check your Order ID.");
        setOrderData(null);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
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

  // 🧠 Auto-load if orderId received from dashboard OR from an email link
  useEffect(() => {
    if (receivedOrderId) {
      fetchOrderDetails(receivedOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedOrderId]);

  // 📍 Track button click
  const handleTrack = () => {
    if (!orderId.trim()) {
      setError("⚠️ Please enter an Order ID");
      return;
    }
    fetchOrderDetails(orderId);
  };

  // 🎨 Status stages mapping
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

        {/* 🔍 Search Box */}
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

        {/* ⚠️ Error Message */}
        {error && <p className="error-text">{error}</p>}

        {/* ⏳ Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        )}

        {/* 📄 Order Details */}
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

            {/* 🚀 Progress Bar */}
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

            {/* 📍 Delivery Address */}
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

            {/* 🛍️ Items Ordered */}
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

              {/* Order Summary */}
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

        {/* 📭 Empty State */}
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