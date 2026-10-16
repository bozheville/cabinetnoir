# Breaking the Affine cipher

Affine is a monoalphabetic {{term:substitution}} with a mathematical
backbone — and the backbone is exactly what gives it away. Two known
letters collapse the whole key. This page shows both routes.

{{challenge:affine-demo}}

## The flaw: a straight line leaves a trace

Two parameters, one linear rule: `y = (a·x + b) mod 26`. Every letter
pair of the key lies on the same line. Two points determine a line —
so two known letter pairs determine the key.

## Attack 1 — two known letters solve it

1. Guess or obtain two plaintext–ciphertext pairs, say `x₁ → y₁` and
   `x₂ → y₂`.
2. Subtract: `y₁ − y₂ ≡ a·(x₁ − x₂) (mod 26)`. Divide by `x₁ − x₂` —
   in {{term:modular-arithmetic}}, dividing means multiplying by the
   modular inverse — to recover `a`.
3. Substitute back to recover `b`.
4. Enter the key and decrypt. {{term:crib}} words like a known opening
   give you the pairs for free.

## Attack 2 — frequency analysis, as always

Without known letters, the cipher is still a fixed
{{term:substitution}}: the commonest ciphertext letter corresponds to
E, the second to T or A, and each guessed correspondence is a
hypothesis about `(a, b)` that you can test on the next few letters.
There is no period to find, no structure beyond the mapping itself —
{{term:frequency-analysis}} works exactly as it did against Caesar,
only the candidate alphabets are less orderly.

## Why the coprimality rule matters

The multiplier must be coprime with 26 — otherwise two plaintext
letters collide onto one ciphertext letter and the message cannot be
uniquely decrypted. That requirement halves the key space to 312
combos, and it is the first place a beginner meets the idea that
carries modern cryptography: invertibility inside modular arithmetic.
The same arithmetic, taken vastly more seriously, secures today's
public-key exchanges.

## From Caesar to Affine to RSA

Caesar's shift is the Affine cipher with `a` = 1. Affine adds one
multiplication, and with it the concept of a modular inverse. Keep
raising the stakes — exponentiation instead of multiplication — and
you arrive at RSA's public-key mathematics. The toy cipher and the
bank-grade system share one grammar.
