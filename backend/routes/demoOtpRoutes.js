import express from "express";
import { sendDemoOtp, verifyDemoOtp } from "../controllers/demoOtpController.js";

const router = express.Router();

router.post("/demo/send-otp", sendDemoOtp);
router.post("/demo/verify-otp", verifyDemoOtp);

export default router;