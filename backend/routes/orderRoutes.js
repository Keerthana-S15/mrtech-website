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
import { sendDeliveryOtp, verifyDeliveryOtp } from "../controllers/deliveryOtpController.js";
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
} from "../controllers/orderController.js";

const router = express.Router();

// Customer-facing — no login required
router.post("/orders", createOrder);
router.get("/orders/customer/:email", getOrdersByCustomer);
router.get("/orders/track/:orderId", trackOrder);
router.get("/orders/shiprocket-track/:orderId", trackShipment);
router.get("/orders/customer/:email/stats", getCustomerStats);
router.get("/orders/customer/:email/recent", getRecentOrders);

// ✅ NEW: Admin-only, company-scoped
router.get("/orders", requireAdmin, getAdminOrders);
router.put("/orders/:orderId", requireAdmin, updateOrderStatus);

// Cash-on-Delivery collection at the doorstep: email a code to the customer,
// then verify it to mark the order delivered with the payment collected.
router.post("/orders/:orderId/delivery-otp/send", requireAdmin, sendDeliveryOtp);
router.post("/orders/:orderId/delivery-otp/verify", requireAdmin, verifyDeliveryOtp);
router.delete("/orders/:orderId", requireAdmin, deleteOrder);

export default router;