# How to decrypt the Atbash cipher

To decrypt Atbash you need no key, only the alphabet the sender
mirrored. Decryption mirrors the text again: Z goes back to A, Y to B.
The one setting that can go wrong is the alphabet. Mirror with the
wrong one and the letters land in the wrong places.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Choose the sender's alphabet in {{control:alphabet-selector}}. The
  French alphabet here is plain A–Z, so it decrypts exactly like
  Latin.
- The decrypt side has no space or case toggles. Spaces and capitals
  always stay; digits, punctuation and letters outside the alphabet
  are dropped.
- {{control:swap}} switches to encrypting, which is the same mirror.
  Only the label changes.

## A quick example

`IVEVIHVNV` gives `REVERSEME`. I is the 9th letter and lands on R, the
9th from the end; V lands on E. Written with spaces and capitals,
`Ivevihv nv!` gives `Reverse me`, without the exclamation mark.

The wrong alphabet shows how much the setting matters. With the German
alphabet, which has 30 letters, `IVEVIHVNV` gives `QCUCQRCMC`. With
the Russian or Ukrainian alphabet the output is empty, because no
Latin letter survives.

## Not sure it is Atbash?

- [How the Atbash cipher works and why it is broken at once](/encoder/atbash/learn),
  with the full mirror table
- [Identify an unknown cipher](/identify) if the mirror gives no sense;
  it tests Atbash, Caesar shifts and more
- [The history of Atbash](/encoder/atbash/history), from the Book of
  Jeremiah to puzzle books
- [Atbash practice challenges](/encoder/atbash/practice) to decrypt
