## What unites the family

A shift cipher slides the whole alphabet a fixed number of places. Every letter moves by the same amount, the {{term:shift}}, and the alphabet wraps around, so Z is followed by A again. The shift is the entire key, and with 26 letters there are only 25 useful ones.

## How it works

The [Caesar cipher](/encoder/caesar/learn) with a shift of 3 turns HELLO into KHOOR: H moves to K, E to H, L to O. To decode, slide back three places. [ROT13](/encoder/rot13/learn) is the special case with a shift of 13, exactly half the alphabet: applying it twice brings you back to the start, so the same operation both hides and reveals a text. HELLO becomes URYYB, and URYYB becomes HELLO again.

## How it is broken

Twenty-five keys are nothing. A {{term:brute-force}} attack writes out every shift, one per line, and the only line that reads as language is the answer; even by hand it takes a few minutes. {{term:frequency-analysis}} is faster still: find the most common ciphertext letter, assume it stands for E, and the distance between them is the key. ROT13 needs no attack at all, since the key is public.

Shift ciphers are where every course on cryptography starts, because they show the two basic ideas in their purest form: a key, and an attack that searches or counts.

## History

The family is named after Julius Caesar, who, his biographer Suetonius reports, used a shift of 3 in his private correspondence. ROT13 was never meant to be secret: it grew up on Usenet in the 1980s as a way to hide spoilers and punchlines from readers who did not want to see them yet.
