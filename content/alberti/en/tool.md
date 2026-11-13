# About the Alberti cipher

The Alberti cipher uses two concentric discs: a fixed outer ring of
capital letters and a movable inner ring of mixed lowercase letters.
Each outer letter is replaced by the inner letter under it, and the
inner disc is turned from time to time, so the substitution keeps
changing. Leon Battista Alberti described it around 1467, making it
the first {{term:polyalphabetic}} cipher on record.

## How to use this tool

- Type your message into {{control:message-input}}; the result appears
  in {{control:output}} in lowercase, like the inner disc.
- The outer disc holds 20 letters and the digits 1–4:
  `ABCDEFGILMNOPQRSTVXZ1234`. H, J, K, U, W and Y are not on it and are
  dropped, as are spaces and punctuation.
- Set how many letters are encrypted before each turn with
  {{control:period}} (default 2), and how far the disc turns with
  {{control:increment}} (default 3).
- Change the starting alignment with {{control:rotate-left}} and
  {{control:rotate-right}}.
- Press {{control:swap}} to decrypt. You need the same period,
  increment and starting alignment as the sender.

## A quick example

`SECRETNOTE` with period 2 and increment 3 gives `rfdugs&xft`. S and E
are read with the disc at its starting position, C and R after the
first turn, and so on, every two letters.

## Go further

Letters at the same place in each chunk share one substitution, which
is the way in for the codebreaker.

- [How the Alberti cipher works](/encoder/alberti/learn), turn by turn
- [Break an Alberti cipher without the key](/encoder/alberti/cryptanalysis)
- [The history of the Alberti cipher](/encoder/alberti/history), from
  the Renaissance to the cipher machines
- [Alberti cipher practice challenges](/encoder/alberti/practice)
