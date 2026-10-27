# Breaking the autokey cipher

The autokey cipher has no repeating {{term:key}} to find — so the
Vigenère attack finds nothing. But it has a weaker seam: the key *is*
plaintext. This page explains the {{term:crib}}-dragging attack; every
step has a matching step in the tool's guided cracker, so you can follow
along while reading.

{{challenge:autokey-demo}}

## Why the classic attack fails

Periodicity is gone. With the keystream being primer-then-plaintext,
two identical plaintext letters almost never encrypt the same way twice,
so repeated sequences dry up and slice-wise frequency analysis has no
slices to stand on. Kasiski's examination and the
{{term:index-of-coincidence}} both come up empty.

## The seam: the key is the message

Every keystream letter (after the primer) is a plaintext letter from one
primer-length earlier. That means a guessed plaintext word does double
duty:

1. **Drag the word.** Place your guess at each position of the
   {{term:ciphertext}}. At position *p*, the guess implies key letters
   K = C − guess — and in autokey those key letters *are* plaintext from
   one primer-length earlier. A wrong placement produces alphabet soup;
   the right one produces readable English.
2. **Unroll.** Once the placement is right, the known plaintext letters
   propagate on their own: a recovered letter at position *p* becomes
   the key at *p + L* (revealing the plaintext there), and the letter at
   *p − L* is revealed the same way backwards. A few passes and the
   chains cover everything the crib's position classes touch.
3. **Read the primer.** The keystream's first *L* letters are the
   primer: K(i) = C(i) − P(i) for each of them. Where the crib never
   reached, the primer letters stay blank — the last step of the
   wizard is you typing those by hand, from what looks like English.

Nothing here needs statistics. It is one guessed word, one subtraction
rule, and the cipher doing the rest of the demolition itself.

## The limits

- **The guess is the whole game.** If the plaintext does not contain a
  word you can guess, the attack stalls — no ranking machinery can
  rescue a wrong crib.
- **Short primers are fragile.** A primer of 1–3 letters is nearly a
  Caesar cipher with extra steps; the unrolled chains cover almost
  everything at once.
- **Long primers behave like a one-time pad.** A primer as long as the
  message never reuses anything — unbreakable, as with any key used
  once. The autokey's weakness only exists because the primer is short.
