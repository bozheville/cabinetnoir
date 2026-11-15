## What unites the family

[Vigenère](/encoder/vigenere/learn), [Beaufort](/encoder/beaufort/learn) and [Autokey](/encoder/autokey/learn) share one 26 × 26 table, the {{term:tabula-recta}}: every row is the alphabet shifted one more place. A key letter picks the row, the message letter picks the column, and the cell where they meet is the ciphertext. The three ciphers differ only in how they read the table and where their key comes from.

## How it works

Key LEMON over ATTACK: A under L gives L, T under E gives X, T under M gives F, and so on, so ATTACK becomes LXFOPV. The key repeats as often as needed. Beaufort subtracts the message from the key instead of adding it, which makes encryption and decryption the same operation. Autokey uses a short primer and then the message itself as the rest of the key, so the key never repeats.

## How it is broken

A repeating key repeats its patterns. The spacing between repeated fragments, found with the {{term:kasiski-examination}}, and the {{term:index-of-coincidence}} give the key length; each column then falls to plain frequency analysis. The [Vigenère cracker](/encoder/vigenere/cryptanalysis) and the [Beaufort cracker](/encoder/beaufort/cryptanalysis) walk through both steps. Autokey has no period to find, but its key is made of language, so guessed words and the primer break it instead: see the [Autokey cracker](/encoder/autokey/cryptanalysis).

## History

Johannes Trithemius printed the table in his *Polygraphia* in 1508. In 1553 Giovan Battista Bellaso published the keyed cipher the world later named after Blaise de Vigenère, who described an autokey version in 1586. Charles Babbage broke the repeating key around 1854 and kept it to himself; Kasiski published the method in 1863.
