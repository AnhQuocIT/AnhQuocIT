#!/usr/bin/env node
/**
 * Render dark bento SVG cards from profile.yml
 * Usage: node scripts/render-cards.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "assets", "cards");
const FONT_DIR = join(ROOT, "assets", "fonts");

const COLORS = {
  bg: "#0A0E14",
  card: "#11161D",
  border: "#1F2630",
  text: "#E6EDF3",
  muted: "#9BA4AE",
};

function loadProfile() {
  return parseYaml(readFileSync(join(ROOT, "profile.yml"), "utf8"));
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fontFace(family, file, weight) {
  const path = join(FONT_DIR, file);
  if (!existsSync(path)) {
    console.warn(`Missing font ${file}; falling back to system fonts`);
    return "";
  }
  const b64 = readFileSync(path).toString("base64");
  return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
}

function fontCss() {
  return [
    fontFace("JB Mono", "JetBrainsMono-Regular.woff2", 400),
    fontFace("JB Mono", "JetBrainsMono-Medium.woff2", 500),
    fontFace("Plex Sans", "IBMPlexSans-Regular.woff2", 400),
    fontFace("Plex Sans", "IBMPlexSans-Medium.woff2", 500),
  ].join("");
}

function wrapLines(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function svgShell(width, height, accent, inner, { animateCursor = false } = {}) {
  const motion = animateCursor
    ? `
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.cursor{animation:blink 1.1s step-end infinite}
@media (prefers-reduced-motion:reduce){.cursor{animation:none;opacity:1}}`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <style><![CDATA[
${fontCss()}
text,tspan{font-family:'Plex Sans',system-ui,sans-serif}
.mono{font-family:'JB Mono',ui-monospace,Menlo,monospace}
${motion}
    ]]></style>
  </defs>
  <rect width="${width}" height="${height}" rx="16" fill="${COLORS.card}" stroke="${COLORS.border}" stroke-width="1"/>
  ${inner}
</svg>
`;
}

function renderHero(p) {
  const W = 830;
  const H = 200;
  const accent = p.accent;
  const inner = `
  <defs>
    <radialGradient id="glow" cx="14%" cy="18%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${COLORS.card}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" rx="16" fill="url(#glow)"/>
  <text x="28" y="36" class="mono" fill="${accent}" font-size="12" letter-spacing="0.06em">// hero</text>
  <text x="28" y="74" class="mono" fill="${COLORS.text}" font-size="15">
    <tspan fill="${accent}">${esc(p.prompt)}</tspan><tspan class="cursor" fill="${accent}"> ▋</tspan>
  </text>
  <text x="28" y="116" fill="${COLORS.text}" font-size="28" font-weight="500">${esc(p.name)}</text>
  <text x="28" y="146" class="mono" fill="${accent}" font-size="13">${esc(p.role)}  ·  ${esc(p.years)} yrs  ·  ${esc(p.location)}</text>
  <text x="28" y="176" fill="${COLORS.muted}" font-size="14">${esc(p.tagline)}</text>`;
  return svgShell(W, H, accent, inner, { animateCursor: true });
}

function renderImpact(p) {
  const W = 830;
  const H = 200;
  const accent = p.accent;
  const gap = 12;
  const pad = 28;
  const top = 52;
  const tileW = (W - pad * 2 - gap * 3) / 4;
  const tileH = 128;

  const tilesSvg = p.impact
    .map((t, i) => {
      const x = pad + i * (tileW + gap);
      const y = top;
      const lines = wrapLines(t.detail, 22);
      const detail = lines
        .map(
          (ln, li) =>
            `<text x="${x + 14}" y="${y + 88 + li * 14}" fill="${COLORS.muted}" font-size="11.5">${esc(ln)}</text>`
        )
        .join("\n");
      return `
  <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="12" fill="${COLORS.bg}" stroke="${COLORS.border}"/>
  <text x="${x + 14}" y="${y + 34}" class="mono" fill="${accent}" font-size="24" font-weight="500">${esc(t.value)}</text>
  <text x="${x + 14}" y="${y + 58}" fill="${COLORS.text}" font-size="12.5" font-weight="500">${esc(t.label)}</text>
  ${detail}`;
    })
    .join("\n");

  return svgShell(
    W,
    H,
    accent,
    `
  <text x="28" y="34" class="mono" fill="${accent}" font-size="12" letter-spacing="0.06em">// impact</text>
  ${tilesSvg}`
  );
}

function renderWork(project, accent) {
  const W = 407;
  const blurbLines = wrapLines(project.blurb, 48);
  const blurbStart = 78;
  const blurbSvg = blurbLines
    .map(
      (ln, i) =>
        `<text x="22" y="${blurbStart + i * 15}" fill="${COLORS.muted}" font-size="12">${esc(ln)}</text>`
    )
    .join("\n");
  const blurbBlock = blurbStart + blurbLines.length * 15;
  const urlY = blurbBlock + 8;
  const modsStart = urlY + 24;
  const chips = project.stack.join("  ·  ");
  const H = modsStart + project.modules.length * 20 + 44;

  const modCompact = project.modules
    .map((m, i) => {
      const y = modsStart + i * 20;
      return `
  <text x="22" y="${y}" fill="${COLORS.text}" font-size="12"><tspan class="mono" fill="${accent}">${esc(m.name)}</tspan><tspan fill="${COLORS.muted}">  —  ${esc(m.note)}</tspan></text>`;
    })
    .join("");

  return svgShell(
    W,
    H,
    accent,
    `
  <text x="22" y="30" class="mono" fill="${accent}" font-size="12" letter-spacing="0.06em">// work</text>
  <text x="22" y="56" fill="${COLORS.text}" font-size="20" font-weight="500">${esc(project.title)}</text>
  ${blurbSvg}
  <text x="22" y="${urlY}" class="mono" fill="${project.url ? accent : COLORS.muted}" font-size="11">${esc(project.url ? project.url.replace(/^https?:\/\//, "") : "internal product")}</text>
  ${modCompact}
  <text x="22" y="${H - 18}" class="mono" fill="${COLORS.muted}" font-size="10">${esc(chips)}</text>`
  );
}

function renderStack(p) {
  const W = 407;
  const groups = Object.entries(p.stack);
  const rowH = 36;
  const H = 48 + groups.length * rowH + 16;
  const accent = p.accent;

  const rows = groups
    .map(([name, items], i) => {
      const y = 56 + i * rowH;
      return `
  <text x="22" y="${y}" class="mono" fill="${accent}" font-size="11">${esc(name)}</text>
  <text x="22" y="${y + 16}" fill="${COLORS.text}" font-size="12">${esc(items.join(" · "))}</text>`;
    })
    .join("");

  return svgShell(
    W,
    H,
    accent,
    `
  <text x="22" y="30" class="mono" fill="${accent}" font-size="12" letter-spacing="0.06em">// stack</text>
  ${rows}`
  );
}

function renderNow(p) {
  const W = 407;
  const accent = p.accent;
  const focusLines = wrapLines(p.now.focus, 46);
  let y = 56;
  const focusSvg = focusLines
    .map((ln, i) => {
      const yy = y + i * 18;
      return `<text x="22" y="${yy}" fill="${COLORS.text}" font-size="13">${esc(ln)}</text>`;
    })
    .join("\n");
  y += focusLines.length * 18 + 20;

  let personal = `<text x="22" y="${y}" class="mono" fill="${accent}" font-size="11">// personal</text>`;
  y += 22;
  for (const item of p.now.personal) {
    personal += `\n  <text x="22" y="${y}" fill="${COLORS.text}" font-size="13" font-weight="500">${esc(item.title)}</text>`;
    y += 18;
    for (const ln of wrapLines(item.note, 46)) {
      personal += `\n  <text x="22" y="${y}" fill="${COLORS.muted}" font-size="12">${esc(ln)}</text>`;
      y += 16;
    }
    if (item.url) {
      personal += `\n  <text x="22" y="${y}" class="mono" fill="${accent}" font-size="11">${esc(item.url.replace(/^https?:\/\//, ""))}</text>`;
      y += 20;
    } else {
      y += 10;
    }
  }
  const H = y + 16;

  return svgShell(
    W,
    H,
    accent,
    `
  <text x="22" y="30" class="mono" fill="${accent}" font-size="12" letter-spacing="0.06em">// now</text>
  ${focusSvg}
  ${personal}`
  );
}

function main() {
  const p = loadProfile();
  mkdirSync(OUT, { recursive: true });

  const files = {
    "hero.svg": renderHero(p),
    "impact.svg": renderImpact(p),
    "work-radanhadat.svg": renderWork(
      p.work.find((w) => w.id === "radanhadat"),
      p.accent
    ),
    "work-dghome.svg": renderWork(
      p.work.find((w) => w.id === "dghome"),
      p.accent
    ),
    "stack.svg": renderStack(p),
    "now.svg": renderNow(p),
  };

  for (const [name, svg] of Object.entries(files)) {
    writeFileSync(join(OUT, name), svg, "utf8");
    const kb = (Buffer.byteLength(svg) / 1024).toFixed(1);
    console.log(`Wrote ${name} (${kb} KB)`);
  }
}

main();
