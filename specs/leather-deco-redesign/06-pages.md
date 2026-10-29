# 06: Pages: layout and organisation

Page-by-page proposals. Each page uses the five slots from
`03-layout-and-proportions.md` §8. The wireframes are schematic; the full
mock-ups are `assets/mock-home.svg` and `assets/mock-tool.svg`.

Legend: `▓` leather band · `░` paper · `╔╗` DecoFrame · `[ ]` brass
control · `( )` copper control · `◆` lozenge.

---

## 1. Home `/` (`pages/index.tsx`)

Today: Hero (blue) → StartHere → Ladder → Identify → Roadmap → Footer. There is
no header, the grids invert on mobile, and the order mixes "learn about the site"
with "use the site".

### Proposed order

| # | Band | Leather | Content | Why |
|---|------|---------|---------|-----|
| 0 | Header | chestnut | Wordmark, `Identify`, language | Same nav on every page |
| 1 | **Hero** | racing green + sunburst | Nameplate `CABINET NOIR`, tagline, one `primary lg` CTA "Choose a cipher" (scrolls to ladder) and a `secondary` "Identify a ciphertext" | One clear first action |
| 2 | **Start here** | beige | Paper letter (StartHereCard) + the two "audience" notes as two small pinned paper notes beside it on desktop | Onboarding stays near the top but is lighter |
| 3 | **The cabinet** (cipher cards) | **no band: cards lie on the desk patchwork** | Heading rule `◆ THE CABINET ◆` (brass on desk), family filter (Segmented: All · Substitution · Polyalphabetic · Transposition · Grid · Symbol · Machine), grid of separate leather cards | The main content of the site; filtering helps as the list grows (20 ciphers today). Separate cards on the desk read as a set of objects, not as a striped list |
| 4 | **Identify** | navy | Wide identify card with sunburst corner | Second main entry point |
| 5 | **Workshop** (roadmap) | beige | Two paper columns: Built / Next | Secondary info, low on the page |
| 6 | Footer | desk patchwork | — | |

### Wireframe (desktop ≥ 1024)

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ header (chestnut) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
◆ CABINET NOIR                                         IDENTIFY  [EN▾]
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ hero (racing green, sunburst) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                  \  \  \  |  /  /  /
              ╔══════════════════════════════╗
              ║        CABINET  NOIR         ║   ← nameplate, display face
              ╚══════════════════════════════╝
         Modern handy decoder for old-fashioned ways
                     of hiding a truth
             [ CHOOSE A CIPHER ]  ( IDENTIFY A TEXT )
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ start here (beige) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
     ┌░░░░░░░░░░░░░░░░░░░░░░░┐   ┌░░░░░░░░░░┐ ┌░░░░░░░░░░┐
     ░ ● START HERE         ● ░   ░ CURIOUS? ░ ░ STUDENT? ░
     ░ Caesar is the place…  ░   ░ …        ░ ░ …        ░
     ░        [ BEGIN ]      ░   └░░░░░░░░░░┘ └░░░░░░░░░░┘
     └░░░░░░░░░░░░░░░░░░░░░░░┘
