// import { db } from "../config/firebase.js";
// import { getEstimatedDelivery } from "../utils/helpers.js";

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       customerName,
//       email,
//       phone,
//       items,
//       shippingAddress,
//       paymentMethod,
//       subtotal,
//       shipping,
//       tax,
//       totalAmount,
//     } = req.body;

//     if (!customerName || !email || !phone || !items || !shippingAddress || !paymentMethod || !totalAmount) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const orderId = "ORD" + Date.now();

//     const docRef = await db.collection("orders").add({
//       orderId,
//       customerName,
//       email,
//       phone,
//       items,
//       shippingAddress,
//       paymentMethod,
//       paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
//       orderStatus: "pending",
//       subtotal,
//       shipping,
//       tax,
//       totalAmount,
//       createdAt: new Date().toISOString(),
//       estimatedDelivery: getEstimatedDelivery(),
//     });

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       orderId: orderId,
//       docId: docRef.id,
//     });
//   } catch (error) {
//     console.error("🔥 Order Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getAllOrders = async (req, res) => {
//   try {
//     const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
//     if (snapshot.empty) return res.json({ success: true, orders: [] });

//     const orders = [];
//     snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("🔥 Get Orders Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getOrdersByCustomer = async (req, res) => {
//   try {
//     const { email } = req.params;
    
//     if (!email) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Email is required" 
//       });
//     }

//     console.log(`📦 Fetching orders for customer: ${email}`);

//     const snapshot = await db
//       .collection("orders")
//       .where("email", "==", email)
//       .orderBy("createdAt", "desc")
//       .get();

//     if (snapshot.empty) {
//       console.log(`ℹ️  No orders found for ${email}`);
//       return res.json({ 
//         success: true, 
//         orders: [],
//         message: "No orders found for this customer"
//       });
//     }

//     const orders = [];
//     snapshot.forEach((doc) => {
//       orders.push({ 
//         id: doc.id, 
//         ...doc.data() 
//       });
//     });

//     console.log(`✅ Found ${orders.length} orders for ${email}`);

//     res.json({ 
//       success: true, 
//       orders,
//       count: orders.length
//     });
//   } catch (error) {
//     console.error("🔥 Get Customer Orders Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: "Internal Server Error",
//       message: error.message 
//     });
//   }
// };

// export const trackOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     if (!orderId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Order ID is required" 
//       });
//     }

//     console.log(`🔍 Tracking order: ${orderId}`);

//     const snapshot = await db
//       .collection("orders")
//       .where("orderId", "==", orderId)
//       .get();

//     if (snapshot.empty) {
//       console.log(`❌ Order not found: ${orderId}`);
//       return res.status(404).json({ 
//         success: false, 
//         error: "Order not found" 
//       });
//     }

//     const order = snapshot.docs[0].data();
    
//     console.log(`✅ Order found: ${orderId} - Status: ${order.orderStatus}`);
    
//     res.json({ 
//       success: true, 
//       order: {
//         id: snapshot.docs[0].id,
//         ...order
//       }
//     });
//   } catch (error) {
//     console.error("🔥 Get Order Details Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: "Internal Server Error" 
//     });
//   }
// };

// export const getCustomerStats = async (req, res) => {
//   try {
//     const { email } = req.params;
    
//     if (!email) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Email is required" 
//       });
//     }

//     console.log(`📊 Calculating stats for: ${email}`);

//     const snapshot = await db
//       .collection("orders")
//       .where("email", "==", email)
//       .get();

//     if (snapshot.empty) {
//       console.log(`ℹ️  No orders to calculate stats for ${email}`);
//       return res.json({ 
//         success: true, 
//         stats: {
//           totalOrders: 0,
//           totalSpent: 0,
//           activeOrders: 0,
//           deliveredOrders: 0,
//           pendingOrders: 0
//         }
//       });
//     }

//     let totalSpent = 0;
//     let activeOrders = 0;
//     let deliveredOrders = 0;
//     let pendingOrders = 0;
//     let cancelledOrders = 0;

//     const statusCounts = {};

//     snapshot.forEach((doc) => {
//       const order = doc.data();
//       const status = order.orderStatus?.toLowerCase() || 'unknown';
      
//       statusCounts[status] = (statusCounts[status] || 0) + 1;
      
//       if (status !== 'cancelled') {
//         totalSpent += order.totalAmount || 0;
//       }
      
