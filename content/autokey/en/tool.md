# About the Autokey cipher

The Autokey cipher is a Vigenère cipher whose key never repeats: a
short {{term:primer}} starts the key, and then the message itself
continues it. That removes the repeating period that breaks ordinary
Vigenère. Giovan Battista Bellaso proposed the idea in 1553, and Blaise
de Vigenère published the form usually named after him in 1586.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}.
- Enter a primer in {{control:key}} — four to six letters is typical.
  Without a primer there is no output.
- The keystream row under the controls shows the primer highlighted,
  followed by your own plaintext feeding the key.
- Only the letters A–Z are encrypted. Spaces, digits and punctuation
  are dropped, and the output is in capitals.
- Press {{control:swap}} to decrypt with the same primer; the tool
  rebuilds the keystream from each recovered letter.

## A quick example

`ATTACKATDAWN` with the primer `QUEENLY` gives `QNXEPVYTWTWP`. The
first seven letters use Q, U, E, E, N, L, Y; from the eighth letter on,
the key is the plaintext itself: A, T, T, A, C.

## Go further

Because plaintext and key are the same text, a guessed word ({{term:crib}})
dragged along the ciphertext reveals the next part of the key.

- [How the Autokey cipher works](/encoder/autokey/learn), letter by
  letter
- [Break an Autokey cipher without the key](/encoder/autokey/cryptanalysis)
  by crib dragging
- [The history of the Autokey cipher](/encoder/autokey/history), from
  Bellaso to Vigenère
- [Autokey practice challenges](/encoder/autokey/practice)