· · · · · · · · · · · desk patchwork (no band) · · · · · · · · · · · ·
          ──────◆──  THE CABINET  ──◆──────
   (ALL)[SUBST][POLY][TRANSP][GRID][SYMBOL][MACHINE]

   ┌▓▓▓▓▓▓▓▓▓▓┐   ┌▓▓▓▓▓▓▓▓▓▓┐   ┌▓▓▓▓▓▓▓▓▓▓┐
   ▓ SUBST.  ◆▓   ▓ POLY   ◆◆▓   ▓ GRID  ◆◆◆▓
   ▓ Caesar   ▓   ▓ Vigenère ▓   ▓ ADFGVX   ▓
   ▓ Shift…   ▓   ▓ Keyword… ▓   ▓ WWI…     ▓
   ▓[TOOL](LRN)▓  ▓[TOOL](LRN)▓  ▓[TOOL](LRN)▓
   └▓▓▓▓▓▓▓▓▓▓┘   └▓▓▓▓▓▓▓▓▓▓┘   └▓▓▓▓▓▓▓▓▓▓┘
        ↑ desk visible in the 24px gutters between cards
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ identify (navy) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ workshop (beige) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
· · · · · · · · · · · · footer (desk patchwork) · · · · · · · · · · · ·
```

### Cipher cards

The cipher list is a **set of separate leather cards lying on the desk**,
like index cards or small leather cases. It is not a list of stripes or
rows.

- **Columns:** 1 on mobile, 2 on tablet, **3 on desktop, 4 on wide
  (≥ 1360)**. Fixed counts, not auto-fill (`03-layout-and-proportions.md`
  §5). Gutter 24px (mobile 16px); the desk patchwork shows through the gutters.
- **Card shape:** portrait, about 1 : 1.2 (min-height 220px on desktop,
  auto on mobile), radius 10, all-round stitch, level-1 shadow. Every card
  in a row has the same height (`grid-auto-rows: 1fr`).
- **Card content, top to bottom:** family caption + difficulty lozenges ·
  title · one-line glance (max 2 lines, clamp) · `Tool` (brass) and
  `Learn` (copper) buttons pinned to the bottom.
- **Leather per family** as in `05-components.md` (CipherLadder cards). On
  the desk, cards must stand out from it, so **espresso is not used for
  cards**: Machine ciphers use chestnut with a copper thread instead.
- **Mobile (1 per row):** the same card, full width, with a horizontal
  inner layout: text on the left, the two buttons stacked on the right.
  The card stays a card (radius, stitch, gutter 16px) and never becomes a
  full-bleed row.
- **Filtering** hides cards that do not match; the grid closes up the
  gaps. With reduced motion this happens instantly, otherwise with a 150ms
  fade. On mobile the Segmented filter becomes a full-width brass `Select`
  ("Family: All") with a count caption below it ("20 ciphers").
- **Order** within the grid: by family, then by learning ladder order
  (existing `CipherLadder` order).

Mock-ups: `assets/mock-home.svg` (desktop, 3 per row) and
`assets/mock-home-mobile.svg` (375px, 1 per row).

Audience notes: under the letter on mobile/tablet, beside it on desktop.

---

## 2. Cipher tool `/encoder/[algorithm]/direct|reverse`

Today: header → red band holding AtGlance card + tabs + frame (settings,
text areas). Tabs float above the frame, the at-a-glance card pushes the tool
down, and the settings layout differs per cipher.

### Proposed organisation

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ header (chestnut) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
◆ CABINET NOIR › CAESAR › ENCRYPT                      IDENTIFY  [EN▾]
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ zone band (chestnut-dark) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  ┌░ CIPHER INDEX ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┐
  ░ TYPE Substitution · ERA 1st c. BC · KEY 1–25 · STRENGTH ◆◇◇◇ ░  ← one line
  └░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ details ▾┘
     ╱(TOOL)╲╱[BREAK]╲╱[LEARN]╲╱[HISTORY]╲╱[PRACTICE]╲   ← TabPlates
  ╔══╧══════╧════════════════════════════════════════════════════╗
  ║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ control panel (saddle) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
  ║ ▓ ENCRYPT  ( ⇄ )  [CAESAR][VIGENÈRE][ATBASH][ ALL ▾ ]        ▓ ║
  ║ ▓ ═══════════════ engraved groove ════════════════════════   ▓ ║
  ║ ▓ SHIFT  ━━━━━━┿━━━━━ 03 ⓘ   ALPHABET [Latin ▾] ⓘ  KEEP CASE ◉▓ ║
  ║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
  ║ ┌░ PLAINTEXT ░░░░░░░░░░░░░░░┐  ┌░ CIPHERTEXT ░░░░░░░░░░░░░░┐ ║
  ║ ░                           ░  ░                       (⧉) ░ ║
  ║ ░ attack at dawn_           ░  ░ dwwdfn dw gdzq            ░ ║
  ║ ░                           ░  ░                           ░ ║
  ║ └░░░░░░░░░░░░░░░░░░░░░ 14 ┘  └░░░░░░░░░░░░░░░░░░░░░░░░░░┘ ║
  ╚══════════════════════════════════════════════════════════════╝
           ┌ instrument (optional): cipher wheel / tabula ┐
· · · · · · · · · · · · footer (desk patchwork) · · · · · · · · · · · · ·
```