//       if (status === "delivered") {
//         deliveredOrders++;
//       } else if (status === "pending") {
//         pendingOrders++;
//       } else if (status === "cancelled") {
//         cancelledOrders++;
//       } else if (["processing", "confirmed", "shipped"].includes(status)) {
//         activeOrders++;
//       }
//     });

//     const stats = {
//       totalOrders: snapshot.size,
//       totalSpent: Math.round(totalSpent),
//       activeOrders,
//       deliveredOrders,
//       pendingOrders,
//       cancelledOrders,
//       statusBreakdown: statusCounts
//     };

//     console.log(`✅ Stats calculated for ${email}:`, stats);

//     res.json({ 
//       success: true, 
//       stats
//     });
//   } catch (error) {
//     console.error("🔥 Get Customer Stats Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: "Internal Server Error" 
//     });
//   }
// };

// export const getRecentOrders = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const { limit = 5 } = req.query;
    
//     if (!email) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Email is required" 
//       });
//     }

//     console.log(`🔔 Fetching recent orders for notifications: ${email}`);

//     const snapshot = await db
//       .collection("orders")
//       .where("email", "==", email)
//       .orderBy("createdAt", "desc")
//       .limit(parseInt(limit))
//       .get();

//     const orders = [];
//     snapshot.forEach((doc) => {
//       const order = doc.data();
//       orders.push({ 
//         orderId: order.orderId,
//         orderStatus: order.orderStatus,
//         totalAmount: order.totalAmount,
//         createdAt: order.createdAt,
//         items: order.items?.map(item => ({
//           name: item.name,
//           quantity: item.quantity
//         }))
//       });
//     });

//     console.log(`✅ Found ${orders.length} recent orders for notifications`);

//     res.json({ 
//       success: true, 
//       orders
//     });
//   } catch (error) {
//     console.error("🔥 Get Recent Orders Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: "Internal Server Error" 
//     });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { orderStatus } = req.body;

//     if (!orderStatus)
//       return res.status(400).json({ success: false, error: "Order status is required" });

//     console.log(`✏️  Updating order ${orderId} to status: ${orderStatus}`);

//     const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
//     if (snapshot.empty)
//       return res.status(404).json({ success: false, error: "Order not found" });

//     const docId = snapshot.docs[0].id;
//     await db.collection("orders").doc(docId).update({
//       orderStatus,
//       updatedAt: new Date().toISOString(),
//     });

//     console.log(`✅ Order ${orderId} updated to ${orderStatus}`);

//     res.json({ success: true, message: "Order status updated successfully" });
//   } catch (error) {
//     console.error("🔥 Update Order Status Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };



                  

// import { db } from "../config/firebase.js";
// import { getEstimatedDelivery } from "../utils/helpers.js";
// import transporter from "../config/email.js";

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       customerName,
//       email,
//       phone,
//       items,
//       shippingAddress,
//       paymentMethod,
//       subtotal,
//       shipping,
//       tax,
//       totalAmount,
//     } = req.body;

//     if (!customerName || !email || !phone || !items || !shippingAddress || !paymentMethod || !totalAmount) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const orderId = "ORD" + Date.now();

//     const docRef = await db.collection("orders").add({
//       orderId,
//       customerName,
//       email,
//       phone,
//       items,
//       shippingAddress,
//       paymentMethod,
//       paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
//       orderStatus: "pending",
//       subtotal,
//       shipping,
//       tax,
//       totalAmount,
//       createdAt: new Date().toISOString(),
//       estimatedDelivery: getEstimatedDelivery(),
//     });

//     // ✅ Company-க்கு email
//     const itemsList = items
//       .map((item) => `<tr>
//         <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
//         <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
//         <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
//         <td style="padding:8px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
//       </tr>`)
//       .join("");

