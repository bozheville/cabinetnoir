# 01: Materials and colour

Four material families. Each has a **role**. Do not use a colour outside its role.

| Family | Role | Where |
|--------|------|-------|
| Leather | Structure: bands, cards, page background | `Section`, cards, header, footer |
| Paper | Reading and writing | Text areas, markdown, tables, worked examples, inputs |
| Thread | Seams and stitches | Patch edges only |
| Metal | Interaction + frames | Buttons, tabs, toggles, sliders, knobs, frames, ornaments |

The palette board is `assets/palette.svg`.

---

## 1. Leather

Classic vegetable-tanned and dyed hides, muted and slightly warm. Leathers
are sorted from light to dark. Each leather has a `base` plus a `seam`
(darker edge line) and a recommended `thread`.

| Token | Name | Base | Seam (edge) | Thread | Text on it | Typical use |
|-------|------|------|-------------|--------|------------|-------------|
| `leather.beige` | Natural / undyed | `#d9c4a0` | `#b49c74` | `#7a5a36` | ink `#2a1a12` (9.8:1) | Light bands: StartHere, ladder background |
| `leather.tan` | Tan | `#b48a5e` | `#8d6a44` | `#f3e9d2` | ink `#2a1a12` (5.4:1) | Description bands, secondary cards |
| `leather.saddle` | Saddle brown | `#8a5a33` | `#6a4425` | `#e2c47a` | cream `#f3e9d2` (4.8:1, **large text only**) | Accents, tool header strip |
| `leather.chestnut` | Chestnut | `#5a3320` | `#3f2316` | `#d9c4a0` | cream (9.0:1), brass-light (6.4:1) | Header, tool band |
| `leather.espresso` | Espresso / desk | `#2b1b13` | `#1a100b` | `#8d6a44` | cream (13.7:1), brass-light (9.8:1) | Page background (the "desk"), footer |
| `leather.green` | Racing green | `#2f4a3b` | `#1f3328` | `#c4b08f` | cream (8.0:1), brass-light (5.7:1) | Hero, Learn tab band |
| `leather.olive` | Olive | `#5b5a34` | `#424123` | `#d9c4a0` | cream (5.9:1) | Practice / challenge band |
| `leather.oxblood` | Oxblood | `#5e211d` | `#421613` | `#d9c4a0` | cream (10.2:1), brass-light (7.3:1) | Cryptoanalysis band ("breaking it"), warnings |
| `leather.navy` | Navy | `#243246` | `#18222f` | `#c4b08f` | cream (10.7:1), brass-light (7.7:1) | History band, identify card |

### Rules

- **The desk is a patchwork of three close tones.** `body` is not one flat
  colour. It is large leather patches in three nearby dark browns, stitched
  together. See "Desk patchwork" below and `assets/desk-patchwork.svg`.
  Every band and card sits on top of it.
- **Neighbours differ in value.** Two adjacent patches must differ clearly
  in lightness (e.g. chestnut next to beige, green next to tan). Do not put
  chestnut next to oxblood or navy next to espresso without a brass rule
  between them.
- **Maximum two leathers in one viewport row** (bands count as rows).
  A third leather may appear as a small card. Exception: the home
  cipher-card grid. Each card has its own family leather, and the desk
  patchwork between them keeps the set calm.
- **Leather per page zone is semantic.** It helps people recognise where
  they are:

| Zone | Leather |
|------|---------|
| Header | chestnut |
| Hero (home) | racing green |
| Tool (encrypt / decrypt) | chestnut band, vellum inside the frame |
| Cryptoanalysis | oxblood band |
| Learn | racing green band |
| History | navy band |
| Practice | olive band |
| Identify | navy band |
| Descriptions, StartHere, ladder | beige / tan |
| Footer | desk patchwork, separated by a top seam + gold stitch |

### Desk patchwork

The desk is the biggest surface on the page, so a flat fill would look
digital. Instead it is built from **three leather tones that differ only a
little**, cut into large patches. Thin seams and a quiet thread join them.

