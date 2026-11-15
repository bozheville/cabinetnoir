## What unites the family

A transposition cipher keeps every letter of the message and changes only their order. Nothing is replaced: the ciphertext is an anagram of the plaintext, with exactly the same letters in exactly the same numbers. The key is the rule for the shuffle.

## How it works

The [Rail fence](/encoder/railFence/learn) writes the message in a zigzag across a few lines and reads the lines one after another. With two rails, ATTACKATDAWN becomes ATCADW TAKTAN. The [Columnar transposition](/encoder/columnar/learn) writes the message in rows under a keyword and reads the columns in the alphabetical order of the key letters. [Saknussemm's cipher](/encoder/saknussemm/learn) from Jules Verne's novel scrambles a runic grid, and [ADFGVX](/encoder/adfgvx/learn) uses a columnar shuffle as its second step.

## How it is broken

Because the letters are unchanged, the letter counts match the language exactly, and that alone tells you the cipher is a transposition: E, T and A are as common as they should be, just in the wrong places. The attack is {{term:anagramming}}: try a width or a number of rails, line up the columns, and slide them until common pairs such as TH and HE appear across them. A rail fence has so few keys that trying them all is quick; the [Rail fence cracker](/encoder/railFence/cryptanalysis) does it. Columnar keys are larger, but pair scores still guide the search, as the [Columnar cracker](/encoder/columnar/cryptanalysis) shows.

## History

The oldest transposition on record is the Spartan scytale, a leather strip wound around a staff. Columnar shuffles filled the cipher manuals of the Renaissance, and in 1864 Jules Verne used a scrambled runic message to open *Journey to the Centre of the Earth*.
