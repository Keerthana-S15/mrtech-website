/**
 * Printable invoice for an admin order row.
 *
 * The row carries a flattened view for the table plus `fullData`, the raw
 * Firestore document — the same shape orderPdf.js reads, so the two stay
 * consistent. Everything that matters lives on `fullData`, with the flattened
 * fields as a fallback for older rows.
 *
 * This opens a window and prints it rather than producing a file: the admin
 * panel already has Download PDF for that. Printing gives a real invoice with
 * product photos, which the PDF cannot carry.
 */
import { resolveProductImage } from "./productImages";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (n) =>
  typeof n === "number" && Number.isFinite(n) ? `₹${n.toLocaleString("en-IN")}` : "—";

const when = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? String(iso)
    : d.toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
};

/** Images must be absolute: the print window resolves nothing from the opener. */
const absolute = (src) => {
  if (!src) return null;
  if (/^(https?:|data:)/i.test(src)) return src;
  return window.location.origin + (src.startsWith("/") ? src : `/${src}`);
};

const addressLines = (order) => {
  const a = order.fullData?.shippingAddress;
  if (a && typeof a === "object") {
    return [
      a.fullName,
      a.address,
      [a.city, a.pincode].filter(Boolean).join(" - "),
      a.state,
      a.phone ? `Phone: ${a.phone}` : null,
    ].filter(Boolean);
  }
  return [order.address || "—"];
};

const itemRows = (order) => {
  const items = order.fullData?.items;
  if (!Array.isArray(items) || items.length === 0) {
    // Very old rows only kept the joined name string.
    return [{ name: String(order.items || "—"), quantity: null, price: null, image: null }];
  }
  return items.map((it) => ({
    name: it.name || "—",
    quantity: Number(it.quantity) || 0,
    price: Number(it.price) || 0,
    image: absolute(resolveProductImage(it)),
  }));
};

const statusPill = (label, tone) =>
  `<span class="pill pill--${tone}">${esc(label)}</span>`;

const toneFor = (value) => {
  const v = String(value || "").toLowerCase();
  if (["delivered", "paid", "collected"].includes(v)) return "ok";
  if (["cancelled", "failed"].includes(v)) return "bad";
  return "wait";
};

