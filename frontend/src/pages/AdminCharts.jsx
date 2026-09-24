import React, { useMemo, useState } from "react";

/**
 * Inline-SVG charts for the admin dashboard. No charting dependency — these
 * render straight from the live orders/products already in state.
 *
 * Palette was validated with the dataviz palette checker against a white
 * surface (lightness band, chroma floor, CVD separation, normal-vision floor
 * all PASS). The contrast warning for the lighter hues is answered by direct
 * value labels + a legend, so colour never carries meaning on its own.
 */
export const STATUS_COLORS = {
  pending: "#F97316",
  processing: "#0EA5E9",
  shipped: "#8B5CF6",
  delivered: "#10B981",
  cancelled: "#DC2626",
};
export const STATUS_ORDER = ["pending", "processing", "shipped", "delivered", "cancelled"];

const TEAL = "#0E7490";
const INK = "#0f172a";
const MUTED = "#64748b";
const GRID = "#e2e8f0";

const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const nice = (max) => {
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / pow) * pow;
};

/* ------------------------------------------------------------------ *
 * Revenue over time — single series, so no legend; the title names it.
 * ------------------------------------------------------------------ */
export function RevenueTrend({ data, height = 220 }) {
  const [hover, setHover] = useState(null);
  const W = 720;
  const H = height;
  const pad = { t: 16, r: 16, b: 28, l: 56 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const max = nice(Math.max(...data.map((d) => d.value), 0));
  const x = (i) => (data.length <= 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v) => ih - (max ? (v / max) * ih : 0);

  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = data.length
    ? `${line} L${x(data.length - 1)},${ih} L${x(0)},${ih} Z`
    : "";

  if (!data.length) return <ChartEmpty label="No revenue yet" />;

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart-svg"
        role="img"
        aria-label={`Revenue over the last ${data.length} periods`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="revfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.28" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <g transform={`translate(${pad.l},${pad.t})`}>
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1="0" x2={iw} y1={ih * f} y2={ih * f} stroke={GRID} strokeWidth="1" />
              <text x="-10" y={ih * f + 4} textAnchor="end" fontSize="11" fill={MUTED}>
                {money(max * (1 - f))}
              </text>
            </g>
          ))}

          <path d={area} fill="url(#revfill)" />
          <path d={line} fill="none" stroke={TEAL} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {data.map((d, i) => (
            <g key={d.label}>
              {hover === i && (
                <line x1={x(i)} x2={x(i)} y1="0" y2={ih} stroke={TEAL} strokeWidth="1" strokeDasharray="3 3" />
              )}
              <circle
                cx={x(i)}
                cy={y(d.value)}
                r={hover === i ? 6 : 4}
                fill="#fff"
                stroke={TEAL}
                strokeWidth="2.5"
              />
              {/* generous invisible hit target */}
              <rect
                x={x(i) - iw / Math.max(data.length, 1) / 2}
                y="0"
                width={iw / Math.max(data.length, 1)}
                height={ih}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
              {(i === 0 || i === data.length - 1 || data.length <= 8) && (
                <text x={x(i)} y={ih + 18} textAnchor="middle" fontSize="11" fill={MUTED}>
                  {d.label}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>

      {hover !== null && data[hover] && (
        <div className="chart-tip" style={{ left: `${((pad.l + x(hover)) / W) * 100}%` }}>
          <strong>{money(data[hover].value)}</strong>
          <small>
            {data[hover].label} · {data[hover].count} order{data[hover].count === 1 ? "" : "s"}
          </small>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Order status mix — part-to-whole, stacked horizontal bar + legend.
 * Each segment is also labelled, so hue is never the only cue.
 * ------------------------------------------------------------------ */
export function StatusMix({ counts, total }) {
  const rows = STATUS_ORDER.map((s) => ({ key: s, value: counts[s] || 0 })).filter((r) => r.value > 0);
  const [hover, setHover] = useState(null);
  if (!total) return <ChartEmpty label="No orders yet" />;

  let acc = 0;
  return (
    <div className="chart-stack">
      <div className="statusbar" role="img" aria-label="Order status breakdown">
        {rows.map((r) => {
          const pct = (r.value / total) * 100;
          const seg = (
            <span
              key={r.key}
              className={`statusbar-seg${hover === r.key ? " is-hover" : ""}`}
              style={{ width: `${pct}%`, background: STATUS_COLORS[r.key], left: `${acc}%` }}
              onMouseEnter={() => setHover(r.key)}
              onMouseLeave={() => setHover(null)}
              title={`${r.key}: ${r.value}`}
            />
          );
          acc += pct;
          return seg;
        })}
      </div>

      <ul className="chart-legend">
        {STATUS_ORDER.map((s) => (
          <li
            key={s}
            className={hover === s ? "is-hover" : ""}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="chart-swatch" style={{ background: STATUS_COLORS[s] }} />
            <span className="chart-legend-name">{s}</span>
            <span className="chart-legend-val">
              {counts[s] || 0}
              <small>{total ? Math.round(((counts[s] || 0) / total) * 100) : 0}%</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Top products — nominal categories, so one hue for every bar.
 * ------------------------------------------------------------------ */
export function TopProducts({ items, valueLabel = "units" }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...items.map((i) => i.value), 1);
  if (!items.length) return <ChartEmpty label="No sales data yet" />;

  return (
    <ul className="hbars">
      {items.map((it, i) => (
        <li
          key={it.label}
          className={hover === i ? "is-hover" : ""}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          <span className="hbar-rank">{i + 1}</span>
          <span className="hbar-label" title={it.label}>
            {it.label}
          </span>
          <span className="hbar-track">
            <span className="hbar-fill" style={{ width: `${(it.value / max) * 100}%` }} />
          </span>
          <span className="hbar-val">
            {it.value.toLocaleString("en-IN")}
            <small>{valueLabel}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Sparkline used inside the KPI tiles */
export function Sparkline({ points, color = TEAL }) {
  const d = useMemo(() => {
    if (!points || points.length < 2) return "";
    const max = Math.max(...points, 1);
    const w = 100;
    const h = 28;
    return points
      .map((p, i) => `${i ? "L" : "M"}${(i / (points.length - 1)) * w},${h - (p / max) * h}`)
      .join(" ");
  }, [points]);
  if (!d) return null;
  return (
    <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChartEmpty({ label }) {
  return <div className="chart-empty">{label}</div>;
}

export { INK, MUTED, TEAL };
