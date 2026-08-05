// // // import transporter from "../config/email.js";
// // // import dotenv from "dotenv";
// // // dotenv.config();

// // // const otpStore = {};

// // // function generateOTP() {
// // //   return Math.floor(100000 + Math.random() * 900000).toString();
// // // }

// // // // ── Send Email OTP ──────────────────────────
// // // export const sendEmailOtp = async (req, res) => {
// // //   const { email } = req.body;
// // //   if (!email) return res.status(400).json({ error: "Email is required" });

// // //   const otp = generateOTP();
// // //   const expiry = Date.now() + 5 * 60 * 1000;
// // //   otpStore[`email_${email}`] = { otp, expiry };

// // //   try {
// // //     await transporter.sendMail({
// // //       from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
// // //       to: email,
// // //       subject: "Your Signup OTP - Myth Reality Technologies",
// // //       html: `
// // //         <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;
// // //                     border:1px solid #ddd;border-radius:12px;padding:30px;">
// // //           <h2 style="color:#003b44;">Email Verification</h2>
// // //           <p>Your OTP for signup is:</p>
// // //           <h1 style="color:orange;letter-spacing:8px;font-size:36px;">${otp}</h1>
// // //           <p style="color:gray;font-size:13px;">Valid for <b>5 minutes</b>. Do not share.</p>
// // //           <p style="color:#003b44;font-weight:bold;">— Myth Reality Technologies</p>
// // //         </div>
// // //       `,
// // //     });

// // //     console.log(`✅ Email OTP sent to ${email}: ${otp}`);
// // //     res.json({ success: true, message: "OTP sent to email" });
// // //   } catch (error) {
// // //     console.error("❌ Email OTP Error:", error);
// // //     res.status(500).json({ error: "Failed to send email OTP" });
// // //   }
// // // };

// // // // ── Verify Email OTP ────────────────────────
// // // export const verifyEmailOtp = (req, res) => {
// // //   const { email, otp } = req.body;
// // //   if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

// // //   const stored = otpStore[`email_${email}`];
// // //   if (!stored) return res.status(400).json({ error: "OTP not found. Request again." });

// // //   if (Date.now() > stored.expiry) {
// // //     delete otpStore[`email_${email}`];
// // //     return res.status(400).json({ error: "OTP expired. Request again." });
// // //   }

// // //   if (stored.otp !== otp.toString()) {
// // //     return res.status(400).json({ error: "Invalid OTP. Try again." });
// // //   }

// // //   delete otpStore[`email_${email}`];
// // //   res.json({ success: true, message: "Email verified successfully" });
// // // };


// // // export const sendPhoneOtp = async (req, res) => {
// // //   let { phone } = req.body;
// // //   if (!phone) return res.status(400).json({ error: "Phone number is required" });

// // //   phone = phone.replace(/^(\+91|0)/, "").trim();
// // //   if (phone.length !== 10) return res.status(400).json({ error: "Enter valid 10-digit number" });

// // //   const otp = generateOTP();
// // //   const expiry = Date.now() + 5 * 60 * 1000;
// // //   otpStore[`phone_${phone}`] = { otp, expiry };

// // //   console.log(`\n🔐 PHONE OTP FOR ${phone}: ${otp}\n`);

// // //   try {
// // //     // ✅ CORRECT DLT API FORMAT
// // //     const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
// // //       method: "POST",
// // //       headers: {
// // //         authorization: process.env.FAST2SMS_API_KEY,
// // //         "Content-Type": "application/json",
// // //       },
// // //       body: JSON.stringify({
// // //         route: "dlt",
// // //         sender_id: "MYTRTC",  // ✅ Direct string instead of env (for testing)
// // //         message: "1007208441947127345",  // ✅ Template ID as string
// // //         variables_values: otp,  // ✅ OTP replaces {#var#}
// // //         flash: 0,
// // //         numbers: phone,  // ✅ Without +91
// // //       }),
// // //     });

// // //     const data = await response.json();
// // //     console.log("✅ Fast2SMS Full Response:", JSON.stringify(data, null, 2));

// // //     if (data.return === true) {
// // //       console.log(`✅ Real SMS sent to ${phone}!`);
// // //       res.json({ success: true, message: "OTP sent to phone via SMS" });
// // //     } else {
// // //       console.log(`⚠️ SMS Failed. Response:`, data);
// // //       console.log(`💡 OTP for testing: ${otp}`);
// // //       res.json({ 
// // //         success: true, 
// // //         message: `OTP: ${otp} (SMS failed: ${data.message || 'Check console'})`,
// // //       });
// // //     }
// // //   } catch (error) {
// // //     console.error("❌ API Call Error:", error.message);
// // //     console.log(`💡 OTP for testing: ${otp}`);
// // //     res.json({ 
// // //       success: true, 
// // //       message: `OTP: ${otp} (Check console - API error)`
// // //     });
// // //   }
// // // };
// // // // ── Verify Phone OTP ────────────────────────
// // // export const verifyPhoneOtp = (req, res) => {
// // //   let { phone, otp } = req.body;
// // //   if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

