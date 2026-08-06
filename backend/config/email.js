import dotenv from "dotenv";
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const transporter = {
  async sendMail({ from, to, subject, html }) {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Myth Reality Technologies",
          email: process.env.ADMIN_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔥 Brevo email send failed:", data);
      throw new Error(data.message || "Failed to send email via Brevo");
    }

    return data;
  },
};

if (BREVO_API_KEY) {
  console.log("✅ Email service ready (Brevo API)");
} else {
  console.log("❌ Email setup failed: BREVO_API_KEY is missing in .env");
}

export default transporter;