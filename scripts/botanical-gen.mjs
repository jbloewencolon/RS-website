// Botanical mark generator — Relational Sovereignty.
//
// Emits engraved-linework SVG for a set of plant forms: rhizome, vine,
// root mass, tendril, bud, bloom, frond. Seeded and deterministic, so
// the same seed always yields the same drawing and the output can be
// baked into a static sprite rather than generated in the browser.
//
// Register: hairline contour (~1.0) + finer interior hatching (~0.45) +
// stipple, in the manner of a 19th-c. botanical plate. No fills.

const TAU = Math.PI * 2;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v) => Math.round(v * 100) / 100;

// Catmull-Rom through points -> cubic bezier path. Tension 0.5 reads as a
// plant stem; higher gets rubbery, lower gets polygonal.
function spine(pts, tension = 0.5) {
  if (pts.length < 2) return "";
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2, p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2, p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2];
    d += ` C${n(c1[0])} ${n(c1[1])},${n(c2[0])} ${n(c2[1])},${n(p2[0])} ${n(p2[1])}`;
  }
  return d;
}

// Sample a point + tangent along a polyline spine.
function sampleSpine(pts, t) {
  const total = pts.length - 1;
  const f = Math.min(total - 0.001, Math.max(0, t * total));
  const i = Math.floor(f);
  const u = f - i;
  const a = pts[i], b = pts[i + 1];
  return {
    x: a[0] + (b[0] - a[0]) * u,
    y: a[1] + (b[1] - a[1]) * u,
    angle: Math.atan2(b[1] - a[1], b[0] - a[0]),
  };
}

/* ---------------------------------------------------------------- leaf */
// Lanceolate leaf with midrib and paired veins, drawn in local space
// pointing along +x, then transformed into place by the caller.
function leaf({ x, y, angle, len, wid, curl = 0, veins = 4, hatch = false }) {
  const L = len, W = wid;
  const bow = curl * W * 0.9;
  const outline =
    `M0 0 ` +
    `C${n(L * 0.16)} ${n(-W * 0.82 + bow * 0.3)},${n(L * 0.58)} ${n(-W * 1.02 + bow * 0.7)},${n(L)} ${n(bow)} ` +
    `C${n(L * 0.58)} ${n(W * 0.86 + bow * 0.7)},${n(L * 0.16)} ${n(W * 0.7 + bow * 0.3)},0 0Z`;
  const midrib = `M0 0 C${n(L * 0.35)} ${n(bow * 0.25)},${n(L * 0.7)} ${n(bow * 0.6)},${n(L)} ${n(bow)}`;

  let veinPaths = "";
  for (let i = 1; i <= veins; i++) {
    const t = i / (veins + 1);
    const mx = L * t;
    const my = bow * t * t;
    const spread = Math.sin(t * Math.PI) * W * 0.92;
    const reach = L * 0.2 * (1 - t * 0.4);
    veinPaths +=
      `M${n(mx)} ${n(my)}C${n(mx + reach * 0.5)} ${n(my - spread * 0.5)},${n(mx + reach * 0.8)} ${n(my - spread * 0.8)},${n(mx + reach)} ${n(my - spread * 0.86)}` +
      `M${n(mx)} ${n(my)}C${n(mx + reach * 0.5)} ${n(my + spread * 0.45)},${n(mx + reach * 0.8)} ${n(my + spread * 0.72)},${n(mx + reach)} ${n(my + spread * 0.78)}`;
  }

  // Engraved shading: short arcs crowded toward the leaf base.
  let hatchPaths = "";
  if (hatch) {
    for (let i = 0; i < 7; i++) {
      const t = 0.08 + i * 0.052;
      const mx = L * t, my = bow * t * t;
      const spread = Math.sin(t * Math.PI) * W * 0.8;
      hatchPaths += `M${n(mx)} ${n(my - spread * 0.2)}C${n(mx + L * 0.06)} ${n(my - spread * 0.5)},${n(mx + L * 0.1)} ${n(my - spread * 0.66)},${n(mx + L * 0.13)} ${n(my - spread * 0.74)}`;
    }
  }

  const g = `transform="translate(${n(x)} ${n(y)}) rotate(${n((angle * 180) / Math.PI)})"`;
  return (
    `<g ${g}>` +
    `<path class="bo-line" d="${outline}"/>` +
    `<path class="bo-fine" d="${midrib}"/>` +
    `<path class="bo-fine" d="${veinPaths}"/>` +
    (hatchPaths ? `<path class="bo-hair" d="${hatchPaths}"/>` : "") +
    `</g>`
  );
}

