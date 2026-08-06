import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email setup failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export default transporter;