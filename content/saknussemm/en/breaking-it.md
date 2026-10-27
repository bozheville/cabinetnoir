# Breaking the Saknussemm cipher

Saknussemm looks impenetrable — backwards Latin in runic clusters —
and is in fact the easiest transposition on this site to break,
because the key space is two small numbers.

## The flaw: a pure transposition

The cipher never substitutes a single letter: the {{term:ciphertext}}
is always an anagram of the {{term:plaintext}}. The only secrets are
the reading direction (backwards — but Axel's suggestion is the first
thing any solver tries) and the shape (letters per cluster, clusters
per line). Both live in a tiny space: a dozen plausible values each,
searchable by hand in minutes.

## Attack — anagram the grid

1. **Count the letters.** If every letter of the language appears
   with its normal frequency, no substitution is at work — profile
   first, transposition second. On the site, /identify reports
   exactly this.
2. **Read it backwards.** Reverse the whole letter stream; for Latin
   — or any text — the ending often shows a signature or a keyword,
   which anchors the direction.
3. **Sweep the shape.** Reverse the stream, then try cluster counts
   that divide the text into even lines: the parchment prints 21
   clusters, so 7 letters per cluster and 3 per line. The right shape
   is the one whose clusters, read side by side, spell reversed
   Latin.
4. **Watch the tell.** Correctly assembled rows read like language;
   a near-miss shape produces noise. There is no key to recover
   beyond the shape — once the rows read, the message is broken.

## The one challenge

{{challenge:saknussemm-parchment}}

## Why there is no cracker here

The guided crackers on this site search key spaces worth guiding
through — alphabets, discs, column permutations. Saknussemm's whole
key space is a pair of small integers you can sweep by hand with the
shape pickers, and its single practice challenge is a text every
reader of the novel already owns. A cracker would only automate the
sweep; the parchment deserves the hand-work.

## What Saknussemm teaches

Verne's professor keeps the runes secret for weeks and falls to the
simplest trick in the book: reading backwards. The cipher is a lesson
in humility — security that rests on the adversary not trying the
second obvious thing is not security at all.
