import crypto from "crypto";
import {
  sendOtpSms,
  normaliseMobile,
  maskMobile,
  Fast2SmsError,
  fast2smsConfig,
} from "../config/fast2sms.js";

// ---------------------------------------------------------------------------
// Cash-on-Delivery OTP gate.
//
// COD is the one payment method where nothing is collected up front, so a
// mistyped or throwaway mobile number produces an order nobody can deliver.
// Before a COD order is written we confirm the customer actually controls the
// delivery number.
//
// The flow mirrors the password reset flow rather than the signup one:
//
//   send   -> we generate the code, Fast2SMS delivers it, we store the hash
//   verify -> correct code exchanges for a single-use, phone-bound token
//   order  -> createOrder consumes that token, and refuses COD without one
//
// The token is what makes this a real gate instead of a UI formality: the
// check lives in createOrder, so POSTing straight to /api/orders with
// paymentMethod "COD" and no verified token is rejected the same way.
//
// Online payments (Card / UPI) are untouched — they never reach this module.
// ---------------------------------------------------------------------------

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_SENDS_PER_WINDOW = 5;
const SEND_WINDOW_MS = 15 * 60 * 1000;

// Long enough to finish reviewing and placing the order after verifying,
// short enough that a verified number cannot be reused hours later.
const TOKEN_TTL_MS = 15 * 60 * 1000;

/** phone -> { hash, expiresAt, attempts, lastSentAt, sends, windowStart } */
const otpStore = new Map();

/** token -> { phone, expiresAt } */
const tokenStore = new Map();

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
const sixDigits = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

function sweep() {
  const now = Date.now();
  for (const [k, v] of otpStore) {
    // Keep an expired code around until its send window closes too, otherwise
    // deleting it would also reset the per-number send counter.
    if (v.expiresAt <= now && now - v.windowStart > SEND_WINDOW_MS) otpStore.delete(k);
  }
  for (const [k, v] of tokenStore) {
    if (v.expiresAt <= now) tokenStore.delete(k);
  }
}

/** Turn a Fast2SmsError into a status + message the checkout popup can show. */
function describeSmsFailure(error) {
  if (!(error instanceof Fast2SmsError)) {
    return { status: 500, message: "Could not send the OTP. Please try again." };
  }
  switch (error.code) {
    case "NOT_CONFIGURED":
    case "DLT_NOT_CONFIGURED":
    case "SMART_NOT_CONFIGURED":
      return {
        status: 503,
        message:
          "SMS verification is unavailable right now. Please choose Card or UPI, or contact support.",
      };
    case "TIMEOUT":
    case "NETWORK":
    case "BAD_RESPONSE":
      return {
        status: 502,
        message: "The SMS service did not respond. Please tap Resend in a moment.",
      };
    default:
      // A validation failure from Fast2SMS — wrong number, blocked route,
      // insufficient balance. Their message is the actionable one.
      return { status: 502, message: `SMS could not be delivered: ${error.message}` };
  }
}

// ---------------------------------------------------------------------------
// Used by orderController — this is the half that makes the gate real.
// ---------------------------------------------------------------------------

/**
 * True when `token` is a live COD token issued for `phone`. Does not consume
 * it, so a request that fails validation later does not burn the token and
 * force the customer through the OTP again.
 */
export function isCodTokenValidFor(token, phone) {
  sweep();
  const normalised = normaliseMobile(phone);
  const entry = tokenStore.get(String(token || ""));
  return Boolean(entry && normalised && entry.phone === normalised);
}

/**
 * Consumes the token. Called once every other check has passed and the order
 * is about to be written, so a double-submitted Place Order cannot produce two
 * orders from one verification. Returns false if it was already used.
 */
