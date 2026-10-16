# How the Playfair cipher works

## The idea in one sentence

The Playfair cipher is the first practical digraph cipher: letters
stop travelling alone and start moving in {{term:digraph}} pairs over
a 5×5 square of letters, so a single plaintext letter no longer
determines a single ciphertext letter.

## The recipe

1. Write the keyword (deduplicated), then the remaining alphabet —
   without J, which folds into I — under it, and cut it into a 5×5
   square.
2. Split the message into pairs ({{term:digraph}}). A doubled letter
   inside a pair gets an X squeezed between the twins; an odd tail
   gets an X at the end.
3. For each pair, find both letters in the square and apply the
   first rule that fits:
   - same row → each letter takes its right-hand neighbour
     (wrapping around);
   - same column → each letter takes the one below it;
   - otherwise → each letter takes the corner of the rectangle that
     lies in its own row and its partner's column.
4. Write the result in pairs.

## A worked example

{{example:playfair-basic}}

The square built from the keyword PLAYFAIREXAMPLE starts
`PLAYF / AIREX / AMPLE …`. **HI** has no shared row or column, so
each letter jumps to the opposite corner of the rectangle —
**CX**. **EG** shares a column, so both letters step down —
**LQ**. Notice the deep change from older ciphers: the same letter
encrypts differently depending on its partner.

## The formula

There is no formula in the affine sense — the key is a whole table.
Mathematically it is a substitution on 336 possible digraph pairs
(25 letters, minus the impossible doubles), driven by row, column
and rectangle rules that all shift pairs *inside* the square while
never mixing rows and columns.

## Decryption and its wrinkles

Decryption runs each rule backwards: left instead of right, above
instead of below, corners stay corners. Two artefacts travel with
the system: an I in the plaintext always appears where a J was
written, and every X is ambiguous — it may be a genuine X or a
filler. Both were accepted costs in the field: telegraph clerks
could learn the square in an afternoon and never touch a table of
26 frequencies.

{{try:playfair-basic}}
