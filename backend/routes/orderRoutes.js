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






import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  trackOrder,
  trackShipment,
  getCustomerStats,
  getRecentOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/customer/:email", getOrdersByCustomer);
router.get("/orders/track/:orderId", trackOrder);
router.get("/orders/shiprocket-track/:orderId", trackShipment);
router.get("/orders/customer/:email/stats", getCustomerStats);
router.get("/orders/customer/:email/recent", getRecentOrders);
router.put("/orders/:orderId", updateOrderStatus);

export default router;