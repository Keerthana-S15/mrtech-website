// import transporter from "../config/email.js";
// import { db } from "../config/firebase.js";
// import fetch from "node-fetch";

// const demoOtpStore = {};

// // ✅ Send OTP for Demo Request (Email + Mobile)
// export const sendDemoOtp = async (req, res) => {
//   const { email, mobile } = req.body;
  
//   if (!email || !mobile) {
//     return res.status(400).json({ error: "Email and Mobile are required" });
//   }

//   // Generate 6-digit OTPs
//   const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
//   const mobileOtp = Math.floor(100000 + Math.random() * 900000).toString();

//   // Store OTPs
//   demoOtpStore[email] = {
//     emailOtp,
//     mobileOtp,
//     mobile,
//     expiresAt: Date.now() + 5 * 60 * 1000,
//   };

//   try {
//     // Send Email OTP
//     await transporter.sendMail({
//       from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
//       to: email,
//       subject: "Your Email OTP - MRtech Demo Request",
//       text: `Your Email OTP is: ${emailOtp}\nThis code expires in 5 minutes.`,
//     });
//     console.log(`✅ Demo Email OTP sent to ${email}: ${emailOtp}`);

//     // Send Mobile OTP via SMS
//     await sendDemoSmsOtp(mobile, mobileOtp);
//     console.log(`✅ Demo Mobile OTP sent to ${mobile}: ${mobileOtp}`);

//     res.json({ 
//       success: true, 
//       message: "Demo request OTP sent to both Email and Mobile!" 
//     });
//   } catch (error) {
//     console.error("❌ Demo OTP Error:", error);
//     res.status(500).json({ error: "Failed to send demo OTP" });
//   }
// };

// // Fast2SMS - Demo Request Template
// const sendDemoSmsOtp = async (mobile, otp) => {
//   try {
//     const url = new URL('https://www.fast2sms.com/dev/bulkV2');
    
//     url.searchParams.append('authorization', process.env.FAST2SMS_API_KEY);
//     url.searchParams.append('variables_values', otp);
//     url.searchParams.append('route', 'dlt');
//     url.searchParams.append('numbers', mobile);
//     url.searchParams.append('sender_id', 'MYTRTC');
//     url.searchParams.append('template_id', '1007208441947127345');
//     url.searchParams.append('entity_id', '1001494195307399829');
    
//     console.log("📤 Demo SMS OTP - Fast2SMS API Call");
//     console.log("📱 Mobile:", mobile);
//     console.log("🔢 OTP:", otp);
//     console.log("📋 Template: DEMO_REQUEST_OTP");
//     console.log("🆔 Template ID: 1007208441947127345");
//     console.log("🏢 Entity ID: 1001494195307399829");

//     const response = await fetch(url.toString(), { method: 'GET' });
//     const data = await response.json();
    
//     console.log("📨 Demo SMS Response:", JSON.stringify(data, null, 2));
    
//     if (data.return === false || data.type === 'error') {
//       throw new Error(data.message || 'Demo SMS sending failed');
//     }
    
//     console.log("✅ SMS Sent Successfully!");
//     return data;
//   } catch (error) {
//     console.error("❌ Demo SMS Error:", error.message);
//     throw error;
//   }
// };

// // ✅ Verify Demo Request OTP
// export const verifyDemoOtp = async (req, res) => {
//   const { name, email, mobile, emailOtp, mobileOtp } = req.body;

//   if (!demoOtpStore[email]) {
//     return res.status(400).json({ error: "OTP not found or expired" });
//   }

//   const stored = demoOtpStore[email];

//   if (Date.now() > stored.expiresAt) {
//     delete demoOtpStore[email];
//     return res.status(400).json({ error: "OTP expired" });
//   }

//   if (emailOtp !== stored.emailOtp) {
//     return res.status(400).json({ error: "Invalid Email OTP" });
//   }

//   if (mobileOtp !== stored.mobileOtp) {
//     return res.status(400).json({ error: "Invalid Mobile OTP" });
//   }

//   try {
//     await db.collection("demoRequests").add({
//       name,
//       email,
//       mobile,
//       verifiedAt: new Date().toISOString(),
//       createdAt: new Date().toISOString(),
//     });

//     await transporter.sendMail({
//       from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "✅ New Verified Demo Request",
//       text: `
// New Demo Request (Verified):
// -----------------------------
// Name: ${name}
// Email: ${email}
// Mobile: ${mobile}
// Verified At: ${new Date().toLocaleString()}
//       `,
//     });

