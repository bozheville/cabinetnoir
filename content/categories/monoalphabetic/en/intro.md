## What unites the family

A monoalphabetic cipher uses one {{term:cipher-alphabet}} for the whole message. Every A becomes the same symbol, every B another, from the first letter to the last. The key is the table, and once you know a single pair you know it everywhere in the text.

## How it works

The simplest tables are mathematical: the [Caesar](/encoder/caesar/learn) shift and [ROT13](/encoder/rot13/learn) slide the alphabet, while [Atbash](/encoder/atbash/learn) and the [Affine cipher](/encoder/affine/learn) map it along a line. The [Keyword cipher](/encoder/keyword/learn) builds a scrambled table from a word: with KEYWORD the alphabet starts K E Y W O R D A B C…, so HELLO becomes AOGGJ. [Pigpen](/encoder/pigpen/learn) swaps letters for shapes cut from a grid, but it is still one fixed table, just drawn instead of written.

## How it is broken

A fixed table keeps the fingerprints of the language. Count the symbols: the most frequent one is probably E, a lone single-letter word is A or I, and double letters like the GG in AOGGJ betray LL, EE or SS. {{term:frequency-analysis}} and pattern words fill in the rest. A scrambled alphabet has far too many keys to try one by one, but it falls to statistics just as fast as a shift; the [Keyword cracker](/encoder/keyword/cryptanalysis) shows how.

## History

In the ninth century Al-Kindi wrote the first known description of frequency analysis, and from then on a single alphabet was living on borrowed time. In 1586 a fixed nomenclator alphabet carried the letters of the Babington plot, and its decryption doomed Mary, Queen of Scots. The Renaissance answer was to use more than one alphabet.
