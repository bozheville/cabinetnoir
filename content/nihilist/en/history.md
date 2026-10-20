# History of the Nihilist cipher

## Smuggling numbers past the censors

In the 1880s the Russian revolutionary movement — the Nihilists — ran a
war of pamphlets and letters against the Tsar's censorship. Prison
correspondence was read and rewritten by guards, so prisoners needed a
cipher simple enough to remember and innocent enough to survive a
cursory glance. Their answer was the Polybius square plus a short
numeric key: the letters became harmless-looking numbers, and the key
pushed the numbers around so the plain grid alone decoded nothing.

{{timeline:nihilist}}

## The prison cipher that became a classic

The scheme spread through the revolutionary underground and into the
textbooks as the Nihilist cipher. Its mechanics are a fork of an idea
that outlived it: coordinates plus arithmetic. The prison variant that
strips the key away again — pure coordinates, tapped on a wall — is the
tap code, known to every prisoner of war since. And the addition itself
grew up: combine it with a bigger square, several layered numeric keys
and a final transposition, and you have the VIC cipher of the 1950s,
the last great pencil-and-paper system ever fielded.

## Why it earns a place on the ladder

The Nihilist cipher sits exactly between the substitution family and
the periodic-key family: it is Vigenère's key rhythm applied to numbers
instead of letters. Learning it teaches two attacks at once — period
finding on a stream, and the clipping constraint that pins each key
number — and it is the natural bridge from the Polybius square to
ADFGVX, where the same coordinates are fractionated and transposed.
