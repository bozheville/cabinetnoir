# 08: Accessibility, motion and performance

A physical look must not make the site harder to use. These rules take
priority over any visual rule in the other documents.

## Contrast

Target **WCAG 2.2 AA**: 4.5:1 for body text, 3:1 for large text (≥ 24px or
≥ 19px bold) and for UI component boundaries / focus indicators.

Checked pairs (computed with the WCAG relative-luminance formula):

| Foreground | Background | Ratio | Allowed for |
|------------|------------|-------|-------------|
| ink `#2a1a12` | vellum `#f1e7d0` | 13.6 | everything |
| ink `#2a1a12` | ivory `#f7f0de` | 14.7 | everything |
| ink `#2a1a12` | parchment `#e8d9b8` | 12.0 | everything |
| ink `#2a1a12` | beige `#d9c4a0` | 9.8 | everything |
| ink `#2a1a12` | tan `#b48a5e` | 5.4 | body text |
| ink `#2a1a12` | brass base `#c9a04f` | 6.9 | button labels |
| ink `#2a1a12` | copper base `#c58052` | 5.3 | button labels |
| ink.secondary `#5a4636` | vellum | 7.2 | body text |
| ink.faded `#8a7560` | vellum | 3.6 | **large / placeholder only** |
| cream `#f3e9d2` | chestnut `#5a3320` | 9.0 | everything |
| cream | racing green `#2f4a3b` | 8.0 | everything |
| cream | oxblood `#5e211d` | 10.2 | everything |
| cream | navy `#243246` | 10.7 | everything |
| cream | olive `#5b5a34` | 5.9 | body text |
| cream | saddle `#8a5a33` | 4.8 | body text (just), prefer large |
| creamMuted `#c4b08f` | espresso `#2b1b13` | 7.8 | secondary text |
| creamMuted | chestnut | 5.2 | secondary text |
| brass.light `#e2c47a` | espresso | 9.8 | links, labels |
| brass.light | chestnut | 6.4 | links, labels |
| brass.light | racing green | 5.7 | links, labels |
| brass.base `#c9a04f` | chestnut | 4.5 | large only |
| brass.dark `#8a6212` | vellum | 4.5 | text on paper (min) |
| copper.dark `#8f4a2a` | vellum | 5.4 | links on paper |
| copper.light `#e7a77c` | chestnut | 5.3 | active labels on leather |

Forbidden pairs: white/cream text on brass (2.6) or copper (3.5), brass
text on beige or tan (≤ 1.9), ink on chestnut/green/navy/oxblood (< 2).

**Metal gradients:** the label contrast is measured against the **darkest
part of the gradient behind the text** (the button's vertical middle,
≈ `base`). Keep labels vertically centred.

## Focus

- Every interactive element shows `:focus-visible` with a **2px
  `copper.light` outline, 2px offset**. On light paper, add a 1px
  `ink.primary` inner ring so it reaches 3:1 there too.
- Never remove outlines without a replacement.
- Tab order follows the visual order of the control panel: direction →
  swap → cipher → key → alphabet → options → input → output → copy.

## Colour is never the only signal

- Active tab: copper **and** joined with the frame **and** `aria-current`.
- Data colours (key slices, columns): plus a number or pattern.
- Difficulty: badge text plus 1–3 lozenges.
- Correct/incorrect: text message plus seal/underline.

## Instruments and custom controls

- Every instrument keeps a native control underneath (`input type=range`,
  `select`, `input type=text`). The visual can be `aria-hidden`.
- Rotors / dials: arrow keys ±1, PageUp/PageDown ±5, Home/End min/max.
- Drag interactions (TranspositionGrid strips) keep the existing move
  buttons as the keyboard path.
- Minimum touch target 44 × 44px.

## Motion

| Allowed | Duration | Easing |
|---------|----------|--------|
| Button press / polish | 120ms | ease-out |
| Toggle lever | 150ms | ease-in-out |
| Rotor turn per step | 120ms | `cubic-bezier(.3,.7,.4,1)` (slight mechanical snap) |
| Tooltip / dialog paper slip | 160ms fade + 4px rise | ease-out |
| Wax seal on correct answer | 200ms scale 0.8 → 1 | ease-out |
| Lamp (Enigma) light-up | 80ms on, 300ms fade off | linear |

- `@media (prefers-reduced-motion: reduce)`: all transitions → 0ms except
  opacity fades (≤ 100ms). No rotation and no scale.
- Nothing loops. There is no idle animation and no parallax.

## Forced colours / high contrast

- `@media (forced-colors: active)`: hide stitches, grain, the desk
  patchwork, sunbursts and
  corners. Keep outlines (`border: 1px solid ButtonText` on buttons,
  `Canvas` / `CanvasText` on paper). Gradients disappear automatically.
- Test with Windows High Contrast emulation in Chromium DevTools.

## Print

- `@media print`: remove leather, metal and ornaments. Paper surfaces
  become white with black text; text areas print their content; tabs,
  header controls and footer are hidden. Learn pages should print as a
  clean article.

## Performance budget

| Item | Budget |
|------|--------|
| Fonts | ≤ 4 families, ≤ 6 files, ≤ 180 KB total (woff2, subset Latin + Latin-Ext + Cyrillic) |
| Ornament SVG | inline, each ≤ 2 KB; one shared `<DecoDefs>` per page |
| Raster textures | only `grain.png` (≤ 10 KB) |
| Desk patchwork | one SVG tile `desk-patchwork.svg` (≤ 6 KB), CSS background |
| Shadows | ≤ 2 box-shadows per element; no `filter: drop-shadow` on large areas |
| Blend modes | only on bands (8 per page max), not on repeated cards |

- Convert the `.ttf` fonts in `public/fonts/` to `woff2`.
- `background-blend-mode` and big radial gradients are cheap, but measure
  scrolling on a mid-range Android phone after phase 2.
