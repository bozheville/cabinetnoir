# How the Rail fence cipher works

## The idea in one sentence

Rail fence is the simplest {{term:transposition}} to picture: the
letters ride a fence on the diagonal, bouncing between the top and
bottom rail, and the ciphertext is the rails read off one after
another, top to bottom.

## The recipe

1. Choose a number of rails, say 3, and write the plaintext diagonally:
   `A` on rail 1, `T` on rail 2, `T` on rail 3, `A` back on rail 2, and
   so on — the {{term:zigzag}}.
2. With `ATTACKATDAWN` the fence fills up as
   rail 1: `A · A · A`, rail 2: `T · C · T · T · A · W`,
   rail 3: `T · K · D · N`.
3. Read the rails top to bottom: `AAA`, then `TCTTAW`, then `KDN`.
4. The ciphertext is `AAATCTTAWKDN`. Decryption is the same walk in
   reverse: count how many letters each rail owns, slice the ciphertext
   accordingly, and ride the fence again.

## A worked example

{{example:railFence-basic}}

Each row follows one plaintext letter: which rail it sits on, and which
position of the ciphertext it ends up at. Notice how the first three
letters of the ciphertext are just the top rail — the fence leaks its
whole shape in plain sight.

## The offset variant

The classic fence always starts on the top rail — the first ciphertext
letter is always the first plaintext letter, a gift to the attacker.
The offset moves the starting rail: with 3 rails and offset 1, the
zigzag begins on the middle rail heading down. Same fence, one more
thing to try.

## Why it is the on-ramp, not the fortress

The key is two small numbers. Even the biggest setting here — ten rails
— is ten times a handful of tries, and each try is checked by whether
the text reads. That makes rail fence the perfect first transposition
to break by hand, and the guided cracker turns it into a single slider.
