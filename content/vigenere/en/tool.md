# About the Vigenère cipher

The Vigenère cipher encrypts each letter with a different Caesar
shift, taken in turn from the letters of a keyword. That makes it a
{{term:polyalphabetic}} cipher: the same plaintext letter can come out
as several different ciphertext letters. For three centuries it was
called "le chiffre indéchiffrable", the unbreakable cipher.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}.
- Enter a keyword in {{control:key}}. Each key letter gives a shift:
  A = 0, B = 1 and so on. The key repeats over the whole message.
  Longer, non-dictionary keys are harder to break.
- Set the alphabet the cipher works on in {{control:alphabet}}. Leave
  it at A–Z, or type your own order for a keyed variant.
- Only letters of that alphabet are encrypted. Spaces, digits and
  punctuation are dropped, and the output is in capitals.
- Switch to decryption with {{control:swap}} and the same key.

## A quick example

`ATTACKATDAWN` with the key `LEMON` gives `LXFOPVEFRNHR`. The first A
meets L and shifts by 11; the two Ts in a row get different shifts
(E and M) and come out as X and F.

## Go further

- [How the Vigenère cipher works](/encoder/vigenere/learn), with the
  full letter-by-letter table
- [Break a Vigenère cipher without the key](/encoder/vigenere/cryptanalysis):
  key length, {{term:frequency-analysis}} and key recovery
- [The history of the Vigenère cipher](/encoder/vigenere/history), from
  Bellaso to Babbage and Kasiski
- [Vigenère practice challenges](/encoder/vigenere/practice)
