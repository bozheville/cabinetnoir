# About Columnar transposition

Columnar transposition keeps every letter but changes their order:
write the message in rows under a keyword, then read the columns in the
alphabetical order of the keyword's letters. It is a
{{term:transposition}}, not a substitution, so letter frequencies stay
those of the plaintext. It was a field workhorse of the First World War
and the second stage of the German ADFGVX cipher.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}.
- Enter the keyword in {{control:keyword-input}}. Below it,
  {{control:transposition-grid}} shows the text row by row, with
  badges giving the column reading order.
- By default the last row is padded with X to a full rectangle. Tick
  {{control:grid-toggle}} to leave it short instead.
- Tick {{control:double-toggle}} and fill {{control:second-keyword-input}}
  to transpose twice, the way wartime agents did.
- Only letters are kept; tick {{control:keep-spaces}} to carry spaces
  through the grid. Digits and punctuation are dropped.
- Press {{control:swap}} to decrypt with the same keyword and settings.

## A quick example

`ATTACKATDAWN` under the keyword `SUN` fills four rows of three. N comes
first in the alphabet, then S, then U, so the third, first and second
columns are read in turn: `TKDN AAAA TCTW`, giving `TKDNAAAATCTW`.

## Go further

- [How Columnar transposition works](/encoder/columnar/learn), grid by
  grid
- [Break a Columnar transposition without the key](/encoder/columnar/cryptanalysis)
- [The history of Columnar transposition](/encoder/columnar/history),
  from the trenches to the SOE poem codes
- [Columnar transposition practice challenges](/encoder/columnar/practice)
