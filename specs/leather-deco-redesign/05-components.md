# 05: Components

Every UI part is described as a **physical object**: what it is made of,
how it looks at rest, and how it reacts. Names in `code` are the proposed
component names. "Replaces" lists what exists today.

## State model for metal fittings

All interactive metal uses the same five states. Implement them once in a
shared `metal()` style helper (see `07-code-organisation.md`).

| State | Look | CSS hint |
|-------|------|----------|
| **Rest** | Brushed metal gradient, top bevel, sits on surface | gradient + level-2 shadow |
| **Hover** | Polished: highlight band brighter, 1px lift | `filter: brightness(1.06)`; shadow +1px |
| **Pressed** (`:active`, `aria-pressed="true"`) | Pushed in: gradient inverted, inner shadow, 1px down | `transform: translateY(1px)`; `inset 0 2px 3px rgba(0,0,0,.35)` |
| **Focus-visible** | Engraved ring: 2px copper ring + 2px offset in the surface colour | `outline: 2px solid copper.light; outline-offset: 2px` |
| **Disabled** | Patina: desaturated, flat, no shadow, label 60 % | `brass.patina` fill, `cursor: not-allowed` |

Transition: 120ms `ease-out` on `filter`, `transform` and `box-shadow`.
Nothing else is animated.

`assets/button-states.svg` shows all five states.

---

## Primitives (atoms)

### `Patch` (replaces `Section`)
- Leather band or card. Props: `zone` or `leather`, `shape: 'band' | 'card'`,
  `stitch: 'none' | 'top' | 'bottom' | 'both' | 'all'`, `thread` (optional
  override).
- Band: full width, radius 0, seam on the bottom. Card: radius 10, stitch
  `all` by default.
- Fixes the `'gray'` default bug: the default is `leather="tan"`.
- `Section` stays as a thin wrapper around `Patch` until all usages move.

### `Paper`
- Vellum sheet. Props: `tone: 'vellum' | 'ivory' | 'parchment'`,
  `ruled?: boolean`, `elevation: 0 | 1`.
- Square corners, edge `paper.rule`, level-1 shadow when elevated.

### `DecoFrame`
- See `04-ornament-and-svg-frames.md`.

### `Button`: three kinds, one API
Replaces evergreen `Button`, `ChallengeLinkButton`, `TryInToolButton`,
`BreakButton` (identify), the Footer coffee button and `PresetOption`.

| Variant | Material | Use | Example |
|---------|----------|-----|---------|
| `primary` | Brass plate | The main action in a block (one per block) | Check answer, Next step, Break it, Try in tool |
| `secondary` | Copper plate | Supporting action | Show hint, Back, Restart, Show answer |
| `quiet` | No plate: engraved text + 1px brass underline | Tertiary / inline actions | Show all steps, Skip |

| Size | Height | Padding X | Label |
|------|--------|-----------|-------|
| `sm` | 32px | 12px | `plate` 12px |
| `md` (default) | 40px | 20px | `plate` 13–14px |
| `lg` | 48px | 28px | `plate` 14px; hero CTA only |

- Label: engraved uppercase (`02-typography.md`). An icon can come before the label.
- Two rivets (4px dots) at the left/right ends on `lg` only.
- Minimum touch target 44 × 44 (add invisible padding on `sm`).
- A link that looks like a button renders `<a>` with the same styles.

### `IconButton` (replaces evergreen `IconButton`)
- Round brass **knob**, 36px (mobile 40px), engraved icon centred.
- Hover: knob turns 15° (icon rotates) + polish. Pressed: inset.
- Always has `aria-label` (+ the existing Tooltip).
- Used for: swap direction, copy output, erase.

### `Toggle` (replaces evergreen `Checkbox`)
- A **brass toggle switch** (like an old light switch): pill housing 40 × 22,
  copper lever. Off: lever left, housing brass. On: lever right, housing gets
  a copper inset glow and a small "ON" engraving.
