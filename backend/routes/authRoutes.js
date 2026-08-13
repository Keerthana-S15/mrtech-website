// import express from "express";
// import { register, login } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;




// import express from "express";
// import { register, login, createCompanyAdmin } from "../controllers/authController.js";
// import { requireAdmin, requireSuperAdmin } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// // ✅ NEW: Only MRtech's super admin can create a new company's admin account
// router.post("/admin/create-company-admin", requireAdmin, requireSuperAdmin, createCompanyAdmin);

// export default router;




import express from "express";
import { register, login, createCompanyAdmin, getCompanies } from "../controllers/authController.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Only MRtech's super admin can create a new company's admin account, or list companies
router.post("/admin/create-company-admin", requireAdmin, requireSuperAdmin, createCompanyAdmin);
router.get("/admin/companies", requireAdmin, requireSuperAdmin, getCompanies);

export default router;