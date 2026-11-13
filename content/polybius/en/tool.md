# About the Polybius square

The Polybius square writes the alphabet into a 5×5 grid and replaces
each letter with two digits: its row and its column. The Greek
historian Polybius described it in the second century BC as a way to
signal letters with torches. On its own it is a simple
{{term:substitution}}, but its number pairs are the building block of
the [Nihilist](/encoder/nihilist/learn), [ADFGVX](/encoder/adfgvx/learn) and many later ciphers.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the
  coordinates appear in {{control:output}}.
- Leave the Square key field empty for the plain A–Z square, or type a
  keyword: its letters, without repeats, fill the grid first and the
  rest of the alphabet follows.
- The grid has 25 cells, so I and J share one. Only letters are
  encrypted; spaces, digits and punctuation are dropped.
- The "Space-separated pairs" toggle, on by default, puts a space
  between the pairs.
- The square under the controls highlights the cell of the latest
  letter, with its row and column.
- Press {{control:swap}} to decrypt; the digits are read two at a time,
  with or without spaces.

## A quick example

`HELLO` in the plain square gives `23 15 31 31 34`: H sits in row 2,
column 3; E in row 1, column 5. `ATTACKATDAWN` gives
`11 44 44 11 13 25 11 44 14 11 52 33`.

## Go further

- [How the Polybius square works](/encoder/polybius/learn), row by row
- [Break a keyed Polybius square](/encoder/polybius/cryptanalysis)
- [The history of the Polybius square](/encoder/polybius/history), from
  Greek torches to prison walls
- [Polybius square practice challenges](/encoder/polybius/practice)
