# How the Beaufort cipher works

## The idea in one sentence

The Beaufort cipher is the Vigenère's mirror twin: it uses the
same repeating {{term:key}} and the same {{term:tabula-recta}} idea, but
subtracts the other way round. Where Vigenère computes
cipher = plaintext + key, Beaufort computes
cipher = key − plaintext. That one flipped sign makes the cipher
self-reciprocal: the very same operation encrypts and decrypts.

## The recipe

1. Write your message and keep only the letters (the tool drops spaces
   and punctuation the same way).
2. Write the key under the message, letter by letter, repeating it until
   both lines have the same length.
3. For each pair, subtract the plaintext letter's position from the key
   letter's position: the key letter counts the rows, the plaintext
   letter counts the columns backwards.
4. Read off the letters you landed on — that is the ciphertext.

## A worked example

{{example:beaufort-basic}}

Read the first row: under the key letter **L**, the plaintext letter
**A** lands on **L** again (L − A = L). The second letter is subtracted
from **E**, the third from **M**, and after the fifth letter the key
starts over — exactly the {{term:key-length}} rhythm Vigenère has.

## The formula

Numbering A=0 … Z=25, encryption subtracts and wraps around the
{{term:alphabet}}:

```
cipher = (key − plain) mod 26
```

Because the same formula with the operands swapped decrypts
(`plain = key − cipher`), Beaufort is {{term:reciprocal}}: one lookup
serves both directions. The tool stays in one mode — encrypt a message
with a key, then encrypt the result again with the same key and the
plaintext comes back.

## The variant

The **variant Beaufort** flips the subtraction the other way:
`cipher = plain − key`. It decrypts with plain = cipher + key — the same
arithmetic as Vigenère with every key letter negated. That has an
important consequence for {{term:cryptanalysis}}: statistically, the
variant is indistinguishable from Vigenère, while classic Beaufort
leaves its own fingerprint (the slices fit *reflected* frequency
curves). The tool's variant selector switches between the two; the
cracker follows along.

## Where it sits in the family

Vigenère, Beaufort and variant Beaufort share the same engine: a short
repeating key over a shifted or reflected {{term:tabula-recta}}. If you
know one, you know all three — the difference is which way the
subtraction points.
