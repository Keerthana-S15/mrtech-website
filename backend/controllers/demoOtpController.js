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
import fetch from "node-fetch";

const demoOtpStore = {};

// ✅ Send OTP for Demo Request (Email + Mobile)
export const sendDemoOtp = async (req, res) => {
  const { email, mobile } = req.body;

  if (!email || !mobile) {
    return res.status(400).json({ error: "Email and Mobile are required" });
  }

  // Generate 6-digit OTPs
  const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const mobileOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTPs
  demoOtpStore[email] = {
    emailOtp,
    mobileOtp,
    mobile,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  try {
    // ✅ FIX: was "text:" — Brevo's API (via config/email.js) requires "html:"
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
    console.log(`✅ Demo Email OTP sent to ${email}: ${emailOtp}`);

    // Send Mobile OTP via SMS
    await sendDemoSmsOtp(mobile, mobileOtp);
    console.log(`✅ Demo Mobile OTP sent to ${mobile}: ${mobileOtp}`);

    res.json({
      success: true,
      message: "Demo request OTP sent to both Email and Mobile!",
    });
  } catch (error) {
    console.error("❌ Demo OTP Error:", error);
    res.status(500).json({ error: "Failed to send demo OTP" });
  }
};

// Fast2SMS - Demo Request Template
const sendDemoSmsOtp = async (mobile, otp) => {
  try {
    const url = new URL("https://www.fast2sms.com/dev/bulkV2");

    url.searchParams.append("authorization", process.env.FAST2SMS_API_KEY);
    url.searchParams.append("variables_values", otp);
    url.searchParams.append("route", "dlt");
    url.searchParams.append("numbers", mobile);
    // ✅ FIX: entity_id was hardcoded before and didn't match .env — now all
    // three pulled from environment variables so they stay in sync with
    // your Fast2SMS DLT setup.
    url.searchParams.append("sender_id", process.env.FAST2SMS_SENDER_ID);
    url.searchParams.append("template_id", process.env.FAST2SMS_TEMPLATE_ID);
    url.searchParams.append("entity_id", process.env.FAST2SMS_ENTITY_ID);

    console.log("📤 Demo SMS OTP - Fast2SMS API Call");
    console.log("📱 Mobile:", mobile);
    console.log("🔢 OTP:", otp);
    console.log("📋 Template: DEMO_REQUEST_OTP");
    console.log("🆔 Template ID:", process.env.FAST2SMS_TEMPLATE_ID);
    console.log("🏢 Entity ID:", process.env.FAST2SMS_ENTITY_ID);

    const response = await fetch(url.toString(), { method: "GET" });
    const data = await response.json();

    console.log("📨 Demo SMS Response:", JSON.stringify(data, null, 2));

    if (data.return === false || data.type === "error") {
      throw new Error(data.message || "Demo SMS sending failed");
    }

    console.log("✅ SMS Sent Successfully!");
    return data;
  } catch (error) {
    console.error("❌ Demo SMS Error:", error.message);
    throw error;
  }
};

// ✅ Verify Demo Request OTP
export const verifyDemoOtp = async (req, res) => {
  const { name, email, mobile, emailOtp, mobileOtp } = req.body;

  if (!demoOtpStore[email]) {
    return res.status(400).json({ error: "OTP not found or expired" });
  }

  const stored = demoOtpStore[email];

  if (Date.now() > stored.expiresAt) {
    delete demoOtpStore[email];
    return res.status(400).json({ error: "OTP expired" });
  }

  if (emailOtp !== stored.emailOtp) {
    return res.status(400).json({ error: "Invalid Email OTP" });
  }

  if (mobileOtp !== stored.mobileOtp) {
    return res.status(400).json({ error: "Invalid Mobile OTP" });
  }

  try {
    await db.collection("demoRequests").add({
      name,
      email,
      mobile,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // ✅ FIX: was "text:" — changed to "html:"
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

    delete demoOtpStore[email];

    console.log("✅ Demo OTPs verified! Request saved.");
    res.json({
      success: true,
      message: "Demo request submitted successfully!",
    });
  } catch (error) {
    console.error("❌ Demo Verification Error:", error);
    res.status(500).json({ error: "Failed to process demo request" });
  }
};