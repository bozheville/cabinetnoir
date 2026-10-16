# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}.
2. Drag the rotation slider {{control:key}} to choose the shift — a
   shift of 3 is the classic choice.
3. Decide about the two checkboxes: {{control:keep-spaces}} preserves
   the word layout and {{control:keep-case}} preserves capital letters.
   The tool drops everything else.
4. Read the encrypted result in {{control:output}}.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}}.
2. Press the swap button {{control:swap}} to switch to decrypt mode.
3. Set the rotation slider {{control:key}} to the shift the sender
   used — you need the exact same number.
4. Read the original message in {{control:output}}.

## Break a message without the key

A shift is a number between 1 and 25, so a {{term:brute-force}} attack
needs at most 25 tries — and usually far fewer:

1. Paste the cryptogram into {{control:message-input}} and switch to
   decrypt mode with {{control:swap}}.
2. Slide the rotation {{control:key}} through the values and watch
   {{control:output}}: nonsense, nonsense… until a readable word
   suddenly appears.
3. If walking through all shifts feels like cheating, use the smarter
   way: {{term:frequency-analysis}}. Find the most frequent ciphertext
   letter (often the encrypted E), measure its distance from E, set
   that as the shift and read one sentence to check.
