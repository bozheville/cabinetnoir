# Step-by-step guides

## Hide a line of text

1. Type the text into {{control:message-input}}. ROT13 has no
   settings — the shift is fixed at 13.
2. Read the scrambled line in {{control:output}}. Copy it wherever
   spoilers are unwelcome.

## Reveal it again

1. Paste the scrambled text into {{control:message-input}} and press
   the swap button {{control:swap}} — or don't: in encrypt mode the
   same text transforms identically. ROT13 decrypting is encrypting.
2. Read the original line in {{control:output}}.

## Recognise ROT13 in the wild

1. It is the commonest "gibberish" on old internet forums: letters
   only, spacing untouched, frequency distribution suspiciously
   intact.
2. Test by symmetry: take one letter and try the 13-step partner —
   if a word appears, apply the whole mapping.
3. Confirm with the giveaway letters: in English, a text rotated 13
   turns E's into R's, so ciphertext full of R's and lacking a clear
   most-common letter is a strong hint.
