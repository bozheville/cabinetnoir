# Step-by-step guides

## Encode anything

1. Type or paste any text — spaces, punctuation, digits, anything —
   into {{control:message-input}}. Base64 has no settings and no key.
2. Read the encoded string in {{control:output}}. The alphabet is
   always `A–Z a–z 0–9 + /`, with `=` padding the tail.

## Decode a string

1. Paste the Base64 into {{control:message-input}} and press the swap
   button {{control:swap}}. There are no settings to get wrong.
2. Read the decoded text in {{control:output}}.
3. If decoding fails, the string is probably not valid Base64: look
   for characters outside the alphabet, a missing `=` padding, or
   whitespace that sneaked in on copying.

## Spot Base64 in the wild

1. Length divisible by 4, only letters, digits, `+`, `/` and `=`
   padding at the end — that combination is the fingerprint.
2. Ending in `==` means the last chunk carried a single byte;
   a single `=` means two.
3. Remember the lesson of this page: recognising the encoding is
   instant, decoding is instant — Base64 is a transport wrapper, not
   a lock.