| Token | Value | Role | Contrast vs espresso |
|-------|-------|------|----------------------|
| `desk.espresso` | `#2b1b13` | Darkest patch; same as `leather.espresso` | 1.00 |
| `desk.umber` | `#35221a` | Middle patch | 1.10 |
| `desk.walnut` | `#3e2a1e` | Lightest patch | 1.23 |
| `desk.seam` | `#1a100b` | 1.5px line where two patches meet | — |
| `desk.thread` | `#8d6a44` @ 55 % | Stitch 6px inside each patch edge | — |

Rules:
- **Low contrast on purpose.** Tones stay within ~1.25:1 of each other, so
  the patchwork reads as texture and never competes with bands, cards or
  text. Text never sits on the desk directly (it is on a band, card or
  paper), but all three tones still pass for `ink.cream` (≥ 11:1),
  `ink.creamMuted` (≥ 6.4:1) and `brass.light` (≥ 8:1).
- **Big patches, few shapes.** Patches are 200–540px. Most are rectangles,
  and roughly one in five has a single 45° cut (a Deco step), so the grid
  does not look like tiles. No curves.
- **Seams line up across the tile.** The pattern is one seamless tile
  (`960 × 720`, repeat both ways). All patch edges on the tile border are
  also seams, so the repeat cannot be seen.
- **The desk thread is quieter than band thread:** brown, 55 % opacity,
  1.5px. Bands and cards keep their stronger cream/linen/gold thread.
- **Implementation:** one SVG file `public/images/desk-patchwork.svg`
  (≤ 6 KB) as `background-image`, with the grain tile on top using
  `multiply`:
  ```css
  body {
    background-color: var(--desk-espresso);
    background-image: url(/images/grain.png), url(/images/desk-patchwork.svg);
    background-size: auto, 960px 720px;
    background-blend-mode: multiply, normal;
    background-attachment: scroll; /* not fixed: fixed repaints on scroll */
  }
  ```
- **Mobile:** the same tile at `background-size: 640px 480px`. Patches stay
  large relative to the screen.
- **Where the desk shows:** the gutters between home cipher cards, the
  margins around the tool frame (`width.tool` < viewport), and the footer.
  Bands keep their own single leather and cover the desk fully.
- **Forced colours / print:** remove the patchwork (plain `Canvas` / white).

### Leather finish (how a patch is drawn)

A patch is never a flat colour. It is built from four layers, all CSS:

```css
/* 1. base colour */
background-color: var(--leather-base);
/* 2. grain tile (existing public/images/grain.png, blended) */
background-image:
  /* 3. soft vignette: lighter centre, darker edges, like a worn hide */
  radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06), rgba(0,0,0,0.18) 100%),
  url(/images/grain.png);
background-blend-mode: normal, multiply;
/* 4. edge: burnished seam line + subtle depth */
box-shadow:
  inset 0 0 0 1px var(--leather-seam),
  inset 0 1px 0 rgba(255,255,255,0.06),
  0 1px 0 rgba(0,0,0,0.35);
```

- The grain tile stays the same file. On dark leathers use `multiply`. On
  beige and tan use `soft-light` at ~60 % so the speckle does not look dirty.
- Vignette strength: 0.18 dark edge on bands, 0.10 on cards.
- No more than one radial-gradient per patch.

---

## 2. Paper

Every surface where people read paragraphs or type text is paper.

| Token | Value | Use |
|-------|-------|-----|
| `paper.vellum` | `#f1e7d0` | Default reading/writing surface (TextArea, markdown, cards inside tool) |
| `paper.ivory` | `#f7f0de` | Raised paper: active input, dialog body |
| `paper.parchment` | `#e8d9b8` | Read-only output, table header rows, "aged" sheets (Saknussemm) |
| `paper.rule` | `#c9b48c` | Ruled lines, table borders, dividers on paper |
| `paper.shadow` | `rgba(42,26,18,0.25)` | Drop shadow under a paper sheet on leather |

Paper rules:
- Paper lies **on** leather: 1px darker edge (`paper.rule`) and a soft
  shadow `0 2px 0 rgba(0,0,0,.25), 0 6px 14px -6px rgba(0,0,0,.5)`.
