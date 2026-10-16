# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}}.
2. That is the whole setup — Atbash has no key. The
   {{control:alphabet-selector}} only chooses which alphabet gets
   mirrored (Latin by default; the mirror works on German, French,
   Russian and Ukrainian too).
3. Read the mirrored text in {{control:output}}.

## Decrypt a message you received

1. Paste the cryptogram into {{control:message-input}} and press the
   swap button {{control:swap}} — although here even that is a formality:
   Atbash encrypting and decrypting are the very same operation.
2. Make sure the same {{control:alphabet-selector}} is selected as the sender
   used.
3. Read the original message in {{control:output}}.

## Recognise an Atbash message

There is no key to find, so "breaking" Atbash is really
*recognising* it:

1. Read the gibberish backwards — mirror text read in reverse often
   shows letter shapes that feel suspiciously like words.
2. Or test the fixed mapping directly: switch to decrypt mode, paste
   the text, and see if sense appears. One attempt settles it.
3. Remember the giveaway: a message where E does *not* cluster near
   the common ciphertext letters but the letter distribution still
   looks like ordinary language — just permuted — points to a fixed
   mapping with no key.
