# Breaking the Caesar cipher

The Caesar cipher is trivially breakable, and it is worth understanding
why: it fails not because of bad arithmetic but because it keeps too
much structure. Both classic attacks below need nothing more than the
tool.

{{challenge:caesar-demo}}

## The flaw: one shift for everything

Every letter hides behind the same {{term:shift}}. Whatever the
plaintext statistics were, the {{term:ciphertext}} keeps them — just
wearing different letters. The most common letter of the message is
still the most common letter, only shifted; the rhythm of repeated
words is still there. A single substitution preserves everything about
the text except which letters it uses.

## Attack 1 — brute force

There are only 25 possible shifts (26 if you count "no encryption").
Work through them:

1. Switch the tool to decrypt mode with {{control:swap}} and paste the
   cryptogram into {{control:message-input}}.
2. Drag the rotation {{control:key}} from 1 to 25 and read
   {{control:output}} each time.
3. The readable fragment appears exactly once — when the rotation
   matches the sender's shift. A human eye finishes the job from there.

A {{term:brute-force}} attack needs no statistics at all, which is why
any modern cipher must have a key space far too large to walk through.

## Attack 2 — frequency analysis

{{term:frequency-analysis}} skips the guessing: count the letters of
the ciphertext and compare the counts with the language's known
profile.

- In English, E is the most frequent letter — about 12% of a long text
  — followed by T, A, O, I and N.
- Find the most frequent ciphertext letter; its distance from E is the
  most likely shift.
- Decrypt with that shift and read. If the text is short and stubborn,
  try the distance to T instead.

Frequency analysis was described by the Arab polymath Al-Kindi in the
9th century, and it breaks every single-alphabet substitution cipher —
Caesar is just the simplest of them.

## Where the idea survives

Caesar's failure taught cryptographers the first great lesson: the key
must change the text irregularly. Later ciphers kept the shifting idea
but made the shift vary letter by letter — the Vigenère cipher is
literally "many Caesars", one per key letter, and the
{{term:frequency-analysis}} attack above stops working on it until you
first recover its key length.
