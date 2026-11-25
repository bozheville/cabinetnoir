# VIC cipher: step-by-step guides

## Guide 1: encrypt your first message

1. Type a message into {{control:message-input}}, for example
   `ATTACK AT DAWN. BY DAWN I MEAN 0500.`
2. Fill in the secrets from the Wikipedia example. **Phrase**: *Twas
   the night before Christmas*. **Date**: `13/9/1959`. **Personal №**:
   `6`. **Keygroup**: `72401`. (For real messages you would press
   **Roll a fresh keygroup** instead.)
3. Five-digit groups appear in {{control:output}}. That is your
   ciphertext.
4. Turn on **Show the key workings**. Read the worksheet from the top:
   the keygroup (line A), the date digits (line B) and their
   difference (line C). Hover over a line to see how it was made.
5. Scroll to the checkerboard. `A` sits on `5` and `T` on `9`. The
   empty cells sit on `6` and `8`, so every letter in the lower rows
   starts with `6` or `8`.
6. Find your keygroup in the output. Count five groups from the end:
   the date's sixth digit, `5`, decides the position.

## Guide 2: decrypt with the secrets

1. Press {{control:swap}} to switch to decryption. Paste the
   five-digit groups.
2. Enter the phrase, the date and the personal number. Leave the
   keygroup alone: the tool reads it from the message and fills the
   field for you.
3. The plaintext appears. If it ends with a few `X` letters, drop them.
   They were filler that made the digit count divide by five.
4. Now change one digit of the date and look again. The text turns
   into nonsense. Every stage depends on every secret, which makes
   VIC a {{term:product-cipher}}.

## Guide 3: try Häyhänen's own board

1. Open **Alphabet** and choose the Cyrillic board.
2. Look at the top row of the checkerboard: `СНЕГОПА`. These are the
   first seven letters of *снегопад*, Russian for "snowfall". Häyhänen
   used exactly this word.
3. The Latin board has two empty cells, the Cyrillic one has three. So
   it has three lower rows, enough room for a longer alphabet and a
   few extra signs.
4. Type a short message in Russian and encrypt it. Then decrypt it to
   check that it comes back unchanged. The board uses the Russian
   alphabet, so Ukrainian letters such as І or Ї are dropped.

## Guide 4: bisect the message

1. Turn on **Bisect the message** and set **Cut at** to `20`.
2. Encrypt the same message as in guide 1. The ciphertext changes
   completely, because the tool swapped the two halves of the text
   before encrypting.
3. The person you write to needs this number as well. Agree on it in
   advance, like the other secrets.
4. Decrypt with bisection switched off. The message comes out with its
   halves in the wrong order. Turn it back on with the same cut, and
   the text reads normally again.
