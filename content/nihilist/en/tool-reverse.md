# How to decrypt the Nihilist cipher

To decrypt a Nihilist message you need both keys: the square and the
key word. The tool turns the key word into numbers and subtracts them
from the ciphertext, digit by digit. What is left are plain
[Polybius square](/encoder/polybius/learn) coordinates, which the
square turns back into letters. A wrong key word gives wrong letters,
or none at all.

## Using the decrypt tool

- Paste the numbers into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Leave the Square key field empty for the plain A–Z square, or type
  the sender's keyword.
- Enter the {{term:additive-key}} in the Key word field. Without it
  there is no output.
- Spaces between the numbers help but are not required. Without them
  the tool splits the digits into valid sums by itself.
- J was folded into I before encryption, so it comes back as I.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`53 89 87 54 37 36 53 89 57 54 76 44` with the key `RUSSIA` gives
`ATTACKATDAWN`. The first number is 53 and R is 42. Digit by digit,
5 − 4 = 1 and 3 − 2 = 1, so 11, which is A.

A wrong key word shows itself in two ways. `RUSSKA` differs only in its
fifth letter, and gives `ATTABKATDAVN`: letters 5 and 11 are off. With
`RUSSIAN` some subtractions fall outside the square. The tool drops
those numbers, and only `ATTACKBAN` is left.

## No key?

- [Break a Nihilist cipher without the key](/encoder/nihilist/cryptanalysis):
  find the key length, pin each key number, then rebuild the square
- [How the Nihilist cipher works](/encoder/nihilist/learn), with the
  addition table
- [The history of the Nihilist cipher](/encoder/nihilist/history)
- [Nihilist cipher practice challenges](/encoder/nihilist/practice) to
  decrypt
- [Identify an unknown cipher](/identify) if you are not sure the
  numbers are Nihilist sums
