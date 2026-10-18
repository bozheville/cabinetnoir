# How the Pigpen cipher works

## The idea in one sentence

Pigpen is a {{term:substitution}} where the replacement symbols are not
letters at all: every letter becomes a small drawing — a fragment of a
grid, with or without a dot — the famous "Freemason's cipher".

## The recipe

1. Draw three shapes: two tic-tac-toe grids (#) and two diagonal
   crosses (X).
2. Fill the first grid with A–I, the second with J–R, and put S–V and
   W–Z on the arms of the two crosses.
3. Dots are the second half of the secret: the second grid and the
   second cross carry a dot in each pen. Without the dot the same shape
   means A, with the dot it means J.
4. To encrypt, replace each letter by the drawing of the pen it lives
   in. To decrypt, read each glyph and write down the letter whose pen
   has that shape.

## A worked example

{{example:pigpen-basic}}

Each row pairs the letter with the drawing it becomes. S, the first
letter, lives on the plain cross: its glyph is a V-shape — the two
strokes of the cross that bound the top arm. O, the fifteenth letter,
lives in the dotted grid: the same kind of corner shape as A, but with
a dot inside.

## Why the shapes look like this

Nothing is memorised: every glyph is *derived*. The key below is the
whole secret — two grids, two crosses — and every glyph is simply the
walls of one pen of these figures, cut out and carried alone:

{{glyphkey:pigpen}}

The dot is the only added mark, and it says one thing: *second set* —
the dotted grid holds J–R, the dotted cross holds W–Z. Take **H**: it
lives in the bottom-middle pen of the first grid, so its glyph is that
pen's walls — a ceiling and two side walls, open at the bottom.

{{glyphkey:pigpen-h}}

A pen in the middle is a full box, a pen in a corner is an L-shape, a
pen on an edge is open on one side. This is why the cipher is so easy
to learn by hand — and, as the breaking-it page explains, why it is so
easy to break.

{{try:pigpen-basic}}