/* ------------------------------------------------------------- tendril */
// The coil a vine throws to grip: a straight-ish reach, then a spiral
// that tightens as it winds. Radius decays linearly — exponential decay
// collapses to a dot too fast to read at this scale.
function tendril({ x, y, angle, len, turns = 2.2, dir = 1 }) {
  const r0 = len * 0.3;
  const cx = len * 0.62;
  const pts = [[0, 0], [cx - r0 * 1.25, dir * len * 0.04]];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const th = t * TAU * turns + Math.PI;
    const r = r0 * (1 - 0.78 * t);
    pts.push([cx + r * Math.cos(th), dir * r * Math.sin(th)]);
  }
  const g = `transform="translate(${n(x)} ${n(y)}) rotate(${n((angle * 180) / Math.PI)})"`;
  return `<g ${g}><path class="bo-fine" d="${spine(pts, 0.42)}"/></g>`;
}

/* ----------------------------------------------------------------- bud */
// Closed bud: a full ovoid body, two sepals wrapping up its flanks, and
// the overlap seam of the furled petals. The body has to be round low
// down — taper it all the way and it reads as a leaf, not a bud.
function bud({ x, y, angle, size }) {
  const S = size;
  const body =
    `M0 ${n(-S * 0.05)} ` +
    `C${n(-S * 0.5)} ${n(-S * 0.22)},${n(-S * 0.54)} ${n(-S * 0.82)},0 ${n(-S * 1.42)} ` +
    `C${n(S * 0.54)} ${n(-S * 0.82)},${n(S * 0.5)} ${n(-S * 0.22)},0 ${n(-S * 0.05)}Z`;
  // furled petal edges — two overlapping seams, off-centre so the bud
  // reads as wrapped rather than as a symmetrical vessel
  const seam =
    `M${n(-S * 0.04)} ${n(-S * 0.14)}C${n(-S * 0.3)} ${n(-S * 0.44)},${n(-S * 0.26)} ${n(-S * 0.94)},${n(-S * 0.02)} ${n(-S * 1.36)}` +
    `M${n(S * 0.06)} ${n(-S * 0.16)}C${n(S * 0.2)} ${n(-S * 0.6)},${n(S * 0.16)} ${n(-S * 1.0)},${n(S * 0.02)} ${n(-S * 1.33)}`;
  const sepalL =
    `M${n(-S * 0.06)} ${n(-S * 0.02)}C${n(-S * 0.44)} ${n(-S * 0.1)},${n(-S * 0.7)} ${n(-S * 0.46)},${n(-S * 0.6)} ${n(-S * 0.92)}` +
    `C${n(-S * 0.52)} ${n(-S * 0.56)},${n(-S * 0.32)} ${n(-S * 0.24)},${n(-S * 0.06)} ${n(-S * 0.02)}Z`;
  const sepalR =
    `M${n(S * 0.06)} ${n(-S * 0.02)}C${n(S * 0.42)} ${n(-S * 0.12)},${n(S * 0.66)} ${n(-S * 0.4)},${n(S * 0.56)} ${n(-S * 0.84)}` +
    `C${n(S * 0.48)} ${n(-S * 0.5)},${n(S * 0.3)} ${n(-S * 0.22)},${n(S * 0.06)} ${n(-S * 0.02)}Z`;
  // engraved shading crowded into the bud's left flank
  let sh = "";
  for (let i = 0; i < 6; i++) {
    const t = 0.18 + i * 0.12;
    sh += `M${n(-S * 0.42 * Math.sin(t * Math.PI))} ${n(-S * 1.4 * t)}c${n(S * 0.06)} ${n(-S * 0.05)},${n(S * 0.1)} ${n(-S * 0.08)},${n(S * 0.13)} ${n(-S * 0.09)}`;
  }
  const stem = `M0 ${n(-S * 0.02)}C${n(S * 0.05)} ${n(S * 0.3)},${n(-S * 0.03)} ${n(S * 0.5)},${n(S * 0.02)} ${n(S * 0.8)}`;
  const g = `transform="translate(${n(x)} ${n(y)}) rotate(${n((angle * 180) / Math.PI)})"`;
  return (
    `<g ${g}>` +
    `<path class="bo-line" d="${body}"/>` +
    `<path class="bo-hair" d="${seam}"/>` +
    `<path class="bo-hair" d="${sh}"/>` +
    `<path class="bo-fine" d="${sepalL}"/>` +
    `<path class="bo-fine" d="${sepalR}"/>` +
    `<path class="bo-line" d="${stem}"/>` +
    `</g>`
  );
}

