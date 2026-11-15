## What unites the family

A substitution cipher replaces every letter, or every pair of letters, with something else: another letter, a number, a symbol. The letters keep their place in the message; only their identity changes. The key is the replacement table, and the whole family is about how that table is built and how often it changes.

## How it works

With a [Caesar](/encoder/caesar/learn) shift of 3, HELLO becomes KHOOR: every letter moves three places down the alphabet. A scrambled [keyword](/encoder/keyword/learn) alphabet, the grid of [Pigpen](/encoder/pigpen/learn), the reversed alphabet of [Atbash](/encoder/atbash/learn) or the arithmetic of the [Affine cipher](/encoder/affine/learn) are other ways to build one fixed table. [Vigenère](/encoder/vigenere/learn), [Beaufort](/encoder/beaufort/learn), [Autokey](/encoder/autokey/learn), [Alberti's disk](/encoder/alberti/learn) and the [Enigma machine](/encoder/enigma/learn) switch between many tables as the message goes on. [Playfair](/encoder/playfair/learn) replaces pairs, and the [Polybius square](/encoder/polybius/learn) turns letters into numbers.

## How it is broken

One fixed table leaks the letter frequencies of the language: E, T and A shine through, and {{term:frequency-analysis}} reads them off. Several tables spread those frequencies out, until Kasiski's test and the {{term:index-of-coincidence}} pull them apart again; the [Vigenère cracker](/encoder/vigenere/cryptanalysis) walks through it step by step. Pair substitution hides single letters but still leaks pair frequencies, which is how [Playfair falls](/encoder/playfair/cryptanalysis).

## History

Suetonius reports that Julius Caesar shifted his private letters by three. In the ninth century Al-Kindi described frequency analysis in Baghdad, and the race between better tables and better statistics ran on to the Enigma machine and Bletchley Park.
