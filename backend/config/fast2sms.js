import dotenv from "dotenv";
dotenv.config();

/**
 * Fast2SMS client used for mobile OTPs.
 *
 * Two delivery methods are supported:
 *
 *  1. DLT template route (preferred) — we generate the OTP, Fast2SMS sends
 *     it using our approved sender ID + DLT template, and we verify it
 *     locally.  Needs FAST2SMS_SENDER_ID and FAST2SMS_TEMPLATE_ID.
 *
 *  2. Smart OTP route (fallback) — Fast2SMS generates, sends and verifies
 *     the OTP itself.  Needs FAST2SMS_OTP_ID.  Used automatically if the DLT
 *     send is rejected (e.g. template not yet approved) so the flow keeps
 *     working.
 *
 * The API key is only ever sent in the Authorization header — never in a
 * URL query string (which would leak it into logs and proxies) and never
 * written to the console.
 */

const BASE_URL = "https://www.fast2sms.com/dev";
const REQUEST_TIMEOUT_MS = 10_000;

const API_KEY = process.env.FAST2SMS_API_KEY;
const SENDER_ID = process.env.FAST2SMS_SENDER_ID;
const TEMPLATE_ID = process.env.FAST2SMS_TEMPLATE_ID;
const OTP_ID = process.env.FAST2SMS_OTP_ID;

export const fast2smsConfig = {
  configured: Boolean(API_KEY),
  dltReady: Boolean(API_KEY && SENDER_ID && TEMPLATE_ID),
  smartOtpReady: Boolean(API_KEY && OTP_ID),
};

if (!API_KEY) {
  console.log("❌ Fast2SMS setup failed: FAST2SMS_API_KEY is missing in .env");
} else {
  const modes = [];
  if (fast2smsConfig.dltReady) modes.push(`DLT (sender ${SENDER_ID})`);
  if (fast2smsConfig.smartOtpReady) modes.push("Smart OTP");
  console.log(
    modes.length
      ? `✅ Fast2SMS ready: ${modes.join(" + ")}`
      : "⚠️  Fast2SMS: API key set but neither DLT (SENDER_ID + TEMPLATE_ID) nor Smart OTP (OTP_ID) is configured"
  );
}

/** Error type that carries the Fast2SMS status code so callers can decide what to do. */
export class Fast2SmsError extends Error {
  constructor(message, { status, code, retryable = false } = {}) {
    super(message);
    this.name = "Fast2SmsError";
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

/** Mask a mobile number for logs: 98xxxxxx21 */
export const maskMobile = (mobile = "") =>
  String(mobile).replace(/^(\d{2})\d+(\d{2})$/, "$1xxxxxx$2");

/** Accept 10-digit Indian mobiles, optionally prefixed with +91 / 91 / 0. */
export const normaliseMobile = (raw = "") => {
  const digits = String(raw).replace(/\D/g, "");
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
};

async function callFast2Sms(path, body) {
  if (!API_KEY) {
    throw new Fast2SmsError("SMS service is not configured", { code: "NOT_CONFIGURED" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        authorization: API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    const timedOut = err?.name === "AbortError";
    throw new Fast2SmsError(
      timedOut ? "SMS service timed out" : "Could not reach SMS service",
      { code: timedOut ? "TIMEOUT" : "NETWORK", retryable: true }
    );
  } finally {
    clearTimeout(timer);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Fast2SmsError("SMS service returned an unreadable response", {
      status: response.status,
      code: "BAD_RESPONSE",
      retryable: true,
    });
  }

  // Fast2SMS signals failure with `return: false` (and usually a numeric
  // status_code + message), regardless of the HTTP status.
  if (!response.ok || data?.return !== true) {
    const status = data?.status_code ?? response.status;
    throw new Fast2SmsError(data?.message || "SMS service request failed", {
      status,
      code: data?.status_code != null ? `F2S_${data.status_code}` : "HTTP_ERROR",
      // 5xx / rate-limit style failures are worth retrying; validation
      // errors (bad sender/template, invalid number) are not.
      retryable: response.status >= 500 || status === 429,
    });
  }

  return data;
}

/**
 * Send `otp` to `mobile` using the approved DLT template.
 * `variables_values` fills the {#var#} placeholder(s) in the template.
 */
export async function sendDltOtp(mobile, otp) {
  if (!fast2smsConfig.dltReady) {
    throw new Fast2SmsError("DLT route is not configured", { code: "DLT_NOT_CONFIGURED" });
  }
  return callFast2Sms("/bulkV2", {
    route: "dlt",
    sender_id: SENDER_ID,
    message: TEMPLATE_ID, // Fast2SMS expects the template / message ID here
    variables_values: String(otp),
    numbers: mobile,
    flash: 0,
  });
}

/**
 * Send `otp` to `mobile` through the Smart OTP template (`otp_id`).
 *
 * We pass our own OTP value (supported by Fast2SMS's `otp` parameter) so the
 * code can be verified locally, exactly like the DLT route. Relying on
 * Fast2SMS's own /otp/verify instead is fragile: it is one-shot per mobile
 * ("OTP not found or already verified" on any second call), so a retry or a
 * failure after that check permanently invalidates the user's OTP.
 */
export async function sendSmartOtp(mobile, otp, { expiryMinutes = 5 } = {}) {
  if (!fast2smsConfig.smartOtpReady) {
    throw new Fast2SmsError("Smart OTP route is not configured", { code: "SMART_NOT_CONFIGURED" });
  }
  return callFast2Sms("/otp/send", {
    otp_id: OTP_ID,
    mobile,
    otp: String(otp),
    otp_expiry: expiryMinutes,
  });
}

/**
 * Verify a Smart OTP with Fast2SMS. Resolves `true` when the OTP matches,
 * `false` when Fast2SMS says it is wrong/expired; throws only on transport
 * or service errors.
 */
export async function verifySmartOtp(mobile, otp) {
  try {
    await callFast2Sms("/otp/verify", { mobile, otp: String(otp) });
    return true;
  } catch (err) {
    if (err instanceof Fast2SmsError && !err.retryable && err.code !== "NOT_CONFIGURED") {
      return false; // Fast2SMS rejected the OTP
    }
    throw err;
  }
}