// // //   phone = phone.replace(/^(\+91|0)/, "").trim();
// // //   const stored = otpStore[`phone_${phone}`];

// // //   if (!stored) return res.status(400).json({ error: "OTP not found. Request again." });

// // //   if (Date.now() > stored.expiry) {
// // //     delete otpStore[`phone_${phone}`];
// // //     return res.status(400).json({ error: "OTP expired. Request again." });
// // //   }

// // //   if (stored.otp !== otp.toString()) {
// // //     return res.status(400).json({ error: "Invalid OTP. Try again." });
// // //   }

// // //   delete otpStore[`phone_${phone}`];
// // //   res.json({ success: true, message: "Phone verified successfully" });
// // // };





// // import transporter from "../config/email.js";
// // import dotenv from "dotenv";
// // dotenv.config();

// // const otpStore = {};

// // function generateOTP() {
// //   return Math.floor(100000 + Math.random() * 900000).toString();
// // }

// // // ── Send Email OTP ──────────────────────────
// // export const sendEmailOtp = async (req, res) => {
// //   const { email } = req.body;
// //   if (!email) return res.status(400).json({ error: "Email is required" });

// //   const otp = generateOTP();
// //   const expiry = Date.now() + 5 * 60 * 1000;
// //   otpStore[`email_${email}`] = { otp, expiry };

// //   try {
// //     await transporter.sendMail({
// //       from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
// //       to: email,
// //       subject: "Your Signup OTP - Myth Reality Technologies",
// //       html: `
// //         <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;
// //                     border:1px solid #ddd;border-radius:12px;padding:30px;">
// //           <h2 style="color:#003b44;">Email Verification</h2>
// //           <p>Your OTP for signup is:</p>
// //           <h1 style="color:orange;letter-spacing:8px;font-size:36px;">${otp}</h1>
// //           <p style="color:gray;font-size:13px;">Valid for <b>5 minutes</b>. Do not share.</p>
// //           <p style="color:#003b44;font-weight:bold;">— Myth Reality Technologies</p>
// //         </div>
// //       `,
// //     });

// //     console.log(`✅ Email OTP sent to ${email}: ${otp}`);
// //     res.json({ success: true, message: "OTP sent to email" });
// //   } catch (error) {
// //     console.error("❌ Email OTP Error:", error);
// //     res.status(500).json({ error: "Failed to send email OTP" });
// //   }
// // };

// // // ── Verify Email OTP ────────────────────────
// // export const verifyEmailOtp = (req, res) => {
// //   const { email, otp } = req.body;
// //   if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

// //   const stored = otpStore[`email_${email}`];
// //   if (!stored) return res.status(400).json({ error: "OTP not found. Request again." });

// //   if (Date.now() > stored.expiry) {
// //     delete otpStore[`email_${email}`];
// //     return res.status(400).json({ error: "OTP expired. Request again." });
// //   }

// //   if (stored.otp !== otp.toString()) {
// //     return res.status(400).json({ error: "Invalid OTP. Try again." });
// //   }

// //   delete otpStore[`email_${email}`];
// //   res.json({ success: true, message: "Email verified successfully" });
// // };

// // // ── Send Phone OTP ──────────────────────────
// // export const sendPhoneOtp = async (req, res) => {
// //   let { phone } = req.body;
// //   if (!phone) return res.status(400).json({ error: "Phone number is required" });

// //   phone = phone.replace(/^(\+91|0)/, "").trim();
// //   if (phone.length !== 10) return res.status(400).json({ error: "Enter valid 10-digit number" });

// //   const otp = generateOTP();
// //   const expiry = Date.now() + 5 * 60 * 1000;
// //   otpStore[`phone_${phone}`] = { otp, expiry };

// //   console.log(`\n🔐 PHONE OTP FOR ${phone}: ${otp}\n`);

// //   try {
// //     // ✅ CORRECT DLT API FORMAT (Fast2SMS)
// //     const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
// //       method: "POST",
// //       headers: {
// //         authorization: process.env.FAST2SMS_API_KEY,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         route: "dlt",

      
// //         sender_id: "MYTRTC",
// //          DLT_TE_ID: process.env.FAST2SMS_TEMPLATE_ID,
// //         message:
// //           "Your OTP is #{VAR#} for account verification. Valid for 5 mins. Do not share this code with anyone. - MYTRTC",

        
// //         variables_values: otp,

// //         flash: 0,
// //         numbers: phone,
// //       }),
// //     });

