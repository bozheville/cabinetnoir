# How the Caesar cipher works

## The idea in one sentence

Caesar shifts every letter of the {{term:plaintext}} by the same fixed
amount — the {{term:shift}} — so the whole {{term:alphabet}} slides
sideways at once. That makes it a {{term:substitution}} cipher with a
single alphabet: every A becomes, say, D, every B becomes E, and so on
for the whole message.

## The recipe

1. Write your message and keep only the letters (the tool drops spaces
   and punctuation unless you ask it to keep them).
2. Choose the shift: a number between 1 and 25. Julius Caesar used 3.
3. Move every letter forward through the {{term:alphabet}} by that many
   positions, wrapping around at the end: after Z comes A.
4. Read off the letters you landed on — that is the ciphertext.

## A worked example

{{example:caesar-basic}}

With a shift of 3 the plaintext letter **A** lands on **D**, **B** on
**E**, and the tail of the alphabet wraps around: **X**, **Y** and
**Z** come out as **A**, **B** and **C**. One shift for the whole
message is what makes Caesar easy to use — and easy to break.

## The formula

Numbering A=0 … Z=25, encryption adds the shift and wraps around the
alphabet:

```
cipher = (plain + shift) mod 26
plain  = (cipher - shift + 26) mod 26
```

Decryption is the same move backwards: subtract the shift instead of
adding it. The tool's swap button does exactly that — it feeds the
ciphertext through the second formula instead of the first.

## One alphabet or another

The tool defaults to the English alphabet, but the cipher works with
any ordered set of letters: pick a preset or paste your own into the
Alphabet field. The arithmetic stays the same; only the alphabet length
changes (the formula then wraps at that length instead of 26).

{{try:caesar-basic}}