/* --------------------------------------------------------------- bloom */
// Face-on flower. Two things keep this off the cartoon-daisy line that
// the first pass fell over: petals are narrow and long rather than
// round, and they are drawn in two offset ranks so the silhouette
// overlaps itself instead of sitting in a tidy ring.
function bloom({ x, y, size, petals = 8, seed = 1, rot = 0 }) {
  const rnd = mulberry32(seed);
  const S = size;

  const petalAt = (a, w, h, cls) => {
    const P =
      `M0 ${n(-S * 0.24)} ` +
      `C${n(-S * 0.23 * w)} ${n(-S * 0.42 * h)},${n(-S * 0.25 * w)} ${n(-S * 0.72 * h)},${n(-S * 0.09 * w)} ${n(-S * 0.95 * h)} ` +
      `C${n(-S * 0.04 * w)} ${n(-S * 1.02 * h)},${n(S * 0.04 * w)} ${n(-S * 1.02 * h)},${n(S * 0.09 * w)} ${n(-S * 0.95 * h)} ` +
      `C${n(S * 0.25 * w)} ${n(-S * 0.72 * h)},${n(S * 0.23 * w)} ${n(-S * 0.42 * h)},0 ${n(-S * 0.24)}Z`;
    // lengthwise engraving strokes — the convention that reads as a
    // curved petal surface without any fill
    let ribs = "";
    for (let k = -2; k <= 2; k++) {
      const off = k * 0.055 * w;
      ribs += `M${n(S * off * 0.6)} ${n(-S * 0.3)}C${n(S * (off * 1.5))} ${n(-S * 0.5 * h)},${n(S * (off * 1.7))} ${n(-S * 0.7 * h)},${n(S * (off * 1.1))} ${n(-S * 0.88 * h)}`;
    }
    return `<g transform="rotate(${n(a)})"><path class="${cls}" d="${P}"/><path class="bo-hair" d="${ribs}"/></g>`;
  };

  let back = "", front = "";
  for (let i = 0; i < petals; i++) {
    const base = (i / petals) * 360 + rot;
    // rear rank: offset half a step, slightly shorter, finer line
    back += petalAt(base + 180 / petals + (rnd() - 0.5) * 5, 0.9 + rnd() * 0.2, 0.82 + rnd() * 0.1, "bo-fine");
    front += petalAt(base + (rnd() - 0.5) * 6, 0.92 + rnd() * 0.24, 0.96 + rnd() * 0.14, "bo-line");
  }

  // disc: ring, radiating stamens, stipple crowded off-centre
  let out = back + front;
  out += `<circle class="bo-line" cx="0" cy="0" r="${n(S * 0.23)}"/>`;
  let stam = "";
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU + rnd() * 0.14;
    const rA = S * 0.07, rB = S * 0.21 * (0.8 + rnd() * 0.3);
    stam += `M${n(Math.cos(a) * rA)} ${n(Math.sin(a) * rA)}L${n(Math.cos(a) * rB)} ${n(Math.sin(a) * rB)}`;
  }
  out += `<path class="bo-hair" d="${stam}"/>`;
  let dots = "";
  for (let i = 0; i < 22; i++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * S * 0.19;
    dots += `<circle cx="${n(Math.cos(a) * r - S * 0.02)}" cy="${n(Math.sin(a) * r - S * 0.02)}" r="${n(S * 0.016)}"/>`;
  }
  out += `<g class="bo-stipple">${dots}</g>`;
  return `<g transform="translate(${n(x)} ${n(y)})">${out}</g>`;
}

