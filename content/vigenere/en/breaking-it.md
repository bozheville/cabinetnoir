# Breaking the Vigenère cipher

The repeating {{term:key}} is what makes the cipher breakable. This page
explains the attack; every step has a matching step in the tool's
guided cracker, so you can follow along while reading.

{{challenge:vigenere-demo}}

## The flaw: the key repeats

Encryption shifts letter *i* of the plaintext by key letter *i* — but
the key is short, so letter *i+5* (with a 5-letter key) is shifted by
the *same* key letter again. Whenever the plaintext contains the same
letter at two positions a multiple of the key length apart, the
{{term:ciphertext}} shows the same letter there too. Long texts repeat
common letter groups (the, and, tion…), and those repeats leak the
{{term:key-length}}.

## Step 1 — find the key length

Two independent signals, both shown on the cracker's key length cards:

- **Repeated sequences** — the {{term:kasiski-examination}}: find groups
  of letters that appear several times, measure the distances between
  them, and look for lengths that divide many of those distances. If the
  gaps are 12 and 18, the key length divides both — 6 is a better guess
  than 36.
- **The {{term:index-of-coincidence}}** — for a candidate length N,
  split the text into N slices (every Nth letter) and measure how
  English-like each slice looks. English scores about 0.067, random
  letters about 0.038. When N is the true key length, every slice was
  shifted by a *single* letter and still looks like English.

## Step 2 — each slice is a Caesar cipher

Knowing the key length, every slice is encrypted with one fixed key
letter — it is now just a Caesar cipher of the kind any schoolchild
breaks. The tool's chart lays a slice's letter counts against the
English frequency table: rotate until the tall bars sit over the tall
reference bars, and the shown letter is that slice's key letter. One
rotation per slice, and the whole key is out — watch the live preview
turn into readable text as you go.

## A shortcut — cribs

Sometimes you can guess a word that must appear in the plaintext (a
greeting, a name, "attack"). Place the {{term:crib}} at a position and
subtract: each ciphertext letter minus the guessed plaintext letter is
a key letter. A correct guess reveals several key letters at once; a
wrong one is rejected because it contradicts itself.

## The limits

- **Short texts lie.** With few letters per slice, frequency analysis
  becomes guesswork — that is why the cracker warns you and why a crib
  helps.
- **Long keys hurt.** A key as long as the text, used once, is the
  {{term:substitution}}-free ideal: the one-time pad, the only cipher
  proven unbreakable. Vigenère with a one-time key *is* a one-time pad.
- **Everything else is bookkeeping.** Once the key length is known, the
  rest is mechanical — which is exactly what the guided cracker
  automates the arithmetic for, while you make the decisions.