// //     const data = await response.json();
// //     console.log("✅ Fast2SMS Full Response:", JSON.stringify(data, null, 2));

// //     if (data.return === true) {
// //       console.log(`✅ Real SMS sent to ${phone}!`);
// //       res.json({ success: true, message: "OTP sent to phone via SMS" });
// //     } else {
// //       console.log(`⚠️ SMS Failed. Response:`, data);
// //       console.log(`💡 OTP for testing: ${otp}`);
// //       res.json({
// //         success: true,
// //         message: `OTP: ${otp} (SMS failed: ${data.message || "Check console"})`,
// //       });
// //     }
// //   } catch (error) {
// //     console.error("❌ API Call Error:", error.message);
// //     console.log(`💡 OTP for testing: ${otp}`);
// //     res.json({
// //       success: true,
// //       message: `OTP: ${otp} (Check console - API error)`,
// //     });
// //   }
// // };

// // // ── Verify Phone OTP ────────────────────────
// // export const verifyPhoneOtp = (req, res) => {
// //   let { phone, otp } = req.body;
// //   if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

// //   phone = phone.replace(/^(\+91|0)/, "").trim();
// //   const stored = otpStore[`phone_${phone}`];

// //   if (!stored) return res.status(400).json({ error: "OTP not found. Request again." });

// //   if (Date.now() > stored.expiry) {
// //     delete otpStore[`phone_${phone}`];
// //     return res.status(400).json({ error: "OTP expired. Request again." });
// //   }

// //   if (stored.otp !== otp.toString()) {
// //     return res.status(400).json({ error: "Invalid OTP. Try again." });
// //   }

// //   delete otpStore[`phone_${phone}`];
// //   res.json({ success: true, message: "Phone verified successfully" });
// // };



// import transporter from "../config/email.js";
// import dotenv from "dotenv";
// dotenv.config();

// const otpStore = {};

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // ── Send Email OTP ────────────────────────────────────────────
// export const sendEmailOtp = async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: "Email is required" });

//   const otp = generateOTP();
//   const expiry = Date.now() + 5 * 60 * 1000;
//   otpStore[`email_${email}`] = { otp, expiry };

//   try {
//     await transporter.sendMail({
//       from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
//       to: email,
//       subject: "Your Signup OTP - Myth Reality Technologies",
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px;background:#fafafa;">
//           <h2 style="color:#333;text-align:center;">Email Verification</h2>
//           <p style="color:#555;text-align:center;">Your OTP for signup is:</p>
//           <div style="font-size:36px;font-weight:bold;text-align:center;color:#4F46E5;letter-spacing:8px;margin:24px 0;">
//             ${otp}
//           </div>
//           <p style="color:#888;text-align:center;font-size:13px;">Valid for 5 minutes. Do not share this OTP with anyone.</p>
//           <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
//           <p style="color:#aaa;text-align:center;font-size:12px;">— Myth Reality Technologies</p>
//         </div>
//       `,
//     });

//     console.log(`✅ Email OTP sent to ${email}: ${otp}`);
//     res.json({ success: true, message: "OTP sent to email" });
//   } catch (error) {
//     console.error("❌ Email OTP Error:", error);
//     res.status(500).json({ error: "Failed to send email OTP" });
//   }
// };

// // ── Verify Email OTP ──────────────────────────────────────────
// export const verifyEmailOtp = (req, res) => {
//   const { email, otp } = req.body;
//   if (!email || !otp)
//     return res.status(400).json({ error: "Email and OTP required" });

//   const stored = otpStore[`email_${email}`];
//   if (!stored)
//     return res.status(400).json({ error: "OTP not found. Request again." });

//   if (Date.now() > stored.expiry) {
//     delete otpStore[`email_${email}`];
//     return res.status(400).json({ error: "OTP expired. Request again." });
//   }

//   if (stored.otp !== otp.toString())
//     return res.status(400).json({ error: "Invalid OTP. Try again." });

//   delete otpStore[`email_${email}`];
//   res.json({ success: true, message: "Email verified successfully" });
// };

// // ── Send Phone OTP ────────────────────────────────────────────
// export const sendPhoneOtp = async (req, res) => {
//   let { phone } = req.body;
//   if (!phone) return res.status(400).json({ error: "Phone number is required" });

//   phone = phone.replace(/^(\+91|0)/, "").trim();
//   if (phone.length !== 10)
//     return res.status(400).json({ error: "Enter valid 10-digit number" });

//   const otp = generateOTP();
//   const expiry = Date.now() + 5 * 60 * 1000;
//   otpStore[`phone_${phone}`] = { otp, expiry };

//   console.log(`\n🔐 PHONE OTP FOR ${phone}: ${otp}\n`);

