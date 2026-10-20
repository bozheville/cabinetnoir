# How the Columnar transposition cipher works

## The idea in one sentence

Columnar transposition is a {{term:transposition}}: every letter keeps
its identity and only changes place. The keyword decides how the places
are shuffled — write the message row by row into a grid, then read the
columns out in the order the keyword spells.

## The recipe

1. Choose a keyword, say `SUN`. Its letters, sorted alphabetically
   (N, S, U), fix the {{term:column-order}}: the column under N is read
   first, then S, then U.
2. Write the plaintext row by row under the keyword, one letter per
   cell:
   `ATT / ACK / ATD / AWN`.
3. Read the columns in keyword order, top to bottom: the N column gives
   `TKDN`, the S column `AAAA`, the U column `TCTW`.
4. The ciphertext is the columns concatenated: `TKDNAAAATCTW`. To
   decrypt, rebuild the grid the same way and read it row by row.

## A worked example

{{example:columnar-basic}}

Each row follows one plaintext letter: which column of the grid it was
written into, and which position of the ciphertext it ends up at. The
letters never change — A is still A — but their order is scrambled
beyond recognition without the keyword.

## Padding and the incomplete last row

If the message length does not fill the last row, the sender has two
options. Padding completes the grid with a dummy letter (the tool uses
`X`), which makes the rectangle regular — every column has the same
length, and the ciphertext length betrays the possible column counts.
Leaving the last row incomplete keeps the grid irregular: slightly
harder to analyse, and the classic hand practice. The tool offers both.

## Double transposition

Encrypting the result a second time with another keyword — the classic
*double transposition* — shatters the simple column structure. The single-columnar weakness you will exploit below mostly disappears;
that is why serious users (from WWI armies to the SOE) always applied
the transposition twice.
