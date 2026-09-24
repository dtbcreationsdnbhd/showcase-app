import { createReadStream, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const keys = ["ai", "web", "star", "refresh"];
const REST = [0.165, 0.22, 0.29, 1];
const LIT = [0.765, 0.643, 1, 1];
const FRAMES = 90;
const WAVE = 28;

function luma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function loadPng(file) {
  return new Promise((resolve, reject) => {
    createReadStream(file)
      .pipe(new PNG())
      .on("parsed", function parsed() {
        resolve(this);
      })
      .on("error", reject);
  });
}

function dotsFromPng(png) {
  const { width: w, height: h, data } = png;
  const mask = new Uint8Array(w * h);
  let bg = 0;
  const samples = [];
  for (let i = 0; i < 80; i++) {
    const x = Math.floor((i * 17) % w);
    const y = Math.floor((i * 29) % h);
    const o = (w * y + x) << 2;
    samples.push(luma(data[o], data[o + 1], data[o + 2]));
  }
  samples.sort((a, b) => a - b);
  bg = samples[Math.floor(samples.length * 0.15)];
  const thresh = bg + 8;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (w * y + x) << 2;
      if (data[o + 3] < 40) continue;
      if (luma(data[o], data[o + 1], data[o + 2]) > thresh) {
        mask[y * w + x] = 1;
      }
    }
  }

  const seen = new Uint8Array(w * h);
  const dots = [];
  const qx = new Int32Array(w * h);
  const qy = new Int32Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const start = y * w + x;
      if (!mask[start] || seen[start]) continue;
      let qh = 0;
      let qt = 0;
      qx[qt] = x;
      qy[qt] = y;
      qt++;
      seen[start] = 1;
      let sx = 0;
      let sy = 0;
      let n = 0;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      while (qh < qt) {
        const cx = qx[qh];
        const cy = qy[qh];
        qh++;
        sx += cx;
        sy += cy;
        n++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const idx = ny * w + nx;
          if (!mask[idx] || seen[idx]) continue;
          seen[idx] = 1;
          qx[qt] = nx;
          qy[qt] = ny;
          qt++;
        }
      }
      if (n < 6) continue;
      const radius = Math.max(
        1.4,
        Math.min((maxX - minX + 1) / 2, (maxY - minY + 1) / 2, Math.sqrt(n / Math.PI) * 1.08),
      );
      dots.push({ x: sx / n, y: sy / n, d: radius * 2 });
    }
  }
  return { w, h, dots };
}

function colorKf(delay) {
  const t0 = delay;
  const t1 = delay + 16;
  const t2 = delay + 40;
  const t3 = delay + 56;
  const keys = [
    { t: t0, s: REST },
    { t: t1, s: LIT },
    { t: t2, s: LIT },
    { t: t3, s: REST },
  ];
  if (t0 > 0) keys.unshift({ t: 0, s: REST });
  if (t3 < FRAMES) keys.push({ t: FRAMES, s: REST });
  return keys.map((k) => ({
    t: k.t,
    s: k.s,
    i: { x: [0.67], y: [1] },
    o: { x: [0.33], y: [0] },
  }));
}

function toLottie(name, { w, h, dots }) {
  const maxDim = Math.max(w, h);
  const shapes = dots.map((dot) => {
    const delay = Math.round(((dot.x + dot.y) / (w + h)) * WAVE);
    return {
      ty: "gr",
      it: [
        {
          ty: "el",
          p: { a: 0, k: [dot.x, dot.y] },
          s: { a: 0, k: [dot.d, dot.d] },
        },
        {
          ty: "fl",
          c: { a: 1, k: colorKf(delay) },
          o: { a: 0, k: 100 },
          r: 1,
        },
        {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 },
        },
      ],
      nm: "dot",
    };
  });

  return {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: FRAMES,
    w,
    h,
    nm: name,
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "dots",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [w / 2, h / 2, 0] },
          a: { a: 0, k: [w / 2, h / 2, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes,
        ip: 0,
        op: FRAMES,
        st: 0,
      },
    ],
    meta: { maxDim },
  };
}

