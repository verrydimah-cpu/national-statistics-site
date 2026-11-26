/* NusaStat charts: small SVG bar and line charts drawn from local data.
   No library, no network — pure DOM/SVG built from the numbers in data.js. */

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function fmtNum(v) {
  return String(v).replace(".", ",");
}

/* Axis tick labels: whole numbers for large values, one decimal otherwise. */
function fmtAxis(v) {
  if (Math.abs(v) >= 100) return fmtNum(Math.round(v));
  return fmtNum(Math.round(v * 10) / 10);
}

/* Horizontal or vertical bar chart.
   opts: { labels, values, unit, color, height, valueFmt, horizontal } */
function barChart(opts) {
  const W = 640, H = opts.height || 260, padL = 46, padR = 14, padT = 12, padB = 30;
  const svg = svgEl("svg", {
    viewBox: "0 0 " + W + " " + H, role: "img",
    "aria-label": "Grafik batang: " + (opts.title || ""),
  });
  const max = Math.max.apply(null, opts.values.map(Math.abs)) || 1;
  const min = Math.min.apply(null, opts.values.concat([0]));
  const span = max - min;
  const iw = W - padL - padR, ih = H - padT - padB;
  const zeroY = padT + ih * (max / span);
  const n = opts.values.length;
  const slot = iw / n, bw = Math.min(44, slot * 0.62);

  // gridlines
  for (let g = 0; g <= 4; g++) {
    const v = min + (span * g) / 4;
    const y = padT + ih * (1 - (v - min) / span);
    const line = svgEl("line", { x1: padL, x2: W - padR, y1: y, y2: y, class: "grid" });
    svg.appendChild(line);
    const t = svgEl("text", { x: padL - 6, y: y + 4, class: "axis-label", "text-anchor": "end" });
    t.textContent = fmtAxis(v);
    svg.appendChild(t);
  }
  const zero = svgEl("line", { x1: padL, x2: W - padR, y1: zeroY, y2: zeroY, class: "axis" });
  svg.appendChild(zero);

  opts.values.forEach(function (v, i) {
    const x = padL + slot * i + (slot - bw) / 2;
    const h = Math.abs(v) / span * ih;
    const y = v >= 0 ? zeroY - h : zeroY;
    const bar = svgEl("rect", {
      x: x, y: y, width: bw, height: Math.max(h, 1.5),
      rx: 3, class: "bar", fill: v < 0 ? "#c0392b" : (opts.color || "#0e7c7b"),
    });
    svg.appendChild(bar);
    const val = svgEl("text", {
      x: x + bw / 2, y: (v >= 0 ? y - 6 : y + h + 14),
      class: "bar-value", "text-anchor": "middle",
    });
    val.textContent = opts.valueFmt ? opts.valueFmt(v) : fmtNum(v);
    svg.appendChild(val);
    const lab = svgEl("text", { x: x + bw / 2, y: H - 8, class: "axis-label", "text-anchor": "middle" });
    lab.textContent = opts.labels[i];
    svg.appendChild(lab);
  });
  return svg;
}

/* Line chart with dots and value labels. */
function lineChart(opts) {
  const W = 640, H = opts.height || 260, padL = 46, padR = 20, padT = 18, padB = 30;
  const svg = svgEl("svg", {
    viewBox: "0 0 " + W + " " + H, role: "img",
    "aria-label": "Grafik garis: " + (opts.title || ""),
  });
  const vals = opts.values;
  const min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  const pad = (max - min) * 0.15 || 1;
  const lo = min - pad, hi = max + pad;
  const iw = W - padL - padR, ih = H - padT - padB;
  const X = function (i) { return padL + iw * (vals.length === 1 ? 0.5 : i / (vals.length - 1)); };
  const Y = function (v) { return padT + ih * (1 - (v - lo) / (hi - lo)); };

  for (let g = 0; g <= 4; g++) {
    const v = lo + (hi - lo) * g / 4;
    const y = Y(v);
    svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: y, y2: y, class: "grid" }));
    const t = svgEl("text", { x: padL - 6, y: y + 4, class: "axis-label", "text-anchor": "end" });
    t.textContent = fmtAxis(v);
    svg.appendChild(t);
  }
  const pts = vals.map(function (v, i) { return X(i) + "," + Y(v); }).join(" ");
  svg.appendChild(svgEl("polyline", { points: pts, class: "line-path", fill: "none" }));
  vals.forEach(function (v, i) {
    svg.appendChild(svgEl("circle", { cx: X(i), cy: Y(v), r: 5, class: "line-dot" }));
    const t = svgEl("text", { x: X(i), y: Y(v) - 11, class: "bar-value", "text-anchor": "middle" });
    t.textContent = opts.valueFmt ? opts.valueFmt(v) : fmtNum(v);
    svg.appendChild(t);
    const lab = svgEl("text", { x: X(i), y: H - 8, class: "axis-label", "text-anchor": "middle" });
    lab.textContent = opts.labels[i];
    svg.appendChild(lab);
  });
  return svg;
}

/* Horizontal ranked bars (province comparison / choropleth-style bars). */
function rankedBars(rows, opts) {
  const W = 640, rowH = 30, H = 16 + rows.length * rowH + 8;
  const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": opts.title || "Perbandingan provinsi" });
  const max = Math.max.apply(null, rows.map(function (r) { return r.value; })) || 1;
  const labelW = 150, barX = labelW + 8, barW = W - barX - 64;
  rows.forEach(function (r, i) {
    const y = 16 + i * rowH;
    const lab = svgEl("text", { x: labelW, y: y + 15, class: "rank-label", "text-anchor": "end" });
    lab.textContent = r.label;
    svg.appendChild(lab);
    svg.appendChild(svgEl("rect", { x: barX, y: y + 4, width: barW, height: 16, rx: 3, class: "bar-track" }));
    svg.appendChild(svgEl("rect", {
      x: barX, y: y + 4, width: Math.max(barW * r.value / max, 2), height: 16, rx: 3,
      class: "bar", fill: opts.color || "#0b4f6c",
    }));
    const val = svgEl("text", { x: barX + barW + 6, y: y + 17, class: "bar-value" });
    val.textContent = r.display;
    svg.appendChild(val);
  });
  return svg;
}
