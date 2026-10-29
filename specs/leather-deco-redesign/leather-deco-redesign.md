# Leather & Brass Deco: Cabinet Noir Redesign

> Status: guideline / design direction (no code changes yet)
> Replaces: the "pastel leather patches" look (`src/@atoms/Section`, `src/@theme`)
> Scope: visual language, layout, proportions, component behaviour, code organisation

## The idea

Cabinet Noir should look and feel like a **physical object on a desk**: a
leather-bound cipher case from the 1920s with brass and copper hardware.
It should not look like a web app with a leather theme on top.

We keep the **leather patches stitched together**, the one idea that already
works. The pastel tints become **real leather colours**: tan, saddle,
chestnut, racing green, oxblood, navy and vellum. On top of the leather sits
**hardware**: every control you can touch is brass or copper. The
geometry comes from **Art Deco**: symmetry, stepped corners, sunbursts,
chevrons, double rules and SVG frames.

One sentence to test every future change against:

> *If it could not be made from leather, thread, paper, brass or copper,
> it does not belong on the page.*

## Documents in this space

| File | What it covers |
|------|----------------|
| `leather-deco-redesign.md` | This file: idea, principles, decisions |
| `01-materials-and-colour.md` | Leather, paper, thread, metal palettes, tokens, contrast rules |
| `02-typography.md` | Typefaces, scale, engraved labels, numerals |
| `03-layout-and-proportions.md` | Grid, spacing scale, widths, breakpoints, page anatomy |
| `04-ornament-and-svg-frames.md` | Art Deco ornament system, SVG frames, how to build and use them |
| `05-components.md` | Every UI part re-imagined as a physical object, with states |
| `06-pages.md` | Page-by-page layout and organisation proposals (wireframes) |
| `07-code-organisation.md` | Theme structure, primitives, evergreen exit, migration order |
| `08-accessibility-and-motion.md` | Contrast, focus, reduced motion, forced colours, performance |
| `assets/` | Reference SVGs (listed below) |
| `tasks/README.md` | Phased migration plan for when the restyle starts |

### Assets

| File | Shows |
|------|-------|
| `assets/palette.svg` | All leathers, papers, brass, copper, inks, data colours with hex |
| `assets/frame-corner.svg` | Stepped corner piece (`currentColor`), the base drawing to mirror |
| `assets/deco-frame.svg` | Full DecoFrame: corners, double rule, keystone nameplate, vellum inside |
| `assets/heading-rule.svg` | Heading rule with lozenges + chevron band divider |
| `assets/stitch.svg` | Stitch tile (thread + shadow), repeat-x |
| `assets/sunburst.svg` | Hero sunburst with nameplate |
| `assets/button-states.svg` | Primary / secondary / quiet in 5 states; toggle, knob, slider, tab plates |
| `assets/mock-tool.svg` | Desktop mock-up of a cipher tool page (Caesar) |
| `assets/mock-home.svg` | Desktop mock-up of the home page (cipher cards on the desk, 3 per row) |
| `assets/mock-home-mobile.svg` | Mobile mock-up (375px) of the cipher cards, 1 per row |
| `assets/desk-patchwork.svg` | Seamless 3-tone desk tile (960 × 720) |

The mock-ups are direction, not pixel specs. When a mock-up and the text
disagree, the text wins.

## Design principles

1. **Material honesty.** Every surface has one material: leather (patches,
   bands), paper/vellum (anything you read or type on), thread (seams),
   metal (anything you press, turn or slide). Do not mix materials on one
   surface. Brass text on leather is fine. A brass *panel* full of
   paragraphs is not.
2. **Metal means touch.** Brass and copper are reserved for interactive
   elements and the few ornaments that frame them. If metal appears on
   something you cannot use, users will try to click it. Decorative metal
   stays thin (rules, corners, rivets) and is never shaped like a button.
