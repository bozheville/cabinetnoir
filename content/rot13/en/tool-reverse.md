# How to decode ROT13

To decode ROT13 you need nothing at all: the key is in the name. Each
letter moves 13 places, and since the alphabet has 26 letters, the
same move that hid the text brings it back. If the result still looks
like nonsense, the text was not ROT13 in the first place.

## Using the decode tool

- Paste the ROT13 text into {{control:message-input}}; the decoded text
  appears in {{control:output}}.
- There is nothing to set. The shift is always 13 and the alphabet is
  always A–Z.
- Spaces and capitals stay where they were. Digits, punctuation and
  letters outside A–Z, such as é or Cyrillic, are dropped.
- {{control:swap}} only changes the label. Decoding and encoding give
  the same result, so either page works.

## A quick example

`URYYBJBEYQ` gives `HELLOWORLD`. U moves 13 places to H, R to E, and
the double Y becomes the double L. With spaces and capitals,
`Uryyb, jbeyq!` gives `Hello world`: the comma and the exclamation
mark are gone.

Text from another cipher stays unreadable. The Caesar ciphertext
`PHHWDWQRRQ`, shifted by 3, comes out as `CUUJQJDEED`. When that
happens, the shift was not 13.

## Not sure it is ROT13?

- [How ROT13 works and why there is nothing to break](/encoder/rot13/learn):
  no key to find, only the same step again
- [Identify an unknown cipher](/identify) if ROT13 gives no sense; it
  also tests other Caesar shifts
- [The history of ROT13](/encoder/rot13/history), from Usenet spoilers
  to geocaching puzzles
- [ROT13 practice challenges](/encoder/rot13/practice) to decode
