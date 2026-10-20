# How the Nihilist cipher works

## The idea in one sentence

Take the Polybius square, write every plaintext letter as its
coordinate number, and **add a repeating key's numbers digit by digit
without carry** — the ciphertext is a stream of numbers that looks like
coordinates but has drifted off the grid.

## The recipe

1. Fix the square — plain or keyed. Every letter now has a number from
   `11` to `55` (I and J share a cell).
2. Convert the key word to its own numbers the same way. With the key
   `RUSSIA` the numbers are `42 45 43 43 24 11`, and they repeat over
   the whole message — this is the {{term:additive-key}}.
3. Add each plaintext number to the key number above it, **digit by
   digit, no carry**. `44 + 42` gives `86`; `15 + 45` gives `60` — the
   row digits `1 + 4 = 5`, the column digits `5 + 5 = 10`, and a sum
   of 10 spills over as its own digit. That spill is why Nihilist
   numbers can reach `110`, and why a sum like `60` means `5|10`, not
   `6|0`.
4. The ciphertext is the sums, usually written with spaces:
   `86 68 58 …`.

## A worked example

{{example:nihilist-basic}}

Each row is one plaintext letter: its coordinate number, the key
number that absorbed it, and the sum. Watch the key column cycle
`42 45 43 43 24 11` — the periodicity the cracker listens for.

## Decryption

Subtract the key's digits from each ciphertext number and look the
resulting pair up in the square. Because the addition never carried,
the subtraction never borrows: each digit of the sum is exactly
plaintext digit + key digit.

{{try:nihilist-basic}}

## The tells in the numbers

Every sum still contains the grid: subtract any key number and both
digits must land in 1–5, or the guess is wrong. And because the key
repeats, sums at the same key position share its bias — the stream
ripples with a period, exactly what the Cryptoanalysis tab measures.
