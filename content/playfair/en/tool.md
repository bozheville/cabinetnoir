# About the Playfair cipher

Playfair encrypts letters in pairs on a 5×5 square built from a
keyword. It was invented by Charles Wheatstone in 1854, named after
Lord Playfair who promoted it, and used by British forces from the
Boer War to the First World War. Because it works on {{term:digraph}}s
rather than single letters, simple letter counting does not break it.

## How to use this tool

- Type your message into {{control:message-input}}; the encrypted
  pairs appear in {{control:output}}, separated by spaces.
- Enter a keyword in {{control:key}}. Its letters, without repeats,
  fill the square first, then the rest of the alphabet follows. With no
  keyword there is no output.
- Only letters are encrypted. J is merged into I, so the square has 25
  cells. Spaces, digits and punctuation are dropped.
- A double letter inside a pair is split with an X, and an X pads the
  last letter if the message has an odd length.
- Press {{control:swap}} to decrypt with the same keyword; the spaces
  between pairs are optional. Expect an I where a J was written and
  stray X fillers.

## A quick example

`HIDE THE GOLD` with the keyword `PLAYFAIR EXAMPLE` gives
`BM OD ZB XD NA GE`. The pairs are HI, DE, TH, EG, OL and D + X filler.

## Go further

- [How the Playfair cipher works](/encoder/playfair/learn): the square
  and the three pair rules
- [Break a Playfair cipher without the key](/encoder/playfair/cryptanalysis)
- [The history of the Playfair cipher](/encoder/playfair/history), from
  a Victorian dinner party to the trenches
- [Playfair practice challenges](/encoder/playfair/practice)
