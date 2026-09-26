import crypto from "crypto";
import transporter from "../config/email.js";
import {
  sendOtpSms,
  normaliseMobile,
  maskMobile,
  Fast2SmsError,
  fast2smsConfig,
} from "../config/fast2sms.js";
import dotenv from "dotenv";
dotenv.config();

const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------------------------------------------------------------
// Phone OTP state.
//
// The previous implementation asked Fast2SMS to generate the code
// (POST /otp/send with only otp_id) and then checked it with
// POST /otp/verify. That endpoint is one-shot per mobile: once a code has
// been consumed — or a verify has already been attempted — it answers
// "OTP not found or already verified", so a second attempt or a resend could
// never succeed. That is the main reason some numbers appeared never to get
// a usable OTP.
//
// We now generate the code ourselves, hand it to Fast2SMS to deliver, and
// verify it locally. Same delivery route, same credentials, but retries and
// resends work. This mirrors what the Request Demo flow already does.
// ---------------------------------------------------------------------------
const PHONE_OTP_TTL_MS = 5 * 60 * 1000;
const PHONE_MAX_ATTEMPTS = 5;
const PHONE_RESEND_COOLDOWN_MS = 15 * 1000;
const PHONE_MAX_SENDS = 6;
const PHONE_SEND_WINDOW_MS = 15 * 60 * 1000;

/** mobile -> { hash, expiresAt, attempts, lastSentAt, sends, windowStart } */
const phoneOtpStore = new Map();

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
const sixDigits = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

function sweepPhoneOtps() {
  const now = Date.now();
  for (const [k, v] of phoneOtpStore) {
    const stale = v.expiresAt <= now && now - v.windowStart > PHONE_SEND_WINDOW_MS;
    if (stale) phoneOtpStore.delete(k);
  }
}

