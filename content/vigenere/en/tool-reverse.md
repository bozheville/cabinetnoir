# How to decrypt the Vigenère cipher

To decrypt a Vigenère message you need the keyword it was encrypted
with. Each key letter shifts its ciphertext letter back by the same
amount the sender moved it forward. With the right key the plaintext
comes back letter for letter; with a wrong key you get gibberish.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Enter the keyword in {{control:key}}. Case does not matter: `lemon`
  and `LEMON` give the same result.
- Check {{control:alphabet}}. It must be the same alphabet the sender
  used. A keyed alphabet decrypts only with that exact letter order.
- Spaces, digits and punctuation in the ciphertext are dropped. The
  plaintext comes out as one run of capitals, so add the word breaks
  yourself.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`LXFOPVEFRNHR` with the key `LEMON` gives `ATTACKATDAWN`. The first L
moves back 11 places, the shift of key letter L, and becomes A.

A wrong key shows where it is wrong. `LIMON` gives `APTACKWTDAWJ`:
only letters 2, 7 and 12 are off, the ones under the wrong second key
letter. `LEMONS` gives `ATTACDTBFZUZ`: the first five letters are
right, then the key stops lining up.

## No key?

- [Break a Vigenère cipher without the key](/encoder/vigenere/cryptanalysis):
  find the key length, then each key letter with
  {{term:frequency-analysis}}
- [How the Vigenère cipher works](/encoder/vigenere/learn), with the
  full letter-by-letter table
- [The history of the Vigenère cipher](/encoder/vigenere/history), and
  how Babbage and Kasiski first broke it
- [Vigenère practice challenges](/encoder/vigenere/practice) to decrypt
