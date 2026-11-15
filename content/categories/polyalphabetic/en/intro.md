## What unites the family

A polyalphabetic cipher changes its {{term:cipher-alphabet}} as the message goes on. The same plaintext letter becomes different ciphertext letters in different places, so the frequency counts that break a single alphabet flatten out. The key decides which alphabet is used at each step.

## How it works

Take the key BC and shift each letter in turn by B (one place) and C (two places). HELLO becomes IGMNP: the two L's turn into M and N, and the double letter that gives away a simple substitution is gone. The family has two branches. In the tabula recta branch, [Vigenère](/encoder/vigenere/learn), [Beaufort](/encoder/beaufort/learn) and [Autokey](/encoder/autokey/learn) read each alphabet from one square table. In the disks and rotors branch, [Alberti's disk](/encoder/alberti/learn) and the [Enigma machine](/encoder/enigma/learn) turn wheels that change the alphabet mechanically.

## How it is broken

Changing alphabets only helps if the pattern of changes does not repeat. A short repeating key brings the same alphabets back again and again: the {{term:kasiski-examination}} measures the spacing between repeated fragments, the {{term:index-of-coincidence}} confirms the {{term:key-length}}, and each column then falls to ordinary frequency analysis. The [Vigenère cracker](/encoder/vigenere/cryptanalysis) does exactly this. Machines with long periods needed other tools, from known words to the bombes of the Second World War.

## History

Around 1467 Leon Battista Alberti described a disk with two rings and a rule for turning it, the first polyalphabetic cipher in print. Trithemius, Bellaso and Vigenère refined the table over the next century, and in 1863 Friedrich Kasiski published the attack on repeating keys.
