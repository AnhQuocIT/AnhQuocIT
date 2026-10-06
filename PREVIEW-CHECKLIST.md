# Preview checklist (2026-10-06)

| Check | Result |
|-------|--------|
| Primary text contrast on card | **15.4:1** (≥ 7:1) |
| Muted text contrast on card | **7.2:1** (≥ 4.5:1) |
| Accent contrast on card | **10.9:1** |
| No emoji icons | Pass (labels are `// section` only) |
| Icon set | N/A — text chips, no logo wall |
| Every README `<img>` has `alt` | Pass |
| Plain-text fallback in `<details>` | Pass |
| Motion ≤ 2 spots | Pass — hero cursor blink only |
| `prefers-reduced-motion` | Pass — in `hero.svg` |
| SVG size ≤ ~60KB | Pass — all cards ~50KB |
| Preview desktop 830px | `preview/index.html` + `preview/shots/*.png` |
| Preview mobile ~400px | Narrow column in `preview/index.html` |

Accent used: cyan `#7DD3FC` (swap in `profile.yml` → `npm run cards`).
