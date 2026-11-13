# About the Atbash cipher

Atbash mirrors the {{term:alphabet}}: A swaps with Z, B with Y, C with
X, and so on to the middle. It began as a Hebrew scribal cipher — the
name itself is built from the first, last, second and second-to-last
Hebrew letters — and appears in the Book of Jeremiah. There is no key,
so it is a fixed {{term:substitution}}, and running it twice gives the
original text back.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the mirrored
  text appears in {{control:output}}.
- Choose which alphabet gets mirrored with {{control:alphabet-selector}}:
  Latin by default, or German, French, Russian or Ukrainian.
- Tick {{control:keep-spaces}} or {{control:keep-case}} to preserve
  word breaks and capitals. Digits, punctuation and letters outside the
  chosen alphabet are dropped.
- Encrypting and decrypting are the same operation; {{control:swap}}
  only changes the label. To decode, keep the alphabet the sender used.

## A quick example

`REVERSEME` becomes `IVEVIHVNV`. R is the 18th letter and lands on I,
the 9th from the end; E lands on V. Feed `IVEVIHVNV` back in and
`REVERSEME` returns.

## Go further

With no key at all, "breaking" Atbash means recognising it: try the
mirror once, and either sense appears or it is something else.

- [How the Atbash cipher works](/encoder/atbash/learn), with the full
  mirror table
- [The history of Atbash](/encoder/atbash/history), from the Book of
  Jeremiah to puzzle books
- [Atbash practice challenges](/encoder/atbash/practice)