//     await transporter.sendMail({
//       from: process.env.ADMIN_EMAIL,
//       to: process.env.ADMIN_EMAIL,
//       subject: `🛒 New Order Received - ${orderId}`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
//           <h2 style="color:#2c7be5;">🛒 New Order Received!</h2>
//           <p><b>Order ID:</b> ${orderId}</p>
//           <p><b>Customer Name:</b> ${customerName}</p>
//           <p><b>Email:</b> ${email}</p>
//           <p><b>Phone:</b> ${phone}</p>
//           <p><b>Payment Method:</b> ${paymentMethod}</p>
//           <hr/>
//           <h3>📦 Items Ordered:</h3>
//           <table style="width:100%;border-collapse:collapse;">
//             <tr style="background:#f0f0f0;">
//               <th style="padding:8px;border:1px solid #ddd;">Product</th>
//               <th style="padding:8px;border:1px solid #ddd;">Qty</th>
//               <th style="padding:8px;border:1px solid #ddd;">Price</th>
//               <th style="padding:8px;border:1px solid #ddd;">Total</th>
//             </tr>
//             ${itemsList}
//           </table>
//           <hr/>
//           <p><b>Subtotal:</b> ₹${subtotal}</p>
//           <p><b>Shipping:</b> ₹${shipping}</p>
//           <p><b>Tax:</b> ₹${tax}</p>
//           <h3 style="color:green;"><b>Total Amount: ₹${totalAmount}</b></h3>
//           <hr/>
//           <h3>🏠 Shipping Address:</h3>
//           <p>
//             ${shippingAddress.fullName}<br/>
//             ${shippingAddress.address}<br/>
//             ${shippingAddress.city} - ${shippingAddress.pincode}<br/>
//             ${shippingAddress.state}<br/>
//             📞 ${shippingAddress.phone}
//           </p>
//         </div>
//       `,
//     });

//     console.log(`✅ Order email sent for ${orderId}`);

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       orderId: orderId,
//       docId: docRef.id,
//     });
//   } catch (error) {
//     console.error("🔥 Order Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getAllOrders = async (req, res) => {
//   try {
//     const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
//     if (snapshot.empty) return res.json({ success: true, orders: [] });

//     const orders = [];
//     snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("🔥 Get Orders Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getOrdersByCustomer = async (req, res) => {
//   try {
//     const { email } = req.params;
    
//     if (!email) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Email is required" 
//       });
//     }

//     console.log(`📦 Fetching orders for customer: ${email}`);

//     const snapshot = await db
//       .collection("orders")
//       .where("email", "==", email)
//       .orderBy("createdAt", "desc")
//       .get();

//     if (snapshot.empty) {
//       return res.json({ 
//         success: true, 
//         orders: [],
//         message: "No orders found for this customer"
//       });
//     }

//     const orders = [];
//     snapshot.forEach((doc) => {
//       orders.push({ id: doc.id, ...doc.data() });
//     });

//     res.json({ success: true, orders, count: orders.length });
//   } catch (error) {
//     console.error("🔥 Get Customer Orders Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const trackOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     if (!orderId) {
//       return res.status(400).json({ success: false, error: "Order ID is required" });
//     }

//     const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();

//     if (snapshot.empty) {
//       return res.status(404).json({ success: false, error: "Order not found" });
//     }

//     const order = snapshot.docs[0].data();
//     res.json({ success: true, order: { id: snapshot.docs[0].id, ...order } });
//   } catch (error) {
//     console.error("🔥 Get Order Details Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const getCustomerStats = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({ success: false, error: "Email is required" });
//     }

//     const snapshot = await db.collection("orders").where("email", "==", email).get();

//     if (snapshot.empty) {
//       return res.json({ success: true, stats: { totalOrders: 0, totalSpent: 0, activeOrders: 0, deliveredOrders: 0, pendingOrders: 0 } });
//     }

//     let totalSpent = 0, activeOrders = 0, deliveredOrders = 0, pendingOrders = 0, cancelledOrders = 0;
//     const statusCounts = {};

//     snapshot.forEach((doc) => {
//       const order = doc.data();
//       const status = order.orderStatus?.toLowerCase() || "unknown";
//       statusCounts[status] = (statusCounts[status] || 0) + 1;
//       if (status !== "cancelled") totalSpent += order.totalAmount || 0;
//       if (status === "delivered") deliveredOrders++;
//       else if (status === "pending") pendingOrders++;
//       else if (status === "cancelled") cancelledOrders++;
//       else if (["processing", "confirmed", "shipped"].includes(status)) activeOrders++;
//     });

//     res.json({ success: true, stats: { totalOrders: snapshot.size, totalSpent: Math.round(totalSpent), activeOrders, deliveredOrders, pendingOrders, cancelledOrders, statusBreakdown: statusCounts } });
//   } catch (error) {
//     console.error("🔥 Get Customer Stats Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const getRecentOrders = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const { limit = 5 } = req.query;

//     if (!email) {
//       return res.status(400).json({ success: false, error: "Email is required" });
//     }

//     const snapshot = await db.collection("orders").where("email", "==", email).orderBy("createdAt", "desc").limit(parseInt(limit)).get();