const HOLD = 24;
const MORPH = 60;
const STATE_SPAN = HOLD + MORPH;

function centroid(dots) {
  let x = 0;
  let y = 0;
  for (const d of dots) {
    x += d.x;
    y += d.y;
  }
  const n = Math.max(dots.length, 1);
  return { x: x / n, y: y / n };
}

function sortedByAngle(dots) {
  const c = centroid(dots);
  return [...dots].sort((a, b) => {
    const aa = Math.atan2(a.y - c.y, a.x - c.x);
    const ba = Math.atan2(b.y - c.y, b.x - c.x);
    if (aa !== ba) return aa - ba;
    return Math.hypot(a.x - c.x, a.y - c.y) - Math.hypot(b.x - c.x, b.y - c.y);
  });
}

function resample(dots, n) {
  const src = sortedByAngle(dots);
  const out = [];
  if (src.length === 0) return out;
  for (let i = 0; i < n; i++) {
    const j = Math.floor((i * src.length) / n) % src.length;
    out.push({ x: src[j].x, y: src[j].y, d: src[j].d });
  }
  return out;
}

function easeKf(times, values) {
  return times.map((t, i) => ({
    t,
    s: values[i],
    i: { x: [0.67, 0.67], y: [1, 1] },
    o: { x: [0.33, 0.33], y: [0, 0] },
  }));
}

function colorWave(delay, op) {
  const keys = [];
  for (let t = 0; t <= op; t += 12) {
    const lit = Math.floor((t + delay) / 12) % 2 === 1;
    keys.push({
      t,
      s: lit ? LIT : REST,
      i: { x: [0.67], y: [1] },
      o: { x: [0.33], y: [0] },
    });
  }
  return keys;
}

function toMorphLottie(layouts) {
  const { w, h } = layouts[0];
  const n = Math.max(...layouts.map((layout) => layout.dots.length));
  const states = layouts.map((layout) => resample(layout.dots, n));
  const op = (layouts.length - 1) * STATE_SPAN + HOLD;
  const times = [];
  for (let i = 0; i < layouts.length; i++) {
    times.push(i * STATE_SPAN, i * STATE_SPAN + HOLD);
  }

  const shapes = states[0].map((_, idx) => {
    const pos = [];
    const size = [];
    for (let i = 0; i < states.length; i++) {
      const d = states[i][idx];
      pos.push([d.x, d.y], [d.x, d.y]);
      size.push([d.d, d.d], [d.d, d.d]);
    }
    return {
      ty: "gr",
      it: [
        {
          ty: "el",
          p: { a: 1, k: easeKf(times, pos) },
          s: { a: 1, k: easeKf(times, size) },
        },
        {
          ty: "fl",
          c: { a: 0, k: LIT },
          o: { a: 0, k: 100 },
          r: 1,
        },
        {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 },
        },
      ],
      nm: "dot",
    };
  });

  return {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op,
    w,
    h,
    nm: "services-morph",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "dots",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [w / 2, h / 2, 0] },
          a: { a: 0, k: [w / 2, h / 2, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes,
        ip: 0,
        op,
        st: 0,
      },
    ],
  };
}

const layouts = [];
for (const key of keys) {
  const pngPath = join(root, "public", "landing", `${key}.png`);
  const png = await loadPng(pngPath);
  const extracted = dotsFromPng(png);
  layouts.push(extracted);
  const json = toLottie(key, extracted);
  const out = join(root, "public", "landing", `${key}.json`);
  writeFileSync(out, JSON.stringify(json));
  console.log(`${key}: ${extracted.dots.length} dots, ${png.width}x${png.height}`);
}

const morph = toMorphLottie(layouts);
writeFileSync(
  join(root, "public", "landing", "services-morph.json"),
  JSON.stringify(morph),
);
console.log(
  `morph: ${morph.layers[0].shapes.length} dots, op=${morph.op} (hold=${HOLD} morph=${MORPH})`,
);
