# How the Polybius square works

## The idea in one sentence

The Polybius square turns every letter into a **pair of numbers** — the
row and column of a 5×5 grid — so a message becomes a stream of
coordinates that says nothing without the grid.

## The recipe

1. Draw a 5×5 grid and fill it with the alphabet. There are only 24
   letters after I and J share a cell, so both live in the same box.
2. Number the rows and columns 1–5. Every letter now has an address:
   `A` is `11`, `B` is `12`, `Z` is `55`.
3. To encrypt, replace each letter with its pair:
   `ATTACK` becomes `11 44 44 11 13 25`.
4. To decrypt, split the digit stream into pairs and look each one up
   in the grid — the pair is the row and column of the letter.

## A worked example

{{example:polybius-basic}}

Each row follows one plaintext letter: which coordinates it becomes,
and how the pair stream grows. Notice the shape: two digits per letter,
nothing but the digits 1–5 — the whole fingerprint of this cipher.

## The keyed square

Fill the grid with a {{term:key}} first and the mapping changes
completely. With the keyword `SPARTAN`, the square starts
`S P A R T A N…` — the keyword's letters (deduplicated), then the rest
of the alphabet in order.

{{example:polybius-keyed}}

The pairs now point to different letters than the plain square would —
an attacker who assumes the plain grid decodes gibberish. The I/J
shared cell survives: the square always holds 25 letters.

## Why this is a substitution in disguise

Strip away the grid and nothing has moved: every plaintext letter maps
to one fixed symbol, always. The coordinates are just an alphabet
written as numbers — a {{term:substitution}}, not a transposition. That
is why the ciphertext keeps a substitution's fingerprints: the most
frequent pair is the most frequent letter, E, wearing the number `15`
of E's cell.

{{try:polybius-basic}}
