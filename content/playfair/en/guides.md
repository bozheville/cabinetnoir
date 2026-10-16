# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}.
2. Enter a keyword in {{control:key}} — short and memorable, like
   SHADOW. The keyword deduplicates and seeds the square.
3. Read the encrypted pairs in {{control:output}} — the tool joins
   them with spaces, and those spaces are decorative: decrypting
   ignores them.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}} — with or
   without the spaces between pairs, both work — and press the swap
   button {{control:swap}}.
2. Enter exactly the keyword the sender used in {{control:key}}. The
   square is the whole key: a wrong keyword produces a different
   square and pure noise.
3. Read the plaintext in {{control:output}}. Watch for the two
   artefacts: an I may stand where a J was written, and an X may be
   a filler rather than a letter.

## Attack a Playfair message by hand

1. Count the letters. Playfair needs volume — its digraph statistics
   only wake up over a few hundred letters.
2. If the key is known or guessable (a name, a unit, a codeword),
   simply build the square and decrypt — see the guides above.
3. If not, this is textbook digraph frequency analysis: TH, HE, AN,
   RE, ER and ON dominate English pairs, and each guessed digraph
   placement in the square constrains many others. That attack is
   powerful but patient — the practice tab's challenges all hand you
   the keyword instead.
