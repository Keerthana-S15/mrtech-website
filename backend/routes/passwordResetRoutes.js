// Password reset routes.
//
// NOTE: reset codes and tokens live in this process's memory, the same as the
// existing signup and demo OTP flows. On Render a restart or a second instance
// will invalidate in-flight codes and the user simply requests a new one.
// Moving them to Firestore with a TTL would make them durable and shared.

import express from "express";
import {
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetPassword,
} from "../controllers/passwordResetController.js";

const router = express.Router();

router.post("/forgot-password/request", requestPasswordReset);
router.post("/forgot-password/verify", verifyPasswordResetOtp);
router.post("/forgot-password/reset", resetPassword);

export default router;
