# About the Beaufort cipher

The Beaufort cipher is a close relative of Vigenère: each letter is
encrypted with a key letter from a repeating keyword, but the key is
subtracted from instead of added to. In classic Beaufort the
ciphertext letter is `key − plaintext`, which makes the cipher
self-reciprocal: the same operation encrypts and decrypts. It is
named after Admiral Sir Francis Beaufort, of the wind-force scale.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}.
- Enter a keyword in {{control:key}}. It repeats over the whole
  message; longer keys are harder to break.
- Pick the flavour in the Variant selector. Classic Beaufort is
  `C = K − P` and works the same both ways. Variant Beaufort is
  `C = P − K`, which is Vigenère decryption, so it needs the swap
  button to decrypt.
- Set the alphabet the cipher works on in {{control:alphabet}}: A–Z by
  default, or your own order for a keyed table.
- Only letters of that alphabet are encrypted. Spaces, digits and
  punctuation are dropped, and the output is in capitals.

## A quick example

`ATTACKATDAWN` with the key `LEMON` gives `LLTOLBETLNPR` in classic
Beaufort. The first A meets L: L − A = L. Run `LLTOLBETLNPR` through
the tool again with the same key and `ATTACKATDAWN` returns.

## Go further

- [How the Beaufort cipher works](/encoder/beaufort/learn), with the
  reversed {{term:tabula-recta}}
- [Break a Beaufort cipher without the key](/encoder/beaufort/cryptanalysis):
  key length, then key letters
- [The history of the Beaufort cipher](/encoder/beaufort/history), from
  the Admiral's card to the M-209
- [Beaufort practice challenges](/encoder/beaufort/practice)
