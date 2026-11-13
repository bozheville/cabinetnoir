# About the Affine cipher

The Affine cipher turns each letter into a number (A = 0 … Z = 25),
multiplies it by `a`, adds `b` and wraps around modulo 26:
`E(x) = a·x + b`. It is a {{term:substitution}} cipher one step beyond
[Caesar](/encoder/caesar/learn) — Caesar is the special case `a = 1` — and a classic first
exercise in {{term:modular-arithmetic}}.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}.
- Set the multiplier `a` in {{control:multiplier}}. It must share no
  factor with 26, so only 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23 and 25
  work; any other value is ignored and the last valid one stays.
- Set the shift `b` in {{control:shift}}, from 0 to 25.
- In encrypt mode, the "Keep spaces" and "Keep case" toggles preserve
  word breaks and capitals. Digits and punctuation are dropped.
- Press {{control:swap}} to decrypt with the same two numbers; the
  tool works out the modular inverse for you.

## A quick example

`SECRETMESSAGE` with `a = 3`, `b = 7` gives `JTNGTMRTJJHZT`. S is 18,
and 3 × 18 + 7 = 61, which is 9 modulo 26: the letter J.

## Go further

There are only 12 × 26 = 312 keys, and two known letter pairs are
enough to solve for `a` and `b` directly.

- [How the Affine cipher works](/encoder/affine/learn), with the full
  letter-by-letter table
- [Break an Affine cipher without the key](/encoder/affine/cryptanalysis)
- [The history of the Affine cipher](/encoder/affine/history)
- [Affine cipher practice challenges](/encoder/affine/practice)
