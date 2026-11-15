## What unites the family

A polygraphic cipher replaces letters in groups instead of one by one. A pair, a {{term:digraph}}, or a longer block goes in, and a pair or block comes out, so a single plaintext letter has no fixed ciphertext partner. The same E becomes different letters depending on its neighbour.

## How it works

The [Playfair cipher](/encoder/playfair/learn) writes a 5 × 5 square of letters, with I and J sharing a cell, and splits the message into pairs. HELLO becomes HE LX LO: an X separates the double L. Each pair is replaced by the other two corners of its rectangle, or by the letters to its right or below when both letters share a row or column. With the unkeyed square, HE LX LO becomes KC NV MP. A keyword at the start of the square makes the key.

The Hill cipher, coming soon to the cabinet, goes further: it multiplies blocks of letters by a key matrix, so every output letter depends on the whole block.

## How it is broken

Pairs hide single-letter frequencies, but language has pair frequencies too: TH, HE and IN are just as telltale as E. With 600 or so possible pairs instead of 26 letters, the counts need more text, but they come out. A pair and its reverse, such as ER and RE, also encrypt to reversed pairs, another clue that narrows the square. The [Playfair cracker](/encoder/playfair/cryptanalysis) rebuilds the square from pair statistics.

## History

Charles Wheatstone invented the cipher in 1854, but it carries the name of his friend Lord Playfair, who promoted it. The Foreign Office found it too difficult for clerks; British forces used it as a field cipher in the Second Boer War of 1899 and through the First World War.