- Native `<input type="checkbox" role="switch">` visually hidden, label
  clickable.
- Use it for booleans that change behaviour immediately (keep spaces, keep
  case). For "accept / select" lists use `Checkbox` below.

### `Checkbox`
- Small square brass **tick box**, 18px, copper ✓ engraved when checked.
- For multi-select lists (identify filters, cracker hint options).

### `Radio` / `Segmented` (replaces `CrackerSettings` preset picker)
- A row of brass plates joined edge to edge (like piano keys or typewriter
  tab stops). The selected plate is **pressed in** and **copper**.
- `role="radiogroup"`, arrow keys move.

### `Select` (replaces evergreen `Select`)
- Closed: brass plate with an engraved label and a Deco chevron.
- Open: a **paper slip** (ivory, level-3 shadow) with options in body
  text; current option marked with a copper lozenge.
- Implementation: keep a native `<select>` styled with
  `appearance: none` where possible (alphabet, variant, language). Use a
  custom listbox only if options need icons.

### `TextInput` / `NumberInput` (replace atoms + evergreen `TextInput`)
- **Inset paper field**: vellum, 1px `paper.rule` border, inner top shadow
  (looks pressed into the leather), radius 2, typewriter font.
- Focus: border `copper.dark`, 2px copper outline offset 1px.
- Error: border `ink.red` + red handwritten-style underline (2px wavy
  `text-decoration` on the message).
- Label above: `caption` (engraved, 11px, spaced) in brass on leather or
  `ink.secondary` on paper.
- `NumberInput` gets copper **stepper buttons** (▲▼ chevrons) on the right,
  like a counter wheel. Both open the numeric keyboard on mobile
  (`inputmode="numeric"`).

### `Dial` / `Slider` (replaces `RotationPicker` range input)
- Default: a horizontal **brass rail** with tick marks every step (big
  tick every 5) and a **copper slider thumb** shaped like a small lever
  (16 × 24). Current value shown in a tiny brass **window** above the
  thumb in the typewriter font.
- Special: for rotation-type keys (Caesar shift, Alberti, Enigma ring)
  offer the `Dial` variant: a round **rotor** (see "Cipher instruments").
- Native `<input type="range">` underneath for keyboard and screen readers.

### `Tooltip` (restyle of `src/@atoms/Tooltip`)
- Trigger: small brass lozenge with an engraved "i" (16px).
- Bubble: an **ivory paper slip** with level-3 shadow, `ink.primary` 13px
  body text, 1px `paper.rule` edge, arrow as a little folded paper tip.
  Max width 280px.
- Behaviour stays the same (click to open, portal, fixed position).

### `Dialog` (replaces evergreen `Dialog` in `EcryptionSelector`)
- A **paper sheet laid over the desk**: dim the page with
  `rgba(26,16,11,.6)`, sheet = ivory with a `DecoFrame` (rivet corners).
- Close: copper `IconButton` top-right.
- Native `<dialog>` element for focus trap and Escape handling.

### `Badge`
- Small **enamel tag**: pill, 20px tall, caption text.
  Difficulty: easy = bottle green, medium = ochre, hard = vermilion
  (`data.*`), cream text. Confidence (identify): very likely = copper,
  possible = brass, unlikely = patina.

### `Link`
- On paper: `copper.dark`, 1px underline offset 3px; hover underline 2px.
- On dark leather: `brass.light`, underline `brass.dark`.
- Visited: no special colour (it is a tool, not a document).

---

## Molecules

### `Header` → nameplate bar
```
┌────────────────────────────────────────────────────────────────────┐
│ ◆ CABINET NOIR  ›  CAESAR  ›  ENCRYPT          IDENTIFY   [EN ▾] ◆ │
└────────────────────────────────────────────────────────────────────┘
```
- Chestnut band, bottom seam + stitch.
- Left: **wordmark plate** `CABINET NOIR` (engraved, brass on chestnut,
  lozenge before it). It links home.
