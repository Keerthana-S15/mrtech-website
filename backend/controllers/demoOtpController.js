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
  maskMobile,
  normaliseMobile,
  sendOtpSms,
} from "../config/fast2sms.js";

/**
 * Demo-request OTP flow
 *
 *  Email OTP  → generated here, delivered via Brevo (config/email.js),
 *               verified locally.
 *  Mobile OTP → delivered via Fast2SMS (config/fast2sms.js):
 *               • DLT template route first (our sender ID + approved
 *                 template), then
 *               • Smart OTP template as a fallback.
 *               In both cases the OTP is generated here, handed to
 *               Fast2SMS for delivery, and verified locally.
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

/**
 * Send the mobile OTP through Fast2SMS. The OTP is generated here and
 * delivered via the DLT template, or via the Smart OTP template if DLT is
 * rejected — either way the same code is stored and verified locally.
 */
async function deliverMobileOtp(mobile) {
  const masked = maskMobile(mobile);
  const otp = generateOtp();

  // Shared with the signup and password-reset flows: DLT first because it is
  // what reaches DND-registered numbers, Smart OTP as the fallback.
  const { route, requestId, attempts } = await sendOtpSms(mobile, otp, {
    expiryMinutes: OTP_TTL_MS / 60000,
  });
  attempts.forEach((a) =>
    console.error(`❌ Fast2SMS ${a.route} send failed for ${masked} [${a.code}]: ${a.message} — fell back`)
  );
  console.log(`✅ Demo mobile OTP accepted for ${masked} via ${route} (request_id: ${requestId ?? "n/a"})`);
  return { method: route, otp };
}

/** Send the email OTP through Brevo. Returns the OTP, or throws. */
async function deliverEmailOtp(email) {
  const otp = generateOtp();
  await transporter.sendMail({
    from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
    to: email,
    subject: "Your Email OTP - MRtech Demo Request",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px;background:#fafafa;">
        <h2 style="color:#333;text-align:center;">Email Verification</h2>
        <p style="color:#555;text-align:center;">Your Email OTP for the demo request is:</p>
        <div style="font-size:36px;font-weight:bold;text-align:center;color:#4F46E5;letter-spacing:8px;margin:24px 0;">
          ${otp}
        </div>
        <p style="color:#888;text-align:center;font-size:13px;">Valid for 5 minutes. Do not share this OTP with anyone.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#aaa;text-align:center;font-size:12px;">— Myth Reality Technologies</p>
      </div>
    `,
  });
  console.log(`✅ Demo email OTP sent to ${email}${IS_PROD ? "" : ` (otp ${otp})`}`);
  return otp;
}

/** Map a mobile-OTP failure to a user-facing message + HTTP status. */
const mobileErrorInfo = (error) => ({
  status: error?.retryable ? 503 : 502,
  message:
    error?.code === "NOT_CONFIGURED"
      ? "SMS service is not available right now."
      : error?.retryable
      ? "Could not reach the SMS service. Please try again in a moment."
      : "Could not send the mobile OTP. Please check the number and try again.",
});

// ✅ Step 1 — send Email OTP (Brevo) and Mobile OTP (Fast2SMS)
// The two channels are sent independently: a Brevo failure never blocks the
// Fast2SMS OTP (and vice versa). The response tells the client which
// channel(s) succeeded so it can ask only for those OTPs.
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

  const [emailResult, mobileResult] = await Promise.allSettled([
    deliverEmailOtp(email),
    deliverMobileOtp(mobile),
  ]);

  const emailSent = emailResult.status === "fulfilled";
  const mobileSent = mobileResult.status === "fulfilled";

  if (!emailSent) {
    console.error("❌ Demo email OTP error:", emailResult.reason?.message);
  }
  if (!mobileSent) {
    const err = mobileResult.reason;
    console.error(`❌ Demo mobile OTP error [${err?.code ?? "?"}]:`, err?.message);
  }

  if (!emailSent && !mobileSent) {
    const info = mobileErrorInfo(mobileResult.reason);
    return res.status(info.status).json({
      error: `Could not send the OTPs. ${info.message}`,
      emailSent: false,
      mobileSent: false,
    });
  }

  if (!IS_PROD && mobileSent && mobileResult.value.otp) {
    console.log(`   (mobile otp ${mobileResult.value.otp})`);
  }

  demoOtpStore.set(email, {
    emailOtp: emailSent ? emailResult.value : null,
    mobile,
    mobileMethod: mobileSent ? mobileResult.value.method : null,
    mobileOtp: mobileSent ? mobileResult.value.otp ?? null : null, // only for the DLT route
    attempts: 0,
    sentAt: Date.now(),
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  let message = "OTP sent to both Email and Mobile!";
  let warning;
  if (!emailSent) {
    message = "OTP sent to your Mobile.";
    warning = "We couldn't send the email OTP, so only the mobile OTP is required.";
  } else if (!mobileSent) {
    message = "OTP sent to your Email.";
    warning = `We couldn't send the mobile OTP (${mobileErrorInfo(mobileResult.reason).message}) so only the email OTP is required.`;
  }

  res.json({ success: true, emailSent, mobileSent, message, ...(warning && { warning }) });
};

// ✅ Step 2 — verify both OTPs, save the request, notify admin
export const verifyDemoOtp = async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const mobile = normaliseMobile(req.body?.mobile);
  const emailOtp = String(req.body?.emailOtp || "").trim();
  const mobileOtp = String(req.body?.mobileOtp || "").trim();

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
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

  const needEmail = Boolean(stored.emailOtp);
  const needMobile = Boolean(stored.mobileMethod);

  if (needEmail && !emailOtp) {
    return res.status(400).json({ error: "Email OTP is required" });
  }
  if (needMobile && !mobileOtp) {
    return res.status(400).json({ error: "Mobile OTP is required" });
  }

  stored.attempts += 1;

  // Email OTP (Brevo-delivered) — checked locally
  if (needEmail && (!/^\d{6}$/.test(emailOtp) || emailOtp !== stored.emailOtp)) {
    return res.status(400).json({ error: "Invalid Email OTP" });
  }

  // Mobile OTP (Fast2SMS-delivered, DLT or Smart OTP) — checked locally
  // against the code we generated and sent
  if (needMobile && (!/^\d{6}$/.test(mobileOtp) || mobileOtp !== stored.mobileOtp)) {
    return res.status(400).json({ error: "Invalid Mobile OTP" });
  }

  // Both OTPs verified — persist the request. This is the only step that
  // may fail the response.
  try {
    await db.collection("demoRequests").add({
      name,
      email,
      mobile,
      emailVerified: needEmail,
      mobileVerified: needMobile,
      mobileOtpMethod: stored.mobileMethod,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Demo request save error:", error.message);
    return res.status(500).json({ error: "Failed to process demo request" });
  }

  demoOtpStore.delete(email);
  console.log(`✅ Demo OTPs verified for ${email} / ${maskMobile(mobile)} — request saved.`);
  res.json({
    success: true,
    message: "Demo request submitted successfully!",
  });

  // Admin notification is best-effort: the user's request is already saved
  // and verified, so a Brevo failure here must not turn into an error for
  // them (it previously caused a 500 after a successful verification).
  try {
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
          <p><strong>Verified via:</strong> ${[needEmail && "Email", needMobile && "Mobile"].filter(Boolean).join(" + ")}</p>
          <p><strong>Verified At:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("⚠️ Demo request saved but admin notification email failed:", error.message);
  }
};
