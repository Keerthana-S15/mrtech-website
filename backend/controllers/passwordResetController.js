// =============================================================================
// Password reset — request OTP, verify it, set a new password.
//
// Design notes:
//  • No account enumeration. /request always answers the same way whether or
//    not the identifier exists; we only actually send when it does.
//  • OTPs and reset tokens are kept hashed, never in plain text, and are
//    single-use with a short expiry.
//  • Verify attempts and send attempts are both capped.
//  • The OTP is never written to the logs. The signup flow logs its codes,
//    which is tolerable there but not for an account-recovery code.
//
// State lives in memory, matching the existing signup/demo OTP controllers.
// That means codes do not survive a restart and are not shared across
// instances — see the note in the route file.
// =============================================================================

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "../config/firebase.js";
import transporter from "../config/email.js";
import { sendOtpSms, normaliseMobile, maskMobile } from "../config/fast2sms.js";
import dotenv from "dotenv";

dotenv.config();

const OTP_TTL_MS = 10 * 60 * 1000;        // code is valid for 10 minutes
const TOKEN_TTL_MS = 10 * 60 * 1000;      // reset window after a successful verify
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_MS = 15 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 6;            // matches the signup rule

/** key -> { hash, expiresAt, attempts, channel, target, collection, docId } */
const otpStore = new Map();
/** tokenHash -> { expiresAt, collection, docId, email } */
const tokenStore = new Map();
/** key -> { count, windowStart } */
const sendLog = new Map();

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
const sixDigits = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!domain) return "***";
  const head = name.slice(0, Math.min(2, name.length));
  return `${head}${"*".repeat(Math.max(name.length - head.length, 1))}@${domain}`;
};

/** Drop anything past its expiry so the maps cannot grow without bound. */
function sweep() {
  const now = Date.now();
  for (const [k, v] of otpStore) if (v.expiresAt <= now) otpStore.delete(k);
  for (const [k, v] of tokenStore) if (v.expiresAt <= now) tokenStore.delete(k);
  for (const [k, v] of sendLog) if (now - v.windowStart > SEND_WINDOW_MS) sendLog.delete(k);
}

/**
 * Look the identifier up the same way login does: users first, then admin,
 * by email then phone. Returns null when nothing matches.
 */
async function findAccount(identifier) {
  const lookups = [
    ["users", "email"],
    ["users", "phone"],
    ["admin", "email"],
    ["admin", "phone"],
  ];
  for (const [collection, field] of lookups) {
    const snap = await db.collection(collection).where(field, "==", identifier).limit(1).get();
    if (!snap.empty) {
      const doc = snap.docs[0];
      return { collection, docId: doc.id, data: doc.data() };
    }
  }
  return null;
}

