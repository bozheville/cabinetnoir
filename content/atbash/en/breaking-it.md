# Breaking the Atbash cipher

Atbash is the fastest cipher on this site to break — not because
cryptanalysts are clever, but because the cipher never had a secret
to protect. This page shows why, and what that teaches.

## The flaw: no key, no security

A cipher is only as strong as its key space. Atbash's key space is
exactly one: there is precisely one way to mirror an alphabet. The
attacker does not search — they simply know the mapping, the way
everyone knows the alphabet. Trying it once is a
{{term:brute-force}} attack with a workload of one.

## Attack — apply the mirror, once

1. Switch the tool to decrypt mode and paste the
   {{term:ciphertext}}. The mapping is public, so "decrypting" is a
   single click.
2. If the text does not yield, the message was not Atbash — try the
   neighbouring ideas: a Caesar shift, a general
   {{term:substitution}}.
3. Note that {{term:frequency-analysis}} is unnecessary here, though
   it would work: Atbash is monoalphabetic. With no key to recover,
   even the classic statistics are more work than needed.

## A cipher that hides itself

The one protection Atbash offers is obscurity: a reader who does not
suspect a cipher at all sees only nonsense. That is the same
protection as ROT13 on the internet — enough to hide a spoiler, never
enough to hide a secret from anyone who looks twice.

## The family resemblance

Atbash is the Affine cipher with `a` = `b` = 25 — the mirrored
mapping is `y = (25·x + 25) mod 26`, which simplifies to `y = 25 − x`.
Compare the family: Caesar shifts the alphabet, Affine reshapes it
with a chosen multiplier, Atbash flips it completely. All three are
monoalphabetic; all three fall to the same statistics; only the key
space differs — 312 keys, then 1.

## Why it still gets taught

Because it is the boundary case. Every question about cipher strength
— how large is the key space? can the mapping be inverted? does the
same plaintext letter always encrypt the same way? — has an
instant, visible answer on Atbash. When a student can explain *why*
Atbash is worthless, they can explain what any substitution cipher
needs to be worth something.
