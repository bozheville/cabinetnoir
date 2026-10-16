# History of the Affine cipher

## A shift, straightened out

The Affine cipher has no single inventor and no dramatic debut: it is
the generalisation of the Caesar shift that mathematics offers for
free. Where Caesar slides the alphabet (`x + b`), the affine rule
multiplies before sliding (`a·x + b`) — and the name comes from the
affine function of school algebra, `f(x) = a·x + b`.

## The mathematics arrives late

Ciphers of this shape were certainly used in the manuscript age, but
the systematic understanding came with number theory. Working modulo
26, asking which multipliers can be undone — which have a modular
inverse — is a question Euler and Gauss would have found elementary.
The cipher became a textbook exercise: the smallest system where
encryption is arithmetic and the key is a formula.

## The family portrait

Set `a` = 1 and the Affine cipher is Caesar. Set `a` = 1, `b` = 13 and
it is ROT13's shift. Set `a` = 7, `b` = 0 and you have the
multiplicative cipher the Arab cryptographers had already catalogued.
The Affine cipher is the family tree drawn as a single formula — which
is why teachers love it and cryptanalysts shrug at it.

## The legacy: arithmetic as the key

The real inheritance is conceptual. Affine makes the key a piece of
mathematics rather than a table or a disk, and makes "the key has to
be undoable" a provable statement (coprimality). Public-key
cryptography — Diffie and Hellman's 1976 breakthrough, RSA a year
later — runs on the same instinct, with exponentiation in place of
multiplication and moduli of 2048 bits in place of 26.

{{timeline:affine}}
