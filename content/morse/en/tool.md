# About Morse code

Morse code writes each letter and digit as a short pattern of
{{term:dot}}s and {{term:dash}}es. It was built for the telegraph in
the 1830s and 1840s and is still keyed by radio amateurs today. It is an {{term:encoding}}, not a cipher: the table is
public and there is no key. This tool follows the international (ITU)
alphabet.

## How to use this tool

- Type your text into {{control:message-input}}; the Morse appears in
  {{control:output}}. Letters are separated by a space and words by a
  slash `/`.
- Letters A–Z and digits 0–9 are encoded. Punctuation and accented
  letters are dropped.
- Pick the characters drawn for the dot and the dash with
  {{control:dot-symbol}} and {{control:dash-symbol}} — the patterns do
  not change.
- Press {{control:swap}} to decode. Keep one space
  between letters and a slash between words; the common dot and dash
  characters are all accepted.

## A quick example

`SOS` becomes `••• --- •••`: three dots, three dashes, three dots.
`MEET ME` becomes `-- • • - / -- •` — note the slash between the
words.

## Go further

The commonest letters get the shortest patterns: E is a single dot,
T a single dash.

- [How Morse code works](/encoder/morse/learn): timing, gaps and the
  full table
- [The history of Morse code](/encoder/morse/history), from Samuel
  Morse to SOS
- [Morse code practice challenges](/encoder/morse/practice)
