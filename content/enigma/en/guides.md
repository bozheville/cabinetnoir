# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}. Only the letters
   A–Z travel — spaces, digits and punctuation are dropped without
   comment, exactly as on the real machine, which had no space bar.
2. Set the three-letter key in {{control:key}} — the rotor start
   positions, for example `AAA`.
3. Read the result in {{control:output}}. The letters roll on their
   own; nothing else needs adjusting.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}}. Keep it as
   bare letters — the tool ignores everything else.
2. Set the **same** three-letter key in {{control:key}} that the
   sender used. A wrong key produces pure noise, not a graceful
   degradation.
3. Press the swap button {{control:swap}} — or don't. An Enigma is
   its own inverse, so encrypting and decrypting are the very same
   operation; the swap button exists only for symmetry with the other
   tools on this site.

## Work like a codebook clerk

1. Real traffic was broken into chunks: the sender picked a random
   *message key*, enciphered the message with it, and sent the
   message key (twice — that habit became fatal) at the head of the
   transmission.
2. To simulate this: encipher the body with one key setting in
   {{control:key}}, note the ciphertext, then start a fresh run with
   the message key and encipher the three-letter key itself. The
   receiver did the steps in reverse.
3. Try the same message under two different keys and compare the
   ciphertexts — no visible relationship survives, which is exactly
   what the rotor motion is for.
