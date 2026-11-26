# How to decrypt the Playfair cipher

To decrypt a Playfair message you need the keyword that built the 5×5
square. Each ciphertext pair is undone by the same three rules run
backwards: shift left in a row, up in a column, or swap rectangle
corners. A wrong keyword builds a different square, and every pair
comes out as noise.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  pairs appear in {{control:output}}, separated by spaces.
- Enter the keyword in {{control:key}}. Case and spaces do not matter:
  only its letters, without repeats, build the square.
- The spaces between pairs are optional. The letter count must be
  even, though: an odd count gives no output.
- The tool removes nothing it added. Filler X letters stay in the
  plaintext, and an I may stand where the sender wrote a J. Remove the
  fillers yourself.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`BM OD ZB XD NA GE` with the keyword `PLAYFAIR EXAMPLE` gives
`HI DE TH EG OL DX`. Read it as HIDE THE GOLD: the final X only
padded the odd letter count.

Fillers also sit between doubled letters. `HELLO` encrypts to
`DM YR AN` and decrypts to `HE LX LO`, so drop the X between the two
Ls. A shorter keyword, `PLAYFAIR`, turns the example into
`DH TR WD ZC QP EM`.

## No key?

- [Break a Playfair cipher without the key](/encoder/playfair/cryptanalysis)
  with {{term:digraph}} statistics and step-by-step square improvement
- [How the Playfair cipher works](/encoder/playfair/learn): the square
  and the three pair rules
- [The history of the Playfair cipher](/encoder/playfair/history), from
  a Victorian dinner party to the trenches
- [Playfair practice challenges](/encoder/playfair/practice) to decrypt
- [Identify an unknown cipher](/identify) if you are not sure it is
  Playfair
