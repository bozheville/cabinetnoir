# History of the Vigenère cipher

## The first polyalphabetic ideas

Using several alphabets in turn was the great leap of Renaissance
cryptography. Around 1467 the Italian architect and cryptographer Leon
Battista Alberti proposed a cipher disk: two stacked wheels of letters,
rotated between words so that the same letter would not always encrypt
the same way. A few decades later the German abbot Johannes Trithemius
published the *tabula recta* — the square table of all 26 shift
alphabets that Vigenère-style ciphers still use — in his steganography
book *Polygraphia* (1508).

## Bellaso, not Vigenère

The cipher we now call Vigenère was described in 1553 by Giovan Battista
Bellaso, who paired the tabula recta with an easy-to-remember key phrase
and noted that the key should be changed often. In 1586 the French
diplomat Blaise de Vigenère published a stronger, autokey variant of his
own. History got the attribution backwards: the simpler repeating-key
cipher was named after Vigenère, and the name stuck. (The cipher
Vigenère actually described is on this site too — the autokey cipher,
one rung below in the ladder.)

## "Le chiffre indéchiffrable"

For roughly three centuries the cipher was known as *le chiffre
indéchiffrable* — the indecipherable cipher. It was widely used for
diplomatic correspondence, and for a long time the reputation was
deserved: as long as the key was as long as the message and never
reused, the methods below do not work.

## The fall

The repeating key is the flaw. Charles Babbage worked out how to
recover the key from English ciphertext in 1854, likely to help crack a
cipher advertisement in the press, but never published. In 1863 the
Prussian officer Friedrich Kasiski published the same general method —
which is why the repeated-sequence examination carries his name. In the
1920s William Friedman's index of coincidence turned key-length
detection into a measurable statistic, and the cipher became a textbook
exercise.

{{timeline:vigenere}}

## Sources

- [Alberti cipher — Wikipedia](https://en.wikipedia.org/wiki/Alberti_cipher)
- [Tabula recta — Wikipedia](https://en.wikipedia.org/wiki/Tabula_recta)
- [Vigenère cipher — Wikipedia](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher)
- [Kasiski examination — Wikipedia](https://en.wikipedia.org/wiki/Kasiski_examination)
- [Index of coincidence — Wikipedia](https://en.wikipedia.org/wiki/Index_of_coincidence)
- David Kahn, *The Codebreakers* (1967), chapters on the Renaissance ciphers.
