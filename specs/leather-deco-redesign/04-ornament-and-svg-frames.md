# 04: Ornament and SVG frames

The Art Deco layer. It is made of a **small kit of geometric parts**. All of
them are SVG, stroke-based, coloured with `currentColor`, and set to
brass by default. Reference drawings are in `assets/`.

## Vocabulary

| Motif | Shape | Meaning / use | Asset |
|-------|-------|---------------|-------|
| **Stepped corner** | Square corner cut in 2–3 steps (ziggurat) | Frame corners: the signature shape | `assets/frame-corner.svg` |
| **Double rule** | Thick line + thin line, 4px apart | Frame edges, band separators | `assets/deco-frame.svg` |
| **Lozenge** (◆) | Small rotated square | Rule terminals, list bullets, separators in breadcrumb | `assets/heading-rule.svg` |
| **Sunburst / fan** | Rays from a half circle | Hero only, behind the nameplate; empty states | `assets/sunburst.svg` |
| **Chevron band** | Repeating ⋀⋀⋀ or stacked chevrons | Divider between home sections; progress steps | `assets/heading-rule.svg` (bottom) |
| **Rivet** | Small circle with highlight | Corner of a nameplate and DecoFrame top joint | `assets/frame-corner.svg` |
| **Keystone** | Trapezoid at the top centre of a frame | Holds the frame title (the "nameplate" of a tool) | `assets/deco-frame.svg` |
| **Stitch** | Dashed thread line | Leather edges (not Deco, but part of the patch language) | `assets/stitch.svg` |

Do not add motifs outside this list without updating this document.
Flowers, curls, gears and figures are out of style.

## Drawing rules

- **Stroke, not fill.** Ornaments are lines. Fills are used only for
  lozenges and rivets.
- **Stroke widths:** 1.5px primary, 0.75px secondary. They must not scale
  with the box: use `vector-effect: non-scaling-stroke` on paths in
  stretchable frames.
- **Colour:** `stroke="currentColor"`. The parent sets `color` to
  `brass.light` on dark leather, `brass.dark` on paper and light leather,
  and `copper.light` for an active/selected frame.
- **Metal sheen** on ornaments: optional and only on large ornaments
  (frame, sunburst). Use one `linearGradient` from `brass.highlight` to
  `brass.dark`, defined once in a shared `<DecoDefs />` sprite and
  referenced as `stroke="url(#brass)"`.
- **Pixel grid:** coordinates on whole or half pixels so 1.5px lines are
  crisp.
- **Symmetry:** every ornament is drawn once (one corner, one half) and
  mirrored with `transform="scale(-1,1)"`. This guarantees that ornaments
  are symmetric.
- **Accessibility:** all ornaments are `aria-hidden="true"` and
  `focusable="false"`. They never carry meaning on their own.

## DecoFrame: the main frame

The one frame used around the tool, the cryptoanalysis wizard, the
identify panel, the learn sheet and the hero nameplate. It replaces the three
`EncryptorWrapper` copies (`src/@templates/Encryptor/Encryptor.tsx`,
`src/@templates/Cryptoanalysis/Cryptoanalysis.tsx`,
`src/@templates/Identification/elements.ts`).

```
   ┌┐                 ╱‾‾‾‾‾‾‾‾‾‾‾‾╲                 ┌┐
 ┌─┘└───────────────╱  NAMEPLATE   ╲───────────────┘└─┐
 │ ┌───────────────────────────────────────────────┐ │
 └┐│                                               │┌┘
  ││                 content                       ││
 ┌┘│                                               │└┐
 │ └───────────────────────────────────────────────┘ │
 └─┐┌──────────────────────────────────────────────┐┌─┘
   └┘                                               └┘
```

### Construction

The frame is **not** one stretched SVG (corners would distort). It is
built from parts:

1. **Four corner SVGs** (24 × 24, mobile 16 × 16), absolutely positioned,
   mirrored for each corner.
2. **Four edges** drawn with CSS: two `border`s (outer 1.5px, inner
   0.75px) on the frame and on an inner pseudo-element, inset 4px. CSS
   borders stretch perfectly and do not need SVG.
3. **Optional keystone** (top centre): a trapezoid SVG with a brass plate
   that holds the tool name, e.g. `CAESAR · ENCRYPT`.
4. **Optional tabs**: `TabPlates` sit on the top edge (see `05`). When
   tabs are shown, the keystone is not shown (one thing at the top only).

```tsx
<DecoFrame
  tone="brass"        // 'brass' | 'copper'  (copper = active / focus-within)
  surface="vellum"    // what's inside: 'vellum' | 'leather' | 'none'
  keystone="Caesar"   // optional nameplate text
  corners="stepped"   // 'stepped' | 'rivet' | 'fan'
>
  …
</DecoFrame>
```

