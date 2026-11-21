# About the VIC cipher

The VIC cipher is the last great hand cipher of the pencil-and-paper
era: a Cold War Soviet system that carried espionage messages as
five-figure digit groups, unbroken from 1953 to 1957 — and broken then
only because its courier defected. Four small secrets (a memorable
phrase, a date, the agent's personal number and a fresh five-digit
{{term:keygroup}}) unfold through mod-10 arithmetic into a
{{term:straddling-checkerboard}} and two
{{term:transposition}} tableaus. Kahn called it the finest mnemonic
cipher ever made public.

## How to use this tool

- Type your message into {{control:message-input}}; the five-digit
  groups appear in {{control:output}}.
- The four secrets go in their own fields: the Phrase (at least twenty
  letters), the Date (day, month, year — e.g. `13/9/1959`), the
  personal number and the keygroup. Roll a fresh keygroup with the
  dice button for every message, exactly as the agents did.
- Turn on **Show the key workings** to watch the whole pencil-and-paper
  schedule: worksheet lines A–S, the checkerboard and the two tableau
  widths, each line explained in a tooltip.
- The message is optionally **bisected**: the halves are swapped at an
  agreed cut index before encoding. Your recipient must know the cut —
  it is a secret like the others. Leave it off for a first try.
- Letters, digits and periods travel; everything else is dropped.
  Digits ride inside a shift pair and are written three times each, so
  `0500` costs twelve digits plus two shift codes.
- A few trailing `X`s pad the message to a multiple of five digits —
  the classic five-figure-group presentation. Your recipient simply
  ignores them at the end.
- Press {{control:swap}} to decrypt: paste the groups, re-enter the
  three remembered secrets — the keygroup is read from the message
  itself.

## A quick example

`ATTACKATDAWN. BY DAWN I MEAN 0500.` with the phrase *Twas the night
before Christmas*, the date 13/9/1959, personal number 6 and keygroup
`72401` encodes through the checkerboard to
`60253800005550000008087…` — and then through both transpositions
into five-figure groups with `72401` hidden among them.

## Go further

- [How the VIC cipher works](/encoder/vic/learn) — the full key
  schedule, line by line
- [VIC cipher guides](/encoder/vic/learn#guides) — encrypt your first
  message, then decrypt with the four secrets
- [Breaking the VIC cipher](/encoder/vic/learn#breaking-it) — why
  nobody ever did
- [The history of the VIC cipher](/encoder/vic/history) — the hollow
  nickel, the defector, the arrest in a Brooklyn hotel
- [VIC cipher practice challenges](/encoder/vic/practice)
