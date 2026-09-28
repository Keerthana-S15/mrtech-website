import crypto from "crypto";
import { db } from "../config/firebase.js";
import transporter from "../config/email.js";

// ---------------------------------------------------------------------------
// Cash-on-Delivery collection verification.
//
// Nothing is verified when a COD order is placed. The check happens at the
// doorstep: when the delivery agent taps "Complete Delivery", we email a code
// to the address on the order, the customer reads it out, and the agent types
// it in. A correct code is the customer's own confirmation that they received
// the goods and handed over the cash, so only then is the order marked
// Delivered with the payment collected.
//
// Both endpoints sit behind requireAdmin and are company-scoped, exactly like
// updateOrderStatus — an agent can only ever touch their own company's orders.
//
// Card and UPI orders are already paid and never enter this flow; the account
// verification SMS OTP at signup is a separate module and is untouched.
// ---------------------------------------------------------------------------

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_SENDS_PER_WINDOW = 5;
const SEND_WINDOW_MS = 30 * 60 * 1000;

/** orderId -> { hash, expiresAt, attempts, lastSentAt, sends, windowStart } */
const otpStore = new Map();

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
const sixDigits = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

function sweep() {
  const now = Date.now();
  for (const [k, v] of otpStore) {
    // An expired code is kept until its send window closes too, otherwise
    // dropping it would also reset the per-order send counter.
    if (v.expiresAt <= now && now - v.windowStart > SEND_WINDOW_MS) otpStore.delete(k);
  }
}

