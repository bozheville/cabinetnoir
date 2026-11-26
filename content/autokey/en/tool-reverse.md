# How to decrypt the Autokey cipher

To decrypt an Autokey message you need only the primer, the short key
the sender started with. The primer unlocks the first few letters.
Each recovered letter then becomes key for the letter one primer
length later, so the plaintext unlocks itself as you go. A wrong
primer spoils every letter that depends on it.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Enter the primer in {{control:key}}. Case does not matter, but the
  length does: the primer must have exactly as many letters as the
  sender's.
- The keystream row under the controls shows the primer highlighted,
  followed by the plaintext as the tool recovers it.
- Spaces, digits and punctuation in the ciphertext are dropped. The
  plaintext comes out as one run of capitals, so add the word breaks
  yourself.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`QNXEPVYTWTWP` with the primer `QUEENLY` gives `ATTACKATDAWN`. The
first seven letters are undone with Q, U, E, E, N, L, Y. The eighth
letter is undone with the first recovered one, A.

A wrong primer letter repeats its damage. `KUEENLY` gives
`GTTACKANDAWN`: letter 1 is wrong, and so is letter 8, seven places
later. A primer of the wrong length breaks the chain: `QUEEN` gives
`ATTACVFAWRBK`, right for five letters, then noise.

## No key?

- [Break an Autokey cipher without the key](/encoder/autokey/cryptanalysis)
  by dragging a guessed word ({{term:crib}}) along the ciphertext
- [How the Autokey cipher works](/encoder/autokey/learn), letter by
  letter
- [The history of the Autokey cipher](/encoder/autokey/history), from
  Bellaso to Vigenère
- [Autokey practice challenges](/encoder/autokey/practice) to decrypt
- [Identify an unknown cipher](/identify) if you are not sure it is
  Autokey
