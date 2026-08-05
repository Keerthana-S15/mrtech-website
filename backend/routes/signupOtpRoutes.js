import express from "express";
import {
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "../controllers/signupOtpController.js";

const router = express.Router();

router.post("/signup/send-email-otp",   sendEmailOtp);
router.post("/signup/verify-email-otp", verifyEmailOtp);
router.post("/signup/send-phone-otp",   sendPhoneOtp);
router.post("/signup/verify-phone-otp", verifyPhoneOtp);

export default router;  // ✅ இந்த line இருக்கா check பண்ணுங்க