Organisation rules:

1. **Order of attention:** text areas first, settings second, index last.
   The tool frame must start **above the fold** on a 768px-tall laptop
   screen. So the cipher index is one line by default, and the hero/description
   moves into the Learn tab.
2. **Control panel layout** (same for every cipher):
   - Row 1, fixed for all ciphers: *direction* · *swap knob* · *cipher
     selector*.
   - Groove.
   - Row 2+, cipher-specific: control groups in reading order, the
     **key first** (shift, keyword, square, rotors), then **alphabet**, then
     **options** (toggles). Each group has a caption label + info tooltip.
   - Groups wrap; they never shrink below their minimum width.
3. **Instrument placement** (cipher wheel, tabula recta, glyph legend,
   Enigma machine): **between control panel and text areas** when it *is*
   the key control (Alberti, Enigma, Caesar wheel). **Below the text areas**
   when it is a reference (tabula recta, glyph legend). Pigpen's glyph key
   sheet stays above, as the existing spec asks.
4. **Mobile (< 640):**
   - Tabs scroll horizontally.
   - Control panel: Row 1 compresses to `ENCRYPT (⇄) [CAESAR ▾]`
     (only the selected cipher + "All" dialog, as today).
   - Settings collapse into an accordion "Key & options ▾", open on first
     visit and remembered (sessionStorage, no text saved).
   - Text areas stack: plaintext, swap knob between them, ciphertext.
5. **Direction is a physical switch:** "Encrypt / Decrypt" is a 2-position
   `Segmented` lever, not only a heading + swap button. The swap knob
   remains for "swap texts".

---

## 3. Cryptoanalysis `/encoder/[algorithm]/cryptoanalysis`

- Zone band **oxblood**; the same header, cipher index and tab plates
  (`BREAK` tab copper).
- Frame contains the `CrackerWizard`:

```
╔══════════════════════════════════════════════════════════════╗
║        (I)━━━━━[II]━━━━━ III ━━━━━ IV ━━━━━ V                 ║
║     CIPHERTEXT  KEY LENGTH  FREQUENCIES  KEY   PLAINTEXT      ║
║ ┌░ step panel ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┐ ║
║ ░  instrument for this step (chart / board / strip / cards) ░ ║
║ └░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┘ ║
║ ┌░ live preview (parchment, typewriter) ░░░░░░░░░░░░░░░░░░░┐ ║
║ └░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┘ ║
║ (BACK)                               QUIET SKIP   [ NEXT ▸ ] ║
╚══════════════════════════════════════════════════════════════╝
```

- The **live preview** of the partial plaintext is always visible under the
  step panel (on mobile: sticky at the bottom, collapsible). This makes the
  standard "live preview" principle visible.
- Hint presets (Segmented) sit in the top-right corner of the frame as
  small copper plates.

---

## 4. Learn / History / Practice `/encoder/[algorithm]/learn|history|practice`

Today: a red band with evergreen `Heading` + `Text`, markdown blocks,
glossary, challenges. All of them sit directly on the leather.

Proposed: a **bound book page**.

