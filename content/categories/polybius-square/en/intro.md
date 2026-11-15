## What unites the family

A Polybius-square cipher writes the alphabet into a grid and replaces each letter by its row and column. Letters become pairs of coordinates, digits or symbols, and the ciphertext takes the shape of numbers. The {{term:polybius-square}} itself is a simple substitution, but numbers invite arithmetic and shuffling, which is why the square sits at the start of several stronger ciphers.

## How it works

In the plain 5 × 5 square, with I and J sharing a cell, H sits in row 2, column 3, so HELLO becomes 23 15 31 31 34. The [Polybius cipher](/encoder/polybius/learn) stops there, or uses a keyword to scramble the grid. The [Nihilist cipher](/encoder/nihilist/learn) adds the coordinates of a repeating key to each pair, and [ADFGVX](/encoder/adfgvx/learn) labels the rows and columns with the letters A, D, F, G, V and X, then shuffles the coordinates by columns.

## How it is broken

A bare square is a monoalphabetic substitution in disguise: count the pairs and {{term:frequency-analysis}} reads them as letters. The [Polybius cracker](/encoder/polybius/cryptanalysis) does this directly. The Nihilist key adds a repeating pattern that falls, like Vigenère, once its length is known; see the [Nihilist cracker](/encoder/nihilist/cryptanalysis). ADFGVX splits each letter into two halves, which is called {{term:fractionation}}, and needed a different attack altogether.

## Why some ciphers appear here and elsewhere

Nihilist and ADFGVX start with a square and then add a second step, so they are also product ciphers, and ADFGVX belongs to the transposition family as well.

## History

Polybius, the Greek historian of the second century BC, described the grid as a signalling scheme. Prisoners later tapped it on walls, Russian revolutionaries of the 1880s added numbers to it, and the German army built ADFGVX on it in 1918.
