# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}.
2. Pick any word as the secret and enter it in {{control:key}} — longer
   keys are harder to break.
3. Check the mode: the swap button {{control:swap}} toggles between
   encrypt and decrypt. The header shows the current mode.
4. Read the encrypted result in {{control:output}}. Only letters are
   encrypted; spaces and punctuation are dropped.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}}.
2. Enter the key the sender used in {{control:key}} — you need the exact
   same key that encrypted the message.
3. Press the swap button {{control:swap}} to switch to decrypt mode.
4. Read the original message in {{control:output}}.

## Break a message without the key

1. Open the Cryptanalysis tab. The guided cracker opens there.
2. Step 1 — the key length: repeated sequences in the text are
   highlighted; pick the most confident card from
   {{control:key-length-cards}}. Wrong guess? Go back and try another.
3. Step 2 — the alphabet: the cracker checks whether the alphabet
   in {{control:alphabet}} explains every slice. If it fits, keep it;
   if not (the sender used a mixed alphabet), choose "Rebuild it" in
   {{control:alphabet-mode}}.
4. Step 3 — rebuild the alphabet (only when rebuilding): pick two
   slices in {{control:column-pair}}, then in
   {{control:link-board}} click a letter of the first slice and the
   letter of the second that stands for the same plaintext letter. The
   links fill {{control:alphabet-ring}}; a contradicting link is
   flagged red. Watch {{control:merged-ic}} climb towards English, and
   place rare letters by hand from {{control:loose-letters}}.
5. Step 4 — the key letters: for each slice in {{control:slice-tabs}},
   rotate the chart with {{control:chart-arrows}} until the match score
   is highest. The letters collect in {{control:key-strip}}. Stuck? A
   guess in {{control:crib-input}} can reveal several letters at once.
6. Step 5 — check the assembled key: fix any letter directly in the key
   strip, then press {{control:use-this-key}}.
7. The tool decrypts the message with your key.