//     const orders = [];
//     snapshot.forEach((doc) => {
//       const order = doc.data();
//       orders.push({ orderId: order.orderId, orderStatus: order.orderStatus, totalAmount: order.totalAmount, createdAt: order.createdAt, items: order.items?.map((item) => ({ name: item.name, quantity: item.quantity })) });
//     });

//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("🔥 Get Recent Orders Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { orderStatus } = req.body;

//     if (!orderStatus)
//       return res.status(400).json({ success: false, error: "Order status is required" });

//     const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
//     if (snapshot.empty)
//       return res.status(404).json({ success: false, error: "Order not found" });

//     const docId = snapshot.docs[0].id;
//     await db.collection("orders").doc(docId).update({ orderStatus, updatedAt: new Date().toISOString() });

//     res.json({ success: true, message: "Order status updated successfully" });
//   } catch (error) {
//     console.error("🔥 Update Order Status Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };







// import { db } from "../config/firebase.js";
// import { getEstimatedDelivery } from "../utils/helpers.js";
// import transporter from "../config/email.js";

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       customerName,
//       email,
//       phone,
//       items,
//       shippingAddress,
//       paymentMethod,
//       subtotal,
//       shipping,
//       tax,
//       totalAmount,
//     } = req.body;

//     if (!customerName || !email || !phone || !items || !shippingAddress || !paymentMethod || !totalAmount) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const orderId = "ORD" + Date.now();

//     const docRef = await db.collection("orders").add({
//       orderId,
//       customerName,
//       email,
//       phone,
//       items,
//       shippingAddress,
//       paymentMethod,
//       paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
//       orderStatus: "pending",
//       subtotal,
//       shipping,
//       tax,
//       totalAmount,
//       createdAt: new Date().toISOString(),
//       estimatedDelivery: getEstimatedDelivery(),
//     });

//     const itemsList = items
//       .map((item) => `<tr>
//         <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
//         <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
//         <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
//         <td style="padding:8px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
//       </tr>`)
//       .join("");

//     // ✅ Company-க்கு email
//     await transporter.sendMail({
//       from: process.env.ADMIN_EMAIL,
//       to: process.env.ADMIN_EMAIL,
//       subject: `🛒 New Order Received - ${orderId}`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
//           <h2 style="color:#2c7be5;">🛒 New Order Received!</h2>
//           <p><b>Order ID:</b> ${orderId}</p>
//           <p><b>Customer Name:</b> ${customerName}</p>
//           <p><b>Email:</b> ${email}</p>
//           <p><b>Phone:</b> ${phone}</p>
//           <p><b>Payment Method:</b> ${paymentMethod}</p>
//           <hr/>
//           <h3>📦 Items Ordered:</h3>
//           <table style="width:100%;border-collapse:collapse;">
//             <tr style="background:#f0f0f0;">
//               <th style="padding:8px;border:1px solid #ddd;">Product</th>
//               <th style="padding:8px;border:1px solid #ddd;">Qty</th>
//               <th style="padding:8px;border:1px solid #ddd;">Price</th>
//               <th style="padding:8px;border:1px solid #ddd;">Total</th>
//             </tr>
//             ${itemsList}
//           </table>
//           <hr/>
//           <p><b>Subtotal:</b> ₹${subtotal}</p>
//           <p><b>Shipping:</b> ₹${shipping}</p>
//           <p><b>Tax:</b> ₹${tax}</p>
//           <h3 style="color:green;"><b>Total Amount: ₹${totalAmount}</b></h3>
//           <hr/>
//           <h3>🏠 Shipping Address:</h3>
//           <p>
//             ${shippingAddress.fullName}<br/>
//             ${shippingAddress.address}<br/>
//             ${shippingAddress.city} - ${shippingAddress.pincode}<br/>
//             ${shippingAddress.state}<br/>
//             📞 ${shippingAddress.phone}
//           </p>
//         </div>
//       `,
//     });

//     console.log(`✅ Company email sent for ${orderId}`);