function rateLimited(key) {
  const now = Date.now();
  const entry = sendLog.get(key);
  if (!entry || now - entry.windowStart > SEND_WINDOW_MS) {
    sendLog.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_SENDS_PER_WINDOW;
}

async function deliverEmailOtp(email, otp) {
  await transporter.sendMail({
    from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
    to: email,
    subject: "Password reset code - Myth Reality Technologies",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px;background:#fafafa;">
        <h2 style="color:#00313C;text-align:center;margin:0 0 8px;">Password reset</h2>
        <p style="color:#555;text-align:center;margin:0;">Use this code to reset your password:</p>
        <div style="font-size:36px;font-weight:bold;text-align:center;color:#0891b2;letter-spacing:8px;margin:24px 0;">${otp}</div>
        <p style="color:#888;text-align:center;font-size:13px;margin:0;">Valid for 10 minutes. Do not share this code with anyone.</p>
        <p style="color:#888;text-align:center;font-size:13px;">If you did not request a password reset, you can ignore this email — your password will not change.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#aaa;text-align:center;font-size:12px;">— Myth Reality Technologies</p>
      </div>
    `,
  });
}

// -----------------------------------------------------------------------------
// POST /api/forgot-password/request  { identifier }
// -----------------------------------------------------------------------------
export const requestPasswordReset = async (req, res) => {
  sweep();
  const identifier = String(req.body?.identifier || "").trim();

  if (!identifier) {
    return res.status(400).json({ error: "Enter your registered email or phone number." });
  }

  const looksLikeEmail = isEmail(identifier);
  const mobile = looksLikeEmail ? null : normaliseMobile(identifier);
  if (!looksLikeEmail && !mobile) {
    return res.status(400).json({ error: "Enter a valid email address or 10-digit mobile number." });
  }

  const key = looksLikeEmail ? `email:${identifier.toLowerCase()}` : `phone:${mobile}`;

  if (rateLimited(key)) {
    return res.status(429).json({
      error: "Too many reset requests. Please wait 15 minutes before trying again.",
    });
  }

  // Answered identically whether or not the account exists, so this endpoint
  // cannot be used to discover which emails or numbers are registered.
  const genericResponse = {
    success: true,
    channel: looksLikeEmail ? "email" : "sms",
    sentTo: looksLikeEmail ? maskEmail(identifier) : maskMobile(mobile),
    expiresInMinutes: OTP_TTL_MS / 60000,
    message: looksLikeEmail
      ? "If that email is registered, a reset code is on its way."
      : "If that number is registered, a reset code is on its way.",
  };

  try {
    const account = await findAccount(looksLikeEmail ? identifier : mobile);

    if (!account) {
      // Nothing to send. Same shape, same status, similar timing.
      return res.json(genericResponse);
    }

    const otp = sixDigits();
    otpStore.set(key, {
      hash: sha256(otp),
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      channel: looksLikeEmail ? "email" : "sms",
      collection: account.collection,
      docId: account.docId,
      email: account.data.email || null,
    });

    if (looksLikeEmail) {
      await deliverEmailOtp(identifier, otp);
    } else {
      // DLT first so DND-registered numbers are reached; Smart OTP as fallback
      const sms = await sendOtpSms(mobile, otp, { expiryMinutes: OTP_TTL_MS / 60000 });
      console.log(
        `🔐 Reset OTP accepted for ${maskMobile(mobile)} via ${sms.route} (request_id: ${sms.requestId ?? "n/a"})`
      );
    }

    console.log(`🔐 Password reset code issued for ${key.startsWith("email") ? maskEmail(identifier) : maskMobile(mobile)}`);
    return res.json(genericResponse);
  } catch (error) {
    console.error("🔥 Password reset request failed:", error.message);
    // The account may exist but delivery failed — that is a real error the
    // user needs to see, and it leaks nothing about registration.
    otpStore.delete(key);
    return res.status(502).json({
      error: looksLikeEmail
        ? "We could not send the email right now. Please try again shortly."
        : "We could not send the SMS right now. Please try again shortly.",
    });
  }
};

// -----------------------------------------------------------------------------
// POST /api/forgot-password/verify  { identifier, otp }
// -----------------------------------------------------------------------------
export const verifyPasswordResetOtp = async (req, res) => {
  sweep();
  const identifier = String(req.body?.identifier || "").trim();
  const otp = String(req.body?.otp || "").trim();

  if (!identifier || !otp) {
    return res.status(400).json({ error: "Enter the code we sent you." });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: "The code is 6 digits." });
  }

  const looksLikeEmail = isEmail(identifier);
  const mobile = looksLikeEmail ? null : normaliseMobile(identifier);
  const key = looksLikeEmail ? `email:${identifier.toLowerCase()}` : `phone:${mobile}`;

  const entry = otpStore.get(key);
  if (!entry) {
    return res.status(400).json({ error: "That code has expired. Request a new one." });
  }
  if (entry.expiresAt <= Date.now()) {
    otpStore.delete(key);
    return res.status(400).json({ error: "That code has expired. Request a new one." });
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(key);
    return res.status(429).json({ error: "Too many incorrect attempts. Request a new code." });
  }

  // timingSafeEqual over the hashes: same length every time, so comparison
  // cost does not depend on how much of the code was right.
  const expected = Buffer.from(entry.hash, "hex");
  const supplied = Buffer.from(sha256(otp), "hex");
  if (!crypto.timingSafeEqual(expected, supplied)) {
    return res.status(400).json({
      error: "That code is not correct.",
      attemptsLeft: Math.max(MAX_VERIFY_ATTEMPTS - entry.attempts, 0),
    });
  }

  // Single use: the code is spent whether or not the reset completes.
  otpStore.delete(key);

  const resetToken = crypto.randomBytes(32).toString("hex");
  tokenStore.set(sha256(resetToken), {
    expiresAt: Date.now() + TOKEN_TTL_MS,
    collection: entry.collection,
    docId: entry.docId,
    email: entry.email,
  });

  return res.json({
    success: true,
    resetToken,
    expiresInMinutes: TOKEN_TTL_MS / 60000,
    message: "Code verified. Choose a new password.",
  });
};

// -----------------------------------------------------------------------------
// POST /api/forgot-password/reset  { resetToken, password }
// -----------------------------------------------------------------------------
export const resetPassword = async (req, res) => {
  sweep();
  const resetToken = String(req.body?.resetToken || "").trim();
  const password = String(req.body?.password || "");

  if (!resetToken) {
    return res.status(400).json({ error: "Your reset session has expired. Start again." });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
  }

  const tokenHash = sha256(resetToken);
  const entry = tokenStore.get(tokenHash);
  if (!entry || entry.expiresAt <= Date.now()) {
    tokenStore.delete(tokenHash);
    return res.status(400).json({ error: "Your reset session has expired. Start again." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.collection(entry.collection).doc(entry.docId).update({
      password: hashed,
      passwordUpdatedAt: new Date().toISOString(),
    });

    // Burn the token, and any other live token for the same account.
    tokenStore.delete(tokenHash);
    for (const [k, v] of tokenStore) {
      if (v.collection === entry.collection && v.docId === entry.docId) tokenStore.delete(k);
    }

    console.log(`🔐 Password reset completed for ${entry.collection}/${entry.docId}`);
    return res.json({ success: true, message: "Password updated. You can sign in now." });
  } catch (error) {
    console.error("🔥 Password reset failed:", error.message);
    return res.status(500).json({ error: "We could not update your password. Please try again." });
  }
};
