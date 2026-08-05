// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.ADMIN_EMAIL,
//     pass: process.env.ADMIN_PASS,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.log("❌ Email setup failed:", error);
//   } else {
//     console.log("✅ Email server is ready to send messages");
//   }
// });

// export default transporter;




import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS,
  },
  tls: {
    rejectUnauthorized: false  // ✅ இதை add பண்ணுங்க
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email setup failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export default transporter;