# About the VIC cipher

The VIC cipher is a Soviet hand cipher from the Cold War. KGB spies
used it in the 1950s to send messages as groups of five digits. The
FBI found one such message in a hollow nickel in 1953 and could not
read it for four years. It is often called the strongest cipher ever
worked with pencil and paper.

You need four small secrets to use it: a phrase, a date, a personal
number and a random five-digit {{term:keygroup}}. Simple arithmetic
turns them into a {{term:straddling-checkerboard}}, which changes
letters into digits, and two {{term:transposition}} keys, which shuffle
those digits.

## How to use this tool

- Type your message into {{control:message-input}}. The five-digit
  groups appear in {{control:output}}.
- Fill in the four secrets:
  - **Phrase**: any sentence with at least 20 letters.
  - **Date**: day, month and year, for example `13/9/1959`.
  - **Personal №**: a number from 1 to 20.
  - **Keygroup**: five digits. Press **Roll a fresh keygroup** to get
    new ones. Use a new keygroup for every message, as real agents
    did.
- **Alphabet** switches between a Latin board (`AT ONE SIR`) and a
  Cyrillic one (`СНЕГОПА`, the board Häyhänen used).
- Turn on **Show the key workings** to see every step of the key
  calculation: the worksheet lines A to S, the checkerboard and the
  width of both tables. Each line has a tooltip.
- **Bisect the message** is optional. The tool cuts your message at
  the position in **Cut at** and swaps the two halves before encrypting.
  The person you write to must know that number too. Leave it off for
  your first try.
- Letters, digits and full stops are kept. Everything else is dropped.
  Each digit is written three times between two number signs, so
  `0500` becomes 12 digits plus the signs.
- The tool may add up to six `X` letters at the end, so the digit count
  divides by five. When you decrypt, just ignore them.
- To decrypt, press {{control:swap}}, paste the groups and enter the
  phrase, date and personal number. You do not type the keygroup: the
  tool finds it inside the message.

## A quick example

Take the message `ATTACKATDAWN. BY DAWN I MEAN 0500.` and these
secrets: the phrase *Twas the night before Christmas*, the date
`13/9/1959`, personal number `6` and keygroup `72401`.

The checkerboard first turns the text into digits:
`599569645966583387658866583376025380000555000000808782828282`. Then
two transpositions mix them up. The result has 13 groups, and the
keygroup `72401` sits among them, five groups from the end:

`36468 87820 86582 86639 59530 50098 00052 72401 86536 78885 50052
75803 60092`

## Go further

- [How the VIC cipher works](/encoder/vic/learn): the key calculation,
  line by line
- [Step-by-step VIC guides](/encoder/vic/learn#guides): encrypt and
  decrypt your first message
- [Breaking the VIC cipher](/encoder/vic/learn#breaking-it): why the
  FBI could not read it
- [History of the VIC cipher](/encoder/vic/history): the hollow
  nickel, the spy who defected and the arrest of Rudolf Abel
- [VIC cipher challenges](/encoder/vic/practice): decrypt real
  messages yourself
