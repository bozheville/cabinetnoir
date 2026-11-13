# About the Keyword cipher

The Keyword cipher is a simple {{term:substitution}} whose cipher
alphabet is built from a word: write the keyword without repeated
letters, then the rest of the alphabet in order. Every plaintext letter
always maps to the same cipher letter. It is easy to remember and
share, but like every fixed alphabet it falls to
{{term:frequency-analysis}} — the lesson of Mary, Queen of Scots, in
1586.

## How to use this tool

- Type or paste your text into {{control:message-input}}; the result
  appears in {{control:output}}.
- Enter the keyword in {{control:keyword-input}}. Below it,
  {{control:alphabet-strip}} shows the plain alphabet on top and the cipher alphabet below it.
- Tick {{control:continuation-toggle}} to continue the alphabet from the
  keyword's last letter instead of from A.
- Tick {{control:free-alphabet-toggle}} to type any 26-letter alphabet
  directly; the tool checks that each letter appears once.
- Tick {{control:keep-spaces}} or {{control:keep-case}} to preserve
  word breaks and capitals. Digits and punctuation are dropped.
- Press {{control:swap}} to decrypt with the same keyword.

## A quick example

With the keyword `KRYPTOS` the cipher alphabet starts
`KRYPTOSABCDEF…`, so `ATTACKATDAWN` becomes `KNNKYDKNPKVG`. Every A is
K and every T is N — exactly the repetition a codebreaker counts.

## Go further

- [How the Keyword cipher works](/encoder/keyword/learn), with the two
  alphabet strips
- [Break a Keyword cipher without the key](/encoder/keyword/cryptanalysis)
  with frequency analysis
- [The history of the Keyword cipher](/encoder/keyword/history), from
  the cipher manuals to the Babington plot
- [Keyword cipher practice challenges](/encoder/keyword/practice)
