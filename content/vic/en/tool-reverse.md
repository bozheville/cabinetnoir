# How to decrypt the VIC cipher

To decrypt a VIC message you need three of the four secrets: the
phrase, the date and the personal number. The fourth, the
{{term:keygroup}}, travels inside the message, and the tool finds it
by itself. From these it rebuilds the same key, undoes both
transpositions and reads the digits back off the checkerboard. One
wrong secret gives a jumble of letters and digits.

## Using the decrypt tool

- Paste the five-digit groups into {{control:message-input}}; the
  plaintext appears in {{control:output}}. Spaces between groups are
  optional, but the digit count must divide by five.
- Fill in **Phrase**, **Date** and **Personal №** exactly as the
  sender did.
- **Keygroup** is greyed out. It shows the five digits the tool read
  from the message, using the date's sixth digit to find them.
- Set **Alphabet** to the sender's board. If the sender used
  **Bisect the message**, turn it on with the same **Cut at** number.
- Full stops and digits come back, spaces do not. Up to six `X`
  fillers may sit at the end; ignore them.
- **Show the key workings** displays the same worksheet lines A to S
  as on the encrypt page.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

Paste the 13 groups from the encrypt page:

`36468 87820 86582 86639 59530 50098 00052 72401 86536 78885 50052
75803 60092`

Enter the phrase *Twas the night before Christmas*, the date
`13/9/1959` and personal number `6`. The tool finds the keygroup
`72401` and gives `ATTACKATDAWN.BYDAWNIMEAN0500.XXXX`.

Change only the personal number to `7`, and the output becomes
`R.APBJRRL98550ASRTMJELRRRENGTPNCE`. A new key comes out of the
worksheet, and nothing readable survives.

## No key?

Nobody ever broke VIC by codebreaking, so this site has no VIC
cracker. The FBI read the hollow nickel message only in 1957. That
year Reino Häyhänen, the spy it was written for, defected and handed
over his secrets.

- [Breaking the VIC cipher](/encoder/vic/learn#breaking-it): why the
  FBI could not read it
- [Step-by-step VIC guides](/encoder/vic/learn#guides): encrypt and
  decrypt your first message
- [How the VIC cipher works](/encoder/vic/learn): the key calculation,
  line by line
- [History of the VIC cipher](/encoder/vic/history): the hollow
  nickel, the spy who defected and the arrest of Rudolf Abel
- [VIC cipher challenges](/encoder/vic/practice): decrypt real
  messages yourself