//     // ✅ User-க்கு Order Confirmation Email
//     await transporter.sendMail({
//       from: process.env.ADMIN_EMAIL,
//       to: email,
//       subject: `✅ Order Confirmed - ${orderId}`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
//           <h2 style="color:#2c7be5;">✅ Your Order is Confirmed!</h2>
//           <p>Dear <b>${customerName}</b>,</p>
//           <p>Thank you for shopping with <b>MRtech</b>! Your order has been placed successfully.</p>
//           <p><b>Order ID:</b> ${orderId}</p>
//           <p><b>Payment Method:</b> ${paymentMethod}</p>
//           <hr/>
//           <h3>📦 Items Ordered:</h3>
//           <table style="width:100%;border-collapse:collapse;">
//             <tr style="background:#f0f0f0;">
//               <th style="padding:8px;border:1px solid #ddd;">Product</th>
//               <th style="padding:8px;border:1px solid #ddd;">Qty</th>
//               <th style="padding:8px;border:1px solid #ddd;">Price</th>
//             </tr>
//             ${items.map((item) => `
//               <tr>
//                 <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
//                 <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
//                 <td style="padding:8px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
//               </tr>
//             `).join("")}
//           </table>
//           <hr/>
//           <p><b>Subtotal:</b> ₹${subtotal}</p>
//           <p><b>Shipping:</b> ₹${shipping}</p>
//           <p><b>Tax:</b> ₹${tax}</p>
//           <h3 style="color:green;"><b>Total Amount: ₹${totalAmount}</b></h3>
//           <hr/>
//           <h3>🏠 Delivery Address:</h3>
//           <p>
//             ${shippingAddress.fullName}<br/>
//             ${shippingAddress.address}<br/>
//             ${shippingAddress.city} - ${shippingAddress.pincode}<br/>
//             ${shippingAddress.state}
//           </p>
//           <hr/>
//           <p style="color:gray;font-size:12px;">
//             For any queries, contact us at ${process.env.ADMIN_EMAIL}
//           </p>
//         </div>
//       `,
//     });

//     console.log(`✅ Confirmation email sent to user: ${email}`);

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       orderId: orderId,
//       docId: docRef.id,
//     });
//   } catch (error) {
//     console.error("🔥 Order Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getAllOrders = async (req, res) => {
//   try {
//     const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
//     if (snapshot.empty) return res.json({ success: true, orders: [] });

//     const orders = [];
//     snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("🔥 Get Orders Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getOrdersByCustomer = async (req, res) => {
//   try {
//     const { email } = req.params;
//     if (!email) return res.status(400).json({ success: false, error: "Email is required" });

//     const snapshot = await db.collection("orders").where("email", "==", email).orderBy("createdAt", "desc").get();

//     if (snapshot.empty) return res.json({ success: true, orders: [], message: "No orders found for this customer" });

//     const orders = [];
//     snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
//     res.json({ success: true, orders, count: orders.length });
//   } catch (error) {
//     console.error("🔥 Get Customer Orders Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const trackOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     if (!orderId) return res.status(400).json({ success: false, error: "Order ID is required" });

//     const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
//     if (snapshot.empty) return res.status(404).json({ success: false, error: "Order not found" });

//     const order = snapshot.docs[0].data();
//     res.json({ success: true, order: { id: snapshot.docs[0].id, ...order } });
//   } catch (error) {
//     console.error("🔥 Get Order Details Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const getCustomerStats = async (req, res) => {
//   try {
//     const { email } = req.params;
//     if (!email) return res.status(400).json({ success: false, error: "Email is required" });

//     const snapshot = await db.collection("orders").where("email", "==", email).get();

//     if (snapshot.empty) return res.json({ success: true, stats: { totalOrders: 0, totalSpent: 0, activeOrders: 0, deliveredOrders: 0, pendingOrders: 0 } });

//     let totalSpent = 0, activeOrders = 0, deliveredOrders = 0, pendingOrders = 0, cancelledOrders = 0;
//     const statusCounts = {};

//     snapshot.forEach((doc) => {
//       const order = doc.data();
//       const status = order.orderStatus?.toLowerCase() || "unknown";
//       statusCounts[status] = (statusCounts[status] || 0) + 1;
//       if (status !== "cancelled") totalSpent += order.totalAmount || 0;
//       if (status === "delivered") deliveredOrders++;
//       else if (status === "pending") pendingOrders++;
//       else if (status === "cancelled") cancelledOrders++;
//       else if (["processing", "confirmed", "shipped"].includes(status)) activeOrders++;
//     });

//     res.json({ success: true, stats: { totalOrders: snapshot.size, totalSpent: Math.round(totalSpent), activeOrders, deliveredOrders, pendingOrders, cancelledOrders, statusBreakdown: statusCounts } });
//   } catch (error) {
//     console.error("🔥 Get Customer Stats Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const getRecentOrders = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const { limit = 5 } = req.query;
//     if (!email) return res.status(400).json({ success: false, error: "Email is required" });