/* ------------------------------------------------------ bloom, profile */
// Side view, magnolia-ish — the form in reference plate 1. Petals are
// placed as an explicit cup (back rank, two flanks, one overlapping
// front petal) rather than rotated around a shared origin: rotating a
// single petal shape is what turned the first pass into a tangle, since
// every edge crossed every other at the centre.
function bloomProfile({ x, y, size, angle = 0, seed = 3 }) {
  const rnd = mulberry32(seed);
  const S = size;
  const j = () => (rnd() - 0.5) * S * 0.04; // per-petal jitter

  // hatching that follows a petal's long axis, crowded toward its base
  const hatchUp = (x0, y0, dx, dy, count, spread) => {
    let h = "";
    for (let i = 0; i < count; i++) {
      const t = 0.1 + i * (0.62 / count);
      h += `M${n(x0 + dx * t - spread * 0.5)} ${n(y0 + dy * t)}c${n(spread * 0.34)} ${n(-S * 0.1)},${n(spread * 0.6)} ${n(-S * 0.17)},${n(spread * 0.72)} ${n(-S * 0.22)}`;
    }
    return h;
  };

  // One petal, pointing up from its own base, with a *rounded* tip: the
  // two flanks meet through a short cross-curve instead of at a corner.
  // Pointed tips are what made the previous pass read as splayed leaves
  // rather than as a magnolia cup.
  const petal = (rotDeg, L, W, cls, hatch) => {
    // Bases are spread along the receptacle rim in the direction each
    // petal leans. Rotating every petal about one shared origin is what
    // collapsed the last pass into a bow-knot at the centre.
    const bx = Math.sin((rotDeg * Math.PI) / 180) * S * 0.19;
    const by = -S * 0.04;
    const d =
      `M0 0` +
      `C${n(-W * 0.92 + j())} ${n(-L * 0.26)},${n(-W * 1.04)} ${n(-L * 0.6)},${n(-W * 0.56)} ${n(-L * 0.87)}` +
      `C${n(-W * 0.26)} ${n(-L * 1.02)},${n(W * 0.26)} ${n(-L * 1.02)},${n(W * 0.56)} ${n(-L * 0.87)}` +
      `C${n(W * 1.04)} ${n(-L * 0.6)},${n(W * 0.92 + j())} ${n(-L * 0.26)},0 0Z`;
    let h = "";
    if (hatch) {
      for (let i = 0; i < 6; i++) {
        const t = 0.14 + i * 0.11;
        const spread = Math.sin(t * Math.PI) * W * 0.72;
        h += `M${n(-spread * 0.55)} ${n(-L * t)}c${n(spread * 0.4)} ${n(-L * 0.05)},${n(spread * 0.72)} ${n(-L * 0.09)},${n(spread * 0.9)} ${n(-L * 0.12)}`;
      }
    }
    return (
      `<g transform="translate(${n(bx)} ${n(by)}) rotate(${n(rotDeg)})">` +
      `<path class="${cls}" d="${d}"/>` +
      (h ? `<path class="bo-hair" d="${h}"/>` : "") +
      `</g>`
    );
  };

  // The cup, back rank to front. Rear petals are drawn finer so the
  // silhouette reads as depth rather than as a flat rosette.
  const back = petal(-6, S * 1.3, S * 0.4, "bo-fine", false);
  const midL = petal(-34, S * 1.15, S * 0.34, "bo-fine", false);
  const midR = petal(26, S * 1.12, S * 0.33, "bo-fine", false);
  const left = petal(-66, S * 0.95, S * 0.38, "bo-line", true);
  const right = petal(58, S * 1.0, S * 0.36, "bo-line", false);
  const front = petal(6, S * 0.72, S * 0.34, "bo-line", true);

  // receptacle, two flaring sepals, and the pedicel
  const cup = `M${n(-S * 0.19)} ${n(-S * 0.02)}C${n(-S * 0.12)} ${n(S * 0.17)},${n(S * 0.12)} ${n(S * 0.17)},${n(S * 0.19)} ${n(-S * 0.02)}`;
  const sepals =
    `M${n(-S * 0.14)} ${n(S * 0.06)}C${n(-S * 0.4)} ${n(S * 0.12)},${n(-S * 0.52)} ${n(S * 0.3)},${n(-S * 0.48)} ${n(S * 0.46)}` +
    `M${n(S * 0.14)} ${n(S * 0.06)}C${n(S * 0.38)} ${n(S * 0.14)},${n(S * 0.48)} ${n(S * 0.3)},${n(S * 0.44)} ${n(S * 0.44)}`;
  const stem = `M0 ${n(S * 0.15)}C${n(S * 0.1)} ${n(S * 0.52)},${n(-S * 0.06)} ${n(S * 0.82)},${n(S * 0.04)} ${n(S * 1.24)}`;

  const out =
    back + midL + midR + left + right + front +
    `<path class="bo-line" d="${cup}"/>` +
    `<path class="bo-fine" d="${sepals}"/>` +
    `<path class="bo-line" d="${stem}"/>`;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})">${out}</g>`;
}

