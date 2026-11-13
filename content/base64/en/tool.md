# About Base64

Base64 is an {{term:encoding}}, not a cipher: it turns bytes into a
string of 64 safe characters so that binary data can travel through
email, URLs, JSON or HTML without being damaged. It has no key, so
anyone can decode it — it hides nothing.

## How to use this tool

- Type or paste text into {{control:message-input}}; the encoded string
  appears in {{control:output}}.
- There are no settings. The alphabet is always `A–Z a–z 0–9 + /`,
  with one or two `=` signs padding the end.
- Spaces, digits and punctuation are encoded too — nothing is dropped.
  Plain Latin text works best: characters such as Cyrillic or emoji
  are outside what this tool encodes.
- Press {{control:swap}} to decode. If decoding fails,
  look for characters outside the alphabet, missing `=` padding, or
  whitespace picked up while copying.

## A quick example

`MEETATNOON` becomes `TUVFVEFUTk9PTg==`. Every 3 input bytes become 4
output characters; the last chunk holds a single byte, hence the two
`=` signs.

## Go further

A string whose length is a multiple of 4, made only of letters,
digits, `+` and `/`, ending in `=` or `==`, is almost certainly Base64.

- [How Base64 works](/encoder/base64/learn), bit by bit
- [The history of Base64](/encoder/base64/history), from early email
  to the web
- [Base64 practice challenges](/encoder/base64/practice)