- Breadcrumb: engraved caption, separators are Deco chevrons (the imported
  but unused `ChevronRightIcon` is replaced by the `chevron` ornament).
- Right: `Identify` as a `quiet` link button, language `Select` (brass plate).
- Mobile: wordmark + language only; breadcrumb moves into a second row as
  a single "‹ Caesar" back link.
- Home page gets the header too (today it has none). This keeps
  navigation and the language switch consistent.

### `TabPlates` (replaces `CipherTabs`)
- Brass **index tabs** that stick up from the top edge of the `DecoFrame`,
  like ledger tabs: trapezoid plates (top 6px narrower than the bottom), 36px
  tall, engraved labels.
- Active tab: copper, **joined with the frame** (no bottom border; it
  continues into the frame). Inactive: brass, 2px lower, slightly darker.
- Order stays: Tool · Cryptoanalysis · Learn · History · Practice.
- Mobile: horizontal scroll with fade edges and the active tab scrolled
  into view. No wrapping.
- They stay real `<Link>`s (crawlable, one URL per tab). `aria-current="page"`
  on the active one.

### `CipherIndex` (replaces `AtGlanceCard`)
- A slim **library index card**: vellum, rivet corners, two columns of facts
  (`caption` label + body value): Type · Era · Key · Strength.
- Collapsed by default on mobile with a `quiet` "Details" toggle.
- It sits **between the header and the tabs** in the zone strip.

### `CipherSelector` (replaces `EcryptionSelector`)
- The recently-used quick-switch row becomes a set of **typewriter keys**
  (round-ish brass caps, 40px tall, caption label). Selected = copper and
  pressed.
- "All ciphers" opens the `Dialog` with the full list grouped as Encodings
  / Ciphers, each item as a ladder-style mini card.

### `TextArea` (restyle)
- **Paper sheet** inside the tool: vellum (input) / parchment (readonly
  output), faint ruling, typewriter font `cipher` size, padding 16 / 24.
- Corner label: tiny engraved caption at the top-left, `PLAINTEXT` /
  `CIPHERTEXT` (helps on mobile where sheets stack).
- Character counter at bottom-right in `ink.faded`.

### `CipherLadder` cards (home)
- Each cipher = a separate **leather card** lying on the desk (`Patch shape="card"`; grid 1 / 2 / 3 / 4 columns, see `06-pages.md` "Cipher cards") with all-round
  stitch. The leather colour follows the cipher's **family**:

| Family | Leather |
|--------|---------|
| Encodings (Base64, Morse, ROT13) | tan |
| Monoalphabetic substitution | chestnut |
| Polyalphabetic | racing green |
| Transposition | navy |
| Fractionating / grid (Polybius, Nihilist, ADFGVX, Playfair) | oxblood |
| Symbol / glyph (Pigpen, Saknussemm) | olive |
| Machine (Enigma, Alberti) | chestnut + copper thread (not espresso: it would vanish on the desk) |

- Card content: small engraved family caption, title (`GreatPrimer`, cream),
  one-line glance (`creamMuted`), two buttons at the bottom: `Tool`
  (brass `sm`) and `Learn` (copper `sm`).
- Hover: the stitch turns gold (`thread.gold`), the card lifts by 2px.
- Difficulty as 1–3 small brass lozenges in the corner (not colour alone).

### `StartHereCard`, `Roadmap`, `IdentifyCard`
- StartHere: a **paper letter** pinned to the beige band with two copper
  rivets (top corners), body text, `primary` CTA.
- Identify: navy leather card with a sunburst corner, magnifier icon, `primary` "Identify a cipher".
- Roadmap: two paper columns (`Built` / `Next`), bullets are lozenges,
  built items get a small brass ✓, next items an empty lozenge.

### `ChallengeCard`
- An **envelope / telegram**: parchment paper, a Deco header strip with the
  difficulty `Badge` and challenge number in Roman numerals.