/** "asha@example.com" -> "as****@example.com" */
const maskEmail = (email = "") => {
  const [user, domain] = String(email).split("@");
  if (!domain) return "the address on the order";
  const head = user.slice(0, 2);
  return `${head}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
};

const isCod = (order) => String(order?.paymentMethod || "").toUpperCase() === "COD";

/**
 * Fetches the order and checks this admin is allowed to act on it.
 * Mirrors the scoping in updateOrderStatus.
 */
async function loadOrderForAdmin(orderId, admin) {
  const snapshot = await db.collection("orders").where("orderId", "==", orderId).get();
  if (snapshot.empty) {
    return { error: { status: 404, message: "Order not found" } };
  }

  const doc = snapshot.docs[0];
  const order = doc.data();

  if (!admin?.isSuperAdmin && order.companyId !== admin?.companyId) {
    return { error: { status: 403, message: "You do not have access to this order" } };
  }

  return { docId: doc.id, order };
}

/** Shared guards for both endpoints, so the two cannot drift apart. */
function checkCollectable(order) {
  if (!isCod(order)) {
    return "Only Cash on Delivery orders need collection verification.";
  }
  if (String(order.orderStatus || "").toLowerCase() === "delivered") {
    return "This order is already marked delivered.";
  }
  if (String(order.orderStatus || "").toLowerCase() === "cancelled") {
    return "This order has been cancelled.";
  }
  if (!order.email) {
    return "This order has no email address, so the code cannot be sent.";
  }
  return null;
}

export const sendDeliveryOtp = async (req, res) => {
  sweep();

  const { orderId } = req.params;

  try {
    const { error, order } = await loadOrderForAdmin(orderId, req.admin);
    if (error) return res.status(error.status).json({ success: false, error: error.message });

    const blocked = checkCollectable(order);
    if (blocked) return res.status(400).json({ success: false, error: blocked });

    const now = Date.now();
    const existing = otpStore.get(orderId);

    if (existing) {
      const since = now - existing.lastSentAt;
      if (since < RESEND_COOLDOWN_MS) {
        return res.status(429).json({
          success: false,
          error: "Please wait a few seconds before sending another code.",
          retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - since) / 1000),
        });
      }
      if (now - existing.windowStart <= SEND_WINDOW_MS && existing.sends >= MAX_SENDS_PER_WINDOW) {
        return res.status(429).json({
          success: false,
          error: "Too many codes sent for this order. Please try again later.",
        });
      }
    }

    const otp = sixDigits();

    await transporter.sendMail({
      from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
      to: order.email,
      subject: `Delivery code for order ${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px;background:#fafafa;">
          <h2 style="color:#333;text-align:center;">Confirm your delivery</h2>
          <p style="color:#555;text-align:center;">
            Dear <b>${order.customerName || "Customer"}</b>, your order <b>${orderId}</b> is being delivered.
          </p>
          <p style="color:#555;text-align:center;">
            Share this code with the delivery agent <b>only after</b> you have received your items
            and paid <b>&#8377;${order.totalAmount}</b> in cash:
          </p>
          <div style="font-size:36px;font-weight:bold;text-align:center;color:#4F46E5;letter-spacing:8px;margin:24px 0;">
            ${otp}
          </div>
          <p style="color:#888;text-align:center;font-size:13px;">
            Valid for 10 minutes. Do not share this code with anyone else.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
          <p style="color:#aaa;text-align:center;font-size:12px;">&mdash; Myth Reality Technologies</p>
        </div>
      `,
    });

    const windowOpen = existing && now - existing.windowStart <= SEND_WINDOW_MS;
    otpStore.set(orderId, {
      hash: sha256(otp),
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      lastSentAt: now,
      sends: windowOpen ? existing.sends + 1 : 1,
      windowStart: windowOpen ? existing.windowStart : now,
    });

    // The code itself is deliberately never logged.
    console.log(`✅ Delivery code emailed for ${orderId} to ${maskEmail(order.email)}`);

    return res.json({
      success: true,
      message: "Delivery code sent to the customer's email",
      sentTo: maskEmail(order.email),
      expiresInMinutes: OTP_TTL_MS / 60000,
      resendAfterSeconds: RESEND_COOLDOWN_MS / 1000,
    });
  } catch (err) {
    console.error(`🔥 Delivery code send failed for ${orderId}:`, err);
    return res.status(502).json({
      success: false,
      error: "Could not send the code by email. Please try again in a moment.",
    });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  sweep();

  const { orderId } = req.params;
  const otp = String(req.body?.otp ?? "").trim();

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ success: false, error: "The code is 6 digits." });
  }

  try {
    const { error, docId, order } = await loadOrderForAdmin(orderId, req.admin);
    if (error) return res.status(error.status).json({ success: false, error: error.message });

    const blocked = checkCollectable(order);
    if (blocked) return res.status(400).json({ success: false, error: blocked });

    const entry = otpStore.get(orderId);
    if (!entry || entry.expiresAt <= Date.now()) {
      if (entry) otpStore.delete(orderId);
      return res.status(400).json({
        success: false,
        error: "That code has expired. Send a new one.",
        expired: true,
      });
    }

    entry.attempts += 1;
    if (entry.attempts > MAX_VERIFY_ATTEMPTS) {
      otpStore.delete(orderId);
      return res.status(429).json({
        success: false,
        error: "Too many incorrect attempts. Send a new code.",
        expired: true,
      });
    }

    const expected = Buffer.from(entry.hash, "hex");
    const supplied = Buffer.from(sha256(otp), "hex");
    if (!crypto.timingSafeEqual(expected, supplied)) {
      const left = Math.max(MAX_VERIFY_ATTEMPTS - entry.attempts, 0);
      return res.status(400).json({
        success: false,
        error: left
          ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.`
          : "Incorrect code.",
        attemptsLeft: left,
      });
    }

    // Correct code: the customer has confirmed receipt and payment.
    // Burn it first so a double tap cannot re-run the update.
    otpStore.delete(orderId);

    const deliveredAt = new Date().toISOString();
    await db.collection("orders").doc(docId).update({
      orderStatus: "delivered",
      paymentStatus: "paid",
      paymentCollected: true,
      paymentCollectedAt: deliveredAt,
      deliveredAt,
      deliveryVerifiedBy: req.admin?.email || req.admin?.adminId || "unknown",
      updatedAt: deliveredAt,
    });

    console.log(`✅ ${orderId} delivered and payment collected (verified by ${req.admin?.email || "unknown"})`);

    // Confirmation to the customer. Best effort — the delivery is already
    // recorded, so a mail failure must not fail the request.
    try {
      await transporter.sendMail({
        from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
        to: order.email,
        subject: `Order Successfully Delivered - ${orderId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
            <h2 style="color:#16a34a;">&#9989; Order Successfully Delivered</h2>
            <p>Dear <b>${order.customerName || "Customer"}</b>,</p>
            <p>Your order has been delivered and your cash payment has been collected. Thank you for shopping with us!</p>
            <hr/>
            <p><b>Order ID:</b> ${orderId}</p>
            <p><b>Delivered on:</b> ${new Date(deliveredAt).toLocaleString("en-IN")}</p>
            <p><b>Payment Method:</b> Cash on Delivery</p>
            <p><b>Amount Paid:</b> &#8377;${order.totalAmount}</p>
            <p><b>Payment Status:</b> <span style="color:#16a34a;font-weight:bold;">Collected</span></p>
            <hr/>
            <p style="color:gray;font-size:12px;">
              This email is your receipt. For any queries, contact us at ${process.env.ADMIN_EMAIL}
            </p>
          </div>
        `,
      });
      console.log(`✅ Delivery confirmation emailed to ${maskEmail(order.email)} for ${orderId}`);
    } catch (mailErr) {
      console.error(`🔥 Delivery confirmation email failed for ${orderId} (delivery still recorded):`, mailErr);
    }

    // Separate notification to the admin, so cash collection lands in an inbox
    // rather than only in the dashboard. Addressed to the company that owns the
    // order — the same lookup createOrder uses for new-order alerts — so a
    // company admin hears about their own deliveries, not MRtech's. Also best
    // effort: the money is already recorded either way.
    try {
      let adminEmail = process.env.ADMIN_EMAIL;
      let companyName = "MRtech";
      if (order.companyId) {
        const adminSnap = await db
          .collection("admin")
          .where("companyId", "==", order.companyId)
          .limit(1)
          .get();
        if (!adminSnap.empty) {
          adminEmail = adminSnap.docs[0].data().email || adminEmail;
          companyName = adminSnap.docs[0].data().companyName || companyName;
        }
      }

      const row = (label, value) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;background:#fafafa;"><b>${label}</b></td>
          <td style="padding:8px;border:1px solid #ddd;">${value}</td>
        </tr>`;

      await transporter.sendMail({
        from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
        to: adminEmail,
        subject: `Order Delivered & Payment Collected - ${orderId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
            <h2 style="color:#16a34a;">&#128176; Order Delivered &amp; Payment Collected</h2>
            <p>
              Cash on Delivery for <b>${orderId}</b> has been collected and confirmed by the
              customer's one-time code.
            </p>
            <table style="width:100%;border-collapse:collapse;margin-top:14px;">
              ${row("Order ID", orderId)}
              ${row("Company", companyName)}
              ${row("Customer", `${order.customerName || "-"}<br/>${order.email || "-"}<br/>${order.phone || "-"}`)}
              ${row("Amount Collected", `&#8377;${order.totalAmount}`)}
              ${row("Payment Method", "Cash on Delivery")}
              ${row("Payment Status", '<span style="color:#16a34a;font-weight:bold;">Collected</span>')}
              ${row("Order Status", '<span style="color:#16a34a;font-weight:bold;">Delivered</span>')}
              ${row("Delivered On", new Date(deliveredAt).toLocaleString("en-IN"))}
              ${row("Verified By", req.admin?.email || req.admin?.adminId || "unknown")}
            </table>
            <hr style="margin-top:18px;"/>
            <p style="color:gray;font-size:12px;">
              Sent automatically when a delivery is verified. No action is needed.
            </p>
          </div>
        `,
      });
      console.log(`✅ Admin notified of collection for ${orderId} (${maskEmail(adminEmail)})`);
    } catch (mailErr) {
      console.error(`🔥 Admin collection email failed for ${orderId} (delivery still recorded):`, mailErr);
    }

    return res.json({
      success: true,
      message: "Delivered and payment collected",
      orderId,
      orderStatus: "delivered",
      paymentStatus: "paid",
      deliveredAt,
    });
  } catch (err) {
    console.error(`🔥 Delivery verification failed for ${orderId}:`, err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
