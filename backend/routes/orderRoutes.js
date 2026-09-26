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
router.delete("/orders/:orderId", requireAdmin, deleteOrder);

export default router;