export function buildInvoiceHtml(order) {
  const d = order.fullData || {};
  const rows = itemRows(order);

  const subtotal = typeof d.subtotal === "number" ? d.subtotal : null;
  const shipping = typeof d.shipping === "number" ? d.shipping : null;
  const tax = typeof d.tax === "number" ? d.tax : null;
  const total = typeof d.totalAmount === "number" ? d.totalAmount : order.total;

  const orderId = order.id ?? d.orderId ?? "—";
  const paymentMethod = d.paymentMethod || order.paymentMethod || "—";
  const paymentStatus = d.paymentStatus || order.paymentStatus || "—";
  const orderStatus = d.orderStatus || order.status || "—";

  const lineItems = rows
    .map((r) => {
      const amount = r.quantity && r.price ? r.quantity * r.price : null;
      const thumb = r.image
        ? `<img src="${esc(r.image)}" alt="" onerror="this.parentNode.classList.add('noimg');this.remove()">`
        : "";
      return `
        <tr>
          <td class="cell-item">
            <div class="item">
              <span class="thumb${r.image ? "" : " noimg"}">${thumb}</span>
              <span class="item-name">${esc(r.name)}</span>
            </div>
          </td>
          <td class="num">${r.quantity ?? "—"}</td>
          <td class="num">${r.price != null ? money(r.price) : "—"}</td>
          <td class="num">${amount != null ? money(amount) : "—"}</td>
        </tr>`;
    })
    .join("");

  const totalsRows = [
    subtotal != null ? ["Subtotal", money(subtotal)] : null,
    // Older orders carried real shipping and GST; newer ones are zero and the
    // rows would just be noise, so they only appear when they were charged.
    shipping ? ["Shipping", money(shipping)] : null,
    tax ? ["GST (18%)", money(tax)] : null,
  ]
    .filter(Boolean)
    .map(([k, v]) => `<tr><td>${k}</td><td class="num">${v}</td></tr>`)
    .join("");

  const gstNote = !tax
    ? `<p class="note">Prices exclusive of GST.</p>`
    : "";

  const deliveredRow = d.deliveredAt
    ? `<div><dt>Delivered on</dt><dd>${esc(when(d.deliveredAt))}</dd></div>`
    : "";
  const verifiedRow = d.deliveryVerifiedBy
    ? `<div><dt>Verified by</dt><dd>${esc(d.deliveryVerifiedBy)}</dd></div>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice ${esc(orderId)}</title>
<style>
  :root { --ink:#0f172a; --muted:#64748b; --line:#e2e8f0; --teal:#00313c; --accent:#ff6600; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: var(--ink); background: #f1f5f9; -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .sheet { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 14px; padding: 36px 34px; box-shadow: 0 8px 30px rgba(15,23,42,.08); }
  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; border-bottom: 3px solid var(--teal); padding-bottom: 18px; }
  .brand h1 { margin: 0 0 4px; font-size: 20px; letter-spacing: .01em; color: var(--teal); }
  .brand p { margin: 0; font-size: 12px; color: var(--muted); }
  .doc { text-align: right; }
  .doc h2 { margin: 0 0 6px; font-size: 26px; letter-spacing: .04em; text-transform: uppercase; color: var(--ink); }
  .doc .id { font-size: 13px; font-weight: 700; color: var(--accent); }
  .doc .date { font-size: 12px; color: var(--muted); margin-top: 4px; }

  .cols { display: flex; gap: 28px; flex-wrap: wrap; margin: 24px 0 8px; }
  .col { flex: 1 1 220px; min-width: 200px; }
  .col h3 { margin: 0 0 8px; font-size: 11px; letter-spacing: .09em; text-transform: uppercase; color: var(--muted); }
  .col p { margin: 0 0 3px; font-size: 13.5px; line-height: 1.55; }
  .col strong { font-weight: 600; }

  dl.meta { display: flex; flex-wrap: wrap; gap: 10px 26px; margin: 20px 0 0; padding: 14px 16px; background: #f8fafc; border: 1px solid var(--line); border-radius: 10px; }
  dl.meta div { min-width: 130px; }
  dl.meta dt { font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
  dl.meta dd { margin: 3px 0 0; font-size: 13px; font-weight: 600; }

  .pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 700; text-transform: capitalize; }
  .pill--ok { background: #dcfce7; color: #166534; }
  .pill--wait { background: #fef3c7; color: #92400e; }
  .pill--bad { background: #fee2e2; color: #991b1b; }

  table.items { width: 100%; border-collapse: collapse; margin-top: 26px; }
  table.items th { text-align: left; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #fff; background: var(--teal); padding: 10px 12px; }
  table.items th.num, table.items td.num { text-align: right; }
  table.items td { padding: 11px 12px; border-bottom: 1px solid var(--line); font-size: 13.5px; vertical-align: middle; }
  .item { display: flex; align-items: center; gap: 12px; }
  .thumb { flex: none; width: 46px; height: 46px; border-radius: 8px; border: 1px solid var(--line); background: #f8fafc; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb.noimg::after { content: "📦"; font-size: 20px; }
  .item-name { font-weight: 600; }

  .totals { margin-top: 22px; margin-left: auto; width: 100%; max-width: 310px; }
  .totals table { width: 100%; border-collapse: collapse; }
  .totals td { padding: 7px 0; font-size: 13.5px; color: var(--muted); }
  .totals td.num { text-align: right; color: var(--ink); font-weight: 600; }
  .totals .grand td { border-top: 2px solid var(--line); padding-top: 12px; font-size: 17px; font-weight: 800; color: var(--ink); }
  .totals .grand td.num { color: var(--accent); }
  .note { margin: 10px 0 0; font-size: 11.5px; color: var(--muted); text-align: right; }

  footer { margin-top: 34px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 11.5px; color: var(--muted); text-align: center; line-height: 1.7; }

  @media print {
    body { background: #fff; padding: 0; }
    .sheet { box-shadow: none; border-radius: 0; max-width: none; padding: 0; }
    table.items tr { break-inside: avoid; }
  }
  @media (max-width: 560px) {
    body { padding: 16px 12px; }
    .sheet { padding: 22px 18px; }
    .doc { text-align: left; }
    header { flex-direction: column; }
    .totals { max-width: none; }
  }
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <div class="brand">
        <h1>Myth Reality Technologies</h1>
        <p>AI-powered innovation for healthcare, agriculture &amp; digital transformation</p>
      </div>
      <div class="doc">
        <h2>Invoice</h2>
        <div class="id">${esc(orderId)}</div>
        <div class="date">${esc(when(d.createdAt))}</div>
      </div>
    </header>

    <div class="cols">
      <div class="col">
        <h3>Billed to</h3>
        <p><strong>${esc(d.customerName || order.customer || "—")}</strong></p>
        <p>${esc(d.email || order.email || "—")}</p>
        <p>${esc(d.phone || order.phone || "—")}</p>
      </div>
      <div class="col">
        <h3>Delivery address</h3>
        ${addressLines(order).map((l) => `<p>${esc(l)}</p>`).join("")}
      </div>
    </div>

    <dl class="meta">
      <div><dt>Order status</dt><dd>${statusPill(orderStatus, toneFor(orderStatus))}</dd></div>
      <div><dt>Payment method</dt><dd>${esc(paymentMethod)}</dd></div>
      <div><dt>Payment status</dt><dd>${statusPill(paymentStatus, toneFor(paymentStatus))}</dd></div>
      <div><dt>Order date</dt><dd>${esc(when(d.createdAt))}</dd></div>
      ${deliveredRow}
      ${verifiedRow}
    </dl>

    <table class="items">
      <thead>
        <tr>
          <th>Item</th>
          <th class="num">Qty</th>
          <th class="num">Price</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>${lineItems}</tbody>
    </table>

    <div class="totals">
      <table>
        ${totalsRows}
        <tr class="grand"><td>Total</td><td class="num">${money(total)}</td></tr>
      </table>
      ${gstNote}
    </div>

    <footer>
      Thank you for your business.<br>
      This is a computer-generated invoice and does not require a signature.
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Opens the invoice in a new window and sends it to the printer.
 *
 * Printing waits for the product images: firing print() immediately gives a
 * sheet with empty boxes where the photos should be. A short timeout covers
 * an image that never resolves so the dialog still appears.
 */
export function printOrderInvoice(order) {
  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) {
    return { ok: false, reason: "popup-blocked" };
  }

  win.document.open();
  win.document.write(buildInvoiceHtml(order));
  win.document.close();

  const go = () => {
    try {
      win.focus();
      win.print();
    } catch {
      /* the window was closed before printing — nothing to recover */
    }
  };

  const images = Array.from(win.document.images || []);
  const pending = images.filter((img) => !img.complete);

  if (pending.length === 0) {
    // give the layout one frame to settle
    win.setTimeout(go, 60);
    return { ok: true };
  }

  let left = pending.length;
  let fired = false;
  const once = () => {
    if (fired) return;
    left -= 1;
    if (left <= 0) {
      fired = true;
      win.setTimeout(go, 60);
    }
  };
  pending.forEach((img) => {
    img.addEventListener("load", once);
    img.addEventListener("error", once);
  });
  // never leave the admin staring at a window that will not print
  win.setTimeout(() => {
    if (!fired) {
      fired = true;
      go();
    }
  }, 3000);

  return { ok: true };
}
