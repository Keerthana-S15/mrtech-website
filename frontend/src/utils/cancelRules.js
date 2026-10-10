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

/**
 * Why an order can or cannot be cancelled right now, for a surface that shows
 * a live countdown and needs to tell the two refusals apart:
 *
 *   "cancellable" — inside the window, with msLeft / hh:mm:ss to show
 *   "expired"     — the 24 hours have run out, so say so
 *   "status"      — shipped, delivered or already cancelled; the window is
 *                   irrelevant and saying "expired" would be wrong
 *   "unknown"     — no usable createdAt, so no claim is made either way
 *
 * Derived from the order's own createdAt on every call, so passing a ticking
 * `now` is all a live countdown needs.
 */
export function cancelState(order, now = Date.now()) {
  const status = String(order?.orderStatus || "").toLowerCase();
  if (UNCANCELLABLE_STATUSES.includes(status)) return { kind: "status", status };

  const placedAt = order?.createdAt ? new Date(order.createdAt).getTime() : NaN;
  if (!Number.isFinite(placedAt)) return { kind: "unknown" };

  const msLeft = CANCEL_WINDOW_MS - (now - placedAt);
  if (msLeft <= 0) return { kind: "expired" };

  const total = Math.floor(msLeft / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n) => String(n).padStart(2, "0");

  return {
    kind: "cancellable",
    msLeft,
    hours,
    minutes,
    seconds,
    clock: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}
