# How to decrypt the Keyword cipher

To decrypt a Keyword message you need the keyword, or the full cipher
alphabet built from it. Decryption reads the two alphabets the other
way round: find the cipher letter in the lower strip, take the letter
above it. A wrong keyword builds a different alphabet, so some letters
or all of them come out wrong.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Enter the keyword in {{control:keyword-input}}. Case does not matter:
  `kryptos` and `KRYPTOS` give the same result.
- Tick {{control:free-alphabet-toggle}} if you have the whole cipher
  alphabet instead of a keyword. "Use this result" on the cryptanalysis
  tab fills it in for you.
- Tick {{control:continuation-toggle}} only if the sender continued the
  alphabet from the keyword's last letter.
- Check {{control:alphabet-strip}}: on decrypt, you read it from the
  bottom row up.
- Spaces and capitals always stay; digits and punctuation are dropped.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`KNNKYDKNPKVG` with the keyword `KRYPTOS` gives `ATTACKATDAWN`. K sits
under A in the strip, and N sits under T.

A near miss shows exactly which letters it touches. `KRYPTON` gives
`AGGACKAGDAWN`: only the Ts are wrong, because N now sits under a
different plain letter. The right keyword with
{{control:continuation-toggle}} ticked gives `AYYACPAYDAIS`.

## No key?

- [Break a Keyword cipher without the key](/encoder/keyword/cryptanalysis):
  rebuild the alphabet letter by letter with {{term:frequency-analysis}}
- [How the Keyword cipher works](/encoder/keyword/learn), with the two
  alphabet strips
- [The history of the Keyword cipher](/encoder/keyword/history), and
  how Mary, Queen of Scots, lost to letter counts
- [Keyword cipher practice challenges](/encoder/keyword/practice) to
  decrypt
