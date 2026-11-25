# How the VIC cipher works

## The idea in short

The VIC cipher turns four small secrets into one large key. The
secrets are a phrase, a date, a personal number and a random
five-digit {{term:keygroup}}. From them, simple arithmetic builds a
{{term:straddling-checkerboard}} and two {{term:transposition}} keys.

The checkerboard changes letters into digits. The two transpositions
then shuffle those digits twice. Because the keygroup is new for every
message, the whole key is new for every message too.

## The five stages

1. **Build the key.** This is the long part, done on a worksheet with
   lines named A to S (David Kahn's names).
   - Subtract the first five digits of the date from the keygroup,
     digit by digit, without borrowing (line C).
   - Stretch the result to ten digits with {{term:chain-addition}}:
     each new digit is the sum of two neighbours, keeping only the
     last digit (line F1).
   - Take the first 20 letters of the phrase. Number each half in
     alphabetical order. This is called {{term:sequencing}} (lines E1
     and E2).
   - Mix these lines together (lines G and H), then chain-add 50 more
     digits (lines K to P).
   - From this block you read three keys: line Q for the first table,
     line R for the second table and line S for the checkerboard.

   Turn on **Show the key workings** in the tool to watch every line
   appear. Each one has a tooltip that says how it was made.
2. **Change letters into digits.** The checkerboard has a top row of
   eight common letters, `AT ONE SIR` on the Latin board. Each of them
   becomes one digit. The two empty cells in that row label two more
   rows, which hold every other letter, the full stop and a number
   sign `/`. Those take two digits each. Numbers go between two `/`
   signs, and each digit is written three times.
3. **Shuffle the digits, first time.** Write the digits in rows under
   line Q, one digit per column. Then read them out column by column,
   in the order of line Q's numbers. The width of the table comes from
   the personal number.
4. **Shuffle again, with traps.** Do the same with line R, but in a
   {{term:disrupted-transposition}}. Some cells form triangles that
   are filled only at the end. These triangles break the regular
   column pattern that a codebreaker would look for.
5. **Hide the keygroup.** Cut the digits into groups of five. Then
   insert the keygroup into the message. The sixth digit of the date
   says where: that many groups from the end. The keygroup travels
   in the open, but without the other three secrets it is useless.

## A worked example

{{example:vic-basic}}

These are the secrets from the Wikipedia example: the phrase *Twas
the night before Christmas*, the date `13/9/1959`, personal number `6`
and keygroup `72401`. The table shows each worksheet line, from the
keygroup down to line S, `5961328470`. Line S becomes the header of
the checkerboard. The empty cells sit above `6` and `8`, so those two
digits label the lower rows.

The two tables are 13 and 6 columns wide. The date's digits are
`1391959`, so the sixth digit is `5`: the keygroup goes five groups
from the end.

{{try:vic-basic}}

## How decryption works

The receiver knows the phrase, the date and the personal number. The
date's sixth digit tells them where the keygroup sits, so they lift it
out of the message first. With all four secrets, they rebuild the same
worksheet.

Then they undo each stage in reverse order: the second table, the
first table, and finally the checkerboard. If the message was
bisected, they swap the halves back. Any `X` letters at the end are
filler and can be dropped.

## Why the ciphertext gives nothing away

Most classical ciphers leave a trace. A repeating key shows up as a
pattern every few letters. A single transposition keeps the letter
counts of the language. The VIC cipher hides both.

The checkerboard turns letters into digits of different lengths, so
letter counts blur. Two transpositions in a row, one with traps, wipe
out the order. And because every message has its own keygroup, no two
messages share a key. A codebreaker has nothing to compare. That is
why this site has no VIC cracker.