//     delete demoOtpStore[email];

//     console.log("✅ Demo OTPs verified! Request saved.");
//     res.json({ 
//       success: true, 
//       message: "Demo request submitted successfully!" 
//     });
//   } catch (error) {
//     console.error("❌ Demo Verification Error:", error);
//     res.status(500).json({ error: "Failed to process demo request" });
//   }
// };





// import transporter from "../config/email.js";
// import { db } from "../config/firebase.js";
// import fetch from "node-fetch";

// const demoOtpStore = {};

// // ✅ Send OTP for Demo Request (Email + Mobile)
// export const sendDemoOtp = async (req, res) => {
//   const { email, mobile } = req.body;
  
//   if (!email || !mobile) {
//     return res.status(400).json({ error: "Email and Mobile are required" });
//   }

//   // Generate 6-digit OTPs
//   const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
//   const mobileOtp = Math.floor(100000 + Math.random() * 900000).toString();

//   // Store OTPs
//   demoOtpStore[email] = {
//     emailOtp,
//     mobileOtp,
//     mobile,
//     expiresAt: Date.now() + 5 * 60 * 1000,
//   };

//   try {
//     // Send Email OTP
//     await transporter.sendMail({
//       from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
//       to: email,
//       subject: "Your Email OTP - MRtech Demo Request",
//       text: `Your Email OTP is: ${emailOtp}\nThis code expires in 5 minutes.`,
//     });
//     console.log(`✅ Demo Email OTP sent to ${email}: ${emailOtp}`);

//     // Send Mobile OTP via SMS
//     await sendDemoSmsOtp(mobile, mobileOtp);
//     console.log(`✅ Demo Mobile OTP sent to ${mobile}: ${mobileOtp}`);

//     res.json({ 
//       success: true, 
//       message: "Demo request OTP sent to both Email and Mobile!" 
//     });
//   } catch (error) {
//     console.error("❌ Demo OTP Error:", error);
//     res.status(500).json({ error: "Failed to send demo OTP" });
//   }
// };

// // Fast2SMS - Demo Request Template
// const sendDemoSmsOtp = async (mobile, otp) => {
//   try {
//     const url = new URL('https://www.fast2sms.com/dev/bulkV2');
    
//     url.searchParams.append('authorization', process.env.FAST2SMS_API_KEY);
//     url.searchParams.append('variables_values', otp);
//     url.searchParams.append('route', 'dlt');
//     url.searchParams.append('numbers', mobile);
//     // ✅ FIX: these were hardcoded before (entity_id especially was WRONG —
//     // didn't match the value in .env), now all pulled from environment
//     // variables so they always stay in sync with your Fast2SMS DLT setup.
//     url.searchParams.append('sender_id', process.env.FAST2SMS_SENDER_ID);
//     url.searchParams.append('template_id', process.env.FAST2SMS_TEMPLATE_ID);
//     url.searchParams.append('entity_id', process.env.FAST2SMS_ENTITY_ID);
    
//     console.log("📤 Demo SMS OTP - Fast2SMS API Call");
//     console.log("📱 Mobile:", mobile);
//     console.log("🔢 OTP:", otp);
//     console.log("📋 Template: DEMO_REQUEST_OTP");
//     console.log("🆔 Template ID:", process.env.FAST2SMS_TEMPLATE_ID);
//     console.log("🏢 Entity ID:", process.env.FAST2SMS_ENTITY_ID);

//     const response = await fetch(url.toString(), { method: 'GET' });
//     const data = await response.json();
    
//     console.log("📨 Demo SMS Response:", JSON.stringify(data, null, 2));
    
//     if (data.return === false || data.type === 'error') {
//       throw new Error(data.message || 'Demo SMS sending failed');
//     }
    
//     console.log("✅ SMS Sent Successfully!");
//     return data;
//   } catch (error) {
//     console.error("❌ Demo SMS Error:", error.message);
//     throw error;
//   }
// };

// // ✅ Verify Demo Request OTP
// export const verifyDemoOtp = async (req, res) => {
//   const { name, email, mobile, emailOtp, mobileOtp } = req.body;

//   if (!demoOtpStore[email]) {
//     return res.status(400).json({ error: "OTP not found or expired" });
//   }

//   const stored = demoOtpStore[email];

//   if (Date.now() > stored.expiresAt) {
//     delete demoOtpStore[email];
//     return res.status(400).json({ error: "OTP expired" });
//   }

