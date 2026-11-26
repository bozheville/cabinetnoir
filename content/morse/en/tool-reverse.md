# How to decode Morse code

Decoding Morse code needs no key: the tool looks each pattern up in
the international (ITU) table. What matters is the gaps. One space
ends a letter and a slash ends a word. A missing or extra gap gives
you different letters, not an error.

## Using the decode tool

- Paste the Morse into {{control:message-input}}; the letters appear
  in {{control:output}} in capitals.
- The dot and dash selectors are gone in this mode. Any of `.`, `*`
  and `•` reads as a dot, and any of `-`, `_` and `~` as a dash.
- Put one space between letters and a slash `/` between words. The
  spaces around the slash are optional.
- A pattern that is not in the table is dropped without a warning.
  Letters keyed without gaps merge into one long pattern, which reads
  as another letter or is dropped.
- To encode a reply, switch back with {{control:swap}}.

## A quick example

`-- • • - / -- •` gives `MEET ME`, and `••• --- •••` gives `SOS`.
`-- . . - / -- .`, typed with plain full stops, gives `MEET ME` too.

The gaps carry as much meaning as the signals. Drop the space between
the two Es, and `-- •• - / -- •` gives `MIT ME`: two dots in a row
are I. Replace the slash with a double space, and the words run
together as `MEETME`.

## Not sure it is Morse code?

There is no key to find. Once the gaps are right, the message is
read.

- [Identify an unknown cipher](/identify) if the dots and dashes might
  stand for something else
- [How Morse code works](/encoder/morse/learn): timing, gaps and the
  full table
- [The history of Morse code](/encoder/morse/history), from Samuel
  Morse to SOS
- [Morse code practice challenges](/encoder/morse/practice) to decode
