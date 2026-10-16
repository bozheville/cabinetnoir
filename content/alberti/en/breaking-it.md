# Breaking the Alberti cipher

The disk cipher was a leap: a {{term:substitution}} that changes while
you write defeats the plain letter counting that broke Caesar. But
Alberti's scheme turns the disc at *fixed* intervals, and that
regularity leaves a fingerprint. This page shows how the fingerprint
gives the key away.

{{challenge:alberti-demo}}

## The flaw: the disc turns like clockwork

After every chunk of `period` letters the inner disc jumps by exactly
`increment` positions. So letter number 1 of every chunk was always
read through one alignment, letter number 2 through another, and so
on. Split the text by chunk position and you get `period` piles — and
every pile is a plain monoalphabetic cipher again, exactly like the
slices of the later Vigenère attack.

## Attack 1 — slice by chunk position

1. Guess the period (2 or 3 is typical) and cut the ciphertext into
   chunks of that length.
2. Collect letters of the same position — the first letter of every
   chunk into pile 1, the second into pile 2…
3. Run {{term:frequency-analysis}} on each pile. A pile maps plaintext
   letters to positions on a *mixed* alphabet, so one pile reveals
   letter pairs rather than a shift — but two or three solved pairs
   pin down the disc alignment.
4. Rebuild the key: the alignment, the period and the increment. Enter
   them in the tool and decrypt.

## Attack 2 — brute force, gently

Everything is small: a period of 1–4, an increment of 1–10, 24
alignments. If a message stays stubborn, walk the combinations:

1. Fix the period and increment and switch the tool to decrypt mode
   with {{control:swap}}.
2. Turn the discs with the arrows until the {{term:ciphertext}} starts
   saying something. Alignment is the most sensitive part — one step
   changes every letter.
3. Still nothing? Change the period and start over. A
   {{term:brute-force}} walk over a few hundred combinations was not
   feasible for Alberti's enemies, and it costs you seconds.

## What Alberti actually solved

Before the disk, Al-Kindi's {{term:frequency-analysis}} had made every
single-alphabet cipher transparent. Alberti's answer — change the
alphabet while you write — is the root idea of all polyalphabetic
cryptography. His successors kept the idea and regularised it: instead
of a mixed disc turned by hand, a tabula recta turned by a key letter.
That regularised descendant is the Vigenère cipher — easier to use,
and easier to break, but built on the same turn.

## The mixed alphabet's extra mile

Note the inner disc is not a shifted alphabet but a *mixed* one
(**mqihfdbacegklnprtuz&xyso**). Mixing kills the "distance from E"
shortcut inside every pile: the attacker must solve actual
substitutions, not shifts. It is the first appearance of a trick that
later ciphers (Playfair among them) reuse — and a reminder that
key design, not key length, was Alberti's real invention.
