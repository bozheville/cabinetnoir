# How the Affine cipher works

## The idea in one sentence

The Affine cipher is a {{term:substitution}} driven by a straight line:
every letter is first stretched by a multiplier and then shifted, all
inside {{term:modular-arithmetic}} — the arithmetic of wrapping around
at 26.

## The recipe

1. Choose the key: a multiplier `a` and a shift `b`.
2. The multiplier must be coprime with the alphabet length: for the
   26-letter alphabet that leaves twelve values (1, 3, 5, 7, 9, 11, 15,
   17, 19, 21, 23, 25). Anything sharing a factor with 26 would squash
   several letters onto one, and the tool refuses to build that
   alphabet.
3. Number the letters from 0 (A = 0). Encrypt letter number `x` into
   letter number `(a·x + b) mod 26`.
4. Read the new letter off the alphabet.

## A worked example

{{example:affine-basic}}

With multiplier 3 and shift 7, **S** (letter 18) lands on
(3·18 + 7) mod 26 = 9 — **J**. **E** (letter 4) lands on 19 — **T**.
The middle column is the honest heart of the cipher: a multiplication
and an addition, wrapping at 26.

## The formula

```
encrypt: y = (a·x + b) mod 26
decrypt: x = a⁻¹·(y − b) mod 26
```

Decryption needs the inverse of the multiplier — the number that
multiplied by `a` gives 1 mod 26. For `a` = 3 the inverse is 9, because
3·9 = 27 ≡ 1 (mod 26). Only multipliers coprime with 26 have an
inverse — which is exactly why the key space is 12 × 26 = 312 keys.

## Why two numbers are better than one

A pure shift (Caesar, `a` = 1) slides the alphabet but preserves
differences between letters: the pattern A-B-C is visible under any
shift. The multiplier reshapes the spacing — B is not "one step after
A" any more. Every gap changes with the multiplication, which is why
the same frequency analysis that fells Caesar needs more work here.

{{try:affine-basic}}
