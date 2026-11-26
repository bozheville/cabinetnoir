# How to decode Base64

Decoding Base64 needs no key and no settings. Every 4 characters turn
back into 3 bytes, and the tool shows those bytes as text. A typo
garbles only the letters around it. A character outside the alphabet
stops the decoding.

## Using the decode tool

- Paste the Base64 string into {{control:message-input}}; the decoded
  text appears in {{control:output}}.
- Case matters. `T` and `t` are different values, so a string retyped
  in lower case decodes to nonsense.
- Spaces and line breaks inside the string are ignored. Missing `=`
  padding at the end is fine too.
- Decoding fails on a character outside `A–Z a–z 0–9 + /`, or on a
  wrong padding count, such as one `=` where two belong.
- Each byte comes out as one Latin character. Text that held Cyrillic
  or emoji turns into odd letters such as `Ð` and `Ñ`.
- To encode a reply, switch back with {{control:swap}}.

## A quick example

`TUVFVEFUTk9PTg==` gives `MEETATNOON`. The first 4 characters, `TUVF`,
become the first 3 letters, `MEE`.

A typo stays local. Change the `P` near the end to `O`, and
`TUVFVEFUTk9OTg==` gives `MEETATNONN`. Only one letter is wrong: the
ninth letter, an O, has turned into N.

## Not sure it is Base64?

There is no key to find. If a string decodes cleanly, you have read
it.

- [Identify an unknown cipher](/identify) if the string might be
  something else
- [How Base64 works](/encoder/base64/learn), bit by bit
- [The history of Base64](/encoder/base64/history), from early email
  to the web
- [Base64 practice challenges](/encoder/base64/practice) to decode