//     const snapshot = await db.collection("orders").where("email", "==", email).orderBy("createdAt", "desc").limit(parseInt(limit)).get();

//     const orders = [];
//     snapshot.forEach((doc) => {
//       const order = doc.data();
//       orders.push({ orderId: order.orderId, orderStatus: order.orderStatus, totalAmount: order.totalAmount, createdAt: order.createdAt, items: order.items?.map((item) => ({ name: item.name, quantity: item.quantity })) });
//     });

//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("🔥 Get Recent Orders Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { orderStatus } = req.body;

//     if (!orderStatus) return res.status(400).json({ success: false, error: "Order status is required" });

//     const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
//     if (snapshot.empty) return res.status(404).json({ success: false, error: "Order not found" });

//     const docId = snapshot.docs[0].id;
//     await db.collection("orders").doc(docId).update({ orderStatus, updatedAt: new Date().toISOString() });

//     res.json({ success: true, message: "Order status updated successfully" });
//   } catch (error) {
//     console.error("🔥 Update Order Status Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };



import { db } from "../config/firebase.js";
import { getEstimatedDelivery } from "../utils/helpers.js";
import transporter from "../config/email.js";

// ============================================
// SHIPROCKET INTEGRATION
// ============================================
// (see also: OrderTracking.jsx frontend update, provided separately)

// ⚠️ CHANGE THIS to match your Shiprocket pickup location nickname
// (Shiprocket dashboard → Settings → Pickup Addresses)
const PICKUP_LOCATION_NAME = "warehouse";

// Base URL of your website (used to build the "Track Order" link in emails)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

let shiprocketToken = null;
let tokenExpiry = null;

const getShiprocketToken = async () => {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await response.json();

  if (!data.token) {
    throw new Error("Failed to authenticate with Shiprocket: " + JSON.stringify(data));
  }

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // refresh after 9 days
  return shiprocketToken;
};

// Creates the order on Shiprocket's side. Never throws — returns null on failure
// so a Shiprocket outage never blocks a customer's order from being placed.
const createShiprocketOrder = async ({
  orderId,
  customerName,
  email,
  phone,
  items,
  shippingAddress,
  paymentMethod,
  subtotal,
}) => {
  try {
    const token = await getShiprocketToken();

    const order_items = items.map((item) => ({
      name: item.name,
      sku: item.sku || item.name.replace(/\s+/g, "_").toUpperCase(),
      units: item.quantity,
      selling_price: item.price,
    }));

    const payload = {
      order_id: orderId,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: PICKUP_LOCATION_NAME,
      billing_customer_name: customerName,
      billing_last_name: "",
      billing_address: shippingAddress.address,
      billing_city: shippingAddress.city,
      billing_pincode: shippingAddress.pincode,
      billing_state: shippingAddress.state,
      billing_country: "India",
      billing_email: email,
      billing_phone: phone,
      shipping_is_billing: true,
      order_items,
      payment_method: paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: subtotal,
      // Default package dimensions/weight (cm / kg) — adjust if you track this per product
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔥 Shiprocket order creation failed:", data);
      return null;
    }

    console.log("✅ Shiprocket order created:", data);
    return data; // { order_id, shipment_id, status, awb_code (sometimes), ... }
  } catch (error) {
    console.error("🔥 Shiprocket integration error (customer order still placed):", error);
    return null;
  }
};

