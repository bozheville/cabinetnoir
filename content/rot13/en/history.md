# History of ROT13

## Born on Usenet

ROT13 was never invented by a cryptographer — it evolved on the
early internet. In the 1980s, the Usenet discussion system needed a
way to post potentially offensive jokes and film or book spoilers
without ruining them for scrolling readers: the text should be
present but not accidentally readable. A fixed Caesar shift of 13
was the obvious answer, and the newsgroup `net.jokes` made it a
convention.

## Why 13 and not 3

Two reasons, both practical. First, 13 is self-inverse — the same
procedure hides and reveals, which meant readers could use one
command (or one glance at a printed wheel) for both directions.
Second, 13 moves every letter off its original: with an even
alphabet, only the half-turn pairs every letter with a different
partner, so no letter betrays itself by staying put.

## A tool, not a secret

Through the 1980s and 1990s ROT13 became part of netiquette: spoiler
warnings, puzzle hints, punchlines, even answers to quiz posts. Unix
grew a `rot13` command; newsreaders built it in. Security
professionals cite it as the canonical example that *obfuscation is
not encryption* — and puzzle-setters keep it canon for exactly the
same reason.

## Still turning

Decades later the wheel keeps spinning: certificate transparency
logs hide hostnames in ROT13, geocaching puzzles use it, and every
new programmer writes their own ROT13 as an early exercise. The
oldest joke-hider on the internet is also the longest-lived.

{{timeline:rot13}}