//   if (emailOtp !== stored.emailOtp) {
//     return res.status(400).json({ error: "Invalid Email OTP" });
//   }

//   if (mobileOtp !== stored.mobileOtp) {
//     return res.status(400).json({ error: "Invalid Mobile OTP" });
//   }

//   try {
//     await db.collection("demoRequests").add({
//       name,
//       email,
//       mobile,
//       verifiedAt: new Date().toISOString(),
//       createdAt: new Date().toISOString(),
//     });

//     await transporter.sendMail({
//       from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "✅ New Verified Demo Request",
//       text: `
// New Demo Request (Verified):
// -----------------------------
// Name: ${name}
// Email: ${email}
// Mobile: ${mobile}
// Verified At: ${new Date().toLocaleString()}
//       `,
//     });

//     delete demoOtpStore[email];

//     console.log("✅ Demo OTPs verified! Request saved.");
//     res.json({ 
//       success: true, 
//       message: "Demo request submitted successfully!" 
//     });
//   } catch (error) {
//     console.error("❌ Demo Verification Error:", error);
//     res.status(500).json({ error: "Failed to process demo request" });
//   }
// };



import transporter from "../config/email.js";
import { db } from "../config/firebase.js";
import {
  fast2smsConfig,
  Fast2SmsError,
  maskMobile,
  normaliseMobile,
  sendDltOtp,
  sendSmartOtp,
  verifySmartOtp,
} from "../config/fast2sms.js";

/**
 * Demo-request OTP flow
 *
 *  Email OTP  → generated here, delivered via Brevo (config/email.js),
 *               verified locally.
 *  Mobile OTP → delivered via Fast2SMS (config/fast2sms.js):
 *               • DLT template route first (our sender ID + approved
 *                 template; OTP generated + verified locally), then
 *               • Smart OTP as a fallback (Fast2SMS generates + verifies).
 *
 * Pending OTPs live in memory keyed by email, so a single Render instance
 * is assumed (same as before).
 */

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;
const IS_PROD = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

const demoOtpStore = new Map();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Drop expired entries so the map can't grow without bound.
const sweepExpired = () => {
  const now = Date.now();
  for (const [key, entry] of demoOtpStore) {
    if (now > entry.expiresAt) demoOtpStore.delete(key);
  }
};

/** Send the mobile OTP; returns how it was delivered so verify knows what to check. */
async function deliverMobileOtp(mobile) {
  const masked = maskMobile(mobile);

  if (fast2smsConfig.dltReady) {
    const otp = generateOtp();
    try {
      await sendDltOtp(mobile, otp);
      console.log(`✅ Demo mobile OTP sent via Fast2SMS DLT to ${masked}`);
      return { method: "dlt", otp };
    } catch (err) {
      const canFallBack = fast2smsConfig.smartOtpReady && !(err.retryable && err.code === "TIMEOUT");
      console.error(
        `❌ Fast2SMS DLT send failed for ${masked} [${err.code ?? "?"}]: ${err.message}` +
          (canFallBack ? " — falling back to Smart OTP" : "")
      );
      if (!canFallBack) throw err;
    }
  }

  if (fast2smsConfig.smartOtpReady) {
    await sendSmartOtp(mobile);
    console.log(`✅ Demo mobile OTP sent via Fast2SMS Smart OTP to ${masked}`);
    return { method: "smart" };
  }

  throw new Fast2SmsError("SMS service is not configured", { code: "NOT_CONFIGURED" });
}

