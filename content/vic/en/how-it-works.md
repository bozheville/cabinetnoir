# How the VIC cipher works

## The idea in one sentence

Four small secrets — a phrase, a date, a personal number and a fresh
five-digit keygroup — are stretched through mod-10 arithmetic into a
{{term:straddling-checkerboard}} and two {{term:transposition}} keys,
so one message costs the cryptanalyst a substitution he cannot see,
two transpositions he cannot undo, and a key that never repeats.

## The five stages

1. **The key schedule.** The keygroup minus the date's five digits
   (no borrow) starts a {{term:chain-addition}} line; the phrase's
   twenty letters are {{term:sequencing}}-ranked and mixed in; out of
   the arithmetic fall Line Q and Line R — the two transposition
   tableaus — and Line S, the checkerboard's mixed digit header.
   Turn on **Show the key workings** in the tool and watch every line
   appear; the tooltips name each operation, Kahn's A through S.
2. **The checkerboard.** A mnemonic (`AT ONE SIR`) sits on top of the
   Line S digits: eight frequent letters take one digit each, the two
   blank cells become row labels for the rest of the alphabet below.
   Every other letter, the period and the number-shift `/` straddle
   two digits. Digits travel inside a `/…/` pair, written three times
   each.
3. **The first tableau.** The digit stream is written into a grid
   `a` columns wide (Line Q's width comes from the personal number)
   and read out column by column in Line Q's rank order.
4. **The disrupted tableau.** A second transposition, `b` columns
   wide, whose grid carries triangular *disruption* areas — filled
   last, after every ordinary cell. The triangles break exactly the
   column regularity an anagrammer needs.
5. **The keygroup.** The digits are cut into five-figure groups and
   the keygroup is inserted a date-chosen number of groups from the
   end. It travels with the message — which is safe, because alone it
   seeds everything and reveals nothing.

## A worked example

{{example:vic-basic}}

The Wikipedia example's secrets, the whole schedule from keygroup to
checkerboard header. Line S `5961328470` heads the board; the blanks
over `6` and `8` label the straddled rows.

{{try:vic-basic}}

## Decryption

Run the same schedule from the three remembered secrets, but first
lift the keygroup out of its date-chosen position — the message tells
you its own seed. Then undo both transpositions (the disrupted one
last-in-first-out), read the checkerboard back, and undo the optional
bisection at the agreed cut. The trailing `X`s were padding; the
message ends where they begin.

## The tells — and why there are none

A Nihilist stream betrays its key's period; a columnar transposition
betrays its column counts; a checkerboard's digits betray nothing,
because they are one-time-pad-flat: the keygroup is fresh every
message, so the whole schedule is fresh every message. That is the
cipher's whole secret, and the reason the next page is a history
lesson instead of a cracker.
