## What unites the family

An affine cipher treats the alphabet as numbers from 0 to 25 and sends every letter along a straight line: multiply by one number, add another, and wrap around with {{term:modular-arithmetic}}. The rule is E(x) = a·x + b mod 26. The multiplier must share no factor with 26, so only 12 values of a work, which gives 312 keys in all.

## How it works

With a = 5 and b = 8, H (7) becomes 5·7 + 8 = 43, which is 17 mod 26: the letter R. HELLO turns into RCLLA. Decryption runs the line backwards with the inverse of 5, which is 21, because 5·21 = 105 leaves 1 after dividing by 26.

[Atbash](/encoder/atbash/learn) is the line that runs downhill: a = 25 and b = 25 send A to Z, B to Y and so on, so HELLO becomes SVOOL. It is its own inverse, like a mirror. The [Affine cipher](/encoder/affine/learn) page lets you pick any valid pair, and the Caesar shift is simply the case a = 1.

## How it is broken

312 keys can be tried in a blink, so {{term:brute-force}} is always available. By hand it is quicker to guess two letters: if the most common ciphertext letters stand for E and T, two equations give a and b directly. The [Affine cracker](/encoder/affine/cryptanalysis) shows both routes, and Atbash, with one key, needs no attack at all.

## History

Atbash is the oldest member: the book of Jeremiah, written around the fall of Jerusalem in 586 BC, calls Babylon *Sheshach*, the Atbash form of its Hebrew name. The general affine cipher has no single inventor; it is what mathematics offers once you see the Caesar shift as addition.
