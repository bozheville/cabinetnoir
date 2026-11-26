# How to decrypt the Caesar cipher

To decrypt a Caesar message you need the shift the sender used.
Decryption moves every letter back by that many places, so P returns
to M. A wrong shift leaves the text shifted, just by a different
amount. With only 25 shifts on the Latin alphabet, you can also try
them all.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Drag the rotation slider to the sender's shift. Set the shift itself,
  not 26 minus it: the tool counts backwards for you.
- Pick the alphabet the sender used. Latin text under the Russian or
  Ukrainian alphabet gives an empty result, because every letter is
  dropped.
- The decrypt side has no space or case toggles. Spaces and capitals
  always stay; digits and punctuation are dropped.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`PHHWDWQRRQ` with a shift of 3 gives `MEETATNOON`. P moves back 3
places to M, and D moves back to A. Decrypting by 3 is the same as
encrypting by 23: both turn `PHHWDWQRRQ` into `MEETATNOON`.

A wrong shift looks just as foreign as the ciphertext. A shift of 2
gives `NFFUBUOPPO`, and a shift of 4 gives `LDDSZSMNNM`. The wrong
alphabet fails too: the German one has 30 letters, so a shift of 3
gives `NEEUBUOÖÖO`.

## No key?

- [How the Caesar cipher works and how to break it](/encoder/caesar/learn):
  {{term:brute-force}} through all 25 shifts, or count letters with
  {{term:frequency-analysis}}
- [Identify an unknown cipher](/identify): when it spots a Caesar
  shift, it opens this page with the slider already set
- [The history of the Caesar cipher](/encoder/caesar/history), from
  Suetonius to al-Kindi's letter counts
- [Caesar practice challenges](/encoder/caesar/practice) to decrypt
