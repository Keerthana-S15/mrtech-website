import crypto from "crypto";
import { db } from "../config/firebase.js";
import transporter from "../config/email.js";
import { invalidate } from "../utils/readCache.js";

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
    invalidate("orders:");   // delivered and paid must show at once

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

/* ==========================================================================
   Customer refused delivery.

   The mirror image of the collection flow above: the agent is at the door, the
   customer will not take the order, and it has to be cancelled with the same
   proof that the customer was actually there. Reuses the store, the hashing,
   the rate limits and the admin scoping, so the two flows cannot drift.

   Keys into otpStore are prefixed, so a refusal code and a collection code for
   the same order never overwrite each other.
   ========================================================================== */

const refusalKey = (orderId) => `refuse:${orderId}`;

/** Preset reasons the dashboard offers; anything else is free text. */
export const REFUSAL_REASONS = [
  "Customer refused the order",
  "Customer not available",
  "Wrong or incomplete address",
  "Customer unable to pay",
  "Item damaged on arrival",
];

/**
 * Shared guards for both refusal endpoints.
 *
 * Unlike checkCollectable this does not require COD: a prepaid order can be
 * refused at the door too, and that case needs a refund rather than nothing.
 */
/**
 * The cancellation reason, validated identically wherever it arrives.
 *
 * Checked when the code is *sent*, not only when it is verified: without this
 * the endpoint would email a customer "confirm you are refusing this order"
 * before anyone had said why, and could be used to send those repeatedly with
 * no reason ever recorded.
 */
function checkReason(raw) {
  const reason = String(raw ?? "").trim();
  if (!reason) return { error: "A cancellation reason is required." };
  if (reason.length > 200) return { error: "That reason is too long (200 characters max)." };
  return { reason };
}

function checkRefusable(order) {
  const status = String(order?.orderStatus || "").toLowerCase();

  if (status === "delivered") {
    return "This order is already marked delivered and cannot be refused.";
  }
  if (status === "cancelled") {
    return "This order has already been cancelled.";
  }
  if (!order?.email) {
    return "This order has no email address, so the code cannot be sent.";
  }
  return null;
}

export const sendRefusalOtp = async (req, res) => {
  sweep();

  const { orderId } = req.params;
  const key = refusalKey(orderId);

  try {
    const { error, order } = await loadOrderForAdmin(orderId, req.admin);
    if (error) return res.status(error.status).json({ success: false, error: error.message });

    const blocked = checkRefusable(order);
    if (blocked) return res.status(400).json({ success: false, error: blocked });

    // The reason comes first: nothing is emailed until there is one.
    const { reason, error: reasonError } = checkReason(req.body?.reason);
    if (reasonError) return res.status(400).json({ success: false, error: reasonError });

    const now = Date.now();
    const existing = otpStore.get(key);

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
      subject: `Confirm cancellation of order ${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px;background:#fafafa;">
          <h2 style="color:#b91c1c;text-align:center;">Confirm you are refusing this delivery</h2>
          <p style="color:#555;text-align:center;">
            Dear <b>${order.customerName || "Customer"}</b>, our delivery agent has reported that
            order <b>${orderId}</b> is being refused.
          </p>
          <p style="color:#555;text-align:center;">
            Share this code with the agent <b>only if you really do not want this order</b>.
            It will be cancelled as soon as the code is entered:
          </p>
          <div style="font-size:36px;font-weight:bold;text-align:center;color:#b91c1c;letter-spacing:8px;margin:24px 0;">
            ${otp}
          </div>
          <p style="color:#888;text-align:center;font-size:13px;">
            Valid for 10 minutes. If you did not refuse this delivery, do not share this code.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
          <p style="color:#aaa;text-align:center;font-size:12px;">&mdash; Myth Reality Technologies</p>
        </div>
      `,
    });

    const windowOpen = existing && now - existing.windowStart <= SEND_WINDOW_MS;
    otpStore.set(key, {
      hash: sha256(otp),
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      lastSentAt: now,
      sends: windowOpen ? existing.sends + 1 : 1,
      windowStart: windowOpen ? existing.windowStart : now,
      // kept so verification can fall back to the reason this code was issued
      // for, rather than depending on the client sending it again
      reason,
    });

    // The code itself is deliberately never logged.
    console.log(`✅ Refusal code emailed for ${orderId} to ${maskEmail(order.email)} (${reason})`);

    return res.json({
      success: true,
      message: "Cancellation code sent to the customer's email",
      sentTo: maskEmail(order.email),
      expiresInMinutes: OTP_TTL_MS / 60000,
      resendAfterSeconds: RESEND_COOLDOWN_MS / 1000,
      reasons: REFUSAL_REASONS,
    });
  } catch (err) {
    console.error(`🔥 Refusal code send failed for ${orderId}:`, err);
    return res.status(502).json({
      success: false,
      error: "Could not send the code by email. Please try again in a moment.",
    });
  }
};

