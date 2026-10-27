# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}.
2. Pick a short primer and enter it in {{control:key}} — four to six
   letters is typical.
3. Check the mode: the swap button {{control:swap}} toggles between
   encrypt and decrypt. The header shows the current mode.
4. Read the encrypted result in {{control:output}}. Only letters are
   encrypted; spaces and punctuation are dropped.
5. Look at the keystream row under the controls: the highlighted letters
   are your {{term:primer}}, and every letter after them is your own
   message coming back as key.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}}.
2. Enter the primer the sender used in {{control:key}} — you need the
   exact same primer that encrypted the message.
3. Press the swap button {{control:swap}} to switch to decrypt mode.
4. Read the original message in {{control:output}}. The keystream row
   regrows itself from the recovered plaintext.

## Break a message without the key

1. Open the Cryptoanalysis tab. The guided cracker works by
   {{term:crib}} dragging — guessing a word and letting the cipher's own
   key trick unravel the message.
2. Step 1 — guess a word that likely appears in the plaintext (type it
   into {{control:crib-input}}; the challenge hints suggest one) and set
   the primer length in {{control:primer-length}}. A crib at least as
   long as the primer reveals everything; a shorter one leaves a few
   letters for you.
3. Step 2 — drag the word along the text in {{control:offset-list}}. At
   each position the cipher implies a key fragment — in autokey that
   fragment is earlier plaintext, so the readable positions are the
   right ones.
4. Step 3 — the placement unrolls: the plaintext chains propagate in
   both directions in {{control:unroll-worksheet}}, and the primer
   appears at the start. Type any remaining letters in
   {{control:primer-fill}}.
5. Step 4 — check the assembled primer, then press
   {{control:use-this-key}}. The tool decrypts the message with it.
