const stacks = {
  display: 'ui-sans-serif, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
  body: 'Georgia, "Iowan Old Style", "Palatino Linotype", Palatino, serif',
  mono: 'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace'
};
const samples = {
  "ʔ U+0294 glottal stop": "ʔ",
  "à U+00E0": "à",
  "· U+00B7 middle dot": "·",
  "ù U+00F9": "ù",
  "x̂ x + U+0302 combining circumflex": "x̂",
  "ê U+00EA": "ê",
  "ę U+0119 ogonek": "ę",
  "ř U+0159 caron": "ř",
  "î U+00EE": "î",
  "É U+00C9": "É",
  "ʼ U+02BC modifier apostrophe": "ʼ",
  "’ U+2019": "’",
  "★ U+2605": "★",
  "⌖ U+2316": "⌖",
  "▪ U+25AA": "▪",
  "□ U+25A1": "□",
  "— U+2014": "—"
};
// Advance-width comparison against the .notdef box is unreliable for
// monospace stacks: every character in a true monospace font shares one
// fixed advance width by design, so a present glyph and a missing one
// measure identically and width alone can never tell them apart. This
// compares actual rendered pixels instead, which works for any font.
const size = 96;
const canvas = document.createElement('canvas');
canvas.width = size; canvas.height = size;
const ctx = canvas.getContext('2d');
function render(font, ch) {
  ctx.clearRect(0, 0, size, size);
  ctx.font = (size * 0.6) + 'px ' + font;
  ctx.textBaseline = 'top';
  ctx.fillText(ch, 0, 0);
  return ctx.getImageData(0, 0, size, size).data;
}
function isMissing(font, ch) {
  const notdef = render(font, '￿');
  const glyph = render(font, ch);
  for (let i = 0; i < notdef.length; i++) {
    if (notdef[i] !== glyph[i]) return false;
  }
  return true;
}
let out = 'platform: ' + navigator.platform + ' / ' + navigator.userAgent + '\n';
out += 'method: pixel comparison against the .notdef glyph (U+FFFF), not advance width\n\n';
for (const [name, stack] of Object.entries(stacks)) {
  out += '=== ' + name + ' :: ' + stack + '\n';
  for (const [label, ch] of Object.entries(samples)) {
    const missing = isMissing(stack, ch);
    out += (missing ? '  MISSING  ' : '  ok       ') + label + '\n';
  }
  out += '\n';
}
document.getElementById('out').textContent = out;
