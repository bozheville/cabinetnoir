# How the ADFGVX cipher works

## The idea in one sentence

ADFGVX turns every letter (and digit) of the {{term:plaintext}} into a
pair of coordinates from the six letters **A D F G V X**, and then
scrambles the resulting stream with a column shuffle — so one plaintext
letter is first split in two, and each half travels separately. Ciphers
that cut letters into pieces like this are called
{{term:fractionation}} ciphers.

## The recipe

1. Build a 6×6 {{term:polybius-square}} filled with a mixed
   {{term:alphabet}}: the square {{term:key}} letters first (duplicates
   dropped), then the rest of the alphabet, then the digits 0–9. Every
   cell holds one character.
2. Replace every plaintext character with the two coordinates of its
   cell — the row letter and the column letter. A message of N letters
   becomes a stream of 2N letters from the set A D F G V X.
3. Write the fractionated stream into a grid, row by row, as wide as
   the transposition key. If the last row is short, the grid is padded
   to a full rectangle.
4. Read the grid out column by column, in alphabetical order of the
   transposition key letters. That column-by-column reading is the
   {{term:transposition}} — the final ciphertext.

## A worked example

{{example:adfgvx-basic}}

Read the first rows: **A** sits in the cell at row **A**, column **A**
of the square, so it becomes `AA`; **T** lands at row **A**, column
**G** and becomes `AG`. The third column shows the fractionated stream
growing — the stream that the transposition will later shuffle.

## Decryption runs backwards

Given the keys, decryption is mechanical:

1. Split the ciphertext back into its columns (equal chunks, since the
   grid was a full rectangle) and lay them back into the grid in
   key-letter order.
2. Read the grid row by row — the fractionated stream returns.
3. Take the coordinates two at a time and look each pair up in the
   square: the cell is the plaintext character.

The tool does all three steps when you press Decrypt with both keys
filled in.

## Two variants, one idea

The German army first fielded the 5×5 **ADFGX** version (letters only,
I and J sharing a cell), and within weeks added a sixth row for the
digits — **ADFGVX**. The tool supports both: switch variants above the
key fields and the square, the fractionation alphabet and the allowed
characters change with it.

{{try:adfgvx-basic}}