//   try {
//     const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
//       method: "POST",
//       headers: {
//         authorization: process.env.FAST2SMS_API_KEY,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         route: "dlt",
//         sender_id: "MYTRTC",
//         DLT_TE_ID: process.env.FAST2SMS_TEMPLATE_ID,
//         // ✅ FIXED: exact Fast2SMS approved template text + correct variable format
//         message:
//           "Your OTP is {#VAR#} for account verification. Valid for 5 mins. Do not share this code with anyone. - MYTRTC",
//         variables_values: otp + "|",
//         flash: 0,
//         numbers: phone,
//       }),
//     });

//     const data = await response.json();
//     console.log("✅ Fast2SMS Full Response:", JSON.stringify(data, null, 2));

//     if (data.return === true) {
//       console.log(`✅ SMS sent successfully to ${phone}!`);
//       res.json({ success: true, message: "OTP sent to phone via SMS" });
//     } else {
//       console.log(`⚠️ SMS Failed. Response:`, data);
//       res.status(500).json({
//         error: `SMS failed: ${data.message || "Check Fast2SMS dashboard"}`,
//       });
//     }
//   } catch (error) {
//     console.error("❌ Fast2SMS API Error:", error.message);
//     res.status(500).json({ error: "Failed to send SMS. Try again." });
//   }
// };

// // ── Verify Phone OTP ──────────────────────────────────────────
// export const verifyPhoneOtp = (req, res) => {
//   let { phone, otp } = req.body;
//   if (!phone || !otp)
//     return res.status(400).json({ error: "Phone and OTP required" });

//   phone = phone.replace(/^(\+91|0)/, "").trim();

//   const stored = otpStore[`phone_${phone}`];
//   if (!stored)
//     return res.status(400).json({ error: "OTP not found. Request again." });

//   if (Date.now() > stored.expiry) {
//     delete otpStore[`phone_${phone}`];
//     return res.status(400).json({ error: "OTP expired. Request again." });
//   }

//   if (stored.otp !== otp.toString())
//     return res.status(400).json({ error: "Invalid OTP. Try again." });

//   delete otpStore[`phone_${phone}`];
//   res.json({ success: true, message: "Phone verified successfully" });
// };



import transporter from "../config/email.js";
import dotenv from "dotenv";
dotenv.config();

const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Send Email OTP ────────────────────────────────────────────
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

// ── Verify Email OTP ──────────────────────────────────────────
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

// ── Send Phone OTP ────────────────────────────────────────────
export const sendPhoneOtp = async (req, res) => {
  let { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  phone = phone.replace(/^(\+91|0)/, "").trim();
  if (phone.length !== 10)
    return res.status(400).json({ error: "Enter valid 10-digit number" });

  const otp = generateOTP();
  const expiry = Date.now() + 5 * 60 * 1000;
  otpStore[`phone_${phone}`] = { otp, expiry };

  console.log(`\n🔐 PHONE OTP FOR ${phone}: ${otp}\n`);

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "dlt",
        sender_id: process.env.FAST2SMS_SENDER_ID,
        message: "209725",              // ✅ Fast2SMS Template ID (from DLT API Excel)
        variables_values: otp + "|",   // ✅ OTP replaces {#VAR#}
        flash: 0,
        numbers: phone,
      }),
    });

    const data = await response.json();
    console.log("✅ Fast2SMS Full Response:", JSON.stringify(data, null, 2));

    if (data.return === true) {
      console.log(`✅ SMS sent successfully to ${phone}!`);
      res.json({ success: true, message: "OTP sent to phone via SMS" });
    } else {
      console.log(`⚠️ SMS Failed. Response:`, data);
      res.status(500).json({
        error: `SMS failed: ${data.message || "Check Fast2SMS dashboard"}`,
      });
    }
  } catch (error) {
    console.error("❌ Fast2SMS API Error:", error);
    res.status(500).json({ error: "Failed to send SMS. Try again." });
  }
};

// ── Verify Phone OTP ──────────────────────────────────────────
export const verifyPhoneOtp = (req, res) => {
  let { phone, otp } = req.body;
  if (!phone || !otp)
    return res.status(400).json({ error: "Phone and OTP required" });

  phone = phone.replace(/^(\+91|0)/, "").trim();

  const stored = otpStore[`phone_${phone}`];
  if (!stored)
    return res.status(400).json({ error: "OTP not found. Request again." });

  if (Date.now() > stored.expiry) {
    delete otpStore[`phone_${phone}`];
    return res.status(400).json({ error: "OTP expired. Request again." });
  }

  if (stored.otp !== otp.toString())
    return res.status(400).json({ error: "Invalid OTP. Try again." });

  delete otpStore[`phone_${phone}`];
  res.json({ success: true, message: "Phone verified successfully" });
};