// ============================================
// ORDER CONTROLLERS
// ============================================

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      totalAmount,
    } = req.body;

    if (!customerName || !email || !phone || !items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const orderId = "ORD" + Date.now();

    const docRef = await db.collection("orders").add({
      orderId,
      customerName,
      email,
      phone,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      orderStatus: "pending",
      subtotal,
      shipping,
      tax,
      totalAmount,
      createdAt: new Date().toISOString(),
      estimatedDelivery: getEstimatedDelivery(),
    });

    // ✅ Automatically create the order on Shiprocket too.
    // If this fails, the customer's order is NOT affected — it's already saved above.
    const shiprocketResult = await createShiprocketOrder({
      orderId,
      customerName,
      email,
      phone,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
    });

    if (shiprocketResult && shiprocketResult.shipment_id) {
      await docRef.update({
        shiprocketOrderId: shiprocketResult.order_id || null,
        shipmentId: shiprocketResult.shipment_id || null,
        awbCode: shiprocketResult.awb_code || null,
      });
    }

    const itemsList = items
      .map((item) => `<tr>
        <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
        <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
      </tr>`)
      .join("");

    // ✅ Company-க்கு email
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 New Order Received - ${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
          <h2 style="color:#2c7be5;">🛒 New Order Received!</h2>
          <p><b>Order ID:</b> ${orderId}</p>
          <p><b>Customer Name:</b> ${customerName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Payment Method:</b> ${paymentMethod}</p>
          <hr/>
          <h3>📦 Items Ordered:</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f0f0f0;">
              <th style="padding:8px;border:1px solid #ddd;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
              <th style="padding:8px;border:1px solid #ddd;">Total</th>
            </tr>
            ${itemsList}
          </table>
          <hr/>
          <p><b>Subtotal:</b> ₹${subtotal}</p>
          <p><b>Shipping:</b> ₹${shipping}</p>
          <p><b>Tax:</b> ₹${tax}</p>
          <h3 style="color:green;"><b>Total Amount: ₹${totalAmount}</b></h3>
          <hr/>
          <h3>🏠 Shipping Address:</h3>
          <p>
            ${shippingAddress.fullName}<br/>
            ${shippingAddress.address}<br/>
            ${shippingAddress.city} - ${shippingAddress.pincode}<br/>
            ${shippingAddress.state}<br/>
            📞 ${shippingAddress.phone}
          </p>
        </div>
      `,
    });

    console.log(`✅ Company email sent for ${orderId}`);

    // ✅ User-க்கு Order Confirmation Email
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: `✅ Order Confirmed - ${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
          <h2 style="color:#2c7be5;">✅ Your Order is Confirmed!</h2>
          <p>Dear <b>${customerName}</b>,</p>
          <p>Thank you for shopping with <b>MRtech</b>! Your order has been placed successfully.</p>
          <p><b>Order ID:</b> ${orderId}</p>
          <p><b>Payment Method:</b> ${paymentMethod}</p>
          <hr/>
          <h3>📦 Items Ordered:</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f0f0f0;">
              <th style="padding:8px;border:1px solid #ddd;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
            </tr>
            ${items.map((item) => `
              <tr>
                <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
                <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
                <td style="padding:8px;border:1px solid #ddd;">₹${item.price * item.quantity}</td>
              </tr>
            `).join("")}
          </table>
          <hr/>
          <p><b>Subtotal:</b> ₹${subtotal}</p>
          <p><b>Shipping:</b> ₹${shipping}</p>
          <p><b>Tax:</b> ₹${tax}</p>
          <h3 style="color:green;"><b>Total Amount: ₹${totalAmount}</b></h3>
          <hr/>
          <h3>🏠 Delivery Address:</h3>
          <p>
            ${shippingAddress.fullName}<br/>
            ${shippingAddress.address}<br/>
            ${shippingAddress.city} - ${shippingAddress.pincode}<br/>
            ${shippingAddress.state}
          </p>
          <hr/>
          <div style="text-align:center;margin:20px 0;">
            <a href="${FRONTEND_URL}/track-order?orderId=${orderId}"
               style="background:#ff6600;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
              📦 Track Your Order
            </a>
          </div>
          <hr/>
          <p style="color:gray;font-size:12px;">
            For any queries, contact us at ${process.env.ADMIN_EMAIL}
          </p>
        </div>
      `,
    });

    console.log(`✅ Confirmation email sent to user: ${email}`);

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: orderId,
      docId: docRef.id,
    });
  } catch (error) {
    console.error("🔥 Order Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
    if (snapshot.empty) return res.json({ success: true, orders: [] });

    const orders = [];
    snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, orders });
  } catch (error) {
    console.error("🔥 Get Orders Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrdersByCustomer = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });

    const snapshot = await db.collection("orders").where("email", "==", email).orderBy("createdAt", "desc").get();

    if (snapshot.empty) return res.json({ success: true, orders: [], message: "No orders found for this customer" });

    const orders = [];
    snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, orders, count: orders.length });
  } catch (error) {
    console.error("🔥 Get Customer Orders Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ success: false, error: "Order ID is required" });

    const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
    if (snapshot.empty) return res.status(404).json({ success: false, error: "Order not found" });

    const order = snapshot.docs[0].data();
    res.json({ success: true, order: { id: snapshot.docs[0].id, ...order } });
  } catch (error) {
    console.error("🔥 Get Order Details Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ✅ NEW: Live Shiprocket courier tracking (separate from trackOrder above,
// which only reads your own Firestore order status)
export const trackShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ success: false, error: "Order ID is required" });
    }

    const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
    if (snapshot.empty) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const order = snapshot.docs[0].data();

    if (!order.awbCode) {
      return res.json({
        success: true,
        shipped: false,
        orderStatus: order.orderStatus,
        message: "Order has not been shipped yet, no live tracking available.",
      });
    }

    const token = await getShiprocketToken();

    const trackResponse = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${order.awbCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const trackData = await trackResponse.json();

    res.json({
      success: true,
      shipped: true,
      orderId,
      awbCode: order.awbCode,
      tracking: trackData,
    });
  } catch (error) {
    console.error("🔥 Shiprocket Tracking Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error", message: error.message });
  }
};

export const getCustomerStats = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });

    const snapshot = await db.collection("orders").where("email", "==", email).get();

    if (snapshot.empty) return res.json({ success: true, stats: { totalOrders: 0, totalSpent: 0, activeOrders: 0, deliveredOrders: 0, pendingOrders: 0 } });

    let totalSpent = 0, activeOrders = 0, deliveredOrders = 0, pendingOrders = 0, cancelledOrders = 0;
    const statusCounts = {};

    snapshot.forEach((doc) => {
      const order = doc.data();
      const status = order.orderStatus?.toLowerCase() || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      if (status !== "cancelled") totalSpent += order.totalAmount || 0;
      if (status === "delivered") deliveredOrders++;
      else if (status === "pending") pendingOrders++;
      else if (status === "cancelled") cancelledOrders++;
      else if (["processing", "confirmed", "shipped"].includes(status)) activeOrders++;
    });

    res.json({ success: true, stats: { totalOrders: snapshot.size, totalSpent: Math.round(totalSpent), activeOrders, deliveredOrders, pendingOrders, cancelledOrders, statusBreakdown: statusCounts } });
  } catch (error) {
    console.error("🔥 Get Customer Stats Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const { email } = req.params;
    const { limit = 5 } = req.query;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });

    const snapshot = await db.collection("orders").where("email", "==", email).orderBy("createdAt", "desc").limit(parseInt(limit)).get();

    const orders = [];
    snapshot.forEach((doc) => {
      const order = doc.data();
      orders.push({ orderId: order.orderId, orderStatus: order.orderStatus, totalAmount: order.totalAmount, createdAt: order.createdAt, items: order.items?.map((item) => ({ name: item.name, quantity: item.quantity })) });
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("🔥 Get Recent Orders Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Friendly messages shown in the status-update email for each stage
const STATUS_MESSAGES = {
  pending: "Your order has been received and is pending confirmation.",
  processing: "Good news! Your order is now being processed.",
  confirmed: "Your order has been confirmed and will be prepared for shipping soon.",
  shipped: "Your order is on its way! 🚚",
  delivered: "Your order has been delivered. We hope you enjoy it! 🎉",
  cancelled: "Your order has been cancelled.",
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) return res.status(400).json({ success: false, error: "Order status is required" });

    const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
    if (snapshot.empty) return res.status(404).json({ success: false, error: "Order not found" });

    const docId = snapshot.docs[0].id;
    const order = snapshot.docs[0].data();

    await db.collection("orders").doc(docId).update({ orderStatus, updatedAt: new Date().toISOString() });

    // ✅ Notify the customer by email whenever status changes
    try {
      const statusLabel = orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1);
      const message = STATUS_MESSAGES[orderStatus.toLowerCase()] || `Your order status is now: ${statusLabel}`;

      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: order.email,
        subject: `📦 Order Update - ${orderId} is now ${statusLabel}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
            <h2 style="color:#2c7be5;">📦 Order Status Updated</h2>
            <p>Dear <b>${order.customerName}</b>,</p>
            <p>${message}</p>
            <p><b>Order ID:</b> ${orderId}</p>
            <p><b>Current Status:</b> <span style="color:#ff6600;font-weight:bold;">${statusLabel}</span></p>
            <div style="text-align:center;margin:20px 0;">
              <a href="${FRONTEND_URL}/track-order?orderId=${orderId}"
                 style="background:#ff6600;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
                📦 Track Your Order
              </a>
            </div>
            <hr/>
            <p style="color:gray;font-size:12px;">
              For any queries, contact us at ${process.env.ADMIN_EMAIL}
            </p>
          </div>
        `,
      });
      console.log(`✅ Status update email sent to ${order.email} for ${orderId}`);
    } catch (emailError) {
      console.error("🔥 Status update email failed (status still updated):", emailError);
    }

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("🔥 Update Order Status Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};