/* ---------------------------------------------------------------- vine */
// A climbing stem: sinuous spine, alternating leaves, tendrils at the
// nodes, a bud or bloom at the growing tip.
function vine({ w, h, seed = 7, leaves = 6, tip = "bud", amp = 0.3, bloomAt = null }) {
  const rnd = mulberry32(seed);
  const pts = [];
  const segs = 9;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const sway = Math.sin(t * Math.PI * 2.1 + seed) * w * amp * (1 - t * 0.35);
    pts.push([w * 0.5 + sway + (rnd() - 0.5) * w * 0.05, h - t * h]);
  }
  let out = `<path class="bo-line bo-grow" pathLength="1" d="${spine(pts)}"/>`;
  for (let i = 0; i < leaves; i++) {
    const t = 0.1 + (i / leaves) * 0.78;
    const s = sampleSpine(pts, t);
    const side = i % 2 === 0 ? 1 : -1;
    const len = h * (0.1 + rnd() * 0.045) * (1 - t * 0.3);
    out += leaf({
      x: s.x, y: s.y,
      angle: s.angle + side * (1.0 + rnd() * 0.4),
      len, wid: len * 0.38, curl: side * 0.5,
      veins: 4, hatch: i % 3 === 0,
    });
    if (i % 3 === 1) {
      out += tendril({
        x: s.x, y: s.y,
        angle: s.angle - side * 0.85,
        len: len * 0.8, dir: side,
      });
    }
  }
  // A bloom carried on its own peduncle part-way up the stem, rather
  // than only at the growing tip. Botanically right, and it lets the
  // composition put the flower where the layout wants it while the bare
  // stem runs on past the frame edge.
  if (bloomAt != null) {
    const s = sampleSpine(pts, bloomAt);
    const out2 = s.angle - 1.15;
    const reach = h * 0.075;
    const px = s.x + Math.cos(out2) * reach;
    const py = s.y + Math.sin(out2) * reach;
    out +=
      `<path class="bo-line" d="M${n(s.x)} ${n(s.y)}Q${n(s.x + Math.cos(out2) * reach * 0.62)} ${n(s.y + Math.sin(out2) * reach * 0.3)},${n(px)} ${n(py)}"/>`;
    out += bloomProfile({ x: px, y: py, size: h * 0.062, angle: -16, seed: seed + 9 });
  }

  const top = sampleSpine(pts, 0.995);
  if (tip === "bud") out += bud({ x: top.x, y: top.y, angle: 0.12, size: h * 0.045 });
  if (tip === "bloom") out += bloom({ x: top.x, y: top.y - h * 0.03, size: h * 0.055, petals: 7, seed: seed + 3 });
  if (tip === "profile") out += bloomProfile({ x: top.x, y: top.y, size: h * 0.07, angle: -12, seed: seed + 5 });
  return out;
}

