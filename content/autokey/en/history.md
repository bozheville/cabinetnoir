# History of the autokey cipher

## Bellaso's idea, 1553

In 1553 Giovan Battista Bellaso published the cipher the world later
renamed after Vigenère: a keyword-agreed table of mixed alphabets with
an easy-to-remember key phrase. Bellaso also proposed a stronger trick —
using the message itself to continue the key. That variant is the
earliest known autokey: the key that never repeats, because it grows
with the text it encrypts.

## Vigenère's version, 1586

In 1586 Blaise de Vigenère described an autokey construction in his
*Traicté des chiffres*: a priming letter starts the keystream and the
plaintext itself extends it. History's joke is that the cipher carrying
Vigenère's name — the simple repeating-key scheme — is *not* the one he
described; the one he described (the autokey) carries no name at all.
See the Vigenère history page for the full misattribution story.

## Why it did not conquer the world

The autokey is genuinely stronger against the period-finding attacks
that killed the repeating-key scheme — but it is brittle in field use.
Every transmission error corrupts the key from that point on, the
sender and receiver must stay in perfect step, and a single guessed
word unravels the message from the inside. Nineteenth-century
diplomats and armies mostly preferred systems that degraded gracefully.

## The afterlife

The idea refused to die. Keystreams fed by the message (or by the
ciphertext, in the related *ciphertext autokey* form) resurfaced in
machine cryptography and in modern stream cipher design — the general
principle that the key stream should be unpredictable and never repeat
is exactly what Bellaso stumbled on in 1553, four centuries early.

{{timeline:autokey}}
