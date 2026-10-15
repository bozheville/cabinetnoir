# How the Vigenère cipher works

## The idea in one sentence

Vigenère shifts every letter of the {{term:plaintext}} by a different
amount: the first letter by the first {{term:key}} letter, the second by
the second key letter, and so on. When the key runs out, it starts again
from its first letter. This is why it is called a
{{term:polyalphabetic}} cipher: the same plaintext letter can become
different {{term:ciphertext}} letters, which defeats a plain
{{term:frequency-analysis}} attack.

## The recipe

1. Write your message and keep only the letters (the tool drops spaces
   and punctuation the same way).
2. Write the key under the message, letter by letter, repeating it until
   both lines have the same length.
3. Shift each message letter forward through the {{term:alphabet}} by as
   many positions as the key letter says: A counts as 0, B as 1, … Z as
   25. That number is the {{term:shift}}.
4. Read off the letters you landed on — that is the ciphertext.

## A worked example

{{example:vigenere-basic}}

Read the first row: the plaintext letter **A** shifted by the key letter
**L** (position 11) lands on **L**. The key `LEMON` then repeats, so the
second letter is shifted by **E**, the third by **M**, and after the
fifth letter the key starts over — that repeat is both the strength and
the weakness of the cipher.

## The formula

Numbering A=0 … Z=25, encryption adds the two positions and wraps around
the alphabet:

```
cipher = (plain + key) mod 26
plain  = (cipher - key + 26) mod 26
```

The table of all 26 possible shift alphabets is the famous *tabula
recta*; you never need the whole table — one column per key letter is
enough.

## One alphabet or another

The tool defaults to the English alphabet, but the cipher works with any
ordered set of letters: paste your own into the Alphabet field — a
reshuffled English alphabet, or another language. The arithmetic stays
the same; only the alphabet length changes (the formula then wraps at
that length instead of 26).

{{try:vigenere-basic}}
