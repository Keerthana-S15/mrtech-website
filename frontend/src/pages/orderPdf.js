
/**
 * Build a one-page order PDF from a row in the admin Orders table.
 *
 * The row carries a flattened view for the table plus `fullData`, the raw
 * Firestore document. Everything that matters lives on `fullData`, so the
 * flattened fields are only used as a fallback when a document predates a
 * field (older orders have no tax/shipping breakdown, for example).
 *
 * Laid out by hand rather than with autotable so there is one less dependency
 * and the column widths stay predictable for long product names.
 */

const TEAL = [0, 49, 60];
const CYAN = [8, 145, 178];
const INK = [30, 41, 59];
const MUTED = [100, 116, 139];
const LINE = [222, 231, 236];

const PAGE_W = 210;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

const money = (n) =>
  `Rs. ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const asDate = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? String(v)
    : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const addressOf = (order) => {
  const a = order.fullData?.shippingAddress;
  if (a && typeof a === "object") {
    return [a.address, a.city, a.state && a.pincode ? `${a.state} - ${a.pincode}` : a.state || a.pincode]
      .filter(Boolean)
      .join(", ");
  }
  return a || order.address || "-";
};

/** Rows for the items table, tolerating older documents without prices. */
const itemRows = (order) => {
  const items = order.fullData?.items;
  if (!Array.isArray(items)) {
    return [{ name: String(order.items || "-"), qty: "", price: null, amount: null }];
  }
  return items.map((it) => {
    const qty = Number(it.quantity) || 1;
    const price = it.price != null ? Number(it.price) : null;
    return {
      // plain ASCII separator: the PDF core fonts use WinAnsi, and anything
      // outside it (a middle dot, a rupee sign) risks rendering as a blank or
      // a replacement glyph depending on the viewer
      name: [it.name, it.ml, it.color].filter(Boolean).join(" - ") || "Item",
      qty: String(qty),
      price,
      amount: price != null ? price * qty : null,
    };
  });
};

/**
 * jsPDF is ~130KB and only ever runs when an admin clicks Download PDF, so it
 * is pulled in on demand rather than bundled into the main chunk that every
 * visitor downloads.
 */
export async function buildOrderPdf(order) {
  const { jsPDF } = await import("jspdf");
  const d = order.fullData || {};
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  // ---- header band ----
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, PAGE_W, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text("Myth Reality Technologies", MARGIN, 13);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.setTextColor(165, 243, 252);
  doc.text("Order Summary", MARGIN, 20);
  doc.setFontSize(8);
  doc.setTextColor(203, 232, 240);
  doc.text("mrtech05.ai@gmail.com  |  +91-7305152581", MARGIN, 25.5);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold").setFontSize(13);
  doc.text(String(order.id ?? d.orderId ?? "-"), PAGE_W - MARGIN, 14, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.setTextColor(203, 232, 240);
  doc.text(`Status: ${String(d.orderStatus ?? order.status ?? "-").toUpperCase()}`, PAGE_W - MARGIN, 20, {
    align: "right",
  });
  doc.text(`Generated ${new Date().toLocaleDateString("en-IN")}`, PAGE_W - MARGIN, 25.5, { align: "right" });

  y = 40;

  // ---- meta grid ----
  const meta = [
    ["Order ID", String(order.id ?? d.orderId ?? "-")],
    ["Placed on", asDate(d.createdAt)],
    ["Payment", `${d.paymentMethod || "-"}${d.paymentStatus ? ` (${d.paymentStatus})` : ""}`],
    ["Est. delivery", d.estimatedDelivery ? asDate(d.estimatedDelivery) : "-"],
  ];
  if (d.parentOrderId && d.parentOrderId !== (order.id ?? d.orderId)) {
    meta.push(["Parent order", String(d.parentOrderId)]);
  }
  if (d.companyId) meta.push(["Company", String(d.companyId)]);

  doc.setFontSize(9);
  meta.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (CONTENT_W / 2);
    const ry = y + row * 11;
    doc.setFont("helvetica", "bold").setTextColor(...MUTED);
    doc.text(String(label).toUpperCase(), x, ry);
    doc.setFont("helvetica", "normal").setTextColor(...INK);
    doc.text(doc.splitTextToSize(String(value), CONTENT_W / 2 - 6), x, ry + 5);
  });
  y += Math.ceil(meta.length / 2) * 11 + 6;

  // ---- customer + address, side by side ----
  const boxTop = y;
  const half = CONTENT_W / 2 - 3;
  const custLines = [
    d.customerName || order.customer || "-",
    d.email || order.email || "-",
    d.phone || order.phone || "-",
  ];
  const addrLines = doc.splitTextToSize(addressOf(order), half - 8);
  const boxH = Math.max(custLines.length, addrLines.length) * 5 + 16;

  [
    ["CUSTOMER", custLines, MARGIN],
    ["SHIPPING ADDRESS", addrLines, MARGIN + half + 6],
  ].forEach(([title, lines, x]) => {
    doc.setDrawColor(...LINE).setFillColor(248, 250, 252);
    doc.roundedRect(x, boxTop, half, boxH, 2, 2, "FD");
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...CYAN);
    doc.text(title, x + 4, boxTop + 6);
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...INK);
    lines.forEach((l, i) => doc.text(String(l), x + 4, boxTop + 13 + i * 5));
  });
  y = boxTop + boxH + 8;

  // ---- items ----
  const rows = itemRows(order);
  const colQty = MARGIN + CONTENT_W - 62;
  const colPrice = MARGIN + CONTENT_W - 42;
  const colAmt = MARGIN + CONTENT_W;

  doc.setFillColor(...TEAL);
  doc.rect(MARGIN, y, CONTENT_W, 8, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(255, 255, 255);
  doc.text("ITEM", MARGIN + 3, y + 5.5);
  doc.text("QTY", colQty, y + 5.5, { align: "right" });
  doc.text("PRICE", colPrice, y + 5.5, { align: "right" });
  doc.text("AMOUNT", colAmt - 3, y + 5.5, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...INK);
  rows.forEach((r, i) => {
    const nameLines = doc.splitTextToSize(r.name, CONTENT_W - 70);
    const rowH = nameLines.length * 4.6 + 4;
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(MARGIN, y, CONTENT_W, rowH, "F");
    }
    doc.setTextColor(...INK);
    nameLines.forEach((l, li) => doc.text(l, MARGIN + 3, y + 5 + li * 4.6));
    doc.text(r.qty, colQty, y + 5, { align: "right" });
    doc.text(r.price != null ? money(r.price) : "-", colPrice, y + 5, { align: "right" });
    doc.text(r.amount != null ? money(r.amount) : "-", colAmt - 3, y + 5, { align: "right" });
    y += rowH;
    doc.setDrawColor(...LINE).line(MARGIN, y, MARGIN + CONTENT_W, y);
  });

  // ---- totals ----
  y += 6;
  const totals = [
    ["Subtotal", d.subtotal],
    ["Shipping", d.shipping],
    ["Tax", d.tax],
  ].filter(([, v]) => v != null);

  doc.setFontSize(9);
  totals.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal").setTextColor(...MUTED);
    doc.text(label, colPrice, y, { align: "right" });
    doc.setTextColor(...INK);
    doc.text(money(value), colAmt - 3, y, { align: "right" });
    y += 6;
  });

  doc.setDrawColor(...LINE).line(colPrice - 30, y - 2, MARGIN + CONTENT_W, y - 2);
  y += 3;
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...TEAL);
  doc.text("TOTAL", colPrice, y, { align: "right" });
  doc.text(money(d.totalAmount ?? order.total), colAmt - 3, y, { align: "right" });

  // ---- footer ----
  doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...MUTED);
  doc.text(
    "This is a computer-generated order summary and does not require a signature.",
    PAGE_W / 2,
    287,
    { align: "center" }
  );

  return doc;
}

/** Build and download the PDF. Returns the filename used. */
export async function downloadOrderPdf(order) {
  const doc = await buildOrderPdf(order);
  const name = `order-${String(order.id ?? order.fullData?.orderId ?? "unknown").replace(/[^\w-]/g, "_")}.pdf`;
  doc.save(name);
  return name;
}
