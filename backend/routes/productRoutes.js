// import express from "express";
// import upload from "../middleware/uploadMiddleware.js";
// import {
//   addProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } from "../controllers/productController.js";

// const router = express.Router();

// router.post("/products", upload.single("image"), addProduct);
// router.get("/products", getAllProducts);
// router.get("/products/:id", getProductById);
// router.put("/products/:id", upload.single("image"), updateProduct);
// router.delete("/products/:id", deleteProduct);

// export default router;





import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import {
  addProduct,
  getAllProducts,
  getAdminProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public storefront routes — unchanged, no login required
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

// ✅ NEW: Admin-only, company-scoped routes
router.get("/admin/products", requireAdmin, getAdminProducts);
router.post("/products", requireAdmin, upload.single("image"), addProduct);
router.put("/products/:id", requireAdmin, upload.single("image"), updateProduct);
router.delete("/products/:id", requireAdmin, deleteProduct);

export default router;