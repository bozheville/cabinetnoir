# How to decrypt the Polybius square

To decrypt a Polybius message you need the square it was written with:
the plain A–Z square, or the keyword that mixed it. The tool splits the
digits into pairs and looks each pair up as a row and a column. With
the wrong square every pair still lands on a letter, so you get
readable letters that make no sense.

## Using the decrypt tool

- Paste the digits into {{control:message-input}}; the letters appear
  in {{control:output}}.
- Leave the Square key field empty for the plain square, or type the
  sender's keyword.
- Spaces between the pairs do not matter: `23 15` and `2315` give the
  same result. Anything that is not a digit is ignored.
- A lone digit at the end has no partner, so it is dropped.
- I and J share one cell, so a J in the original comes back as I.
- The square under the controls highlights the cell of the latest
  pair.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`23 15 31 31 34` in the plain square gives `HELLO`. The first pair is
row 2, column 3, the cell of H. `11 44 44 11 13 25 11 44 14 11 52 33`
gives `ATTACKATDAWN`.

A wrong square does not look broken. With the Square key `NIGHT`, the
same `23 15 31 31 34` gives `CTFFM`. The double L still shows as a
double F, because a square only renames letters.

## No key?

- [Break a keyed Polybius square](/encoder/polybius/cryptanalysis):
  assign letters to the most frequent pairs, and the square fills in
  as you go
- [How the Polybius square works](/encoder/polybius/learn), row by row
- [The history of the Polybius square](/encoder/polybius/history), from
  Greek torches to prison walls
- [Polybius square practice challenges](/encoder/polybius/practice) to
  decrypt
- [Identify an unknown cipher](/identify) if the digits might come from
  another cipher
