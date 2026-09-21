import dotenv from "dotenv";
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const REQUEST_TIMEOUT_MS = 10_000;

/** Error carrying Brevo's HTTP status and error code so callers/logs can act on it. */
export class BrevoError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "BrevoError";
    this.status = status;
    this.code = code;
  }
}

// Brevo's "Authorised IPs" security setting rejects every call from an IP not
// on the list (e.g. Render's outbound IPs) with a 401 and this message. It is
// the most common reason emails silently stop in production, so call it out.
const isIpRestriction = (data) =>
  /unrecognised ip address|unrecognized ip address|authorised_ips/i.test(String(data?.message || ""));

const transporter = {
  async sendMail({ from, to, subject, html }) {
    if (!BREVO_API_KEY) {
      throw new BrevoError("BREVO_API_KEY is not set in environment variables", { code: "NOT_CONFIGURED" });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(BREVO_API_URL, {
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
        signal: controller.signal,
      });
    } catch (err) {
      const timedOut = err?.name === "AbortError";
      throw new BrevoError(timedOut ? "Brevo request timed out" : "Could not reach Brevo", {
        code: timedOut ? "TIMEOUT" : "NETWORK",
      });
    } finally {
      clearTimeout(timer);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = `${response.status} ${data.code || ""} ${data.message || ""}`.trim();
      console.error(`🔥 Brevo email send failed (to ${to}): ${detail}`);
      if (isIpRestriction(data)) {
        console.error(
          "   ↳ Brevo is blocking this server's IP. Fix in Brevo → Security → Authorised IPs: " +
            "either disable the restriction or add this service's outbound IPs (Render dashboard → service → Outbound IPs)."
        );
      }
      throw new BrevoError(data.message || "Failed to send email via Brevo", {
        status: response.status,
        code: isIpRestriction(data) ? "IP_RESTRICTED" : data.code || "HTTP_ERROR",
      });
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
