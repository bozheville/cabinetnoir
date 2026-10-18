# Breaking the Pigpen cipher

Pigpen looks unbreakable to a beginner — alien symbols, no letters to
count — and is in fact the fastest cipher on this site to break after
Atbash. This page shows why the strangeness is only skin deep.

## The flaw: a substitution in costume

Strip the drawings away and pigpen is a plain monoalphabetic
{{term:substitution}}: exactly one fixed mapping from letters to
symbols, no key, no choices beyond the variant. Everything that breaks
a simple substitution applies unchanged — there are only 26 symbols to
identify, and the plaintext is ordinary language.

## Attack — treat it as a reading exercise

1. **Recognise the cipher first.** Grid fragments and dotted shapes are
   instantly recognisable: the interceptor usually does not need to
   *break* pigpen, only to *decipher* it — the key is public knowledge,
   like the alphabet itself.
2. **Identify the variant.** The symbol set is usually guessable:
   masonic grids first, then the dotted-pen or cross variants. Trying
   the handful of published variants costs minutes.
3. **Fall back on {{term:frequency-analysis}}.** If the variant is
   non-standard, count the symbols: the most frequent glyph is almost
   surely E, T or A, doubled symbols are L, T or E, and the shape
   grammar (walls, dots, arms) constrains the guesses further. A
   hand-sized text falls to the same statistics as any monoalphabetic
   cipher.

## Why there is no cracker here

The guided crackers on this site earn their place by searching a key
space: shifts, multipliers, disc rotations, column permutations. Pigpen
has nothing to search — once the variant is identified, the mapping is
complete. A future cracker would only automate variant recognition; if
a message resists that, it is not really pigpen.

## What pigpen teaches

Pigpen is the purest lesson in the difference between *secrecy of the
method* and *secrecy of the key*: a system whose security rests on the
assumption that the adversary has never seen a Freemason's gravestone
is not a system, it is a hope. That is exactly the assumption every
serious cipher design refuses to make.