- Ciphertext block: typewriter on ivory, ruled.
- Answer: `TextInput` + `primary` Check. Correct → a **wax seal** stamp
  appears (copper rosette with ✓, 200ms scale-in). Wrong → red-ink
  underline on the input + message.

### `HistoryTimeline`
- Vertical **brass rail** (2px) on the left, each event a lozenge marker
  (copper for the current cipher's origin). Years in display face, small caps.

### `WorkedExample`
- Paper table with `paper.rule` lines, header row on parchment, step
  controls as `secondary` / `quiet` buttons under the table.
- Current step row: copper left marker (4px bar) + `tint` highlight.

### `GlossaryTerm` / `GlossarySection`
- Term: dotted copper underline (`text-decoration-style: dotted`), help cursor.
- Section: paper cards in a grid, term in engraved caption, definition in body text.

### `MarkdownContent`
- Body on vellum, `width.read`. h1 → `Trafalgar` style with a heading rule;
  h2 → `DoublePica` engraved; blockquote = indented with a brass left
  rule (2px) and italic body; `code` on parchment.
- Tables: same as `WorkedExample`.

### `Footer`
- Espresso band, top seam with gold stitch.
- Center: wordmark, links as engraved captions separated by lozenges.
- "Buy me a coffee": `secondary` (copper) button with the `coffee` icon.
  The yellow `buymeacoffeeButton` token is retired.
- Release info in `caption`, `creamMuted`.

---

## Organisms and tool parts

### `ToolCase` (new; wraps `EncryptionSettings` + `EncryptionInputs`)
```
╔═══════════════ DecoFrame (brass, stepped) ═════════════════╗
║  CONTROL PANEL (leather: saddle, inset)                    ║
║  ┌───────────────┐  ┌─────┐  ┌──────────────────────────┐  ║
║  │ PLAINTEXT ▸   │  │ ⇄  │  │  [CAESAR][VIGENÈRE][…][▾] │  ║
║  └───────────────┘  └─────┘  └──────────────────────────┘  ║
║  ──────────── engraved rule ────────────                   ║
║  SHIFT ═══════╪══════ 3    ALPHABET [Latin ▾]  ◉ KEEP CASE ║
║                                                            ║
║  ┌──── vellum ─────────────┐ ┌──── parchment ────────────┐ ║
║  │ PLAINTEXT               │ │ CIPHERTEXT            ⧉   │ ║
║  │                          │ │                           │ ║
║  └──────────────────────────┘ └───────────────────────────┘ ║
╚════════════════════════════════════════════════════════════╝
```
- **Control panel** on a saddle-leather inset (darker than the band, with a
  cream stitch). It holds the direction label, the swap knob, the cipher
  selector, and the cipher's own settings. All labels are brass `caption`.
- **Reading area** below: two paper sheets side by side (stacked on mobile,
  input first). The copy knob sits in the output sheet corner.
- The settings row uses **auto-flowing control groups** (`flex-wrap`, gap
  24px). Each group is `[caption label][control][info]`.
- Remove `#999` divider; use an engraved rule (1px `brass.shadow` + 1px
  `brass.highlight` @ 30 %, like a groove).
- "Copied" toast: small brass plate sliding up from the copy knob, text
  `COPIED`, 1.2s.

### `CrackerWizard` (restyle of `shared/cracker/CrackerWizardFrame`)
- Same `DecoFrame`, but in **oxblood** band.
- Step indicator: a row of Roman numerals in **brass rings** joined by a
  rail (`I ─ II ─ III ─ IV`). Done = filled brass, current = copper with
  glow, upcoming = patina outline. Step name in caption below.
- Navigation: `secondary` Back (left), `primary` Next / Use (right), `quiet`
  Skip. The fixed 90px widths go away; buttons size to the label with min 96px.

### `FrequencyChart`
- An **instrument panel**: parchment background, 26 bars as **brass
  columns** (gradient), English reference as a **copper dashed outline**
  (replaces dashed blue), best-shift glow → copper outer glow.
- Axis letters typewriter `cell`, baseline as an engraved groove.
- Rotate buttons = copper knobs `‹` `›`.

### `AssignmentBoard`, `KeyStrip`, `PolybiusSquare`, `TranspositionGrid`, `TabulaRecta`
- Grids are **typeset type trays**: ivory cells, 1px `paper.rule` lines,
  typewriter `cell` font, highlight levels from `01` §6.
- Draggable strips (TranspositionGrid): each column is a **paper strip**
  with a brass clip at the top as the grab handle. Drag = lift (level 2
  shadow). Selected = copper clip.
- KeyStrip letters: individual **typewriter keys** (round caps, 36px),
  border colour = slice `data.n`, plus the slice number engraved in the
  bottom-right (a second cue besides colour).

### `CandidateCards` / identify results
- Small vellum **index cards**, rivet corners. Confidence bar = brass rail
  with a copper fill. Selected card gets a copper frame tone.

### `ResultsTree` (identify)
- Families as **drawers** of a card cabinet: navy leather drawer front with a
  brass handle and nameplate (family name), opens to reveal cipher index
  cards. Collapsed families show the count on the handle plate.

### `MetricsPanel`
- Row of **gauges**: each metric in a parchment tile with a small brass
  semicircle dial (needle = copper) and the number below in tabular
  typewriter digits. Keep the numbers; the dial is decoration with
  `aria-hidden`.

---

## Cipher instruments (custom visuals)

Several ciphers deserve a real instrument instead of form fields. This is
where the "physical product" idea pays off the most. Each one is optional
and can be built later, but the style must follow this guideline.

| Cipher | Instrument | Notes |
|--------|------------|-------|
| **Caesar / ROT13 / Affine** | **Cipher wheel** (two concentric brass rings, the inner one turns). Drag or arrow keys rotate; the shift shows in a window at 12 o'clock | Shared `Rotor` component |
| **Alberti** | **Alberti disc**: copper outer ring (stabilis), brass inner (mobilis). `public/images/alberti.svg` exists but is unused; use it as a drawing reference, but rebuild in the Deco style | Replaces bare `<` `>` buttons |
| **Enigma** | **Machine front**: three rotor windows with thumb wheels (roman numerals I/II/III), a lampboard (26 round lamps, copper glow when lit), and a keyboard row. Plugboard later | Today there is no Enigma visual at all |
| **Vigenère / Beaufort / Autokey** | **Tabula recta** as a brass-framed printed table; key letters as typewriter keys | Highlight row/column in copper |
| **Polybius / Nihilist / ADFGVX / Playfair** | **Type tray** grid with brass edge and engraved coordinates | Shared `PolybiusSquare` restyle |
| **Rail Fence / Columnar** | **Paper strips** on a brass rail (columns) and a zigzag drawn in copper ink on ruled paper | Replaces `#30a46c` zigzag |
| **Pigpen** | **Stencil plate**: glyphs drawn as engraved lines; GlyphKeyboard keys = brass stamps | Glyph strokes use `currentColor`; ink on paper |
| **Saknussemm** | **Parchment manuscript**: aged parchment tone, rune glyphs in sepia ink, torn-edge mask (CSS `mask-image`) | The spec in `specs/cipher-roadmap/saknussemm-notes.md` already asks for parchment |
| **Morse** | **Telegraph key**: a brass key you can press (long/short), output as a paper tape strip | Optional |

Rules for instruments:
- The instrument **is** the control: keyboard operable, with the native
  input (range / select / text) kept for screen readers and as fallback.
- Same metal rules apply: brass = body, copper = moving or lit part.
- Max size: the instrument never exceeds 360px on desktop / full width on
  mobile; text areas stay the main surface.
- Must work without animation (reduced motion): rotation happens instantly.
