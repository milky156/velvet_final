import React from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMoney(n: number) {
  return `₱${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function MiniStat({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-pink-700/80">{label}</p>
      <p className="mt-2 text-2xl font-bold text-pink-800">{value}</p>
      {subValue ? <p className="mt-1 text-xs text-pink-700/80">{subValue}</p> : null}
    </div>
  );
}

export function SalesLineChart({
  points,
  height = 140,
}: {
  points: { xLabel: string; value: number }[];
  height?: number;
}) {
  const width = 520;
  const padding = 18;
  const max = Math.max(1, ...points.map((p) => p.value));
  const min = Math.min(0, ...points.map((p) => p.value));
  const range = Math.max(1, max - min);

  const path = points
    .map((p, i) => {
      const x = padding + (i * (width - padding * 2)) / Math.max(1, points.length - 1);
      const y = padding + ((max - p.value) * (height - padding * 2)) / range;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const area = `${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-pink-800">Today’s Sales</p>
          <p className="mt-1 text-xs text-pink-700/80">Hourly revenue trend</p>
        </div>
        <p className="text-xs font-semibold text-pink-700/80">0–{formatMoney(max)}</p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-[140px] w-full">
        <defs>
          <linearGradient id="vv_area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff4fa3" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ff4fa3" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} rx="18" fill="#fffaf5" />
        <path d={area} fill="url(#vv_area)" />
        <path d={path} fill="none" stroke="#b81b63" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => {
          const x = padding + (i * (width - padding * 2)) / Math.max(1, points.length - 1);
          const y = padding + ((max - p.value) * (height - padding * 2)) / range;
          return <circle key={p.xLabel} cx={x} cy={y} r="4.5" fill="#ff4fa3" stroke="#fff" strokeWidth="2" />;
        })}
      </svg>

      <div className="mt-2 flex justify-between text-[11px] text-pink-700/75">
        <span>{points[0]?.xLabel}</span>
        <span>{points[Math.floor(points.length / 2)]?.xLabel}</span>
        <span>{points.at(-1)?.xLabel}</span>
      </div>
    </div>
  );
}

export function DeviceTypeDonut({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  const total = Math.max(1, items.reduce((s, i) => s + i.value, 0));
  const r = 64;
  const c = 2 * Math.PI * r;

  const segments = items.reduce<{ label: string; value: number; color: string; len: number; offset: number }[]>(
    (acc, it) => {
      const frac = clamp(it.value / total, 0, 1);
      const len = frac * c;
      const prev = acc.at(-1);
      const offset = prev ? prev.offset + prev.len : 0;
      acc.push({ ...it, len, offset });
      return acc;
    },
    [],
  );

  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-pink-800">Device Type</p>
          <p className="mt-1 text-xs text-pink-700/80">Traffic split</p>
        </div>
        <p className="text-xs font-semibold text-pink-700/80">{Math.round((items[0]?.value ?? 0) / total * 100)}% top</p>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <svg viewBox="0 0 180 180" className="h-[150px] w-[150px]">
          <circle cx="90" cy="90" r="74" fill="#fffaf5" />
          <g transform="rotate(-90 90 90)">
            <circle cx="90" cy="90" r={r} stroke="#ffe0ef" strokeWidth="18" fill="none" />
            {segments.map((s) => (
              <circle
                key={s.label}
                cx="90"
                cy="90"
                r={r}
                stroke={s.color}
                strokeWidth="18"
                fill="none"
                strokeDasharray={`${s.len} ${c - s.len}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="round"
              />
            ))}
          </g>
          <circle cx="90" cy="90" r="50" fill="#fff" />
          <text x="90" y="92" textAnchor="middle" fontSize="14" fill="#601b3c" fontWeight="700">
            {Math.round((items.reduce((m, i) => (i.value > m.value ? i : m), items[0]!).value / total) * 100)}%
          </text>
          <text x="90" y="112" textAnchor="middle" fontSize="10" fill="#7a2a51" fontWeight="600">
            Total Views
          </text>
        </svg>

        <div className="min-w-0 flex-1 space-y-2">
          {items.map((it) => (
            <div key={it.label} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: it.color }} />
                <span className="truncate text-pink-800">{it.label}</span>
              </div>
              <span className="shrink-0 text-xs font-semibold text-pink-700/80">
                {Math.round((it.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MonthlyRevenueBars({
  months,
}: {
  months: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...months.map((m) => m.value));
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-pink-800">Monthly Revenue</p>
          <p className="mt-1 text-xs text-pink-700/80">Last {months.length} months</p>
        </div>
        <p className="text-xs font-semibold text-pink-700/80">Max {formatMoney(max)}</p>
      </div>

      <div className="mt-4 grid grid-cols-7 items-end gap-3">
        {months.map((m) => {
          const h = Math.round((m.value / max) * 120);
          return (
            <div key={m.label} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-xl border border-pink-200 bg-gradient-to-b from-pink-500/80 to-pink-800/80"
                style={{ height: `${clamp(h, 8, 120)}px` }}
                title={`${m.label}: ${formatMoney(m.value)}`}
              />
              <span className="text-[11px] font-semibold text-pink-700/75">{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BestSellerBouquets({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-pink-800">Best Seller Bouquets</p>
          <p className="mt-1 text-xs text-pink-700/80">Units sold (top {items.length})</p>
        </div>
        <p className="text-xs font-semibold text-pink-700/80">Top {max}</p>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.label} className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold text-pink-800">{it.label}</span>
              <span className="shrink-0 text-xs font-semibold text-pink-700/80">{it.value}</span>
            </div>
            <div className="h-3 rounded-full bg-pink-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-800"
                style={{ width: `${clamp((it.value / max) * 100, 3, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InventoryStockWarnings({
  items,
  lowThreshold = 8,
  criticalThreshold = 3,
}: {
  items: { label: string; stock: number }[];
  lowThreshold?: number;
  criticalThreshold?: number;
}) {
  const low = items.filter((i) => i.stock <= lowThreshold && i.stock > criticalThreshold);
  const critical = items.filter((i) => i.stock <= criticalThreshold);
  const flagged = [...critical, ...low].slice(0, 6);

  const max = Math.max(1, ...flagged.map((i) => Math.max(0, i.stock)));
  const hasAny = flagged.length > 0;

  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-pink-800">Inventory Stock Warnings</p>
          <p className="mt-1 text-xs text-pink-700/80">
            Critical (≤{criticalThreshold}) and low (≤{lowThreshold}) stock items
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {critical.length} critical
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {low.length} low
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {!hasAny ? (
          <div className="rounded-2xl border border-pink-200 bg-[#fffaf5] p-4 text-sm text-pink-800/80">
            No low-stock items right now.
          </div>
        ) : (
          flagged.map((it) => {
            const isCritical = it.stock <= criticalThreshold;
            const pct = clamp((Math.max(0, it.stock) / max) * 100, 2, 100);
            return (
              <div key={it.label} className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-pink-800">{it.label}</span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                      isCritical
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    {it.stock} left
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-pink-100">
                  <div
                    className={`h-2.5 rounded-full ${
                      isCritical ? "bg-gradient-to-r from-red-400 to-red-600" : "bg-gradient-to-r from-amber-400 to-amber-600"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