| Tab | Band | Sheet |
|-----|------|-------|
| Learn | racing green | vellum sheet with `fan` corners |
| History | navy | parchment sheet; `HistoryTimeline` in the left margin on desktop |
| Practice | olive | challenge "telegrams" stacked, one per card |

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ learn band (racing green) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
     ╱[TOOL]╲╱[BREAK]╲╱(LEARN)╲╱[HISTORY]╲╱[PRACTICE]╲
  ╔══╧═══════════════════════════════════════════════════╗
  ║  ┌░░░░░░░░░░░░░ vellum sheet, width.sheet ░░░░░░░░░┐ ║
  ║  ░   ─────◆──  HOW CAESAR WORKS  ──◆─────           ░ ║
  ║  ░ margin │ Body copy in the reading column,       ░ ║
  ║  ░ notes  │ 640px, 18/28 slab…                     ░ ║
  ║  ░ (glos- │ ┌░ worked example table ░┐  [TRY IT ▸] ░ ║
  ║  ░  sary) │ └░░░░░░░░░░░░░░░░░░░░░░░┘             ░ ║
  ║  └░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┘ ║
  ║  ┌░ glossary cards ░┐ ┌░░░░░┐ ┌░░░░░┐                 ║
  ╚══════════════════════════════════════════════════════╝
```

- **Sheet width** `width.sheet` (800px): reading column 640px + 160px
  margin on desktop. Glossary definitions of the current section can show
  as **marginal notes** in that margin (desktop only; on mobile they stay
  tooltips).
- Topic order follows the learning standard. Each markdown topic starts
  with a heading rule. Topics are separated by a small lozenge
  `◆` centred, not by new cards.
- The evergreen `Heading size 500` + `Text` tab title becomes a nameplate
  keystone on the frame: `LEARN · CAESAR`.
- "Try in the tool" buttons = `primary sm`; "Practice" links = `secondary sm`.
- Long pages get a small **contents index** (topic list) at the top of the
  sheet: engraved caption list with lozenge bullets, anchor links.

---

## 5. Identify `/identify`

- Zone **navy**. Frame keystone `IDENTIFY A CIPHER`.
- Top: one big vellum sheet for the ciphertext (TextArea, typewriter), file
  upload as `secondary` button "Load a file", sample texts as `quiet`
  buttons.
- Below, on desktop, two columns: **Results cabinet** (ResultsTree drawers,
  2/3) and **Gauges** (MetricsPanel, 1/3, sticky). On mobile, gauges come
  after results (keeps the existing spec decision).
- Warning banners (short text, etc.) = small parchment notes with an
  oxblood left edge and a `lamp` icon, replacing the orange banners.

---

## 6. Sitemap `/sitemap`

- Tan band (fixes the current uncoloured bug). `width.sheet`.
- Groups as **drawers**: heading rule per group (Pages · Encodings ·
  Ciphers), links as small paper index cards in a 1/2/3-column grid.

## 7. Stats `/stats` (legacy)

- Out of scope for the first passes. Wrap it in the standard page
  anatomy (tan band + DecoFrame) so it does not look broken; replace the
  `'green' | 'blue' | 'black' | 'transpatent'` colours with `data.*` tokens.

## 8. Error / empty / loading states

| State | Look |
|-------|------|
| 404 | Desk patchwork, centred paper slip with "This drawer is empty", sunburst behind, `primary` "Back to the cabinet" |
| Empty result | Faint sunburst (20 % opacity) + one line in `ink.faded` |
| Loading (identify, cracker) | Brass lozenge row that fills step by step (no spinner). With reduced motion: static "Working…" text |

---

## 9. Navigation summary

| From | To | Control |
|------|----|---------|
| Any page | Home | Wordmark plate in header |
| Any page | Identify | Header `quiet` link + home hero `secondary` |
| Any page | Language | Header language `Select` |
| Cipher page | Other tab | TabPlates on the frame |
| Cipher page | Other cipher | CipherSelector in the control panel; breadcrumb |
| Learn | Tool with example | `primary` "Try it" (existing `TryInToolButton` behaviour) |
| Practice | Cracker with challenge | `secondary` (existing `ChallengeLinkButton` behaviour) |
