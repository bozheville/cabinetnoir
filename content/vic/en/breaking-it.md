# Breaking the VIC cipher

Nobody ever broke the VIC cipher by cryptanalysis. The message that
made it famous lay unread in an FBI safe from 1953 to 1957 — ten
columns of five-figure groups on a scrap of microfilm — and it opened
only when Reino Häyhänen, the spy it was addressed to, defected and
taught the FBI his own keys. This page explains why the attempts
failed, and what it would cost today.

{{challenge:vic-easy-1}}

## Why the FBI and NSA could not read it

A cryptanalyst attacks structure: a repeating key's period, a grid's
column counts, a square's coordinate range. VIC has none on offer.

1. **No repetition.** The keygroup is fresh for every message, and
   every line of the schedule grows out of it — so the entire key,
   checkerboard included, is new each time. There is no period to
   find, ever.
2. **No visible layer.** The checkerboard's digit stream is
   statistically flat — frequent and rare letters no longer differ in
   digit frequency the way letters differ in letter frequency.
3. **Compound locks.** Even granted the substitution, the analyst
   faces two transpositions in a row, the second one disrupted, whose
   widths come from digits he does not have. Each solved layer still
   leaves the message sealed; the layers do not even have the same
   length.
4. **A drop of one-time pad.** Line G is an addition of a message-key
   derivative into the checkerboard header — a small but genuine
   running-key component, forty years after Mauborgne's idea.

Kahn's verdict in "Number One From Moscow": not theoretically
insoluble, but effectually unbreakable without prior knowledge of the
system and on the basis of a single message.

## How it actually fell

Not to mathematics — to a man. In 1957 Häyhänen, the Soviet illegal
who had carried the hollow nickel message, grew disaffected, was
recalled to Moscow, and chose Washington instead. He reconstructed
the system for the FBI from memory, unlocking the 1953 message and
unmasking his own handler — Colonel Rudolf Abel, arrested in a
Brooklyn hotel the same year. The cipher's lesson is the oldest one in
the book: the strongest link in a cipher system is its people.

## What it costs today

Brute force finally has a price tag, if not a bargain. The unknown
secrets after the system is known are Line H's ten digits (guarded by
the phrase and the date, about 10^34 permutations of the line itself
in the worst case) plus the tableau widths' personal number — with a
modern computer, a determined attacker can search the plausible
phrase-and-date space of a *known* correspondence in hours to weeks.
But that assumes the system is known, the message is identified, and
the secrets are guessable — all three of which failed in 1953. As a
hand cipher between two careful people, VIC remains a practical
unbreakable.

## Why there is no cracker in this tool

Every cracker on this site walks a structural weakness — a period, a
grid, a constraint. VIC's design goal was to have none, and it
succeeded: a wizard would have nothing to measure. The tool gives you
the other side of the story instead — the key workings panel, where
you can watch the system do exactly what the FBI could not undo.

## The verdict

VIC closed the pencil-and-paper era at its highest point: security
from information-theoretic flatness and operational discipline rather
than computational difficulty. It was never cracked; it was
surrendered.
