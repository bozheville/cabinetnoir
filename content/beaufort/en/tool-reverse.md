# How to decrypt the Beaufort cipher

To decrypt a Beaufort message you need the keyword and the variant the
sender used. Classic Beaufort is reciprocal: decrypting is the same
operation as encrypting, `P = K − C`. So this page and the encrypt
page give the same output for the same text and key. A wrong key
gives gibberish.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Enter the keyword in {{control:key}}. Case does not matter: `lemon`
  and `LEMON` give the same result.
- Check the Variant selector. Classic Beaufort decrypts exactly as it
  encrypts. Variant Beaufort decrypts with `P = C + K`, so it must
  match the sender's choice.
- Check {{control:alphabet}}. A keyed table decrypts only with the
  sender's exact letter order.
- Spaces, digits and punctuation in the ciphertext are dropped. The
  plaintext comes out as one run of capitals, so add the word breaks
  yourself.

## A quick example

`LLTOLBETLNPR` with the key `LEMON` gives `ATTACKATDAWN`. The first L
meets key letter L: L − L = A. Paste the same ciphertext on the
encrypt page and `ATTACKATDAWN` comes out there too.

A wrong setting shows up quickly. `LIMON` gives `AXTACKETDAWR`: only
letters 2, 7 and 12 are off, the ones under the wrong key letter. The
right key with Variant Beaufort selected gives `WPFCYMIFZAAV`, wrong
from the first letter.

## No key?

- [Break a Beaufort cipher without the key](/encoder/beaufort/cryptanalysis):
  find the key length, then each key letter
- [How the Beaufort cipher works](/encoder/beaufort/learn), with the
  reversed {{term:tabula-recta}}
- [The history of the Beaufort cipher](/encoder/beaufort/history), from
  the Admiral's card to the M-209
- [Beaufort practice challenges](/encoder/beaufort/practice) to decrypt
- [Identify an unknown cipher](/identify) if you are not sure it is
  Beaufort