/* ------------------------------------------------------------- rhizome */
// The horizontal underground stem: nodes, rootlets down, shoots up.
// This is the form the site's own vocabulary leans on hardest.
function rhizome({ w, h, seed = 11, nodes = 5 }) {
  const rnd = mulberry32(seed);
  const pts = [];
  const segs = 10;
  const mid = h * 0.52;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    pts.push([w * t, mid + Math.sin(t * Math.PI * 2.4 + seed) * h * 0.16 + (rnd() - 0.5) * h * 0.04]);
  }
  let out = `<path class="bo-line bo-grow" pathLength="1" d="${spine(pts)}"/>`;
  // a second, thinner runner shadowing the first — engravings rarely
  // show a single lonely stem
  const pts2 = pts.map(([px, py], i) => [px + w * 0.012, py + h * (0.07 + Math.sin(i) * 0.012)]);
  out += `<path class="bo-hair bo-grow" pathLength="1" d="${spine(pts2)}"/>`;

  for (let i = 0; i < nodes; i++) {
    const t = 0.08 + (i / nodes) * 0.85;
    const s = sampleSpine(pts, t);
    // node thickening
    out += `<circle class="bo-fine" cx="${n(s.x)}" cy="${n(s.y)}" r="${n(h * 0.022)}"/>`;
    // rootlets down: a short forked descent
    let r = "";
    for (let k = 0; k < 3; k++) {
      const spread = (k - 1) * 0.5 + (rnd() - 0.5) * 0.3;
      const len = h * (0.16 + rnd() * 0.14);
      const rp = [
        [s.x, s.y],
        [s.x + spread * len * 0.5, s.y + len * 0.5],
        [s.x + spread * len * 0.95, s.y + len],
      ];
      r += spine(rp);
      // hair roots
      const tipx = rp[2][0], tipy = rp[2][1];
      r += `M${n(tipx)} ${n(tipy)}l${n((rnd() - 0.5) * h * 0.07)} ${n(h * 0.05)}`;
    }
    out += `<path class="bo-fine" d="${r}"/>`;
    // shoot up: alternating bud / small leaf pair
    const sh = h * (0.2 + rnd() * 0.16);
    out += `<path class="bo-line" d="M${n(s.x)} ${n(s.y)}C${n(s.x + h * 0.02)} ${n(s.y - sh * 0.5)},${n(s.x - h * 0.03)} ${n(s.y - sh * 0.8)},${n(s.x + h * 0.01)} ${n(s.y - sh)}"/>`;
    if (i % 2 === 0) {
      out += bud({ x: s.x + h * 0.01, y: s.y - sh, angle: 0.06, size: h * 0.06 });
    } else {
      out += leaf({ x: s.x + h * 0.01, y: s.y - sh, angle: -2.3, len: h * 0.16, wid: h * 0.06, curl: 0.4, veins: 3 });
      out += leaf({ x: s.x + h * 0.01, y: s.y - sh, angle: -0.85, len: h * 0.14, wid: h * 0.055, curl: -0.4, veins: 3 });
    }
  }
  return out;
}

