# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}.
2. Set the multiplier in {{control:multiplier}} — try 3, a classic
   choice that is coprime with 26.
3. Set the shift in {{control:shift}} — the Caesar-style add-on, any
   value from 0 to 25.
4. Read the result in {{control:output}}. The same plaintext letter
   always maps to the same ciphertext letter, but the mapping is no
   longer a simple slide.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}} and press the
   swap button {{control:swap}}.
2. Enter the same multiplier {{control:multiplier}} and shift
   {{control:shift}} the sender used. The tool computes the inverse
   multiplication for you — no modular arithmetic on your side.
3. Read the original message in {{control:output}}.

## Break a message without the key

The Affine cipher is still a single fixed {{term:substitution}}, so it
falls to the classic attack — and, better, to a shortcut:

1. If you know two plaintext–ciphertext letter pairs, you can solve the
   straight line directly: subtract the two equations to cancel `b`,
   then divide — which means multiplying by the modular inverse — to
   get `a`.
2. With `a` known, recover `b` from either pair.
3. Enter both numbers in {{control:multiplier}} and {{control:shift}},
   switch to decrypt mode, and read the message.
4. No known letters? Fall back to {{term:frequency-analysis}}: the
   commonest ciphertext letter should be E (or T, or A), and each
   guess of a pair of candidates pins down a candidate key.
