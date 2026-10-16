# How Morse code works

## An encoding, not a cipher

Morse code is the classic example of what this site calls an
{{term:encoding}}: every letter becomes a public pattern, and anyone
can undo it — there is no key and no secret. Its purpose is
*transmission*, not secrecy: a message had to survive a wire that
could only switch between a click and a silence.

## The idea in one sentence

Each letter of the alphabet becomes a short pattern of two signal
lengths — the {{term:dot}} (short) and the {{term:dash}} (long, three
dots long) — and the pattern is chosen so that common letters stay
short.

## The recipe

1. Look the letter up in the table: E, the commonest English letter,
   gets a single dot; T a single dash; Z gets four symbols.
2. Send the pattern, then pause one unit to separate letters.
3. Between words, pause longer — in written Morse, that gap is the
   slash: `... --- ...` are three letters, `.../---/...` is a word
   boundary.
4. Digits each get their own five-symbol pattern.

## A worked example

{{example:morse-basic}}

SOS is famous precisely because it is so cheap to send: three dots,
three dashes, three dots — with the letter gaps carrying the rhythm.

## The tool's conventions

The tool writes letters with a single space between them and a slash
between words, exactly as above. The two selectors pick which
characters play dot and dash — the encoding is the same, only the
ink changes. In decrypt mode the tool is forgiving: `.`, `*` and `•`
all read as dots, `-`, `_` and `~` all read as dashes, so you can
paste Morse from any source.

## Why the table is shaped like that

The letter lengths are not arbitrary — they are an 1840s frequency
analysis. Vail counted letters in a printer's type case and gave the
commonest letters the shortest patterns: E is one dot, T one dash,
while Q and Z pay four symbols. A message in ordinary English simply
takes less airtime. It is the same statistical insight that later
powers {{term:frequency-analysis}} — pointed at the wire instead of
the cryptogram.
