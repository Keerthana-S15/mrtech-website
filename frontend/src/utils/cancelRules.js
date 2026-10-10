/**
 * When a customer may cancel their own order.
 *
 * Mirrored from cancellability() in backend/controllers/orderController.js and
 * shared by every customer surface that offers a Cancel button, so the dashboard
 * and the tracking page cannot drift apart.
 *
 * This only decides what is *shown*. The server re-checks all of it on every
 * cancellation and answers 409 with a reason, so a page left open past the
 * window — or a hand-made request — still cannot cancel anything.
 */

export const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000;
export const UNCANCELLABLE_STATUSES = ["shipped", "delivered", "cancelled"];

export function canCancelOrder(order, now = Date.now()) {
  const status = String(order?.orderStatus || "").toLowerCase();
  if (UNCANCELLABLE_STATUSES.includes(status)) return false;

  const placedAt = order?.createdAt ? new Date(order.createdAt).getTime() : NaN;
  if (!Number.isFinite(placedAt)) return false;

  return now - placedAt <= CANCEL_WINDOW_MS;
}

/** "3 hours left" / "12 minutes left", for the hint beside the button. */
export function cancelTimeLeft(order, now = Date.now()) {
  const placedAt = new Date(order?.createdAt).getTime();
  if (!Number.isFinite(placedAt)) return null;

  const ms = CANCEL_WINDOW_MS - (now - placedAt);
  if (ms <= 0) return null;

  const hours = Math.floor(ms / 3600000);
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"} left to cancel`;

  const minutes = Math.max(Math.floor(ms / 60000), 1);
  return `${minutes} minute${minutes === 1 ? "" : "s"} left to cancel`;
}
