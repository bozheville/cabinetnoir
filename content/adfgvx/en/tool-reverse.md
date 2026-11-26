# How to decrypt the ADFGVX cipher

To decrypt an ADFGVX message you need the variant and both keywords.
Decryption runs the two steps backwards. First the tool rebuilds the
columns from the transposition key and the message length, and reads
the letter pairs off the rows. Then the keyed square turns each pair
back into a character.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Pick the variant the sender used: ADFGX (5×5, letters only) or ADFGVX
  (6×6, letters and digits).
- Enter the grid keyword in {{control:square-key}} and the column
  keyword in {{control:transposition-key}}.
- Only the letters A, D, F, G, V and X are read, in upper or lower
  case. Everything else is ignored.
- The sender's grid was padded with X, so the plaintext may end with a
  stray character. `ATTACKAT` with the same keys decrypts as
  `ATTACKAT9`.
- J was folded into I, so it comes back as I.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`AFDAXXXXAAAAVDVVVAFAADAG` with the square key `NIGHT` and the
transposition key `GERMAN` gives `ATTACKATDAWN`. The 24 letters fill
6 columns of 4. Put back in the order of `GERMAN`, the first row
reads `AXAVAV`: the pairs `AX`, `AV`, `AV`, so A, T, T.

Each key fails in its own way. A wrong square key keeps the pattern
but renames the letters: `DAY` gives `ECCEGLECHEVD`. Swapping the last
two letters of `GERMAN` to `GERMNA` gives `ATYACGATLAWN`: most letters
survive, but letters 3, 6 and 9 are wrong.

## No key?

- [Break an ADFGVX cipher without the key](/encoder/adfgvx/cryptanalysis):
  find the key length, put the columns in order, then solve the square
- [How the ADFGVX cipher works](/encoder/adfgvx/learn), square and
  shuffle
- [The history of the ADFGVX cipher](/encoder/adfgvx/history), from
  Nebel to Painvin
- [ADFGVX practice challenges](/encoder/adfgvx/practice) to decrypt
- [Identify an unknown cipher](/identify) if the message is not made
  of ADFGVX letters only
