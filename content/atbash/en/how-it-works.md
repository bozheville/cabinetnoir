# How the Atbash cipher works

## The idea in one sentence

Atbash is the simplest {{term:substitution}} that exists: flip the
{{term:alphabet}} over and swap every letter with its mirror — A
becomes Z, B becomes Y, and the last letter becomes the first.

## The recipe

1. Write the alphabet out.
2. Underneath it, write the same alphabet backwards.
3. Encrypt each letter by the letter standing under it. There is
   nothing else: no key, no choices, one single fixed mapping.
4. Decryption is the same operation — the mapping is its own inverse,
   because mirroring twice lands you back where you started.

## A worked example

{{example:atbash-basic}}

The index column is the whole story: a letter at position `x` always
travels to position `25 − x`. **R** (17) becomes **H** (7), because
17 + 7 = 25. Every row is a mirrored pair, and the middle of the
alphabet (M ↔ N) maps onto itself's neighbourhood.

## The formula

Atbash is the special case of the Affine cipher with `a` = `b` = 25:
`y = (25·x + 25) mod 26`, which collapses to `y = 25 − x`. That is
why encrypting and decrypting are the same act — the formula is its
own inverse.

## No key at all

Every cipher on this site asks "what is the key?" Atbash is the
counter-example that defines the question: there is exactly one way
to flip an alphabet, so the mapping is public knowledge. The tool's
alphabet selector lets you play the same trick on German, French,
Russian or Ukrainian alphabets — the mirror idea works on any ordered
writing system, and picking the alphabet is the only "choice" left.

{{try:atbash-basic}}