export const verifyRefusalOtp = async (req, res) => {
  sweep();

  const { orderId } = req.params;
  const key = refusalKey(orderId);
  const otp = String(req.body?.otp ?? "").trim();

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ success: false, error: "The code is 6 digits." });
  }

  try {
    const { error, docId, order } = await loadOrderForAdmin(orderId, req.admin);
    if (error) return res.status(error.status).json({ success: false, error: error.message });

    const blocked = checkRefusable(order);
    if (blocked) return res.status(400).json({ success: false, error: blocked });

    const entry = otpStore.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      if (entry) otpStore.delete(key);
      return res.status(400).json({
        success: false,
        error: "That code has expired. Send a new one.",
        expired: true,
      });
    }

    entry.attempts += 1;
    if (entry.attempts > MAX_VERIFY_ATTEMPTS) {
      otpStore.delete(key);
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

    // The reason was validated when the code was sent and stored with it, so
    // it is taken from there. A reason supplied again here is still honoured —
    // and still validated — so the agent can correct it before confirming.
    const { reason, error: reasonError } = checkReason(
      req.body?.reason != null && String(req.body.reason).trim() !== ""
        ? req.body.reason
        : entry.reason
    );
    if (reasonError) return res.status(400).json({ success: false, error: reasonError });

    // Correct code: the customer has confirmed the refusal at the door.
    // Burn it first so a double tap cannot re-run the update.
    otpStore.delete(key);

    const cancelledAt = new Date().toISOString();
    const prepaid = !isCod(order) && String(order.paymentStatus || "").toLowerCase() === "paid";

    // Payment is recorded as it actually stands, never rewritten:
    //   COD      nothing was handed over, so the pending charge simply ends
    //            and paymentCollected is made explicit for the record.
    //   prepaid  money was taken, so paymentStatus stays "paid" and the order
    //            is flagged for refund rather than quietly marked unpaid.
    const update = {
      orderStatus: "cancelled",
      cancelledAt,
      cancelledBy: "delivery",
      cancellationReason: reason,
      refusedAtDelivery: true,
      refusalVerifiedBy: req.admin?.email || req.admin?.adminId || "unknown",
      updatedAt: cancelledAt,
    };
    if (isCod(order)) {
      update.paymentCollected = false;
    } else if (prepaid) {
      update.refundDue = true;
      update.refundStatus = "pending";
    }

    await db.collection("orders").doc(docId).update(update);
    invalidate("orders:");   // the admin list must show this at once

    console.log(
      `✅ ${orderId} cancelled at the door (verified by ${req.admin?.email || "unknown"}): ${reason}`
    );

    // Confirmation to the customer. Best effort — the cancellation is already
    // recorded, so a mail failure must not fail the request.
    try {
      await transporter.sendMail({
        from: `"Myth Reality Technologies" <${process.env.ADMIN_EMAIL}>`,
        to: order.email,
        subject: `Order Cancelled at Delivery - ${orderId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
            <h2 style="color:#b91c1c;">Order Cancelled</h2>
            <p>Dear <b>${order.customerName || "Customer"}</b>,</p>
            <p>Your order was cancelled at the time of delivery, confirmed by the code you provided to our agent.</p>
            <hr/>
            <p><b>Order ID:</b> ${orderId}</p>
            <p><b>Cancelled on:</b> ${new Date(cancelledAt).toLocaleString("en-IN")}</p>
            <p><b>Reason:</b> ${reason}</p>
            <p><b>Order total:</b> &#8377;${order.totalAmount}</p>
            <p><b>Payment method:</b> ${order.paymentMethod || "N/A"}</p>
            ${
              prepaid
                ? '<p style="color:#1d4ed8;"><b>Refund:</b> this order was paid online. Our team will be in touch about the refund.</p>'
                : "<p><b>Amount due:</b> nothing &mdash; no cash was collected.</p>"
            }
            <hr/>
            <p style="color:gray;font-size:12px;">
              For any queries, contact us at ${process.env.ADMIN_EMAIL}
            </p>
          </div>
        `,
      });
      console.log(`✅ Refusal confirmation emailed to ${maskEmail(order.email)} for ${orderId}`);
    } catch (mailErr) {
      console.error(`🔥 Refusal confirmation email failed for ${orderId} (cancellation still recorded):`, mailErr);
    }

    // And the company admin, so a refused delivery — and any refund it owes —
    // lands in an inbox rather than only in the dashboard.
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
        subject: `Delivery Refused & Order Cancelled - ${orderId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;border-radius:8px;">
            <h2 style="color:#b91c1c;">&#128230; Delivery Refused &mdash; Order Cancelled</h2>
            <p>
              <b>${orderId}</b> was refused at the door and cancelled, confirmed by the customer's
              one-time code.
            </p>
            <table style="width:100%;border-collapse:collapse;margin-top:14px;">
              ${row("Order ID", orderId)}
              ${row("Company", companyName)}
              ${row("Customer", `${order.customerName || "-"}<br/>${order.email || "-"}<br/>${order.phone || "-"}`)}
              ${row("Reason", reason)}
              ${row("Order Value", `&#8377;${order.totalAmount}`)}
              ${row("Payment Method", order.paymentMethod || "-")}
              ${row(
                "Payment",
                prepaid
                  ? '<span style="color:#b45309;font-weight:bold;">Paid online &mdash; refund due</span>'
                  : "No cash collected"
              )}
              ${row("Order Status", '<span style="color:#b91c1c;font-weight:bold;">Cancelled</span>')}
              ${row("Cancelled On", new Date(cancelledAt).toLocaleString("en-IN"))}
              ${row("Verified By", req.admin?.email || req.admin?.adminId || "unknown")}
            </table>
            <hr style="margin-top:18px;"/>
            <p style="color:gray;font-size:12px;">
              ${prepaid ? "This order was paid online and needs a refund." : "No action is needed."}
            </p>
          </div>
        `,
      });
      console.log(`✅ Admin notified of refusal for ${orderId} (${maskEmail(adminEmail)})`);
    } catch (mailErr) {
      console.error(`🔥 Admin refusal email failed for ${orderId} (cancellation still recorded):`, mailErr);
    }

    return res.json({
      success: true,
      message: "Order cancelled at delivery",
      orderId,
      orderStatus: "cancelled",
      cancellationReason: reason,
      refundDue: Boolean(prepaid),
      cancelledAt,
    });
  } catch (err) {
    console.error(`🔥 Refusal verification failed for ${orderId}:`, err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
