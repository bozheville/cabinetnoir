# Breaking the Beaufort cipher

The repeating {{term:key}} is what makes the cipher breakable — and the
attack is the Vigenère attack with one mirror turn. This page explains
the attack; every step has a matching step in the tool's guided cracker,
so you can follow along while reading.

{{challenge:beaufort-demo}}

## The flaw: the key repeats

Encryption subtracts letter *i* of the plaintext from key letter *i* —
but the key is short, so letter *i+5* (with a 5-letter key) is subtracted
from the *same* key letter again. The {{term:ciphertext}} is periodic,
and the periodicity leaks the {{term:key-length}} exactly as it does for
Vigenère.

## Step 1 — find the key length

Both classic signals work unchanged:

- **Repeated sequences** — the {{term:kasiski-examination}}: find groups
  of letters that appear several times, measure the distances between
  them, and look for lengths that divide many of those distances.
- **The {{term:index-of-coincidence}}** — for a candidate length N,
  split the text into N slices (every Nth letter) and measure how
  English-like each slice looks. The measure is blind to the direction
  of the subtraction — it only sees how *uneven* the letter counts are —
  so it works for Beaufort as well as for Vigenère.

## Step 2 — each slice is a mirrored Caesar cipher

Knowing the key length, every slice was enciphered by one fixed key
letter — but the slice's letters were *reflected* before (or after) the
shift. The practical difference: when the tool lays a slice's letter
counts against the English frequency table, the tall bars line up with
the reference bars *running the other way*. Rotate until the reversed
curve fits, and the shown letter is that slice's key letter. A
cryptanalyst who forgets the mirror ends up with alphabet soup; the
cracker's chart simply draws the reflected curve.

(For the **variant Beaufort** there is no mirror at all — its slices
behave exactly like Vigenère slices, which is why the two are
statistically indistinguishable.)

## A shortcut — cribs

A guessed word works here too, with the subtraction flipped: each
ciphertext letter *plus* the guessed plaintext letter is a key letter
(for the variant, ciphertext *minus* the guess). The tool's crib panel
does the arithmetic for the variant you are cracking.

## The limits

- **Short texts lie.** With few letters per slice, frequency analysis
  becomes guesswork — that is why the cracker warns you and why a crib
  helps.
- **The variant hides in the crowd.** Variant Beaufort ciphertexts are
  exactly Vigenère ciphertexts with a negated key, so an interceptor
  cannot even tell which of the two you used — little comfort, since
  both fall to the same attack.
- **Long keys hurt.** A key as long as the text, used once, is the
  one-time pad ideal — Beaufort inherits that property from Vigenère.