- Paper corners are square (radius 0–2px). Leather corners can be rounded.
  This difference is what makes paper look like paper.
- Paper may get a very faint horizontal ruling (`repeating-linear-gradient`,
  1px `paper.rule` at 15 % every line-height) in text areas only.
- Readonly output = parchment, not grey. Retire `#f2f2f2`.

---

## 3. Ink (text colours)

| Token | Value | Use | Contrast |
|-------|-------|-----|----------|
| `ink.primary` | `#2a1a12` | Body text on paper and light leather | 13.6:1 on vellum |
| `ink.secondary` | `#5a4636` | Secondary text on paper | 7.2:1 on vellum, 5.2:1 on beige |
| `ink.faded` | `#8a7560` | Hints / placeholders on paper, **large or non-essential only** | 3.6:1 on vellum |
| `ink.cream` | `#f3e9d2` | Text on dark leather | ≥ 8:1 on chestnut / green / oxblood / navy |
| `ink.creamMuted` | `#c4b08f` | Secondary text on dark leather | 7.8:1 on espresso, 5.2:1 on chestnut |
| `ink.red` | `#9e2b25` | Errors, "wrong" marks on paper (like a red editing pen) | 6.0:1 on vellum |
| `ink.green` | `#2f6b4f` | "Correct" marks on paper | 5.1:1 on vellum |

---

## 4. Metal

Two metals with distinct jobs. Each metal is a **ramp**, because metal is
drawn as a gradient (light at the top edge, shadow at the bottom) and not
as a flat fill.

### Brass (primary hardware)

| Token | Value | Use |
|-------|-------|-----|
| `brass.highlight` | `#f3dc9a` | Top-edge highlight, hover sheen |
| `brass.light` | `#e2c47a` | Gradient top, brass text on dark leather |
| `brass.base` | `#c9a04f` | Main fill |
| `brass.dark` | `#8a6212` | Gradient bottom, brass text on paper (4.5:1 on vellum) |
| `brass.shadow` | `#5a3f0c` | Engraving lines, outer edge |
| `brass.patina` | `#8f8a6a` | Disabled / tarnished |

### Copper (secondary hardware + "active")

| Token | Value | Use |
|-------|-------|-----|
| `copper.highlight` | `#f5c7a4` | Top-edge highlight |
| `copper.light` | `#e7a77c` | Gradient top, copper text on dark leather (5.3:1 on chestnut) |
| `copper.base` | `#c58052` | Main fill |
| `copper.dark` | `#8f4a2a` | Gradient bottom, copper text on paper (5.4:1 on vellum) |
| `copper.shadow` | `#5c2c16` | Engraving, outer edge |
| `copper.verdigris` | `#4f8f80` | Disabled copper / "old" marker. Use sparingly: it is the only blue-green in the system |

### Which metal where

| Brass | Copper |
|-------|--------|
| Primary buttons (Encrypt, Check, Next, Break) | Secondary buttons (Reveal hint, Show answer, Back, Skip) |
| Frames, Deco corners, divider rules | Active tab plate, selected item marker, current step |
| Toggle and checkbox housings, slider rail | Slider thumb, toggle lever, radio dot |
| Nameplates (headings on tools) | Highlights in cipher text (strong level), focus glow |
| Icons on dark leather | Links on paper (underlined, `copper.dark`) |

Rule of thumb: **brass is the furniture, copper is the signal.** If a
user should notice "this is on / this is selected / this is where you are",
it is copper.

### Metal finish (how a fitting is drawn)

```css
/* brass button face */
background: linear-gradient(180deg,
  var(--brass-highlight) 0%,
  var(--brass-light) 18%,
  var(--brass-base) 55%,
  var(--brass-dark) 100%);
border: 1px solid var(--brass-shadow);
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.55),  /* top bevel */
  inset 0 -1px 0 rgba(0,0,0,0.25),       /* bottom bevel */
  0 1px 0 rgba(0,0,0,0.45),              /* sits on leather */
  0 2px 4px -1px rgba(0,0,0,0.5);
color: var(--leather-espresso);           /* engraved label: ink on brass = 6.8:1 */
text-shadow: 0 1px 0 rgba(255,255,255,0.35);   /* engraving catch-light */
```