/** Turn a Fast2SmsError into a status + message the signup form can show. */
function describeSmsFailure(error) {
  if (!(error instanceof Fast2SmsError)) {
    return { status: 500, message: "Could not send the OTP. Please try again." };
  }
  switch (error.code) {
    case "NOT_CONFIGURED":
    case "SMART_NOT_CONFIGURED":
      return {
        status: 503,
        message: "SMS service is not configured. Please use email verification or contact support.",
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
      // insufficient balance. Surface their message, it is the actionable one.
      return {
        status: 502,
        message: `SMS could not be delivered: ${error.message}`,
      };
  }
}

export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000;
  otpStore[`email_${email}`] = { otp, expiry };

  try {
    await transporter.sendMail({
      from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Your Signup OTP - Myth Reality Technologies",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px;background:#fafafa;">
          <h2 style="color:#333;text-align:center;">Email Verification</h2>
          <p style="color:#555;text-align:center;">Your OTP for signup is:</p>
          <div style="font-size:36px;font-weight:bold;text-align:center;color:#4F46E5;letter-spacing:8px;margin:24px 0;">
            ${otp}
          </div>
          <p style="color:#888;text-align:center;font-size:13px;">Valid for 5 minutes. Do not share this OTP with anyone.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
          <p style="color:#aaa;text-align:center;font-size:12px;">— Myth Reality Technologies</p>
        </div>
      `,
    });

    console.log(`✅ Email OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("❌ Email OTP Error:", error);
    res.status(500).json({ error: "Failed to send email OTP" });
  }
};

export const verifyEmailOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP required" });

  const stored = otpStore[`email_${email}`];
  if (!stored)
    return res.status(400).json({ error: "OTP not found. Request again." });

  if (Date.now() > stored.expiry) {
    delete otpStore[`email_${email}`];
    return res.status(400).json({ error: "OTP expired. Request again." });
  }

  if (stored.otp !== otp.toString())
    return res.status(400).json({ error: "Invalid OTP. Try again." });

  delete otpStore[`email_${email}`];
  res.json({ success: true, message: "Email verified successfully" });
};

export const sendPhoneOtp = async (req, res) => {
  sweepPhoneOtps();
  const raw = req.body?.phone;
  if (!raw) return res.status(400).json({ error: "Phone number is required" });

  // Accepts "98765 43210", "+91-9876543210", "09876543210", "919876543210".
  // The old check only stripped a leading "+91" or "0" and then demanded
  // exactly 10 characters, so spaces, hyphens and a bare "91" prefix were all
  // rejected before a message was ever attempted.
  const phone = normaliseMobile(raw);
  if (!phone) {
    return res.status(400).json({
      error: "Enter a valid 10-digit Indian mobile number (starting 6, 7, 8 or 9).",
    });
  }

  if (!fast2smsConfig.configured) {
    return res.status(503).json({
      error: "SMS service is not configured. Please use email verification or contact support.",
    });
  }

  const now = Date.now();
  const existing = phoneOtpStore.get(phone);

  if (existing) {
    const since = now - existing.lastSentAt;
    if (since < PHONE_RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        error: "Please wait a few seconds before requesting another OTP.",
        retryAfterSeconds: Math.ceil((PHONE_RESEND_COOLDOWN_MS - since) / 1000),
      });
    }
    if (now - existing.windowStart <= PHONE_SEND_WINDOW_MS && existing.sends >= PHONE_MAX_SENDS) {
      return res.status(429).json({
        error: "Too many OTP requests for this number. Please try again in 15 minutes.",
      });
    }
  }

  const otp = sixDigits();

  try {
    // We pass our own code so it can be verified locally. sendOtpSms tries the
    // DLT route first, which is what reaches DND-registered numbers; Smart OTP
    // is the fallback and is what this flow used to use exclusively.
    const { route, requestId, attempts } = await sendOtpSms(phone, otp, {
      expiryMinutes: PHONE_OTP_TTL_MS / 60000,
    });
    if (attempts.length) {
      console.warn(
        `⚠️  Signup OTP for ${maskMobile(phone)} fell back to ${route}: ` +
          attempts.map((a) => `${a.route} [${a.code}] ${a.message}`).join("; ")
      );
    }

    const windowOpen = existing && now - existing.windowStart <= PHONE_SEND_WINDOW_MS;
    phoneOtpStore.set(phone, {
      hash: sha256(otp),
      expiresAt: now + PHONE_OTP_TTL_MS,
      attempts: 0,
      lastSentAt: now,
      sends: windowOpen ? existing.sends + 1 : 1,
      windowStart: windowOpen ? existing.windowStart : now,
    });

    // The code itself is deliberately not logged.
    // request_id is the handle for the Fast2SMS dashboard delivery report —
    // the only place a per-recipient failure reason can be read.
    console.log(
      `✅ Signup OTP accepted for ${maskMobile(phone)} via ${route} (request_id: ${requestId ?? "n/a"}). ` +
        "Accepted != delivered; check the Fast2SMS delivery report for this id if the user reports no SMS."
    );
    return res.json({
      success: true,
      message: "OTP sent to your phone",
      sentTo: maskMobile(phone),
      expiresInMinutes: PHONE_OTP_TTL_MS / 60000,
      resendAfterSeconds: PHONE_RESEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    const { status, message } = describeSmsFailure(error);
    console.error(`❌ Signup OTP send failed for ${maskMobile(phone)}: ${error.message}`);
    // Nothing was delivered, so do not leave a code the user cannot receive.
    phoneOtpStore.delete(phone);
    return res.status(status).json({ error: message });
  }
};

export const verifyPhoneOtp = async (req, res) => {
  sweepPhoneOtps();
  const raw = req.body?.phone;
  const otp = String(req.body?.otp ?? "").trim();

  if (!raw || !otp) {
    return res.status(400).json({ error: "Phone and OTP required" });
  }

  const phone = normaliseMobile(raw);
  if (!phone) {
    return res.status(400).json({ error: "Enter a valid 10-digit Indian mobile number." });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: "The OTP is 6 digits." });
  }

  const entry = phoneOtpStore.get(phone);
  if (!entry || entry.expiresAt <= Date.now()) {
    if (entry) phoneOtpStore.delete(phone);
    return res.status(400).json({ error: "That OTP has expired. Tap Resend to get a new one." });
  }

  entry.attempts += 1;
  if (entry.attempts > PHONE_MAX_ATTEMPTS) {
    phoneOtpStore.delete(phone);
    return res.status(429).json({ error: "Too many incorrect attempts. Tap Resend to get a new OTP." });
  }

  const expected = Buffer.from(entry.hash, "hex");
  const supplied = Buffer.from(sha256(otp), "hex");
  if (!crypto.timingSafeEqual(expected, supplied)) {
    const left = Math.max(PHONE_MAX_ATTEMPTS - entry.attempts, 0);
    return res.status(400).json({
      error: left
        ? `Incorrect OTP. ${left} attempt${left === 1 ? "" : "s"} left.`
        : "Incorrect OTP.",
      attemptsLeft: left,
    });
  }

  phoneOtpStore.delete(phone);
  console.log(`✅ Signup phone verified: ${maskMobile(phone)}`);
  return res.json({ success: true, message: "Phone verified successfully" });
};