3. **Paper means read and write.** Long text, inputs, outputs, tables and
   worked examples sit on paper or vellum. Paper is light, so it gives the
   best reading contrast.
4. **Symmetry and axis.** Art Deco is symmetric and centred. Pages have a
   strong central axis. Ornaments mirror left and right. Asymmetry is
   allowed only inside the tool (input on the left, output on the right).
5. **Geometry, not illustration.** Ornaments are built from straight lines,
   arcs, steps, fans and chevrons drawn as SVG strokes. There are no
   photographic textures besides the single grain tile, no clip-art, and
   no drawn leather wrinkles.
6. **Restraint.** The page should look made by hand, not themed. Use one
   frame per tool, one ornament per heading, and at most two leather
   colours visible next to each other. When in doubt, remove ornament.
7. **Physical states.** Controls behave like hardware. Hover polishes the
   metal (a highlight moves in), press pushes it in (inset shadow, 1px
   down), disabled looks tarnished (flat, low-saturation), focus shows a
   clear engraved ring. See `05-components.md`.
8. **Content first on small screens.** Ornament scales down or disappears
   on narrow screens. Stitches, controls and text never do.

## Key decisions

| Question | Decision |
|----------|----------|
| Keep leather patches? | Yes. They stay the main structural element: full-width bands for page zones, stitched cards for content blocks |
| Leather colours | Classic, muted, dark-to-mid: tan, saddle, chestnut, espresso, racing green, olive, oxblood, navy. Pastels are retired |
| Reading surfaces | Vellum / paper (`#f1e7d0` family), never bare leather for long text |
| Accent metals | **Brass** = primary action and main hardware. **Copper** = secondary action, highlights, the "active / selected" signal |
| Old blue accent | Retired. `blue[500]` stops being the de-facto primary colour |
| Ornament style | Art Deco geometry: stepped corners, double rules, sunburst fans, chevrons, rivets. All SVG, all `currentColor` |
| Frame for the tool | One shared `DecoFrame` (brass) replaces the three copy-pasted tool frames |
| Stitches | SVG-based, thread colour picked per leather. All four sides on cards, top/bottom on bands |
| Typography | Deco display face for titles + engraved small caps for labels + slab serif body + typewriter mono for cipher text |
| UI kit | evergreen-ui is phased out in favour of our own primitives (it cannot be themed into brass without fighting it) |
| Dark / light mode | One mode: a dark leather desk (3-tone patchwork) with light paper on top. A dark mode is not planned because the theme is already dark around a light reading core |
| Home cipher list | Separate leather cards on the desk: 1 / 2 / 3 / 4 per row (mobile / tablet / desktop / wide) |
| Motion | Subtle, mechanical, short (≤ 200 ms). Off under `prefers-reduced-motion` |

## What this is not

- **Not steampunk.** No gears, pipes, rivets everywhere or sepia filters.
  Deco is clean, geometric and elegant.
- **Not full skeuomorphism.** No photo-real leather, no 3D-rendered knobs.
  We hint at the material with colour, a tiled grain, a stitch and a
  gradient. Everything is CSS and SVG.
- **Not a rewrite of behaviour.** Layout reorganisation is proposed in
  `06-pages.md`, but cipher logic, routes, i18n and content stay as they are.

## Glossary of materials

| Term | Meaning in this guideline |
|------|---------------------------|
| **Patch** | A piece of leather: a band (full width) or a card (bounded box) |
| **Seam** | Where two patches meet: a darker line plus an optional stitch |
| **Stitch** | Dashed thread line inset from a patch edge |
| **Vellum** | Light paper surface for reading and writing |
| **Plate** | A flat brass or copper rectangle carrying an engraved label (nameplates, tab labels) |
| **Fitting** | Any metal interactive part: buttons, knobs, toggles, slider thumbs |
| **Frame** | A thin brass SVG outline with Deco corners around a tool or hero |
| **Patina** | The tarnished, desaturated look used for disabled metal |
