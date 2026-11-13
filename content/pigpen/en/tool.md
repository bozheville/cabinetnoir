# About the Pigpen cipher

Pigpen replaces every letter with a small drawing: a piece of a
tic-tac-toe grid or an X, with or without a dot. It is a
{{term:substitution}} cipher with symbols instead of letters, made
famous by the Freemasons in the 18th century — hence its other name,
the Freemason's cipher. The layout is widely known, so it hides
messages from a glance, not from a puzzle solver.

## How to use this tool

- Type your message into {{control:message-input}}. Each letter appears
  as a glyph in the strip under the settings; case does not matter.
- Pick a symbol set with {{control:variant-selector}}: masonic (the
  default), Rosicrucian or Templar. They encode the same idea with
  different pens and dots. The Templar set has no J.
- Spaces, digits and punctuation are not drawn: they pass through
  unchanged.
- {{control:output}} holds a text legend of the variant (A→┘, B→⊔ …),
  because glyphs do not survive copy and paste.
- Press {{control:swap}} to decrypt: {{control:glyph-keyboard}} appears,
  and each symbol you click adds its letter to the message. You can
  also type the letters directly.

## A quick example

`SOS` in the masonic set becomes three glyphs: S, on the plain X,
is a V-shape; O, in the dotted grid, is an open box with a dot inside.

{{example:pigpen-basic}}

## Go further

- [How the Pigpen cipher works](/encoder/pigpen/learn): the grids, the
  X shapes and the dots
- [The history of Pigpen](/encoder/pigpen/history), from Agrippa to
  Masonic gravestones
- [Pigpen practice challenges](/encoder/pigpen/practice)
