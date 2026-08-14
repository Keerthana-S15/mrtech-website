// // src/pages/Checkout.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import "./Checkout.css";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, clearCart, getTotalPrice } = useCart();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [shippingInfo, setShippingInfo] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     addressType: "Home"
//   });

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [cardDetails, setCardDetails] = useState({
//     cardNumber: "",
//     cardName: "",
//     expiryDate: "",
//     cvv: ""
//   });

//   const [upiId, setUpiId] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [pincodeChecking, setPincodeChecking] = useState(false);

//   // ✅ NEW: Auto-fill City & State from Pincode using India Post's free public API
//   const lookupPincode = async (pincode) => {
//     setPincodeChecking(true);
//     try {
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();

//       if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
//         const office = data[0].PostOffice[0];
//         setShippingInfo((prev) => ({
//           ...prev,
//           city: office.District,
//           state: office.State,
//         }));
//       }
//     } catch (err) {
//       console.error("Pincode lookup failed:", err);
//       // Silent failure — user can still type city/state manually
//     } finally {
//       setPincodeChecking(false);
//     }
//   };

//   const subtotal = getTotalPrice();
//   const shipping = subtotal > 5000 ? 0 : 100;
//   const tax = Math.round(subtotal * 0.18);
//   const total = subtotal + shipping + tax;

//   React.useEffect(() => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       navigate("/purchase");
//     }
//   }, [cartItems, navigate]);

//   const handleShippingSubmit = (e) => {
//     e.preventDefault();
//     if (validateShipping()) {
//       setCurrentStep(2);
//     }
//   };

//   const validateShipping = () => {
//     const { fullName, email, phone, address, city, state, pincode } = shippingInfo;
//     if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
//       alert("Please fill all shipping details");
//       return false;
//     }
//     if (!/^\d{10}$/.test(phone)) {
//       alert("Please enter valid 10 digit phone number");
//       return false;
//     }
//     if (!/^\d{6}$/.test(pincode)) {
//       alert("Please enter valid 6 digit pincode");
//       return false;
//     }
//     return true;
//   };

//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();
//     if (validatePayment()) {
//       setCurrentStep(3);
//     }
//   };

//   const validatePayment = () => {
//     if (paymentMethod === "Card") {
//       const { cardNumber, cardName, expiryDate, cvv } = cardDetails;
//       if (!cardNumber || !cardName || !expiryDate || !cvv) {
//         alert("Please fill all card details");
//         return false;
//       }
//       if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
//         alert("Please enter valid 16 digit card number");
//         return false;
//       }
//       if (!/^\d{3,4}$/.test(cvv)) {
//         alert("Please enter valid CVV");
//         return false;
//       }
//     } else if (paymentMethod === "UPI" && !upiId) {
//       alert("Please enter UPI ID");
//       return false;
//     }
//     return true;
//   };

//   // 🔥 Place Order with Backend API
//   const handlePlaceOrder = async () => {
//     if (!agreeTerms) {
//       alert("Please agree to terms and conditions");
//       return;
//     }

//     setLoading(true);

//     try {
//       const orderData = {
//         customerName: shippingInfo.fullName,
//         email: shippingInfo.email,
//         phone: shippingInfo.phone,
//         items: cartItems,
//         shippingAddress: {
//           fullName: shippingInfo.fullName,
//           address: shippingInfo.address,
//           city: shippingInfo.city,
//           state: shippingInfo.state,
//           pincode: shippingInfo.pincode,
//           phone: shippingInfo.phone,
//           addressType: shippingInfo.addressType,
//         },
//         paymentMethod: paymentMethod,
//         subtotal: subtotal,
//         shipping: shipping,
//         tax: tax,
//         totalAmount: total,
//       };

//       // ✅ FIX: relative path instead of hardcoded http://localhost:3000
//       const response = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert("Order placed successfully! 🎉");
        
//         clearCart();
        
//         navigate("/order-confirmation", {
//           state: {
//             orderId: result.orderId,
//             customerName: shippingInfo.fullName,
//             totalAmount: total,
//             paymentMethod: paymentMethod,
//             address: shippingInfo,
//             cartItems: cartItems,
//           },
//         });
//       } else {
//         alert("Order failed: " + (result.error || "Unknown error"));
//       }
//     } catch (error) {
//       console.error("Order Error:", error);
//       alert("Failed to place order. Please try again. Error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingInfo({ ...shippingInfo, [name]: value });
//   };

//   const handleCardInputChange = (e) => {
//     const { name, value } = e.target;
//     setCardDetails({ ...cardDetails, [name]: value });
//   };

//   return (
//     <div className="checkout-page">
//       {/* Progress Bar */}
//       <div className="checkout-header">
//         <div className="container">
//           <div className="progress-steps">
//             <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
//               <div className="step-number">1</div>
//               <div className="step-label">Shipping</div>
//             </div>
//             <div className="step-line"></div>
//             <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
//               <div className="step-number">2</div>
//               <div className="step-label">Payment</div>
//             </div>
//             <div className="step-line"></div>
//             <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
//               <div className="step-number">3</div>
//               <div className="step-label">Review</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="checkout-container">
//         <div className="checkout-content">
//           {/* Left Side - Forms */}
//           <div className="checkout-main">
//             {/* Step 1: Shipping Information */}
//             {currentStep === 1 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">📦 Shipping Information</h2>
//                 <form onSubmit={handleShippingSubmit}>
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Full Name *</label>
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={shippingInfo.fullName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Email Address *</label>
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="your.email@example.com"
//                         value={shippingInfo.email}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Phone Number *</label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="10 digit phone number"
//                         value={shippingInfo.phone}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
//                           setShippingInfo({ ...shippingInfo, phone: digitsOnly });
//                         }}
//                         maxLength="10"
//                         inputMode="numeric"
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Address Type</label>
//                       <select
//                         name="addressType"
//                         value={shippingInfo.addressType}
//                         onChange={handleInputChange}
//                       >
//                         <option value="Home">Home</option>
//                         <option value="Office">Office</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label>Complete Address *</label>
//                     <textarea
//                       name="address"
//                       placeholder="House/Flat No, Street, Landmark"
//                       value={shippingInfo.address}
//                       onChange={handleInputChange}
//                       rows="3"
//                       required
//                     ></textarea>
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>City *</label>
//                       <input
//                         type="text"
//                         name="city"
//                         placeholder="Enter city"
//                         value={shippingInfo.city}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>State *</label>
//                       <input
//                         type="text"
//                         name="state"
//                         placeholder="Enter state"
//                         value={shippingInfo.state}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Pincode * {pincodeChecking && <span style={{ fontSize: 12, color: "#888" }}>(checking...)</span>}</label>
//                       <input
//                         type="text"
//                         name="pincode"
//                         placeholder="6 digits"
//                         value={shippingInfo.pincode}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
//                           setShippingInfo({ ...shippingInfo, pincode: digitsOnly });
//                           if (digitsOnly.length === 6) {
//                             lookupPincode(digitsOnly);
//                           }
//                         }}
//                         maxLength="6"
//                         inputMode="numeric"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <button type="submit" className="continue-btn">
//                     Continue to Payment →
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Step 2: Payment Method */}
//             {currentStep === 2 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">💳 Payment Method</h2>
//                 <form onSubmit={handlePaymentSubmit}>
//                   <div className="payment-methods">
//                     <div
//                       className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("COD")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="COD"
//                         checked={paymentMethod === "COD"}
//                         onChange={() => setPaymentMethod("COD")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">💵</span>
//                         <div>
//                           <strong>Cash on Delivery</strong>
//                           <p>Pay when you receive the order</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`payment-option ${paymentMethod === "Card" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("Card")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="Card"
//                         checked={paymentMethod === "Card"}
//                         onChange={() => setPaymentMethod("Card")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">💳</span>
//                         <div>
//                           <strong>Credit/Debit Card</strong>
//                           <p>Secure payment via card</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`payment-option ${paymentMethod === "UPI" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("UPI")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="UPI"
//                         checked={paymentMethod === "UPI"}
//                         onChange={() => setPaymentMethod("UPI")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">📱</span>
//                         <div>
//                           <strong>UPI Payment</strong>
//                           <p>Pay via Google Pay, PhonePe, Paytm</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Details */}
//                   {paymentMethod === "Card" && (
//                     <div className="card-details">
//                       <div className="form-group">
//                         <label>Card Number</label>
//                         <input
//                           type="text"
//                           name="cardNumber"
//                           placeholder="1234 5678 9012 3456"
//                           value={cardDetails.cardNumber}
//                           onChange={handleCardInputChange}
//                           maxLength="19"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>Cardholder Name</label>
//                         <input
//                           type="text"
//                           name="cardName"
//                           placeholder="Name on card"
//                           value={cardDetails.cardName}
//                           onChange={handleCardInputChange}
//                         />
//                       </div>
//                       <div className="form-row">
//                         <div className="form-group">
//                           <label>Expiry Date</label>
//                           <input
//                             type="text"
//                             name="expiryDate"
//                             placeholder="MM/YY"
//                             value={cardDetails.expiryDate}
//                             onChange={handleCardInputChange}
//                             maxLength="5"
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>CVV</label>
//                           <input
//                             type="password"
//                             name="cvv"
//                             placeholder="123"
//                             value={cardDetails.cvv}
//                             onChange={handleCardInputChange}
//                             maxLength="4"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* UPI ID */}
//                   {paymentMethod === "UPI" && (
//                     <div className="upi-details">
//                       <div className="form-group">
//                         <label>UPI ID</label>
//                         <input
//                           type="text"
//                           placeholder="yourname@upi"
//                           value={upiId}
//                           onChange={(e) => setUpiId(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="checkout-actions">
//                     <button
//                       type="button"
//                       className="back-btn"
//                       onClick={() => setCurrentStep(1)}
//                     >
//                       ← Back
//                     </button>
//                     <button type="submit" className="continue-btn">
//                       Review Order →
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* Step 3: Review & Confirm */}
//             {currentStep === 3 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">✅ Review Your Order</h2>

//                 {/* Shipping Summary */}
//                 <div className="review-section">
//                   <h3>📦 Shipping Address</h3>
//                   <div className="review-card">
//                     <p><strong>{shippingInfo.fullName}</strong></p>
//                     <p>{shippingInfo.address}</p>
//                     <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
//                     <p>Phone: {shippingInfo.phone}</p>
//                     <p>Email: {shippingInfo.email}</p>
//                   </div>
//                 </div>

//                 {/* Payment Summary */}
//                 <div className="review-section">
//                   <h3>💳 Payment Method</h3>
//                   <div className="review-card">
//                     <p><strong>{paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod === "Card" ? "Credit/Debit Card" : "UPI Payment"}</strong></p>
//                     {paymentMethod === "Card" && <p>Card ending in ****{cardDetails.cardNumber.slice(-4)}</p>}
//                     {paymentMethod === "UPI" && <p>UPI ID: {upiId}</p>}
//                   </div>
//                 </div>

//                 {/* Items Summary */}
//                 <div className="review-section">
//                   <h3>🛒 Order Items</h3>
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="review-item">
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
//                         />
//                       ) : (
//                         <span className="item-emoji">📦</span>
//                       )}
//                       <div className="item-details">
//                         <strong>{item.name}</strong>
//                         <p>Qty: {item.quantity} × ₹{item.price}</p>
//                       </div>
//                       <div className="item-total">₹{item.price * item.quantity}</div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Terms & Conditions */}
//                 <div className="terms-section">
//                   <label className="checkbox-label">
//                     <input
//                       type="checkbox"
//                       checked={agreeTerms}
//                       onChange={(e) => setAgreeTerms(e.target.checked)}
//                     />
//                     <span>I agree to the Terms & Conditions and Privacy Policy</span>
//                   </label>
//                 </div>

//                 <div className="checkout-actions">
//                   <button
//                     type="button"
//                     className="back-btn"
//                     onClick={() => setCurrentStep(2)}
//                   >
//                     ← Back
//                   </button>
//                   <button
//                     className="place-order-btn"
//                     onClick={handlePlaceOrder}
//                     disabled={!agreeTerms || loading}
//                   >
//                     {loading ? "Processing..." : `Place Order - ₹${total} 🎉`}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Side - Order Summary */}
//           <div className="order-summary">
//             <h3>Order Summary</h3>
            
//             <div className="summary-items">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="summary-item">
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
//                     />
//                   ) : (
//                     <span>📦</span>
//                   )}
//                   <div className="item-info">
//                     <p>{item.name}</p>
//                     <small>Qty: {item.quantity}</small>
//                   </div>
//                   <span className="item-price">₹{item.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="summary-divider"></div>

//             <div className="summary-row">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>
//             <div className="summary-row">
//               <span>Shipping</span>
//               <span className={shipping === 0 ? "free-shipping" : ""}>
//                 {shipping === 0 ? "FREE" : `₹${shipping}`}
//               </span>
//             </div>
//             <div className="summary-row">
//               <span>Tax (18% GST)</span>
//               <span>₹{tax}</span>
//             </div>

//             <div className="summary-divider"></div>

//             <div className="summary-total">
//               <span>Total Amount</span>
//               <span>₹{total}</span>
//             </div>

//             {shipping > 0 && (
//               <div className="free-shipping-banner">
//                 💡 Add ₹{5000 - subtotal} more for FREE shipping!
//               </div>
//             )}

//             <div className="secure-badge">
//               <span>🔒</span>
//               <div>
//                 <strong>Secure Checkout</strong>
//                 <p>Your data is protected</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;







// // src/pages/Checkout.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import LocationMap from "./LocationMap";
// import "./Checkout.css";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, clearCart, getTotalPrice } = useCart();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [shippingInfo, setShippingInfo] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     addressType: "Home"
//   });

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [cardDetails, setCardDetails] = useState({
//     cardNumber: "",
//     cardName: "",
//     expiryDate: "",
//     cvv: ""
//   });

//   const [upiId, setUpiId] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [pincodeChecking, setPincodeChecking] = useState(false);

//   // ✅ NEW: Auto-fill City & State from Pincode using India Post's free public API
//   const lookupPincode = async (pincode) => {
//     setPincodeChecking(true);
//     try {
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();

//       if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
//         const office = data[0].PostOffice[0];
//         setShippingInfo((prev) => ({
//           ...prev,
//           city: office.District,
//           state: office.State,
//         }));
//       }
//     } catch (err) {
//       console.error("Pincode lookup failed:", err);
//       // Silent failure — user can still type city/state manually
//     } finally {
//       setPincodeChecking(false);
//     }
//   };

//   // ✅ NEW: Auto-fill address when user picks a location on the map
//   const handleLocationSelect = (location) => {
//     setShippingInfo((prev) => ({
//       ...prev,
//       address: location.address,
//     }));
//   };

//   const subtotal = getTotalPrice();
//   const shipping = subtotal > 5000 ? 0 : 100;
//   const tax = Math.round(subtotal * 0.18);
//   const total = subtotal + shipping + tax;

//   React.useEffect(() => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       navigate("/purchase");
//     }
//   }, [cartItems, navigate]);

//   const handleShippingSubmit = (e) => {
//     e.preventDefault();
//     if (validateShipping()) {
//       setCurrentStep(2);
//     }
//   };

//   const validateShipping = () => {
//     const { fullName, email, phone, address, city, state, pincode } = shippingInfo;
//     if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
//       alert("Please fill all shipping details");
//       return false;
//     }
//     if (!/^\d{10}$/.test(phone)) {
//       alert("Please enter valid 10 digit phone number");
//       return false;
//     }
//     if (!/^\d{6}$/.test(pincode)) {
//       alert("Please enter valid 6 digit pincode");
//       return false;
//     }
//     return true;
//   };

//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();
//     if (validatePayment()) {
//       setCurrentStep(3);
//     }
//   };

//   const validatePayment = () => {
//     if (paymentMethod === "Card") {
//       const { cardNumber, cardName, expiryDate, cvv } = cardDetails;
//       if (!cardNumber || !cardName || !expiryDate || !cvv) {
//         alert("Please fill all card details");
//         return false;
//       }
//       if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
//         alert("Please enter valid 16 digit card number");
//         return false;
//       }
//       if (!/^\d{3,4}$/.test(cvv)) {
//         alert("Please enter valid CVV");
//         return false;
//       }
//     } else if (paymentMethod === "UPI" && !upiId) {
//       alert("Please enter UPI ID");
//       return false;
//     }
//     return true;
//   };

//   // 🔥 Place Order with Backend API
//   const handlePlaceOrder = async () => {
//     if (!agreeTerms) {
//       alert("Please agree to terms and conditions");
//       return;
//     }

//     setLoading(true);

//     try {
//       const orderData = {
//         customerName: shippingInfo.fullName,
//         email: shippingInfo.email,
//         phone: shippingInfo.phone,
//         items: cartItems,
//         shippingAddress: {
//           fullName: shippingInfo.fullName,
//           address: shippingInfo.address,
//           city: shippingInfo.city,
//           state: shippingInfo.state,
//           pincode: shippingInfo.pincode,
//           phone: shippingInfo.phone,
//           addressType: shippingInfo.addressType,
//         },
//         paymentMethod: paymentMethod,
//         subtotal: subtotal,
//         shipping: shipping,
//         tax: tax,
//         totalAmount: total,
//       };

//       // ✅ FIX: relative path instead of hardcoded http://localhost:3000
//       const response = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert("Order placed successfully! 🎉");
        
//         clearCart();
        
//         navigate("/order-confirmation", {
//           state: {
//             orderId: result.orderId,
//             customerName: shippingInfo.fullName,
//             totalAmount: total,
//             paymentMethod: paymentMethod,
//             address: shippingInfo,
//             cartItems: cartItems,
//           },
//         });
//       } else {
//         alert("Order failed: " + (result.error || "Unknown error"));
//       }
//     } catch (error) {
//       console.error("Order Error:", error);
//       alert("Failed to place order. Please try again. Error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingInfo({ ...shippingInfo, [name]: value });
//   };

//   const handleCardInputChange = (e) => {
//     const { name, value } = e.target;
//     setCardDetails({ ...cardDetails, [name]: value });
//   };

//   return (
//     <div className="checkout-page">
//       {/* Progress Bar */}
//       <div className="checkout-header">
//         <div className="container">
//           <div className="progress-steps">
//             <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
//               <div className="step-number">1</div>
//               <div className="step-label">Shipping</div>
//             </div>
//             <div className="step-line"></div>
//             <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
//               <div className="step-number">2</div>
//               <div className="step-label">Payment</div>
//             </div>
//             <div className="step-line"></div>
//             <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
//               <div className="step-number">3</div>
//               <div className="step-label">Review</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="checkout-container">
//         <div className="checkout-content">
//           {/* Left Side - Forms */}
//           <div className="checkout-main">
//             {/* Step 1: Shipping Information */}
//             {currentStep === 1 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">📦 Shipping Information</h2>
//                 <form onSubmit={handleShippingSubmit}>
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Full Name *</label>
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={shippingInfo.fullName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Email Address *</label>
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="your.email@example.com"
//                         value={shippingInfo.email}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Phone Number *</label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="10 digit phone number"
//                         value={shippingInfo.phone}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
//                           setShippingInfo({ ...shippingInfo, phone: digitsOnly });
//                         }}
//                         maxLength="10"
//                         inputMode="numeric"
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Address Type</label>
//                       <select
//                         name="addressType"
//                         value={shippingInfo.addressType}
//                         onChange={handleInputChange}
//                       >
//                         <option value="Home">Home</option>
//                         <option value="Office">Office</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* ✅ NEW: Location picker — search or click on map to auto-fill address below */}
//                   <div className="form-group">
//                     <label>Pick Delivery Location on Map</label>
//                     <LocationMap onLocationSelect={handleLocationSelect} />
//                   </div>

//                   <div className="form-group">
//                     <label>Complete Address *</label>
//                     <textarea
//                       name="address"
//                       placeholder="House/Flat No, Street, Landmark"
//                       value={shippingInfo.address}
//                       onChange={handleInputChange}
//                       rows="3"
//                       required
//                     ></textarea>
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>City *</label>
//                       <input
//                         type="text"
//                         name="city"
//                         placeholder="Enter city"
//                         value={shippingInfo.city}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>State *</label>
//                       <input
//                         type="text"
//                         name="state"
//                         placeholder="Enter state"
//                         value={shippingInfo.state}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Pincode * {pincodeChecking && <span style={{ fontSize: 12, color: "#888" }}>(checking...)</span>}</label>
//                       <input
//                         type="text"
//                         name="pincode"
//                         placeholder="6 digits"
//                         value={shippingInfo.pincode}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
//                           setShippingInfo({ ...shippingInfo, pincode: digitsOnly });
//                           if (digitsOnly.length === 6) {
//                             lookupPincode(digitsOnly);
//                           }
//                         }}
//                         maxLength="6"
//                         inputMode="numeric"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <button type="submit" className="continue-btn">
//                     Continue to Payment →
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Step 2: Payment Method */}
//             {currentStep === 2 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">💳 Payment Method</h2>
//                 <form onSubmit={handlePaymentSubmit}>
//                   <div className="payment-methods">
//                     <div
//                       className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("COD")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="COD"
//                         checked={paymentMethod === "COD"}
//                         onChange={() => setPaymentMethod("COD")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">💵</span>
//                         <div>
//                           <strong>Cash on Delivery</strong>
//                           <p>Pay when you receive the order</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`payment-option ${paymentMethod === "Card" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("Card")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="Card"
//                         checked={paymentMethod === "Card"}
//                         onChange={() => setPaymentMethod("Card")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">💳</span>
//                         <div>
//                           <strong>Credit/Debit Card</strong>
//                           <p>Secure payment via card</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`payment-option ${paymentMethod === "UPI" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("UPI")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="UPI"
//                         checked={paymentMethod === "UPI"}
//                         onChange={() => setPaymentMethod("UPI")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">📱</span>
//                         <div>
//                           <strong>UPI Payment</strong>
//                           <p>Pay via Google Pay, PhonePe, Paytm</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Details */}
//                   {paymentMethod === "Card" && (
//                     <div className="card-details">
//                       <div className="form-group">
//                         <label>Card Number</label>
//                         <input
//                           type="text"
//                           name="cardNumber"
//                           placeholder="1234 5678 9012 3456"
//                           value={cardDetails.cardNumber}
//                           onChange={handleCardInputChange}
//                           maxLength="19"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>Cardholder Name</label>
//                         <input
//                           type="text"
//                           name="cardName"
//                           placeholder="Name on card"
//                           value={cardDetails.cardName}
//                           onChange={handleCardInputChange}
//                         />
//                       </div>
//                       <div className="form-row">
//                         <div className="form-group">
//                           <label>Expiry Date</label>
//                           <input
//                             type="text"
//                             name="expiryDate"
//                             placeholder="MM/YY"
//                             value={cardDetails.expiryDate}
//                             onChange={handleCardInputChange}
//                             maxLength="5"
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>CVV</label>
//                           <input
//                             type="password"
//                             name="cvv"
//                             placeholder="123"
//                             value={cardDetails.cvv}
//                             onChange={handleCardInputChange}
//                             maxLength="4"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* UPI ID */}
//                   {paymentMethod === "UPI" && (
//                     <div className="upi-details">
//                       <div className="form-group">
//                         <label>UPI ID</label>
//                         <input
//                           type="text"
//                           placeholder="yourname@upi"
//                           value={upiId}
//                           onChange={(e) => setUpiId(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="checkout-actions">
//                     <button
//                       type="button"
//                       className="back-btn"
//                       onClick={() => setCurrentStep(1)}
//                     >
//                       ← Back
//                     </button>
//                     <button type="submit" className="continue-btn">
//                       Review Order →
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* Step 3: Review & Confirm */}
//             {currentStep === 3 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">✅ Review Your Order</h2>

//                 {/* Shipping Summary */}
//                 <div className="review-section">
//                   <h3>📦 Shipping Address</h3>
//                   <div className="review-card">
//                     <p><strong>{shippingInfo.fullName}</strong></p>
//                     <p>{shippingInfo.address}</p>
//                     <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
//                     <p>Phone: {shippingInfo.phone}</p>
//                     <p>Email: {shippingInfo.email}</p>
//                   </div>
//                 </div>

//                 {/* Payment Summary */}
//                 <div className="review-section">
//                   <h3>💳 Payment Method</h3>
//                   <div className="review-card">
//                     <p><strong>{paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod === "Card" ? "Credit/Debit Card" : "UPI Payment"}</strong></p>
//                     {paymentMethod === "Card" && <p>Card ending in ****{cardDetails.cardNumber.slice(-4)}</p>}
//                     {paymentMethod === "UPI" && <p>UPI ID: {upiId}</p>}
//                   </div>
//                 </div>

//                 {/* Items Summary */}
//                 <div className="review-section">
//                   <h3>🛒 Order Items</h3>
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="review-item">
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
//                         />
//                       ) : (
//                         <span className="item-emoji">📦</span>
//                       )}
//                       <div className="item-details">
//                         <strong>{item.name}</strong>
//                         <p>Qty: {item.quantity} × ₹{item.price}</p>
//                       </div>
//                       <div className="item-total">₹{item.price * item.quantity}</div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Terms & Conditions */}
//                 <div className="terms-section">
//                   <label className="checkbox-label">
//                     <input
//                       type="checkbox"
//                       checked={agreeTerms}
//                       onChange={(e) => setAgreeTerms(e.target.checked)}
//                     />
//                     <span>I agree to the Terms & Conditions and Privacy Policy</span>
//                   </label>
//                 </div>

//                 <div className="checkout-actions">
//                   <button
//                     type="button"
//                     className="back-btn"
//                     onClick={() => setCurrentStep(2)}
//                   >
//                     ← Back
//                   </button>
//                   <button
//                     className="place-order-btn"
//                     onClick={handlePlaceOrder}
//                     disabled={!agreeTerms || loading}
//                   >
//                     {loading ? "Processing..." : `Place Order - ₹${total} 🎉`}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Side - Order Summary */}
//           <div className="order-summary">
//             <h3>Order Summary</h3>
            
//             <div className="summary-items">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="summary-item">
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
//                     />
//                   ) : (
//                     <span>📦</span>
//                   )}
//                   <div className="item-info">
//                     <p>{item.name}</p>
//                     <small>Qty: {item.quantity}</small>
//                   </div>
//                   <span className="item-price">₹{item.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="summary-divider"></div>

//             <div className="summary-row">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>
//             <div className="summary-row">
//               <span>Shipping</span>
//               <span className={shipping === 0 ? "free-shipping" : ""}>
//                 {shipping === 0 ? "FREE" : `₹${shipping}`}
//               </span>
//             </div>
//             <div className="summary-row">
//               <span>Tax (18% GST)</span>
//               <span>₹{tax}</span>
//             </div>

//             <div className="summary-divider"></div>

//             <div className="summary-total">
//               <span>Total Amount</span>
//               <span>₹{total}</span>
//             </div>

//             {shipping > 0 && (
//               <div className="free-shipping-banner">
//                 💡 Add ₹{5000 - subtotal} more for FREE shipping!
//               </div>
//             )}

//             <div className="secure-badge">
//               <span>🔒</span>
//               <div>
//                 <strong>Secure Checkout</strong>
//                 <p>Your data is protected</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;



// // src/pages/Checkout.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import LocationMap from "./LocationMap";
// import "./Checkout.css";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, clearCart, getTotalPrice } = useCart();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [shippingInfo, setShippingInfo] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     addressType: "Home"
//   });

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [cardDetails, setCardDetails] = useState({
//     cardNumber: "",
//     cardName: "",
//     expiryDate: "",
//     cvv: ""
//   });

//   const [upiId, setUpiId] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [pincodeChecking, setPincodeChecking] = useState(false);

//   // ✅ Auto-fill City & State from Pincode using India Post's free public API
//   const lookupPincode = async (pincode) => {
//     setPincodeChecking(true);
//     try {
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await res.json();

//       if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
//         const office = data[0].PostOffice[0];
//         setShippingInfo((prev) => ({
//           ...prev,
//           city: office.District,
//           state: office.State,
//         }));
//       }
//     } catch (err) {
//       console.error("Pincode lookup failed:", err);
//       // Silent failure — user can still type city/state manually
//     } finally {
//       setPincodeChecking(false);
//     }
//   };

//   // ✅ Auto-fill address when user picks a location on the map.
//   // User can still edit this field afterwards to add door no. / floor / landmark.
//   const handleLocationSelect = (location) => {
//     setShippingInfo((prev) => ({
//       ...prev,
//       address: location.address,
//     }));
//   };

//   const subtotal = getTotalPrice();
//   const shipping = subtotal > 5000 ? 0 : 100;
//   const tax = Math.round(subtotal * 0.18);
//   const total = subtotal + shipping + tax;

//   React.useEffect(() => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty!");
//       navigate("/purchase");
//     }
//   }, [cartItems, navigate]);

//   const handleShippingSubmit = (e) => {
//     e.preventDefault();
//     if (validateShipping()) {
//       setCurrentStep(2);
//     }
//   };

//   const validateShipping = () => {
//     const { fullName, email, phone, address, city, state, pincode } = shippingInfo;
//     if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
//       alert("Please fill all shipping details");
//       return false;
//     }
//     if (!/^\d{10}$/.test(phone)) {
//       alert("Please enter valid 10 digit phone number");
//       return false;
//     }
//     if (!/^\d{6}$/.test(pincode)) {
//       alert("Please enter valid 6 digit pincode");
//       return false;
//     }
//     return true;
//   };

//   const handlePaymentSubmit = (e) => {
//     e.preventDefault();
//     if (validatePayment()) {
//       setCurrentStep(3);
//     }
//   };

//   const validatePayment = () => {
//     if (paymentMethod === "Card") {
//       const { cardNumber, cardName, expiryDate, cvv } = cardDetails;
//       if (!cardNumber || !cardName || !expiryDate || !cvv) {
//         alert("Please fill all card details");
//         return false;
//       }
//       if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
//         alert("Please enter valid 16 digit card number");
//         return false;
//       }
//       if (!/^\d{3,4}$/.test(cvv)) {
//         alert("Please enter valid CVV");
//         return false;
//       }
//     } else if (paymentMethod === "UPI" && !upiId) {
//       alert("Please enter UPI ID");
//       return false;
//     }
//     return true;
//   };

//   // 🔥 Place Order with Backend API
//   const handlePlaceOrder = async () => {
//     if (!agreeTerms) {
//       alert("Please agree to terms and conditions");
//       return;
//     }

//     setLoading(true);

//     try {
//       const orderData = {
//         customerName: shippingInfo.fullName,
//         email: shippingInfo.email,
//         phone: shippingInfo.phone,
//         items: cartItems,
//         shippingAddress: {
//           fullName: shippingInfo.fullName,
//           address: shippingInfo.address,
//           city: shippingInfo.city,
//           state: shippingInfo.state,
//           pincode: shippingInfo.pincode,
//           phone: shippingInfo.phone,
//           addressType: shippingInfo.addressType,
//         },
//         paymentMethod: paymentMethod,
//         subtotal: subtotal,
//         shipping: shipping,
//         tax: tax,
//         totalAmount: total,
//       };

//       // ✅ FIX: relative path instead of hardcoded http://localhost:3000
//       const response = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert("Order placed successfully! 🎉");
        
//         clearCart();
        
//         navigate("/order-confirmation", {
//           state: {
//             orderId: result.orderId,
//             customerName: shippingInfo.fullName,
//             totalAmount: total,
//             paymentMethod: paymentMethod,
//             address: shippingInfo,
//             cartItems: cartItems,
//           },
//         });
//       } else {
//         alert("Order failed: " + (result.error || "Unknown error"));
//       }
//     } catch (error) {
//       console.error("Order Error:", error);
//       alert("Failed to place order. Please try again. Error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingInfo({ ...shippingInfo, [name]: value });
//   };

//   const handleCardInputChange = (e) => {
//     const { name, value } = e.target;
//     setCardDetails({ ...cardDetails, [name]: value });
//   };

//   return (
//     <div className="checkout-page">
//       {/* Progress Bar */}
//       <div className="checkout-header">
//         <div className="container">
//           <div className="progress-steps">
//             <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
//               <div className="step-number">1</div>
//               <div className="step-label">Shipping</div>
//             </div>
//             <div className="step-line"></div>
//             <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
//               <div className="step-number">2</div>
//               <div className="step-label">Payment</div>
//             </div>
//             <div className="step-line"></div>
//             <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
//               <div className="step-number">3</div>
//               <div className="step-label">Review</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="checkout-container">
//         <div className="checkout-content">
//           {/* Left Side - Forms */}
//           <div className="checkout-main">
//             {/* Step 1: Shipping Information */}
//             {currentStep === 1 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">📦 Shipping Information</h2>
//                 <form onSubmit={handleShippingSubmit}>
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Full Name *</label>
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={shippingInfo.fullName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Email Address *</label>
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="your.email@example.com"
//                         value={shippingInfo.email}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Phone Number *</label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         placeholder="10 digit phone number"
//                         value={shippingInfo.phone}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
//                           setShippingInfo({ ...shippingInfo, phone: digitsOnly });
//                         }}
//                         maxLength="10"
//                         inputMode="numeric"
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Address Type</label>
//                       <select
//                         name="addressType"
//                         value={shippingInfo.addressType}
//                         onChange={handleInputChange}
//                       >
//                         <option value="Home">Home</option>
//                         <option value="Office">Office</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Location picker — search or click on map to auto-fill the address box below.
//                       The filled text can still be edited to add door no. / floor / landmark. */}
//                   <div className="form-group">
//                     <label>Pick Delivery Location on Map</label>
//                     <LocationMap onLocationSelect={handleLocationSelect} />
//                   </div>

//                   <div className="form-group">
//                     <label>
//                       Complete Address *{" "}
//                       <span style={{ fontSize: 12, color: "#888", fontWeight: "normal" }}>
//                         (auto-filled from map — edit below to add door no. / floor / landmark)
//                       </span>
//                     </label>
//                     <textarea
//                       name="address"
//                       placeholder="House/Flat No, Street, Landmark"
//                       value={shippingInfo.address}
//                       onChange={handleInputChange}
//                       rows="3"
//                       required
//                     ></textarea>
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>City *</label>
//                       <input
//                         type="text"
//                         name="city"
//                         placeholder="Enter city"
//                         value={shippingInfo.city}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>State *</label>
//                       <input
//                         type="text"
//                         name="state"
//                         placeholder="Enter state"
//                         value={shippingInfo.state}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Pincode * {pincodeChecking && <span style={{ fontSize: 12, color: "#888" }}>(checking...)</span>}</label>
//                       <input
//                         type="text"
//                         name="pincode"
//                         placeholder="6 digits"
//                         value={shippingInfo.pincode}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
//                           setShippingInfo({ ...shippingInfo, pincode: digitsOnly });
//                           if (digitsOnly.length === 6) {
//                             lookupPincode(digitsOnly);
//                           }
//                         }}
//                         maxLength="6"
//                         inputMode="numeric"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <button type="submit" className="continue-btn">
//                     Continue to Payment →
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Step 2: Payment Method */}
//             {currentStep === 2 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">💳 Payment Method</h2>
//                 <form onSubmit={handlePaymentSubmit}>
//                   <div className="payment-methods">
//                     <div
//                       className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("COD")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="COD"
//                         checked={paymentMethod === "COD"}
//                         onChange={() => setPaymentMethod("COD")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">💵</span>
//                         <div>
//                           <strong>Cash on Delivery</strong>
//                           <p>Pay when you receive the order</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`payment-option ${paymentMethod === "Card" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("Card")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="Card"
//                         checked={paymentMethod === "Card"}
//                         onChange={() => setPaymentMethod("Card")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">💳</span>
//                         <div>
//                           <strong>Credit/Debit Card</strong>
//                           <p>Secure payment via card</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`payment-option ${paymentMethod === "UPI" ? "selected" : ""}`}
//                       onClick={() => setPaymentMethod("UPI")}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="UPI"
//                         checked={paymentMethod === "UPI"}
//                         onChange={() => setPaymentMethod("UPI")}
//                       />
//                       <div className="payment-info">
//                         <span className="payment-icon">📱</span>
//                         <div>
//                           <strong>UPI Payment</strong>
//                           <p>Pay via Google Pay, PhonePe, Paytm</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Card Details */}
//                   {paymentMethod === "Card" && (
//                     <div className="card-details">
//                       <div className="form-group">
//                         <label>Card Number</label>
//                         <input
//                           type="text"
//                           name="cardNumber"
//                           placeholder="1234 5678 9012 3456"
//                           value={cardDetails.cardNumber}
//                           onChange={handleCardInputChange}
//                           maxLength="19"
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>Cardholder Name</label>
//                         <input
//                           type="text"
//                           name="cardName"
//                           placeholder="Name on card"
//                           value={cardDetails.cardName}
//                           onChange={handleCardInputChange}
//                         />
//                       </div>
//                       <div className="form-row">
//                         <div className="form-group">
//                           <label>Expiry Date</label>
//                           <input
//                             type="text"
//                             name="expiryDate"
//                             placeholder="MM/YY"
//                             value={cardDetails.expiryDate}
//                             onChange={handleCardInputChange}
//                             maxLength="5"
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label>CVV</label>
//                           <input
//                             type="password"
//                             name="cvv"
//                             placeholder="123"
//                             value={cardDetails.cvv}
//                             onChange={handleCardInputChange}
//                             maxLength="4"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* UPI ID */}
//                   {paymentMethod === "UPI" && (
//                     <div className="upi-details">
//                       <div className="form-group">
//                         <label>UPI ID</label>
//                         <input
//                           type="text"
//                           placeholder="yourname@upi"
//                           value={upiId}
//                           onChange={(e) => setUpiId(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="checkout-actions">
//                     <button
//                       type="button"
//                       className="back-btn"
//                       onClick={() => setCurrentStep(1)}
//                     >
//                       ← Back
//                     </button>
//                     <button type="submit" className="continue-btn">
//                       Review Order →
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* Step 3: Review & Confirm */}
//             {currentStep === 3 && (
//               <div className="checkout-section">
//                 <h2 className="section-title">✅ Review Your Order</h2>

//                 {/* Shipping Summary */}
//                 <div className="review-section">
//                   <h3>📦 Shipping Address</h3>
//                   <div className="review-card">
//                     <p><strong>{shippingInfo.fullName}</strong></p>
//                     <p>{shippingInfo.address}</p>
//                     <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
//                     <p>Phone: {shippingInfo.phone}</p>
//                     <p>Email: {shippingInfo.email}</p>
//                   </div>
//                 </div>

//                 {/* Payment Summary */}
//                 <div className="review-section">
//                   <h3>💳 Payment Method</h3>
//                   <div className="review-card">
//                     <p><strong>{paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod === "Card" ? "Credit/Debit Card" : "UPI Payment"}</strong></p>
//                     {paymentMethod === "Card" && <p>Card ending in ****{cardDetails.cardNumber.slice(-4)}</p>}
//                     {paymentMethod === "UPI" && <p>UPI ID: {upiId}</p>}
//                   </div>
//                 </div>

//                 {/* Items Summary */}
//                 <div className="review-section">
//                   <h3>🛒 Order Items</h3>
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="review-item">
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
//                         />
//                       ) : (
//                         <span className="item-emoji">📦</span>
//                       )}
//                       <div className="item-details">
//                         <strong>{item.name}</strong>
//                         <p>Qty: {item.quantity} × ₹{item.price}</p>
//                       </div>
//                       <div className="item-total">₹{item.price * item.quantity}</div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Terms & Conditions */}
//                 <div className="terms-section">
//                   <label className="checkbox-label">
//                     <input
//                       type="checkbox"
//                       checked={agreeTerms}
//                       onChange={(e) => setAgreeTerms(e.target.checked)}
//                     />
//                     <span>I agree to the Terms & Conditions and Privacy Policy</span>
//                   </label>
//                 </div>

//                 <div className="checkout-actions">
//                   <button
//                     type="button"
//                     className="back-btn"
//                     onClick={() => setCurrentStep(2)}
//                   >
//                     ← Back
//                   </button>
//                   <button
//                     className="place-order-btn"
//                     onClick={handlePlaceOrder}
//                     disabled={!agreeTerms || loading}
//                   >
//                     {loading ? "Processing..." : `Place Order - ₹${total} 🎉`}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Side - Order Summary */}
//           <div className="order-summary">
//             <h3>Order Summary</h3>
            
//             <div className="summary-items">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="summary-item">
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
//                     />
//                   ) : (
//                     <span>📦</span>
//                   )}
//                   <div className="item-info">
//                     <p>{item.name}</p>
//                     <small>Qty: {item.quantity}</small>
//                   </div>
//                   <span className="item-price">₹{item.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="summary-divider"></div>

//             <div className="summary-row">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>
//             <div className="summary-row">
//               <span>Shipping</span>
//               <span className={shipping === 0 ? "free-shipping" : ""}>
//                 {shipping === 0 ? "FREE" : `₹${shipping}`}
//               </span>
//             </div>
//             <div className="summary-row">
//               <span>Tax (18% GST)</span>
//               <span>₹{tax}</span>
//             </div>

//             <div className="summary-divider"></div>

//             <div className="summary-total">
//               <span>Total Amount</span>
//               <span>₹{total}</span>
//             </div>

//             {shipping > 0 && (
//               <div className="free-shipping-banner">
//                 💡 Add ₹{5000 - subtotal} more for FREE shipping!
//               </div>
//             )}

//             <div className="secure-badge">
//               <span>🔒</span>
//               <div>
//                 <strong>Secure Checkout</strong>
//                 <p>Your data is protected</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;





// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "../context/CartContext";
import LocationMap from "./LocationMap";
import "./Checkout.css";

// Your UPI details, shown as a scannable QR when the customer picks UPI
const UPI_ID = "MYTHREALITYTECHNOLOGIESPRIV@iob";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home"
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  const [upiId, setUpiId] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [pincodeChecking, setPincodeChecking] = useState(false);

  // Auto-fill City & State from Pincode using India Post's free public API
  const lookupPincode = async (pincode) => {
    setPincodeChecking(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const office = data[0].PostOffice[0];
        setShippingInfo((prev) => ({
          ...prev,
          city: office.District,
          state: office.State,
        }));
      }
    } catch (err) {
      console.error("Pincode lookup failed:", err);
      // Silent failure — user can still type city/state manually
    } finally {
      setPincodeChecking(false);
    }
  };

  // Auto-fill address when user picks a location on the map.
  // User can still edit this field afterwards to add door no. / floor / landmark.
  const handleLocationSelect = (location) => {
    setShippingInfo((prev) => ({
      ...prev,
      address: location.address,
    }));
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  React.useEffect(() => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/purchase");
    }
  }, [cartItems, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setCurrentStep(2);
    }
  };

  const validateShipping = () => {
    const { fullName, email, phone, address, city, state, pincode } = shippingInfo;
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all shipping details");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter valid 10 digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter valid 6 digit pincode");
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setCurrentStep(3);
    }
  };

  const validatePayment = () => {
    if (paymentMethod === "Card") {
      const { cardNumber, cardName, expiryDate, cvv } = cardDetails;
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert("Please fill all card details");
        return false;
      }
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        alert("Please enter valid 16 digit card number");
        return false;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        alert("Please enter valid CVV");
        return false;
      }
    } else if (paymentMethod === "UPI" && !upiId) {
      alert("Please enter UPI ID");
      return false;
    }
    return true;
  };

  // Place Order with Backend API
  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        items: cartItems,
        shippingAddress: {
          fullName: shippingInfo.fullName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          phone: shippingInfo.phone,
          addressType: shippingInfo.addressType,
        },
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        totalAmount: total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Order placed successfully! 🎉");
        
        clearCart();
        
        navigate("/order-confirmation", {
          state: {
            orderId: result.orderId,
            customerName: shippingInfo.fullName,
            totalAmount: total,
            paymentMethod: paymentMethod,
            address: shippingInfo,
            cartItems: cartItems,
          },
        });
      } else {
        alert("Order failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order. Please try again. Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  return (
    <div className="checkout-page">
      {/* Progress Bar */}
      <div className="checkout-header">
        <div className="container">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Shipping</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Review</div>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-content">
          {/* Left Side - Forms */}
          <div className="checkout-main">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="checkout-section">
                <h2 className="section-title">📦 Shipping Information</h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="10 digit phone number"
                        value={shippingInfo.phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setShippingInfo({ ...shippingInfo, phone: digitsOnly });
                        }}
                        maxLength="10"
                        inputMode="numeric"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Address Type</label>
                      <select
                        name="addressType"
                        value={shippingInfo.addressType}
                        onChange={handleInputChange}
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Location picker — search or click on map to auto-fill the address box below.
                      The filled text can still be edited to add door no. / floor / landmark. */}
                  <div className="form-group">
                    <label>Pick Delivery Location on Map</label>
                    <LocationMap onLocationSelect={handleLocationSelect} />
                  </div>

                  <div className="form-group">
                    <label>
                      Complete Address *{" "}
                      <span style={{ fontSize: 12, color: "#888", fontWeight: "normal" }}>
                        (auto-filled from map — edit below to add door no. / floor / landmark)
                      </span>
                    </label>
                    <textarea
                      name="address"
                      placeholder="House/Flat No, Street, Landmark"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Enter state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode * {pincodeChecking && <span style={{ fontSize: 12, color: "#888" }}>(checking...)</span>}</label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="6 digits"
                        value={shippingInfo.pincode}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setShippingInfo({ ...shippingInfo, pincode: digitsOnly });
                          if (digitsOnly.length === 6) {
                            lookupPincode(digitsOnly);
                          }
                        }}
                        maxLength="6"
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="continue-btn">
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="checkout-section">
                <h2 className="section-title">💳 Payment Method</h2>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="payment-methods">
                    <div
                      className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />
                      <div className="payment-info">
                        <span className="payment-icon">💵</span>
                        <div>
                          <strong>Cash on Delivery</strong>
                          <p>Pay when you receive the order</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`payment-option ${paymentMethod === "Card" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("Card")}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="Card"
                        checked={paymentMethod === "Card"}
                        onChange={() => setPaymentMethod("Card")}
                      />
                      <div className="payment-info">
                        <span className="payment-icon">💳</span>
                        <div>
                          <strong>Credit/Debit Card</strong>
                          <p>Secure payment via card</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`payment-option ${paymentMethod === "UPI" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("UPI")}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                      />
                      <div className="payment-info">
                        <span className="payment-icon">📱</span>
                        <div>
                          <strong>UPI Payment</strong>
                          <p>Pay via Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === "Card" && (
                    <div className="card-details">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange}
                          maxLength="19"
                        />
                      </div>
                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Name on card"
                          value={cardDetails.cardName}
                          onChange={handleCardInputChange}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={handleCardInputChange}
                            maxLength="5"
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                            maxLength="4"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI ID */}
                  {paymentMethod === "UPI" && (
                    <div className="upi-details">
                      {/* Dynamic QR — amount changes automatically based on order total */}
                      <div
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          background: "#f9f9f9",
                          borderRadius: 12,
                          marginBottom: 16,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            padding: 12,
                            background: "white",
                            borderRadius: 10,
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <QRCodeSVG
                            value={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
                              "Myth Reality Technologies"
                            )}&am=${total}&cu=INR&tn=${encodeURIComponent("Order Payment")}`}
                            size={220}
                          />
                        </div>
                        <p style={{ fontSize: 13, color: "#666", marginTop: 10, marginBottom: 2 }}>
                          Scan with any UPI app (GPay, PhonePe, Paytm) — amount ₹{total} auto-filled
                        </p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#00333d" }}>
                          UPI ID: {UPI_ID}
                        </p>
                      </div>

                      <div className="form-group">
                        <label>Your UPI ID (for our reference)</label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="checkout-actions">
                    <button
                      type="button"
                      className="back-btn"
                      onClick={() => setCurrentStep(1)}
                    >
                      ← Back
                    </button>
                    <button type="submit" className="continue-btn">
                      Review Order →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {currentStep === 3 && (
              <div className="checkout-section">
                <h2 className="section-title">✅ Review Your Order</h2>

                {/* Shipping Summary */}
                <div className="review-section">
                  <h3>📦 Shipping Address</h3>
                  <div className="review-card">
                    <p><strong>{shippingInfo.fullName}</strong></p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                    <p>Phone: {shippingInfo.phone}</p>
                    <p>Email: {shippingInfo.email}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="review-section">
                  <h3>💳 Payment Method</h3>
                  <div className="review-card">
                    <p><strong>{paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod === "Card" ? "Credit/Debit Card" : "UPI Payment"}</strong></p>
                    {paymentMethod === "Card" && <p>Card ending in ****{cardDetails.cardNumber.slice(-4)}</p>}
                    {paymentMethod === "UPI" && <p>UPI ID: {upiId}</p>}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="review-section">
                  <h3>🛒 Order Items</h3>
                  {cartItems.map((item) => (
                    <div key={item.id} className="review-item">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        <span className="item-emoji">📦</span>
                      )}
                      <div className="item-details">
                        <strong>{item.name}</strong>
                        <p>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <div className="item-total">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                {/* Terms & Conditions */}
                <div className="terms-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>I agree to the Terms & Conditions and Privacy Policy</span>
                  </label>
                </div>

                <div className="checkout-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setCurrentStep(2)}
                  >
                    ← Back
                  </button>
                  <button
                    className="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={!agreeTerms || loading}
                  >
                    {loading ? "Processing..." : `Place Order - ₹${total} 🎉`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <span>📦</span>
                  )}
                  <div className="item-info">
                    <p>{item.name}</p>
                    <small>Qty: {item.quantity}</small>
                  </div>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? "free-shipping" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax (18% GST)</span>
              <span>₹{tax}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>

            {shipping > 0 && (
              <div className="free-shipping-banner">
                💡 Add ₹{5000 - subtotal} more for FREE shipping!
              </div>
            )}

            <div className="secure-badge">
              <span>🔒</span>
              <div>
                <strong>Secure Checkout</strong>
                <p>Your data is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;