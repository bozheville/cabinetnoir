# About the Nihilist cipher

The Nihilist cipher turns letters into [Polybius square](/encoder/polybius/learn) coordinates and
then adds a repeating key, also turned into coordinates. The addition
is done digit by digit, without carrying, so the result is a stream of
two- or three-digit numbers. Russian revolutionaries used it in the
1880s to get letters past the Tsar's prison censors.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the numbers
  appear in {{control:output}}.
- The Square key field is optional: leave it empty for the plain A–Z
  square, or type a keyword to mix the grid.
- The Key word field holds the {{term:additive-key}}. It repeats over
  the message; without it there is no output.
- Only letters are encrypted, and J is folded into I. Spaces, digits
  and punctuation are dropped.
- The addition table under the text shows each letter's
  `plain + key = sum`. Sums run from 22 to 110: a column total of 10
  carries into the next place, so `ZZZZZ` with the key `ZZZZZ` gives
  `110 110 110 110 110`.
- Press {{control:swap}} to decrypt with the same two keys.

## A quick example

`ATTACKATDAWN` with the key `RUSSIA` gives
`53 89 87 54 37 36 53 89 57 54 76 44`. The first A is 11 and R is 42:
11 + 42 = 53.

## Go further

Every key number shifts its column of sums by a fixed amount, so the
key length shows up when the numbers are written in rows.

- [How the Nihilist cipher works](/encoder/nihilist/learn), with the
  addition table
- [Break a Nihilist cipher without the key](/encoder/nihilist/cryptanalysis)
- [The history of the Nihilist cipher](/encoder/nihilist/history)
- [Nihilist cipher practice challenges](/encoder/nihilist/practice)
