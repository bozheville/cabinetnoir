# 03: Layout and proportions

The product is a **case on a desk**. The page background is the desk
(a patchwork of three close dark-brown tones, see `01` "Desk patchwork").
Page zones are stitched leather **bands**. Inside them
sits **one framed object** (the tool, the learning sheet, the hero
nameplate). Everything is centred on one vertical axis.

```
┌──────────────────────── viewport ────────────────────────┐
│ ░░░░░░░░░░░░░ desk (3-tone patchwork) ░░░░░░░░░░░░░░░░░ │
│ ┌──────────────────── header band ─────────────────────┐ │
│ │ ◆ CABINET NOIR      nameplate breadcrumb      EN ▾  ◆│ │
│ ╞═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ stitch ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═╡ │
│ │                    zone band                         │ │
│ │       ┌─ brass tab plates ────────────────┐          │ │
│ │   ╔═══╧═══════════ DecoFrame ═════════════╧═══╗      │ │
│ │   ║ ┌────────── vellum sheet ─────────────┐   ║      │ │
│ │   ║ │                                      │   ║      │ │
│ │   ║ └──────────────────────────────────────┘   ║      │ │
│ │   ╚════════════════════════════════════════════╝      │ │
│ ╞═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═╡ │
│ │ footer (on desk)                                     │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 1. Base unit and spacing scale

Everything is a multiple of **4px**. The main rhythm is **8px**. The
existing `src/@theme/sizes.ts` already defines this scale but it is not
used anywhere. After migration it is **the only source** of spacing.

| Token | px | Typical use |
|-------|----|-------------|
| `space.0` | 0 | — |
| `space.1` | 4 | Icon-to-label gap, stitch-to-ornament gap |
| `space.2` | 8 | Gap inside controls, between tab plates |
| `space.3` | 12 | Button vertical padding (×2 = 24 + line = 40px button) |
| `space.4` | 16 | Default padding inside cards and paper sheets |
| `space.5` | 24 | Gap between controls in a settings row, card grid gap |
| `space.6` | 32 | Padding of a DecoFrame, gap between stacked blocks |
| `space.7` | 48 | Band vertical padding on tablet/desktop |
| `space.8` | 64 | Hero vertical padding, gap between home sections |
| `space.9` | 96 | Hero vertical padding on desktop |

Fixed physical constants (they are part of the material and do not scale):

| Constant | Value | Why |
|----------|-------|-----|
| Stitch inset (band) | 6px | Matches today's look; a stitch close to the edge reads as real |
| Stitch inset (card) | 5px | |
| Stitch dash / gap | 6px / 4px | |
| Seam line | 1px | |
| Frame stroke | 1.5px outer + 0.75px inner, 4px apart | Classic Deco double rule |
| Corner ornament | 24px (mobile 16px) | |
| Rivet | 6px diameter | |

## 2. Radii

Different materials have different corners. That is what tells them apart.

| Material | Radius | Notes |
|----------|--------|-------|
| Leather band | 0 | Full width, the seam does the work |
| Leather card | 10px | Cut leather is soft-cornered |
| Paper sheet | 2px | Almost square |
| Metal button | 4px | Stamped plate |
| Metal pill (toggle housing, tags) | 999px | |
| Knob / rivet / slider thumb | 50 % | |
| DecoFrame | 0, with **stepped** (chamfered) corners drawn in SVG | Not a CSS radius |

Tokens: `radius.none 0`, `radius.paper 2`, `radius.metal 4`,
`radius.leather 10`, `radius.round 999`. The current mixture of 2/3/4/6/8
is retired.

## 3. Breakpoints

Three steps instead of two, **mobile first** (`min-width`):

| Token | Query | Name |
|-------|-------|------|
| (base) | < 640px | `mobile` |
| `tablet` | `@media (min-width: 640px)` | `tablet` |
| `desktop` | `@media (min-width: 1024px)` | `desktop` |
| `wide` | `@media (min-width: 1360px)` | `wide`: only for the home ladder and the identify results |

Rules:
- Write base styles for mobile, then add columns at `tablet`/`desktop`.
- This fixes the current inversion where `small` sets 2 columns (CipherLadder,
  Roadmap, Hero audiences, Sitemap). After migration: **1 column on
  mobile, 2 on tablet, then 3 or 4 on desktop/wide**. Home cipher cards:
  1 / 2 / 3 / 4 (see §5).
- Keep `small` (max-width) only as a deprecated alias during migration.

## 4. Widths

Widths come from what is inside. They are **measure-based**, not arbitrary.

| Token | Max width | Content | Derived from |
|-------|-----------|---------|--------------|
| `width.read` | 640px | Markdown, hero copy, StartHere, at-a-glance | 66 characters of 18px Roboto Slab |
| `width.sheet` | 800px | Learn sheet (markdown + tables + worked example + glossary), challenges, sitemap, roadmap | read width + 2 × 80px margin for marginal notes |
| `width.tool` | 1120px | Tool frame (two text areas side by side) | 2 × 520px text areas + 32px gutter + 2 × 24px frame padding |
| `width.case` | 1280px | Home cipher cards, header content | 4 × 290px cards + 3 × 24 gutter + 2 × 32 padding |

The tool frame grows from 1016 to 1120px so two typewriter columns of 40+
characters fit side by side.

## 5. Grid

- **12-column grid** inside `width.tool` / `width.case`, gutter 24px
  (`space.5`), mobile 4 columns with 16px gutter.
- The grid is used for **cards and tool layouts only**. Reading pages use
  the single reading column centred on the axis.
- **Home cipher cards use fixed column counts per breakpoint**, not
  auto-fill, so rows are always full and even:

  | Breakpoint | Columns | Card width (approx.) |
  |------------|---------|----------------------|
  | mobile < 640 | **1** | full width − 32px |
  | tablet 640–1023 | 2 | 290–480px |
  | desktop 1024–1359 | **3** | 300–380px |
  | wide ≥ 1360 | **4** | 290px |

  ```css
  grid-template-columns: 1fr;
  ${tablet}  { grid-template-columns: repeat(2, 1fr); }
  ${desktop} { grid-template-columns: repeat(3, 1fr); }
  ${wide}    { grid-template-columns: repeat(4, 1fr); }
  ```
- Other card grids (glossary, candidate cards, metrics) use
  `grid-template-columns: repeat(auto-fill, minmax(<min>, 1fr))` with
  minimums: glossary 240px, candidates 140px, metrics 160px.

## 6. Proportions

Deco loves clear proportion. Use these ratios when sizing boxes:

| Ratio | Where |
|-------|-------|
| **1 : 1.414** (√2, paper) | Learn sheet min-height, challenge cards, sitemap cards, ladder cards (portrait) |
| **1 : 1.618** (golden) | Hero height to width at desktop (≈ 0.62 × width), nameplate width to height |
| **2 : 1** | Tool text areas row (each area ~1 : 1, side by side) |
| **1 : 3** | Tool settings strip height vs text area height (settings never dominate the tool) |

Ornament budget: ornaments take **no more than 8 %** of a block's area. A
corner ornament of 24px on a 1120px frame is about right. If the ornament
draws more attention than the heading, it is too big.

## 7. Vertical rhythm of a page

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Header band height | 56px | 64px | 72px |
| Band padding (top/bottom) | 32px | 48px | 48px |
| Hero padding | 48px | 64px | 96px |
| Gap tab plates → frame | 0 (tabs sit **on** the frame edge) | 0 | 0 |
| Frame padding | 12px | 24px | 32px |
| Gap between stacked blocks in a band | 24px | 32px | 32px |
| Footer padding | 32px | 48px | 48px |

## 8. Anatomy of a page

Every page uses the same five slots. Pages differ only in what goes into
slot 3 and slot 4.

| # | Slot | Material | Component (new) |
|---|------|----------|-----------------|
| 1 | Header band | chestnut | `Header` → `Nameplate` + `Breadcrumb` + `LocaleSwitch` |
| 2 | Zone strip (optional) | same leather as zone, darker by one seam | `CipherIndex` (at-a-glance) and `TabPlates` |
| 3 | Main object | leather band (zone colour) holding a `DecoFrame` | `ToolCase` / `LearnSheet` / `HeroPlate` |
| 4 | Secondary bands (optional) | alternating leathers | glossary, challenges, roadmap, ladder |
| 5 | Footer | desk patchwork | `Footer` |

The current page structure already follows this pattern loosely (bands
stacked with `Section`). The main changes are:

1. The **tool frame** becomes one component (`DecoFrame` + `ToolCase`)
   instead of three copies.
2. **Tabs move onto the frame**: brass index tabs attached to the top edge
   of the frame, like tabs on a ledger. They no longer float between the
   at-a-glance card and the frame.
3. **At-a-glance** becomes a slim index card above the tabs (collapsed by
   default on mobile).
4. **Settings and text areas** inside the frame are re-organised into a
   clear **control panel** (top) and **reading area** (below). See
   `06-pages.md`.

## 9. Z-order and depth

Physical things stack. There are four depth levels, each with one shadow:

| Level | Thing | Shadow |
|-------|-------|--------|
| 0 | Desk, bands | none (band seams only) |
| 1 | Cards, paper sheets on leather | `0 2px 0 rgba(0,0,0,.25), 0 6px 14px -6px rgba(0,0,0,.5)` |
| 2 | Metal fittings | `0 1px 0 rgba(0,0,0,.45), 0 2px 4px -1px rgba(0,0,0,.5)` |
| 3 | Tooltips, dialogs, menus (paper slips on top) | `0 12px 28px -8px rgba(0,0,0,.6)` |

No other shadows. The current `0 0 3px #999` header shadow and 1px blue
rings are removed.
