// import express from "express";
// import {
//   createOrder,
//   getAllOrders,
//   getOrdersByCustomer,
//   trackOrder,
//   getCustomerStats,
//   getRecentOrders,
//   updateOrderStatus,
// } from "../controllers/orderController.js";

// const router = express.Router();

// router.post("/orders", createOrder);
// router.get("/orders", getAllOrders);
// router.get("/orders/customer/:email", getOrdersByCustomer);
// router.get("/orders/track/:orderId", trackOrder);
// router.get("/orders/customer/:email/stats", getCustomerStats);
// router.get("/orders/customer/:email/recent", getRecentOrders);
// router.put("/orders/:orderId", updateOrderStatus);

// export default router;






// import express from "express";
// import {
//   createOrder,
//   getAllOrders,
//   getOrdersByCustomer,
//   trackOrder,
//   trackShipment,
//   getCustomerStats,
//   getRecentOrders,
//   updateOrderStatus,
// } from "../controllers/orderController.js";

// const router = express.Router();

// router.post("/orders", createOrder);
// router.get("/orders", getAllOrders);
// router.get("/orders/customer/:email", getOrdersByCustomer);
// router.get("/orders/track/:orderId", trackOrder);
// router.get("/orders/shiprocket-track/:orderId", trackShipment);
// router.get("/orders/customer/:email/stats", getCustomerStats);
// router.get("/orders/customer/:email/recent", getRecentOrders);
// router.put("/orders/:orderId", updateOrderStatus);

// export default router;





import express from "express";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  sendDeliveryOtp,
  verifyDeliveryOtp,
  sendRefusalOtp,
  verifyRefusalOtp,
} from "../controllers/deliveryOtpController.js";
import {
  createOrder,
  getAdminOrders,
  getOrdersByCustomer,
  trackOrder,
  trackShipment,
  getCustomerStats,
  getRecentOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Customer-facing — no login required
router.post("/orders", createOrder);
router.get("/orders/customer/:email", getOrdersByCustomer);
router.get("/orders/track/:orderId", trackOrder);
router.get("/orders/shiprocket-track/:orderId", trackShipment);
router.get("/orders/customer/:email/stats", getCustomerStats);
router.get("/orders/customer/:email/recent", getRecentOrders);

// A customer cancelling their own order. Distinct from the admin status route
// below: that one needs a token and can set any status, this one only ever
// sets "cancelled" and only within the rules in cancellability(). The extra
// path segment keeps it clear of PUT /orders/:orderId, which is admin-only.
router.put("/orders/:orderId/cancel", cancelOrder);

// ✅ NEW: Admin-only, company-scoped
router.get("/orders", requireAdmin, getAdminOrders);
router.put("/orders/:orderId", requireAdmin, updateOrderStatus);

// Cash-on-Delivery collection at the doorstep: email a code to the customer,
// then verify it to mark the order delivered with the payment collected.
router.post("/orders/:orderId/delivery-otp/send", requireAdmin, sendDeliveryOtp);
router.post("/orders/:orderId/delivery-otp/verify", requireAdmin, verifyDeliveryOtp);

// The other outcome at the door: the customer refuses the order. Same proof —
// a code emailed to the customer and verified here — but it cancels rather
// than completing, and records why. Admin-only, company-scoped, like the pair
// above; a customer cannot reach these.
router.post("/orders/:orderId/refusal-otp/send", requireAdmin, sendRefusalOtp);
router.post("/orders/:orderId/refusal-otp/verify", requireAdmin, verifyRefusalOtp);
router.delete("/orders/:orderId", requireAdmin, deleteOrder);

export default router;