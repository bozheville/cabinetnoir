# 07: Code organisation

How the guideline maps onto the codebase. Paths follow the existing
`src/@<layer>` folders (resolved through `baseUrl: "src"` in `tsconfig.json`).

## 1. Theme: `src/@theme/`

### Target structure

```
src/@theme/
  index.ts              // assembles the theme object (keeps the default export)
  materials/
    leather.ts          // 8 leathers: { base, seam, thread, text, textMuted }
    paper.ts            // vellum, ivory, parchment, rule, shadow
    metal.ts            // brass + copper ramps
    thread.ts
  ink.ts                // text colours
  data.ts               // 8 enamel/ink data colours + highlight levels
  zones.ts              // zone → leather mapping (header, hero, tool, learn …)
  space.ts              // replaces sizes.ts; 4px scale
  radius.ts
  shadow.ts             // depth levels 0–3
  type.ts               // families, scale per breakpoint
  breakpoints.ts        // mobile-first: tablet, desktop, wide (+ deprecated `small`)
  mixins/
    leather.ts          // leather(base) → css for a patch
    metal.ts            // metal('brass' | 'copper', state?) → css for a fitting
    paper.ts
    engraved.ts         // engraved text styles
    focusRing.ts
  legacy/
    colors.ts           // current colors.ts, unchanged until migration ends
    color-scheme.json   // current ramps
```

### Theme shape

```ts
const theme = {
  leather, paper, metal, thread, ink, data, zones,
  space, radius, shadow, type, breakpoints,
  // legacy keys stay until phase 5 so nothing breaks:
  colors, colorScheme, paddings, borderRadius,
};
```

- `src/styled.d.ts` already augments `DefaultTheme` from `typeof theme`.
  New keys are typed automatically.
- **Also expose CSS custom properties** from `createGlobalStyle` in
  `pages/_app.js` (`--brass-base`, `--leather-chestnut`, `--space-4` …).
  Reasons: SVG ornaments can use `var(--…)`, markdown HTML can be styled
  without JS, and it is easier to debug in DevTools.
  styled-components keeps reading from the JS theme; both come from the
  same source file so they cannot drift.

### Naming rules

- Material first, then role: `theme.metal.brass.base`, not `theme.colors.gold`.
- Components choose **zones and variants**, not colours:
  `<Patch zone="learn" />`, `<Button variant="primary" />`.
- Raw hex values outside `src/@theme/` are not allowed. Add a lint check
  (`grep -rn "#[0-9a-fA-F]\{3,8\}" src --include=*.ts* | grep -v @theme`) to
  the task checklist; it should only shrink.

## 2. New and changed folders

| Folder | What | Notes |
|--------|------|-------|
| `src/@ornaments/` (new) | `DecoFrame`, `FrameCorner`, `HeadingRule`, `Sunburst`, `ChevronDivider`, `Stitch`, `Rivet`, `Lozenge`, `DecoDefs` (shared gradients), `icons/` | Pure presentation, no i18n, all `aria-hidden` |
| `src/@atoms/` | `Patch`, `Paper`, `Button`, `IconButton`, `Toggle`, `Checkbox`, `Segmented`, `Select`, `TextInput`, `NumberInput`, `Slider`, `Tooltip`, `Badge`, `Link`, `Dialog` | Replaces evergreen usage |
| `src/@typography/` | Existing printer-named components + `PlateLabel`, `Caption`, `CipherText` | Update sizes per `02` |
| `src/@molecues/` | `TabPlates` (← CipherTabs), `CipherIndex` (← AtGlanceCard), `CipherSelector` (← EcryptionSelector) | Keep old names as re-exports during migration |
| `src/@organisms/` | `ToolCase` (frame + control panel + text areas), `ControlPanel`, `ControlGroup` | ControlGroup = caption label + control + tooltip, used by every cipher pane |
| `src/@instruments/` (new, later) | `Rotor`, `CipherWheel`, `AlbertiDisc`, `EnigmaFront`, `TabulaRecta`, `TypeTray` | Phase 6, optional |
| `src/@templates/` | Use `ToolCase` / `DecoFrame` instead of the 3 copied wrappers | |
| `public/images/` | `grain.png` (keep), `stitch-{cream,linen,brown,gold}.svg` | |
| `public/fonts/` | New faces from `02` | Remove unused Roboto weights at the end |

The `@molecues` spelling stays (renaming would touch many imports). If it
is ever renamed, do it as a separate task with no visual changes.

## 3. Style helpers

