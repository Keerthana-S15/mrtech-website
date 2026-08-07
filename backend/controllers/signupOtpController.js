import transporter from "../config/email.js";
import dotenv from "dotenv";
dotenv.config();

const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
  let { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  phone = phone.replace(/^(\+91|0)/, "").trim();
  if (phone.length !== 10)
    return res.status(400).json({ error: "Enter valid 10-digit number" });

  try {
    const response = await fetch("https://www.fast2sms.com/dev/otp/send", {
      method: "POST",
      headers: {
        Authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp_id: process.env.FAST2SMS_OTP_ID,
        mobile: phone,
      }),
    });

    const data = await response.json();
    console.log("✅ Fast2SMS Smart OTP Send Response:", JSON.stringify(data, null, 2));

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

export const verifyPhoneOtp = async (req, res) => {
  let { phone, otp } = req.body;
  if (!phone || !otp)
    return res.status(400).json({ error: "Phone and OTP required" });

  phone = phone.replace(/^(\+91|0)/, "").trim();

  try {
    const response = await fetch("https://www.fast2sms.com/dev/otp/verify", {
      method: "POST",
      headers: {
        Authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: phone,
        otp: otp.toString(),
      }),
    });

    const data = await response.json();
    console.log("✅ Fast2SMS Smart OTP Verify Response:", JSON.stringify(data, null, 2));

    if (data.return === true) {
      res.json({ success: true, message: "Phone verified successfully" });
    } else {
      res.status(400).json({ error: data.message || "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("❌ Fast2SMS Verify Error:", error);
    res.status(500).json({ error: "Failed to verify OTP. Try again." });
  }
};