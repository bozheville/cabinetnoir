# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}.
2. Pick any word as the secret and enter it in {{control:key}} — longer
   keys are harder to break.
3. Check the mode: the swap button {{control:swap}} toggles between
   encrypt and decrypt. The header shows the current mode.
4. Choose the flavour in {{control:variant-select}}: classic Beaufort or
   the variant. Classic is self-reciprocal — the same mode both ways.
5. Read the encrypted result in {{control:output}}. Only letters are
   encrypted; spaces and punctuation are dropped.
6. Watch the {{term:tabula-recta}} under the controls: the highlighted
   cell is the exact row-and-column lookup your first letter performs.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}}.
2. Enter the key the sender used in {{control:key}} — you need the exact
   same key that encrypted the message.
3. Classic Beaufort needs no mode change at all: encrypting the
   cryptogram with the same key *is* decrypting it. If the sender used
   the variant, press the swap button {{control:swap}} instead.
4. Read the original message in {{control:output}}.

## Break a message without the key

1. Open the Cryptoanalysis tab. The guided cracker walks the same steps
   as the Vigenère one, with one twist: each slice is matched against a
   *reflected* frequency curve, because Beaufort subtracts the other way.
2. Step 1 — the key length: repeated sequences in the text are
   highlighted; pick the most confident card from
   {{control:key-length-cards}}. Wrong guess? Go back and try another.
3. Step 2 — the key letters: for each slice in {{control:slice-tabs}},
   rotate the chart with {{control:chart-arrows}} until the match score
   is highest. The letters collect in {{control:key-strip}}. Stuck? A
   guess in {{control:crib-input}} can reveal several letters at once.
4. Step 3 — check the assembled key: fix any letter directly in the key
   strip, then press {{control:use-this-key}}.
5. The tool decrypts the message with your key.
