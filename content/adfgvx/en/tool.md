# About the ADFGVX cipher

ADFGVX is the German field cipher of 1918. It stacks two steps: a keyed
{{term:polybius-square}} turns each character into two letters from
A, D, F, G, V and X, and a columnar {{term:transposition}} then
shuffles those letters under a second keyword. The six letters were
chosen because they are easy to tell apart in Morse code. French
cryptanalyst Georges Painvin broke it in time to matter for the June
1918 offensive.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}, written only with the cipher letters.
- Pick the variant: ADFGX uses a 5×5 square of letters (J is folded
  into I); ADFGVX uses a 6×6 square that also holds the digits 0–9.
- Enter the keyword for the grid in {{control:square-key}} and the
  keyword for the column shuffle in {{control:transposition-key}}.
- Spaces and punctuation are dropped; in the ADFGX variant digits are
  dropped too.
- The grid is padded with X to a full rectangle, so a short message
  may decrypt with a stray letter at the end.
- Press {{control:swap}} to decrypt with the same two keys.

## A quick example

`ATTACKATDAWN` with the square key `NIGHT` and the transposition key
`GERMAN` gives `AFDAXXXXAAAAVDVVVAFAADAG`. A becomes `AX`, T becomes
`AV`, and the column shuffle mixes the pairs apart.

## Go further

- [How the ADFGVX cipher works](/encoder/adfgvx/learn), square and
  shuffle
- [Break an ADFGVX cipher without the key](/encoder/adfgvx/cryptanalysis)
- [The history of the ADFGVX cipher](/encoder/adfgvx/history), from
  Nebel to Painvin
- [ADFGVX practice challenges](/encoder/adfgvx/practice)
