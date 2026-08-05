import { db } from "../config/firebase.js";
import transporter from "../config/email.js";

export const sendEnquiry = async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const docRef = await db.collection("enquiries").add({
      name,
      phone,
      email,
      service,
      message,
      createdAt: new Date().toISOString(),
    });

    const mailOptions = {
      from: `"MRtech Website" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Enquiry from ${name}`,
      text: `
📩 New Quick Enquiry:
--------------------------
Name: ${name}
Phone: ${phone}
Email: ${email}
Service: ${service}
Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("🔥 Enquiry Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};