- Labels on brass and copper are **dark** (`ink.primary` / espresso), with
  a 1px light text-shadow below to read as engraved. Never put white on
  brass (2.6:1).
- Metal never gets the grain tile.
- A faint brushed texture is allowed on large plates only:
  `repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)`.

---

## 5. Thread

| Token | Value | Use |
|-------|-------|-----|
| `thread.cream` | `#f3e9d2` | Default stitch on dark leather |
| `thread.linen` | `#d9c4a0` | Stitch on chestnut / oxblood / olive |
| `thread.brown` | `#7a5a36` | Stitch on beige / tan |
| `thread.gold` | `#e2c47a` | Special stitch: around the tool frame, the hero, the active card |

Stitch shape: dashes 6px with 4px gaps, 1.5px thick, rounded caps, inset
6px (bands) or 5px (cards) from the edge. Every dash gets a 1px dark
shadow offset (0, 1px) so it looks pressed into the leather. Details in
`04-ornament-and-svg-frames.md`.

---

## 6. Data and highlight colours

The crackers need several distinct colours (key slices, columns, the
`HIGHLIGHT_COLORS` in `src/@encryptors/shared/cracker/CipherText.tsx`). The
Radix hues are replaced with **inks and enamels**, colours a 1920s printer
or enamel sign maker would have:

| Token | Value | Name | Contrast on vellum |
|-------|-------|------|--------------------|
| `data.1` | `#9e2b25` | Vermilion ink | 6.0:1 |
| `data.2` | `#2c4f7c` | Prussian blue | 6.8:1 |
| `data.3` | `#2f6b4f` | Bottle green | 5.1:1 |
| `data.4` | `#8a6212` | Ochre (brass dark) | 4.5:1 |
| `data.5` | `#6b3a62` | Aubergine | 7.1:1 |
| `data.6` | `#1f6a78` | Teal | 5.0:1 |
| `data.7` | `#8f4a2a` | Copper dark | 5.4:1 |
| `data.8` | `#3d2a1c` | Sepia | 11.0:1 |

- They are designed for **text and outlines on paper**. As fills, use them
  at 18 % opacity with the full colour as border.
- When colour encodes meaning (e.g. Vigenère slice index), also add a
  second cue: a number, an underline style, or a small glyph (standard §
  accessibility, see `08-accessibility-and-motion.md`).
- Replace `#f5a623` hint outlines with `copper.base` + 2px dashed outline.
- Replace `cellHighlight` levels (`src/@encryptors/shared/cracker/highlight.ts`):

| Level | Fill | Border | Text |
|-------|------|--------|------|
| `strong` | `copper.light` @ 45 % | 2px `copper.dark` | bold `ink.primary` |
| `filled` | `brass.light` @ 35 % | 1px `brass.dark` | `ink.primary` |
| `tint` | `brass.light` @ 15 % | none | `ink.primary` |

---

## 7. Token naming (code)

Theme keys become **material-first**, then role. Proposed shape for
`src/@theme/` (details in `07-code-organisation.md`):

```ts
theme.materials.leather.chestnut  // { base, seam, thread, text }
theme.materials.paper.vellum
theme.materials.metal.brass       // { highlight, light, base, dark, shadow, patina }
theme.ink.primary
theme.data[1..8]
theme.zones.cryptoanalysis        // -> 'oxblood' (leather key)
```

Components ask for a **zone** or a **role**, not a hex. E.g.
`<Patch zone="learn">` instead of `<Section color="encryptor">`.

## 8. Retired

The `color-scheme.json` pastel ramps (red, blue, yellow, violet, …),
`buymeacoffeeButton` yellow, `#f2f2f2`, `#999`, `#f5a623`, the
`HIGHLIGHT_COLORS` Radix hues, and the ADFGVX `StepColumns` palette are
removed after migration. Until then, the old tokens stay so nothing breaks.
