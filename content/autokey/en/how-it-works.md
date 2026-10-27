# How the autokey cipher works

## The idea in one sentence

The autokey cipher is what the "Vigenère cipher" really was in 1586:
a {{term:Vigenère}}-style cipher whose {{term:key}} grows out of the
message itself. It starts with a short primer — say `QUEEN` — and after
those five letters the keystream continues with the plaintext you have
already written. The key feeds on itself; that is the *auto* in autokey.

## The recipe

1. Write your message and keep only the letters.
2. Choose a primer — a short key word, typically much shorter than the
   message.
3. Build the {{term:keystream}}: the primer first, then your own
   plaintext appended after it.
4. Add as in Vigenère: each plaintext letter plus the keystream letter
   above it (wrapping around the {{term:alphabet}}) gives the
   {{term:ciphertext}}.

## A worked example

{{example:autokey-basic}}

Watch the keystream column: `QUEENLY` runs out after six letters, and
from then on every key letter is simply the message's own letter from
one primer-length earlier. The tool shows this live: the keystream row
under the input grows with your text, the primer part highlighted.

## The formula

Numbering A=0 … Z=25, with the keystream K built from the primer and
the plaintext itself:

```
cipher = (plain + key) mod 26
key[i] = primer[i]                  for i < primer length
key[i] = plain[i − primer length]   after that
```

Decryption walks the same keystream: recover the plaintext letter by
letter, and each recovered letter becomes key material one primer-length
later. That is why the primer is the whole secret — everything else
regenerates itself.

## What it buys — and what it costs

Because the keystream never repeats a fixed period, the periodic
fingerprints of Vigenère (repeated sequences, slice-wise
{{term:index-of-coincidence}} gains) disappear. The cipher resists the
classic 19th-century attack.

The cost is fragility. Any error in the ciphertext propagates through
every later key letter, and the whole scheme leans on one short secret:
if an attacker guesses plaintext ("{{term:crib}} dragging"), the
guessed letters *are* key material and unravel the rest of the message —
that is exactly what the tool's guided cracker does with you.
