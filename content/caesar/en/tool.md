# About the Caesar cipher

The Caesar cipher replaces every letter with the letter a fixed number
of places further along the {{term:alphabet}}. It is a
{{term:substitution}} cipher with a single key — the {{term:shift}} —
and the one Julius Caesar used, with a shift of 3, for his military
letters.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}} as you type.
- Drag the rotation slider to set the shift, from 1 to 25. Decryption
  needs the same shift the sender used.
- Pick the alphabet: Latin, German, French, Russian or Ukrainian. The
  slider range follows the alphabet length.
- Tick {{control:keep-spaces}} or {{control:keep-case}} to preserve
  word breaks and capitals. Digits, punctuation and letters outside the
  chosen alphabet are dropped.
- Switch between encrypting and decrypting with {{control:swap}}.

## A quick example

With a shift of 3, `MEETATNOON` becomes `PHHWDWQRRQ`: M moves to P,
E to H, T to W, and the alphabet wraps around after Z.

## Go further

A shift has only 25 possible values, so a Caesar message falls to a
{{term:brute-force}} attack in minutes.

- [How the Caesar cipher works](/encoder/caesar/learn), step by step
- [The history of the Caesar cipher](/encoder/caesar/history), from
  Suetonius to al-Kindi
- [Caesar practice challenges](/encoder/caesar/practice) to decode
