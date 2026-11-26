# How to decrypt the Affine cipher

To decrypt an Affine message you need both numbers of the key: the
multiplier `a` and the shift `b`. Decryption first takes `b` away,
then multiplies by the inverse of `a` modulo 26. If either number is
wrong, most letters map to the wrong ones and the text stays foreign.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Enter the sender's `a` in {{control:multiplier}}. Type the
  encryption multiplier, not its inverse: the tool finds the inverse
  itself.
- Only 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23 and 25 are accepted. Any
  other value is ignored and the last valid one stays, so check the
  field.
- Enter the sender's `b` in {{control:shift}}.
- The decrypt side has no space or case toggles. Spaces and capitals
  always stay; digits and punctuation are dropped.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`JTNGTMRTJJHZT` with `a = 3`, `b = 7` gives `SECRETMESSAGE`. The
inverse of 3 modulo 26 is 9, because 3 × 9 = 27. J is 9, and
9 × (9 − 7) = 18: the letter S.

Each number breaks the text in its own way. With `b = 8` the same
ciphertext gives `JVTIVKDVJJRXV`, and with `a = 5` it gives
`QSWFSBCSQQAOS`. Repeated letters still repeat, since one letter
always maps to one letter.

## No key?

- [Break an Affine cipher without the key](/encoder/affine/cryptanalysis):
  rank the 12 multipliers, then read the shift off a
  {{term:frequency-analysis}} chart
- [How the Affine cipher works](/encoder/affine/learn), with the full
  letter-by-letter table
- [The history of the Affine cipher](/encoder/affine/history)
- [Affine cipher practice challenges](/encoder/affine/practice) to
  decrypt
