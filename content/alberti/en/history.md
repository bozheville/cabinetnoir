# History of the Alberti cipher

## The Renaissance man with a disk

Leon Battista Alberti (1404–1472) was an architect, artist, musician
and mathematician — the model "Renaissance man" — and in 1467 he
presented the Pope with a writing device he called *Formula*: two
concentric bronze discs on a common pin. The larger one, *Stabilis*,
holds a capital-letter alphabet; the smaller one, *Mobilis*, a mixed
lowercase alphabet. Turn the inner disc and every letter changes its
meaning.

## The first polyalphabetic system

Before Alberti, every cipher known to Europe used one fixed alphabet —
and the Arab cryptographers had already shown how to break such ciphers
by letter counting. Alberti's disk answers that attack directly: turn
the disc and the frequency table of your message no longer applies. The
twenty letters of the outer ring were shared across Europe at the time
(I, J and U were not yet separate letters, K and W were rarely used),
and the digits 1–4 on the ring encoded a second layer: a codebook of
336 phrases that could be superenciphered with the numbers.

## A book, not a machine

Alberti wrote the system down in *De Cifris* (1467), the first printed
book on cryptography. The Latin West slowly absorbed the idea:
Johannes Trithemius published the tabula recta — a table of all
alphabets laid out in a square — a generation later, and Giovan
Battista Bellaso turned the alphabets with an easy-to-remember key
phrase. That regularised descendant, misattributed to Blaise de
Vigenère, outlived them all — this site covers it under the Vigenère
cipher.

## Why the disk still matters

The disk itself was superseded, but its two ideas never left
cryptography: change the alphabet during the message, and *mix* the
target alphabet instead of merely shifting it. Every rotor machine up
to Enigma is Alberti's two discs on a pin, taken seriously.

{{timeline:alberti}}

![Alberti's cipher disk](/images/alberti.svg)