export function consumeCodToken(token, phone) {
  if (!isCodTokenValidFor(token, phone)) return false;
  tokenStore.delete(String(token));
  return true;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export const sendCodOtp = async (req, res) => {
  sweep();

  const phone = normaliseMobile(req.body?.phone);
  if (!phone) {
    return res.status(400).json({
      error: "Enter a valid 10-digit Indian mobile number (starting 6, 7, 8 or 9).",
    });
  }

  if (!fast2smsConfig.dltReady) {
    return res.status(503).json({
      error:
        "SMS verification is unavailable right now. Please choose Card or UPI, or contact support.",
    });
  }

  const now = Date.now();
  const existing = otpStore.get(phone);

  if (existing) {
    const since = now - existing.lastSentAt;
    if (since < RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        error: "Please wait a few seconds before requesting another OTP.",
        retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - since) / 1000),
      });
    }
    if (now - existing.windowStart <= SEND_WINDOW_MS && existing.sends >= MAX_SENDS_PER_WINDOW) {
      return res.status(429).json({
        error: "Too many OTP requests for this number. Please try again in 15 minutes.",
      });
    }
  }

  const otp = sixDigits();

  try {
    const { route, requestId } = await sendOtpSms(phone, otp);

    const windowOpen = existing && now - existing.windowStart <= SEND_WINDOW_MS;
    otpStore.set(phone, {
      hash: sha256(otp),
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      lastSentAt: now,
      sends: windowOpen ? existing.sends + 1 : 1,
      windowStart: windowOpen ? existing.windowStart : now,
    });

    // The code itself is deliberately never logged. request_id is the handle
    // for the Fast2SMS delivery report — the only place a per-recipient
    // failure reason can be read.
    console.log(
      `✅ COD OTP accepted for ${maskMobile(phone)} via ${route} (request_id: ${requestId ?? "n/a"}).`
    );

    return res.json({
      success: true,
      message: "OTP sent to your mobile number",
      sentTo: maskMobile(phone),
      expiresInMinutes: OTP_TTL_MS / 60000,
      resendAfterSeconds: RESEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    const { status, message } = describeSmsFailure(error);
    console.error(`❌ COD OTP send failed for ${maskMobile(phone)}: ${error.message}`);
    // Nothing was delivered, so do not leave behind a code the customer
    // cannot possibly receive.
    otpStore.delete(phone);
    return res.status(status).json({ error: message });
  }
};

export const verifyCodOtp = async (req, res) => {
  sweep();

  const phone = normaliseMobile(req.body?.phone);
  const otp = String(req.body?.otp ?? "").trim();

  if (!phone) {
    return res.status(400).json({ error: "Enter a valid 10-digit Indian mobile number." });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: "The OTP is 6 digits." });
  }

  const entry = otpStore.get(phone);
  if (!entry || entry.expiresAt <= Date.now()) {
    if (entry) otpStore.delete(phone);
    return res.status(400).json({
      error: "That OTP has expired. Tap Resend to get a new one.",
      expired: true,
    });
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(phone);
    return res.status(429).json({
      error: "Too many incorrect attempts. Tap Resend to get a new OTP.",
      expired: true,
    });
  }

  const expected = Buffer.from(entry.hash, "hex");
  const supplied = Buffer.from(sha256(otp), "hex");
  if (!crypto.timingSafeEqual(expected, supplied)) {
    const left = Math.max(MAX_VERIFY_ATTEMPTS - entry.attempts, 0);
    return res.status(400).json({
      error: left
        ? `Incorrect OTP. ${left} attempt${left === 1 ? "" : "s"} left.`
        : "Incorrect OTP.",
      attemptsLeft: left,
    });
  }

  otpStore.delete(phone);

  const token = crypto.randomBytes(32).toString("hex");
  tokenStore.set(token, { phone, expiresAt: Date.now() + TOKEN_TTL_MS });

  console.log(`✅ COD mobile verified: ${maskMobile(phone)}`);
  return res.json({
    success: true,
    message: "Mobile number verified",
    codToken: token,
    tokenExpiresInMinutes: TOKEN_TTL_MS / 60000,
  });
};
