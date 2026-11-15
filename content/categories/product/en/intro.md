## What unites the family

A product cipher applies two different operations one after the other, usually a substitution and then a transposition. Each step covers the other's weakness: the substitution hides which letters are there, the transposition hides where they are. Breaking only one layer gives you nothing readable.

## How it works

Take HELLO in a plain Polybius square: 23 15 31 31 34. Now write those ten digits in rows under a two-letter key and read the columns in a fixed order: the two digits of each letter end up in different places. That is the idea behind [ADFGVX](/encoder/adfgvx/learn), which labels its square with the letters A, D, F, G, V and X and then shuffles the result with a columnar transposition. The [Nihilist cipher](/encoder/nihilist/learn) combines a Polybius square with the addition of a repeating numeric key.

The Bifid cipher and the straddling checkerboard of the VIC cipher, both coming soon, mix coordinates in other ways.

## How it is broken

Splitting each letter into two pieces, {{term:fractionation}}, stops frequency analysis from working on the ciphertext directly. Attacks therefore undo the second layer first. For ADFGVX that means finding the column order from many messages on the same key, then reading the square as a simple substitution; the [ADFGVX cracker](/encoder/adfgvx/cryptanalysis) follows that route. The [Nihilist cracker](/encoder/nihilist/cryptanalysis) finds the key length from the numbers, much like Vigenère.

## Why these ciphers appear in several families

Both members start from a Polybius square, so they are listed there too, and ADFGVX is also a transposition.

## History

ADFGVX was designed by Fritz Nebel and entered German service in March 1918. Georges Painvin of the French cipher bureau broke a day's key that same spring, and when the German offensive came in June 1918, the French were waiting.
