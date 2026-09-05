// import express from "express";
// import { sendDemoOtp, verifyDemoOtp } from "../controllers/demoOtpController.js";

// const router = express.Router();

// router.post("/demo/send-otp", sendDemoOtp);
// router.post("/demo/verify-otp", verifyDemoOtp);

// export default router;



import express from "express";
import { sendDemoOtp, verifyDemoOtp } from "../controllers/demoOtpController.js";

const router = express.Router();

// ✅ FIX: removed the "/demo" prefix — frontend (Home.jsx) calls
// "/api/send-otp" and "/api/verify-otp" directly, so these routes must
// match exactly (index.js already mounts this router at "/api").
router.post("/send-otp", sendDemoOtp);
router.post("/verify-otp", verifyDemoOtp);

export default router;