### Measurements

| Part | Mobile | Tablet+ |
|------|--------|---------|
| Corner box | 16px | 24px |
| Outer rule | 1.5px | 1.5px |
| Inner rule | 0.75px, inset 4px | 0.75px, inset 4px |
| Padding inside inner rule | 12px | 24px (desktop 32px) |
| Keystone | 160 × 28px | 220 × 32px |

### Corner variants

| Variant | Use |
|---------|-----|
| `stepped` | Default. Tool, cryptoanalysis, identify |
| `rivet` | Cards, nameplates, at-a-glance (small, quiet) |
| `fan` | Hero and learn sheet title only (quarter sunburst in the corner) |

## Heading rule

Section titles inside bands:

```
──────◆──  CHOOSE YOUR CIPHER  ──◆──────
```

- SVG left half: line (flex-grows) + lozenge 6 × 6 + short line 16px.
  Mirrored on the right.
- Implementation: a flex row `[rule][title][rule]`, where each `rule` is a
  `flex: 1` element with a 0.75px brass `border-top` and an SVG lozenge
  terminal. The title is `DoublePica` in engraved style.
- Mobile: the long lines disappear and only the lozenges stay.

## Band dividers

Between two **bands of the same leather** (e.g. two beige bands on the
home page), use the chevron divider instead of a plain seam:
12px tall, brass at 60 % opacity, repeated pattern 16px wide.

Between **bands of different leathers**, use the seam + stitch only (the
colour change is already the divider).

## Stitch: SVG instead of CSS dashed border

The current stitch is `border-top: 1px dashed` (`src/@atoms/Section/Section.ts`).
Dashed borders cannot control dash length and look different in each browser.
The new stitch is an SVG pattern used as a `background-image` on a
pseudo-element:

```css
.patch::before {            /* top stitch */
  content: '';
  position: absolute;
  inset: 6px 6px auto 6px;
  height: 3px;
  background: url("data:image/svg+xml,…") repeat-x;  /* see assets/stitch.svg */
  /* the SVG draws a 6px dash of thread colour at y=1 and its 1px shadow at y=2 */
}
```

- The thread colour comes from a CSS variable. Generate one data-URI per
  thread colour (4 in total) at build time or keep them as tiny files in
  `public/images/stitch-*.svg`.
- Cards get a **full stitch around all four sides** (use a rounded
  `rect` with `stroke-dasharray="6 4"` inside an SVG that fills the card,
  `vector-effect: non-scaling-stroke`, with `preserveAspectRatio="none"`).
  This is the one case where a stretched SVG is fine because there are no
  corners to distort, only the dashes.
- Respect `forced-colors`: stitches are hidden (`display: none`) because
  they are pure decoration.

## Sunburst

Only two places: the home hero (behind the nameplate) and empty states
(e.g. "no candidates yet").

- Half-circle fan, 24 rays, alternating 1.5px and 0.75px strokes, brass at
  35 % opacity on racing green.
- The rays are clipped by the hero edges. It is fine if the rays are cut.
- Static. Do not animate it (no rotation).

## Icons

evergreen's Blueprint icons (`SwapHorizontalIcon`, `DuplicateIcon`,
`TrashIcon`, `ChevronRightIcon`, `ChevronDownIcon`) are replaced by a small
**engraved icon set** in the same stroke style (1.5px, square caps,
24 × 24 grid, drawn on 2px padding):

| Icon | Concept | Used in |
|------|---------|---------|
| `swap` | Two opposite arrows on a horizontal axis | Encrypt ⇄ decrypt |
| `copy` | Two offset sheets | Copy output |
| `erase` | Eraser block | Clear glyph keyboard |
| `chevron` | Deco chevron (90°) | Breadcrumb, dropdowns, steppers |
| `info` | Lozenge with "i" | Tooltip trigger (replaces Georgia italic circle) |
| `key` | Antique key | Key inputs |
| `lamp` | Small bulb | Hint |
| `coffee` | Cup | Footer (replaces the feather `coffee.svg`) |
| `seal` | Wax seal / rosette | Practice "solved" |

Put them in `src/@ornaments/icons/` as React components (svgr is already set up).

## Where ornament is forbidden

- Inside text areas, tables, frequency charts and cipher grids. They are
  instruments and need to be clean.
- Around every card in a grid. Use stitches only, no frames.
- More than one frame inside another frame. Exception: tabs on a frame.
- Over content on mobile. Corners shrink and sunbursts are hidden below
  640px.