Shared mixins make sure the materials look the same everywhere:

```ts
// src/@theme/mixins/metal.ts
export const metal = (kind: 'brass' | 'copper') => css`
  ${({ theme }) => {
    const m = theme.metal[kind];
    return css`
      background: linear-gradient(180deg, ${m.highlight} 0%, ${m.light} 18%, ${m.base} 55%, ${m.dark} 100%);
      border: 1px solid ${m.shadow};
      color: ${theme.ink.primary};
      text-shadow: 0 1px 0 rgba(255,255,255,.35);
      box-shadow: ${theme.shadow.metal};
      transition: filter 120ms ease-out, transform 120ms ease-out, box-shadow 120ms ease-out;
      &:hover:not(:disabled) { filter: brightness(1.06); }
      &:active:not(:disabled), &[aria-pressed='true'] {
        transform: translateY(1px);
        box-shadow: ${theme.shadow.metalPressed};
      }
      &:focus-visible { outline: 2px solid ${theme.metal.copper.light}; outline-offset: 2px; }
      &:disabled { background: ${m.patina}; box-shadow: none; filter: saturate(.3); cursor: not-allowed; }
    `;
  }}
`;
```

Same idea for `leather(name)`, `paper(tone)`, `engraved(on: 'metal' | 'leather')`.

## 4. Leaving evergreen-ui

evergreen 7.1.9 is used in 80 files, and the theme was never customised.
Theming it into brass would mean fighting its styling engine
(ui-box). Removing it is the cleaner path, and it was already in the
specs' direction (`specs/learning-material-standardisation/tasks/12-tooltip.md`:
"prefer small styled-components").

| evergreen | Replacement | Count today |
|-----------|-------------|-------------|
| `Pane` | `styled.div` / `Stack` / `Cluster` layout atoms (flex + gap from `space`) | 70 |
| `Text`, `Heading` | `@typography` components | 46 + 32 |
| `TextInput`, `TextInputField` | `@atoms/TextInput`, `@atoms/Slider` | 18 + 1 |
| `Button`, `IconButton` | `@atoms/Button`, `@atoms/IconButton` | 15 + 4 |
| `Select` | `@atoms/Select` | 12 |
| `Checkbox` | `@atoms/Toggle` / `@atoms/Checkbox` | 8 |
| `Tooltip` (evergreen) | `@atoms/Tooltip` | 2 |
| `Dialog` | `@atoms/Dialog` (native `<dialog>`) | 1 |
| `Table` | `@atoms/PaperTable` | 1 |
| Icons | `@ornaments/icons` | 5 |

Add two layout atoms to replace `Pane` mechanically:
- `Stack` (vertical flex, `gap` from space scale, `align`)
- `Cluster` (horizontal wrap flex, `gap`, `justify`)

When the last import is gone, remove `evergreen-ui`, the toaster stub
(`evergreen-toaster.dev-stub.js`) and its aliases in `next.config.js`.

## 5. Migration order (summary)

Full plan with tasks: `tasks/README.md`.

1. **Foundations**: tokens, CSS variables, mixins, fonts. No visual change yet
   (legacy keys still used).
2. **Surfaces**: `Patch` (Section reskin) + `Paper` + desk background. The
   whole site changes colour in one step, because every band goes through
   `Section`.
3. **Ornaments + frame**: `@ornaments`, `DecoFrame`, replace the 3 tool
   frames with `ToolCase`. Tabs → `TabPlates`.
4. **Controls**: Button, Select, Toggle, inputs, slider, tooltip, dialog;
   swap evergreen out file by file (cipher panes are independent and can be
   done in parallel).
5. **Pages**: home reorder, learn sheet, identify, sitemap; delete legacy
   tokens, `Home.module.css`, `FrequencyPrint`, unused deps.
6. **Instruments** (optional): wheel, Alberti disc, Enigma front…

Each phase leaves the site **shippable**. Do not start phase *n + 1* in a
file that still has phase *n* work open.

## 6. Verification per task

Same ground rules as the other specs, plus visual checks:

- `npx tsc --noEmit` passes, `vitest` passes, no console errors.
- Browser check at **375, 768, 1280** px wide, in `en`, `fr` and `ua`
  (longest labels).
- Keyboard pass: tab through the page; every fitting shows the copper focus ring.
- Contrast check for any new text/background pair (keep a list in
  `01-materials-and-colour.md` if a new pair is added).
- No raw hex outside `src/@theme/` in touched files.
- Screenshot before/after attached to the PR.
