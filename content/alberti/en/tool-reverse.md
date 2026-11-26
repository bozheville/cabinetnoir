# How to decrypt the Alberti cipher

To decrypt an Alberti message you need the sender's three settings:
the period, the increment and the starting alignment of the disc. The
tool reads each lowercase letter on the inner disc and writes the
letter above it, turning the disc exactly as the sender did. With one
wrong setting, the message turns to nonsense by the first turn at the
latest.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Line up the inner disc as the sender did, with
  {{control:rotate-left}} and {{control:rotate-right}}. The default
  start has `m` under `A`.
- Set {{control:increment}} and {{control:period}} to the sender's
  values. The defaults are 3 and 2.
- Paste the ciphertext exactly as it came. Spaces and case are kept,
  and every extra character still counts toward the period. One stray
  space shifts every turn after it.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`rfdugs&xft` with period 2 and increment 3 gives `secretnote`. The
`&` is a normal cell of the inner disc: here it stands for N.

Each wrong setting leaves its own trace. With increment 2, the result
is `sedsgxqr1l`: the first two letters are right, because the disc has
not turned yet. Period 3 gives `sefrizqr3i`. One click on
{{control:rotate-right}} breaks it from the start: `rdbqdsmnsd`.

## No key?

- [Break an Alberti cipher without the key](/encoder/alberti/cryptanalysis):
  guess the period, then solve each slice with
  {{term:frequency-analysis}}
- [How the Alberti cipher works](/encoder/alberti/learn), turn by turn
- [The history of the Alberti cipher](/encoder/alberti/history), from
  the Renaissance to the cipher machines
- [Alberti cipher practice challenges](/encoder/alberti/practice) to
  decrypt