// ✅ Step 1 — send Email OTP (Brevo) + Mobile OTP (Fast2SMS)
export const sendDemoOtp = async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const mobile = normaliseMobile(req.body?.mobile);

  if (!email || !req.body?.mobile) {
    return res.status(400).json({ error: "Email and Mobile are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }
  if (!mobile) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number" });
  }

  sweepExpired();

  const existing = demoOtpStore.get(email);
  if (existing && Date.now() - existing.sentAt < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.sentAt)) / 1000);
    return res.status(429).json({ error: `Please wait ${wait}s before requesting a new OTP` });
  }

  const emailOtp = generateOtp();

  // 1) Email OTP via Brevo
  try {
    await transporter.sendMail({
      from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "Your Email OTP - MRtech Demo Request",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px;background:#fafafa;">
          <h2 style="color:#333;text-align:center;">Email Verification</h2>
          <p style="color:#555;text-align:center;">Your Email OTP for the demo request is:</p>
          <div style="font-size:36px;font-weight:bold;text-align:center;color:#4F46E5;letter-spacing:8px;margin:24px 0;">
            ${emailOtp}
          </div>
          <p style="color:#888;text-align:center;font-size:13px;">Valid for 5 minutes. Do not share this OTP with anyone.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
          <p style="color:#aaa;text-align:center;font-size:12px;">— Myth Reality Technologies</p>
        </div>
      `,
    });
    console.log(`✅ Demo email OTP sent to ${email}${IS_PROD ? "" : ` (otp ${emailOtp})`}`);
  } catch (error) {
    console.error("❌ Demo email OTP error:", error.message);
    return res.status(502).json({ error: "Could not send the email OTP. Please check the address and try again." });
  }

  // 2) Mobile OTP via Fast2SMS
  let delivery;
  try {
    delivery = await deliverMobileOtp(mobile);
    if (!IS_PROD && delivery.otp) console.log(`   (mobile otp ${delivery.otp})`);
  } catch (error) {
    console.error(`❌ Demo mobile OTP error [${error.code ?? "?"}]:`, error.message);
    const msg =
      error.code === "NOT_CONFIGURED"
        ? "SMS service is not available right now."
        : error.retryable
        ? "Could not reach the SMS service. Please try again in a moment."
        : "Could not send the mobile OTP. Please check the number and try again.";
    return res.status(error.retryable ? 503 : 502).json({ error: msg });
  }

  demoOtpStore.set(email, {
    emailOtp,
    mobile,
    mobileMethod: delivery.method,
    mobileOtp: delivery.otp ?? null, // only for the DLT route
    attempts: 0,
    sentAt: Date.now(),
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  res.json({
    success: true,
    message: "Demo request OTP sent to both Email and Mobile!",
  });
};

// ✅ Step 2 — verify both OTPs, save the request, notify admin
export const verifyDemoOtp = async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const mobile = normaliseMobile(req.body?.mobile);
  const emailOtp = String(req.body?.emailOtp || "").trim();
  const mobileOtp = String(req.body?.mobileOtp || "").trim();

  if (!email || !emailOtp || !mobileOtp) {
    return res.status(400).json({ error: "Email, Email OTP and Mobile OTP are required" });
  }

  const stored = demoOtpStore.get(email);
  if (!stored) {
    return res.status(400).json({ error: "OTP not found or expired. Please request a new one." });
  }
  if (Date.now() > stored.expiresAt) {
    demoOtpStore.delete(email);
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }
  if (stored.attempts >= MAX_VERIFY_ATTEMPTS) {
    demoOtpStore.delete(email);
    return res.status(429).json({ error: "Too many incorrect attempts. Please request a new OTP." });
  }
  if (!mobile || mobile !== stored.mobile) {
    return res.status(400).json({ error: "Mobile number does not match the one the OTP was sent to" });
  }

  stored.attempts += 1;

  if (!/^\d{6}$/.test(emailOtp) || emailOtp !== stored.emailOtp) {
    return res.status(400).json({ error: "Invalid Email OTP" });
  }

  // Mobile OTP: local check for the DLT route, Fast2SMS check for Smart OTP
  if (!/^\d{4,6}$/.test(mobileOtp)) {
    return res.status(400).json({ error: "Invalid Mobile OTP" });
  }
  if (stored.mobileMethod === "dlt") {
    if (mobileOtp !== stored.mobileOtp) {
      return res.status(400).json({ error: "Invalid Mobile OTP" });
    }
  } else {
    try {
      const ok = await verifySmartOtp(mobile, mobileOtp);
      if (!ok) return res.status(400).json({ error: "Invalid or expired Mobile OTP" });
    } catch (error) {
      console.error(`❌ Fast2SMS verify error [${error.code ?? "?"}]:`, error.message);
      return res.status(503).json({ error: "Could not verify the mobile OTP right now. Please try again." });
    }
  }

  // Both OTPs verified — persist and notify
  try {
    await db.collection("demoRequests").add({
      name,
      email,
      mobile,
      mobileOtpMethod: stored.mobileMethod,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    await transporter.sendMail({
      from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "✅ New Verified Demo Request",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:24px;">
          <h2 style="color:#333;">New Demo Request (Verified)</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Verified At:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    demoOtpStore.delete(email);

    console.log(`✅ Demo OTPs verified for ${email} / ${maskMobile(mobile)} — request saved.`);
    res.json({
      success: true,
      message: "Demo request submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Demo verification error:", error.message);
    res.status(500).json({ error: "Failed to process demo request" });
  }
};
