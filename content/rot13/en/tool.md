# About ROT13

ROT13 is a [Caesar cipher](/encoder/caesar/learn) with a fixed shift of 13. Because the Latin
{{term:alphabet}} has 26 letters, shifting by 13 twice brings every
letter back: the same operation both encodes and decodes. Usenet
groups used it to hide spoilers and punchlines — it protects against a
casual glance, never against a reader who wants to know.

## How to use this tool

- Type or paste text into {{control:message-input}}; the result
  appears in {{control:output}} as you type.
- There is no key and no setting: the shift is always 13 and the
  alphabet is always A–Z.
- Spaces, punctuation, digits and capitals are kept exactly as they
  are; only Latin letters change. Accented and non-Latin letters pass
  through untouched.
- Pressing {{control:swap}} changes nothing but the label: encoding
  and decoding give the same result.

## A quick example

`HELLOWORLD` becomes `URYYBJBEYQ`. H moves 13 places to U, E to R, and
running `URYYBJBEYQ` through the tool again gives `HELLOWORLD` back.

## Go further

ROT13 has exactly one key, so it offers no protection at all: anyone
who recognises it can read it. A text full of `gur` and `naq` (`the`
and `and`) is a giveaway.

- [How ROT13 works](/encoder/rot13/learn), and why 13 is special
- [The history of ROT13](/encoder/rot13/history), from Usenet to
  geocaching puzzles
- [ROT13 practice challenges](/encoder/rot13/practice)
