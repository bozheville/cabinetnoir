# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}. Only the 20
   letters of the disc get encrypted — H, J, K, U, W, Y are dropped,
   exactly as on Alberti's Latin disc.
2. Set the chunk length with the period slider {{control:period}} and
   the disc jump with the increment slider {{control:increment}}.
3. If you want a different starting alignment, turn the inner disc with
   the arrows {{control:rotate-left}} and {{control:rotate-right}}.
4. Read the encrypted result in {{control:output}} — lowercase, like
   the inner disc itself.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}}.
2. Press the swap button {{control:swap}} to switch to decrypt mode.
3. Set the same period {{control:period}} and increment
   {{control:increment}} the sender used, and bring the discs into the
   same starting alignment with the arrows. You need all three —
   period, increment and alignment — to undo the encryption.
4. Read the original message in {{control:output}}.

## Break a message without the key

The disc turns at fixed intervals, so letters at the same position
inside every chunk are encrypted with the same substitution. That
regularity is the way in:

1. Guess the period: cut the ciphertext into chunks of that length
   (start with 2 or 3) and put letters of the same position into one
   pile.
2. Each pile is a single {{term:substitution}} — apply
   {{term:frequency-analysis}} to it. The inner alphabet is mixed, so a
   pile gives you letter pairs rather than a simple shift, but even two
   or three solved letters identify the alignment.
3. Set the discs to that alignment with the arrows, enter the period
   {{control:period}} and increment {{control:increment}}, and decrypt.
   Wrong guess? Try the next candidate period — a short message may
   need several.
