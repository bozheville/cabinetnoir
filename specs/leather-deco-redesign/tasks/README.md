# Leather & Brass Deco: Task Breakdown

Source: `../leather-deco-redesign.md` (+ `01`–`08`)

## Ground rules

- **Each phase leaves the site shippable.** Old tokens and components stay
  as aliases until phase 5.
- No behaviour changes: routes, i18n, cipher logic and content stay as they are.
  The exception is the layout reorganisation listed in `06-pages.md`.
- Verify every task: `npx tsc --noEmit`, `vitest`, no console errors,
  browser check at 375 / 768 / 1280px in `en`, `fr`, `ua`, keyboard pass,
  contrast check for new pairs (`08`), before/after screenshots in the PR.
- No new raw hex outside `src/@theme/`.
- The task files (one per row, like the other specs) are written when the
  phase starts. This README is the plan.

## Phases

| Phase | Tasks | What | Visible change |
|-------|-------|------|----------------|
| 1. Foundations | 01–05 | Tokens, CSS variables, mixins, breakpoints, fonts | Fonts only |
| 2. Surfaces | 06–09 | Patch, Paper, desk, stitch SVG | Whole site turns to classic leather |
| 3. Ornament + frame | 10–14 | `@ornaments`, DecoFrame, ToolCase, TabPlates, header | Tool pages get the Deco case |
| 4. Controls | 15–24 | Own primitives, evergreen replaced file by file | All buttons/inputs become brass & copper |
| 5. Pages + cleanup | 25–31 | Home, learn sheet, cracker, identify, sitemap, stats; remove legacy | Final layout |
| 6. Instruments (optional) | 32–37 | Wheel, Alberti disc, Enigma front, tabula, type tray, Saknussemm parchment | Cipher-specific visuals |

## Tasks

| #  | Task | Depends on | Docs |
|----|------|------------|------|
| 01 | Theme tokens: `materials/`, `ink`, `data`, `zones`, `space`, `radius`, `shadow`; legacy moved to `legacy/` and still exported | - | 01, 03, 07 |
| 02 | CSS custom properties from the theme in `createGlobalStyle` (`pages/_app.js`) | 01 | 07 |
| 03 | Mixins: `leather()`, `paper()`, `metal()`, `engraved()`, `focusRing()` | 01 | 01, 05, 07 |
| 04 | Mobile-first breakpoints (`tablet`, `desktop`, `wide`); `small` kept as deprecated alias | 01 | 03 |
| 05 | Fonts: pick + verify Cyrillic/French, woff2, fix Roboto 400 → Medium mapping, typography scale with tablet step, new `PlateLabel` / `Caption` / `CipherText` | 01 | 02 |
| 06 | `Patch` atom; `Section` becomes a wrapper; `zone` mapping; fix missing `'gray'` default | 03 | 01, 05 |
| 07 | Stitch SVG tiles (`public/images/stitch-*.svg`), card all-round stitch | 06 | 04 |
| 08 | Desk patchwork background (`desk-patchwork.svg` + grain, 3 tones); zones assigned on every page | 06 | 01, 06 |
| 09 | `Paper` atom; TextArea, AtGlance, markdown, tables moved onto paper; retire `#f2f2f2` | 03 | 01, 05 |
| 10 | `src/@ornaments/`: corner, heading rule, lozenge, rivet, chevron divider, sunburst, `DecoDefs` | 03 | 04 |
| 11 | Engraved icon set (`@ornaments/icons`) | 10 | 04 |
| 12 | `DecoFrame` component (stepped / rivet / fan, keystone) | 10 | 04 |
| 13 | `ToolCase` + `ControlPanel` + `ControlGroup`: replaces the 3 copied tool frames (Encryptor, Cryptoanalysis, Identification) | 12 | 05, 06 |
| 14 | `TabPlates` (← CipherTabs), `CipherIndex` (← AtGlanceCard), header nameplate bar (+ header on home) | 12 | 05, 06 |
| 15 | `Button` (primary / secondary / quiet, sm / md / lg) + `Link`; replaces CTA, TryInTool, ChallengeLink, BreakButton, coffee | 03 | 05 |
| 16 | `IconButton` knob; swap, copy, erase | 11, 15 | 05 |
| 17 | `Toggle`, `Checkbox`, `Segmented` | 15 | 05 |
| 18 | `Select` (native, styled), `TextInput`, `NumberInput` | 15 | 05 |
| 19 | `Slider` (replaces RotationPicker range) | 15 | 05 |
| 20 | `Tooltip` restyle, `Dialog` (native `<dialog>`), `Badge` | 15 | 05 |
| 21 | Layout atoms `Stack`, `Cluster` | 01 | 07 |
| 22 | Replace evergreen in cipher panes (`src/@encryptors/*`): parallel, one cipher per PR | 15–21 | 07 |
| 23 | Replace evergreen in cracker kit (`shared/cracker/*`): wizard frame, settings, board, cards, chart; data colours + highlight levels | 15–21 | 01, 05 |
| 24 | Replace evergreen in molecules/templates; remove `evergreen-ui`, toaster stub and aliases | 22, 23 | 07 |
| 25 | Home reorganisation: hero, start here, cipher cards on the desk (1/2/3/4 columns) with family filter, identify, workshop | 14, 15 | 06 |
| 26 | Learn / History / Practice sheet: frame, margin notes, contents index, challenge telegrams, wax seal | 12, 15 | 05, 06 |
| 27 | Cryptoanalysis layout: Roman step rail, sticky live preview | 13, 23 | 06 |
| 28 | Identify: drawers, gauges, notes | 13, 20 | 05, 06 |
| 29 | Sitemap + stats wrapped in standard anatomy | 06, 12 | 06 |
| 30 | Accessibility pass: forced-colors, reduced motion, print, focus order | 25–29 | 08 |
| 31 | Cleanup: legacy tokens, `color-scheme.json`, `Home.module.css`, `FrequencyPrint`, `vercel.svg`, `react-joyride`, unused fonts | 30 | 07 |
| 32 | `Rotor` / cipher wheel (Caesar, ROT13, Affine) | 31 | 05 |
| 33 | Alberti disc | 32 | 05 |
| 34 | Enigma machine front (rotor windows, lampboard, keyboard) | 32 | 05 |
| 35 | Tabula recta restyle (Vigenère family) | 31 | 05 |
| 36 | Type tray (Polybius family) + paper strips (transposition) | 31 | 05 |
| 37 | Saknussemm parchment | 31 | 05 |

## Parallel work

- 05 can run with 02–04.
- 10–11 can start once 03 lands, in parallel with phase 2.
- 15–21 are independent of each other after 15.
- 22 splits into one PR per cipher; 32–37 are independent after 32.
