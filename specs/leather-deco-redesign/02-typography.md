# 02: Typography

Type has the same jobs as the materials: some words are **engraved in
metal**, some are **printed on paper**, some are **typed on a machine**,
and a few are **set as a poster title**.

## Faces

| Role | Feel | Candidate (all self-hosted, all need Latin + Cyrillic for `ua`) | Fallback |
|------|------|------------------------------------------------------------------|----------|
| **Display** (page title, hero) | Deco poster: geometric, high contrast between thin and thick, tall caps | `Poiret One` (thin Deco, Cyrillic) for hero only; or `Forum` (Roman inscription caps, Cyrillic) | `Georgia, serif` |
| **Engraved** (plates, buttons, tabs, labels, nav) | Uppercase, wide tracking, medium weight, like letters cut into brass | `Oswald` 500 (condensed, Cyrillic) or `Tenor Sans` (wide, Cyrillic) | `"Arial Narrow", sans-serif` |
| **Body** (paragraphs, markdown) | Printed book text, warm, readable at 16–18px | `Roboto Slab` 400 / 700 (already in `public/fonts`) | `Georgia, serif` |
| **Typewriter** (cipher text, inputs, grids, keys) | Mechanical typewriter, even widths, clear 0/O and 1/l/I | `IBM Plex Mono` 400 / 600 or `PT Mono` (both Cyrillic) | `"Courier New", monospace` |

Rules:
- **Maximum four families**, and the display face appears at most once per
  screen (the `h1`).
- **Verify Cyrillic and French accents** in every face before adopting it.
  Make a test page with `Cabinet Noir · Шифр Цезаря · Chiffre de César ·
  ÀÉÈÊËÎÏÔÙÛÜÇ · ЄІЇҐ`.
- Load only the weights used (currently `pages/_app.js` maps "Roboto 400"
  to the *Medium* file, so fix this during migration). Use `font-display: swap`
  and preload the body + typewriter fonts only.
- Replace the 45 hard-coded `font-family: monospace` with the typewriter token.
- evergreen's own font disappears together with evergreen.

## Scale

Base 16px, ratio about 1.25 (major third), rounded to the 4px baseline.
Names follow the existing printers' names in `src/@typography/`, so the
API stays familiar.

| Token | Component | Face | Mobile (< 640) | Tablet (640–1023) | Desktop (≥ 1024) | Tracking | Case |
|-------|-----------|------|----------------|-------------------|------------------|----------|------|
| `canon` | `Canon` (h1, hero) | Display | 36/40 | 48/52 | 60/64 | 0.04em | Upper |
| `trafalgar` | `Trafalgar` (h1 page) | Display | 28/32 | 32/36 | 40/44 | 0.06em | Upper |
| `doublePica` | `DoublePica` (h2) | Engraved | 20/24 | 22/28 | 24/32 | 0.12em | Upper |
| `greatPrimer` | `GreatPrimer` (h3) | Body 700 | 18/24 | 19/24 | 20/28 | 0 | Sentence |
| `bodyCopy` | `BodyCopy` (p) | Body 400 | 16/24 | 17/26 | 18/28 | 0 | Sentence |
| `minion` | `Minion` (small) | Body 400 | 13/20 | 13/20 | 14/20 | 0 | Sentence |
| `plate` (new) | `PlateLabel` (button, tab, label) | Engraved | 13/16 | 13/16 | 14/16 | 0.16em | Upper |
| `caption` (new) | `Caption` (fact labels, step names) | Engraved | 11/16 | 11/16 | 11/16 | 0.2em | Upper |
| `cipher` (new) | `CipherText` (text areas) | Typewriter | 18/28 | 20/32 | 22/36 | 0.05em | As typed |
| `cell` (new) | grid cells, keys | Typewriter 600 | 14/16 | 15/16 | 16/20 | 0 | Upper |

Changes from the current scale:
- Body text **grows** on desktop (18px) instead of shrinking to 16px.
- A **tablet** step is added everywhere (see breakpoints in `03`).
- Text areas go from 24/36 to 22/36 at most: a typewriter face is wider
  than system monospace.

## Measure

- Paragraphs: **60–72 characters** per line (`max-width: 34em` for body).
  This is why the reading column is 640px (`03-layout-and-proportions.md`).
- Captions and plate labels: never wrap. Shorten the translation if
  needed, and check `fr` and `ua`, which are often 20–30 % longer.

## Engraved text

Text on metal (buttons, plates, tabs) looks cut into the surface:

```css
color: var(--ink-primary);                     /* dark letters */
text-shadow: 0 1px 0 rgba(255,255,255,0.35);   /* light lip under the cut */
```

Text in metal colour on dark leather (nameplates, footer links):

```css
color: var(--brass-light);
text-shadow: 0 -1px 0 rgba(0,0,0,0.6);         /* pressed into leather */
```

Do not use other text effects: no glows, outlines or gradient-filled text.

## Headings with ornament

Section headings (`DoublePica`) are flanked by a Deco divider:
`──◆── HEADING ──◆──` drawn in SVG (see `04`, "Heading rule"). Use it only
for top-level sections inside a band, never for `h3`.

## Numerals

- Use lining numerals in the typewriter face for keys, shifts and counts.
- Use tabular figures (`font-variant-numeric: tabular-nums`) in tables,
  frequency charts and metric panels.
- Roman numerals (I, II, III) are welcome for **steps and rotors**
  (Enigma rotors, cracker wizard steps): they are typical for the period.
