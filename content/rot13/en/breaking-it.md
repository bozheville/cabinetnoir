# Breaking ROT13

ROT13 cannot be "attacked" in any meaningful sense — the shift is
published in the cipher's own name. This page is short, and that is
the pedagogical point.

## The flaw: the name is the key

Caesar hid the shift; ROT13 prints it in its title. There is no key
space — one possibility, one known shift — so there is nothing to
brute-force and nothing to infer. A {{term:brute-force}} attack here
is a single, always-successful attempt.

## Attack — do it again

1. Paste the {{term:ciphertext}} into the tool. Because ROT13 is
   self-inverse, the same operation that produced it removes it.
2. No frequency analysis, no {{term:crib}} hunting, no statistics:
   the letter distribution of ROT13 text is exactly the
   distribution of the original, relabelled — and a trained eye
   reads relabelled English almost directly.

## What makes it useful anyway

The protection ROT13 offers is against *accidental* reading: a
reviewer glancing at a joke's punchline, a reader who does not want
the plot spoiled. That is a real use case — just not a
cryptographic one. It is the same lesson Atbash teaches one page
earlier: an cipher with no key is a convenience feature.

## The family resemblance

ROT13 is the Affine cipher with `a` = 1, `b` = 13, and the only
Caesar shift that is its own inverse. Within the family of
monoalphabetic ciphers it marks the floor: no key at all, no
security at all, and — precisely because of that — a permanent
fixture of netiquette.
