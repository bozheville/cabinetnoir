# ADFGVX step by step

## Before you start

Open the tool at the ADFGVX cipher. Two key fields sit next to the
variant selector: the square {{term:key}} and the transposition key.
This guide walks through a full encryption with the default example
keys — `NIGHT` for the square and `GERMAN` for the transposition.

## Step 1 — watch the square work

Type a short message, for example `ATTACK AT 9 AM`, and watch the
output: it contains only the letters **A D F G V X** — twice as many
characters as your message. Each plaintext character has been replaced
by its row and column in the {{term:polybius-square}}. Change one
square key letter and every coordinate changes: the square is the
{{term:substitution}} half of the cipher.

## Step 2 — watch the shuffle work

Now change only the transposition key. The output keeps the same
character counts but the letters jump around — the fractionated stream
has been cut into columns and read back in key order. This is the
{{term:transposition}} half. Notice what neither half achieves alone:
the substitution flattens nothing by itself, and the transposition
carries no letter statistics of its own — the strength comes from
stacking them.

## Step 3 — decrypt in the tool

Switch to Decrypt, paste the ciphertext and use the same keys. The
tool rebuilds the grid, reads it back row by row and looks the
coordinate pairs up in the square. Trailing pad characters (the grid
padding) may add a stray letter or two at the end of short messages —
that is the rectangle being completed, not a bug.

## Step 4 — try the ADFGX variant

Switch the variant to ADFGX: the square loses its sixth row (no
digits, and J folds into I), and non-letters disappear from the
output. The workflow is otherwise identical.

## Step 5 — hand the keys to a friend

Full ciphertext, both keys, the variant — that is all a receiver of
1918 needed. Try the practice challenges to see what an attacker
without the keys can do.
