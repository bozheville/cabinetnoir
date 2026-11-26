# How to decrypt Columnar transposition

To decrypt a Columnar transposition you need the keyword and the grid
setting the sender used. The tool first works out the grid's shape from
the keyword length and the message length. Then it puts the columns
back in their reading order and reads the rows. A wrong keyword keeps
every letter but puts them in the wrong order.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Enter the keyword in {{control:keyword-input}}. Only the alphabetical
  order of its letters counts, so `BCA` decrypts the same as `SUN`.
- Set {{control:grid-toggle}} the way the sender did. A padded grid
  decrypts either way, but a short last row needs the toggle on.
- Spaces, digits and punctuation are dropped. Padding X at the end
  stays in the plaintext, so remove it yourself.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`TKDNAAAATCTW` with the keyword `SUN` gives `ATTACKATDAWN`. Twelve
letters under a 3-letter keyword make 4 rows, so each column holds 4
letters. N reads first, so `TKDN` goes back into the third column,
`AAAA` into the first and `TCTW` into the second.

The grid setting matters as much as the keyword. `ATTACKATDAW` with a
short last row encrypts to `TKDAAAATCTW`. Decrypted with
{{control:grid-toggle}} off, it gives `ACTATKAWDTA`: the right letters
with the wrong column lengths.

## No key?

- [Break a Columnar transposition without the key](/encoder/columnar/cryptanalysis):
  find the column count, then drag the columns until the rows read as
  English
- [How Columnar transposition works](/encoder/columnar/learn), grid by
  grid
- [The history of Columnar transposition](/encoder/columnar/history),
  from the trenches to the SOE poem codes
- [Columnar transposition practice challenges](/encoder/columnar/practice)
  to decrypt
- [Identify an unknown cipher](/identify) if you are not sure it is a
  transposition
