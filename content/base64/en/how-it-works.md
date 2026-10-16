# How Base64 works

## An encoding, not a cipher

Base64 is the second classic {{term:encoding}} on this site: anyone
can decode it, it hides nothing, and it is not encryption. Its
purpose is transport — turning arbitrary bytes into text that
survives channels that only understand text, like email bodies, URLs
and JSON files.

## The idea in one sentence

Every three bytes of input (24 bits) are re-cut into four groups of
six bits, and each six-bit value — 0 to 63, hence "base 64" — is
written as one letter of a fixed 64-character alphabet:
`A–Z`, `a–z`, `0–9`, `+` and `/`.

## The recipe

1. Take three bytes: 24 bits.
2. Re-cut them into four 6-bit numbers (0–63).
3. Look each number up in the 64-character table and write the
   character.
4. When the input is not a multiple of three, the last group has
   fewer bytes — the missing slots are written as `=` padding.

## A worked example

{{example:base64-basic}}

M is `01001101`, E is `01000101`, E again `01000101` — stream the 24
bits together, re-cut into sixes: 19, 20, 21, 5 → `TUVF`. Notice the
last row: a lone N becomes `Tg==` — two characters of payload and two
padding signs, because 1 byte = 12 bits fills only two 6-bit slots.

## The mathematics

```
3 bytes  = 24 bits = 4 × 6 bits → 4 characters
length grows by exactly 4/3 (plus padding)
```

That growth — a third larger than the input, regardless of content —
is why Base64 blobs look suspiciously uniform: every letter of any
language maps into the same 64 characters.

## What it is good for — and what it is not

Base64 makes binary data printable and postal-channel safe; it also
makes a perfect hiding place for nothing. Encoded strings decode in
one step with no key, so "looks unreadable" is not "is protected".
If a password, an API key or a "secret" message is travelling as
Base64, it is travelling in plain sight — decoding is a paste button
away, as the practice tab demonstrates.