/* ----------------------------------------------------------- root mass */
// Recursive fibrous roots. Used at page terminals — the mark you meet
// at the bottom of a long read.
function rootMass({ w, h, seed = 17, trunks = 6 }) {
  const rnd = mulberry32(seed);
  let out = "";
  // Branches fork mid-run as well as at the tip, which is what stops the
  // mass reading as a row of separate little trees.
  const branch = (x, y, ang, len, depth) => {
    if (depth <= 0 || len < h * 0.015) return;
    const pts = [[x, y]];
    const steps = 5;
    let cx = x, cy = y, ca = ang;
    for (let i = 0; i < steps; i++) {
      ca += (rnd() - 0.5) * 0.38;
      cx += Math.cos(ca) * (len / steps);
      cy += Math.sin(ca) * (len / steps);
      pts.push([cx, cy]);
      if (i === 2 && depth > 2 && rnd() > 0.45) {
        branch(cx, cy, ca + (rnd() > 0.5 ? 1 : -1) * (0.7 + rnd() * 0.6), len * (0.55 + rnd() * 0.2), depth - 1);
      }
    }
    out += `<path class="${depth > 2 ? "bo-fine" : "bo-hair"}" d="${spine(pts)}"/>`;
    // Children keep most of their parent's length and fan wide, so the
    // system spreads across the width instead of balling up.
    const kids = depth > 3 ? 2 : 3;
    for (let k = 0; k < kids; k++) {
      const lean = (k - (kids - 1) / 2) * (0.85 + rnd() * 0.4);
      branch(cx, cy, ca + lean, len * (0.68 + rnd() * 0.16), depth - 1);
    }
    if (depth === 1) {
      let hair = "";
      for (let k = 0; k < 3; k++) {
        const a = ca + (rnd() - 0.5) * 1.8;
        const l = len * (0.3 + rnd() * 0.3);
        hair += `M${n(cx)} ${n(cy)}l${n(Math.cos(a) * l)} ${n(Math.sin(a) * l)}`;
      }
      out += `<path class="bo-hair" d="${hair}"/>`;
    }
  };
  for (let i = 0; i < trunks; i++) {
    const f = trunks === 1 ? 0.5 : i / (trunks - 1);
    const x = w * (0.1 + f * 0.8) + (rnd() - 0.5) * w * 0.04;
    // outer trunks lean outward, the way a spreading root plate does
    const ang = Math.PI / 2 + (f - 0.5) * 0.85 + (rnd() - 0.5) * 0.25;
    branch(x, 0, ang, h * (0.2 + rnd() * 0.06), 5);
  }
  return out;
}

/* --------------------------------------------------------------- frond */
// Compound leaf — the pinnate form that gives the vintage plate its
// density. Good at large scale behind a headline.
function frond({ w, h, seed = 23, pairs = 10 }) {
  const rnd = mulberry32(seed);
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    // rachis leans and relaxes as it rises, the way a real frond bows
    // under its own weight
    pts.push([w * 0.52 + Math.sin(t * 2.3 + 0.4) * w * 0.26 - t * w * 0.06, h - t * h * 0.94]);
  }
  let out = `<path class="bo-line bo-grow" pathLength="1" d="${spine(pts)}"/>`;
  for (let i = 0; i < pairs; i++) {
    const t = 0.06 + (i / pairs) * 0.8;
    const s = sampleSpine(pts, t);
    // leaflets are longest at mid-rachis and shortest at both ends, and
    // the pair angle opens downward near the base — equal pairs at a
    // fixed angle is what made the first pass read mechanical
    const scale = Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.92) * 0.85 + 0.3;
    const len = h * 0.155 * scale * (0.86 + rnd() * 0.28);
    const open = 1.32 - t * 0.42;
    out += leaf({
      x: s.x, y: s.y, angle: s.angle + open + (rnd() - 0.5) * 0.18,
      len, wid: len * (0.28 + rnd() * 0.06), curl: 0.5, veins: 3, hatch: i % 3 === 0,
    });
    out += leaf({
      x: s.x, y: s.y, angle: s.angle - open + (rnd() - 0.5) * 0.18,
      len: len * (0.88 + rnd() * 0.16), wid: len * (0.27 + rnd() * 0.06), curl: -0.5, veins: 3, hatch: i % 3 === 1,
    });
  }
  // terminal leaflet closing the tip, so the rachis does not just stop
  const tip = sampleSpine(pts, 0.93);
  out += leaf({ x: tip.x, y: tip.y, angle: tip.angle, len: h * 0.1, wid: h * 0.026, curl: 0.2, veins: 3 });
  return out;
}

export { vine, rhizome, rootMass, frond, bloom, bloomProfile, bud, leaf, tendril, spine, mulberry32 };
