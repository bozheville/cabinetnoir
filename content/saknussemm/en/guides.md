# Step-by-step guides

## Encrypt your first message

1. Type your message into {{control:message-input}} — letters,
   punctuation and case are all welcome; the cipher keeps the letters
   only.
2. Pick the shape: {{control:cluster-width-picker}} decides how many
   letters each cluster holds, {{control:clusters-per-line-picker}}
   how many clusters each line prints. The parchment's own shape is
   7 and 3 — the defaults.
3. Read the {{control:output}} field: the clusters appear line by
   line, space-separated, in a monospace font so the gaps stay
   visible.

## Decrypt a message you received

1. Press the swap button {{control:swap}} to switch to decrypt mode.
2. Paste the cryptogram into {{control:message-input}}. Whitespace
   between the clusters is read as a cluster boundary — keep it if
   you can. A solid blob of letters works too; the tool slices it
   with the current shape rule.
3. Set the shape the sender used with
   {{control:cluster-width-picker}} and
   {{control:clusters-per-line-picker}}. A wrong shape scrambles the
   rows: the letters are all there, just in the wrong grid.
4. Read the {{term:plaintext}} in {{control:output}} — the final
   reversal happens automatically.

## Replay the parchment

1. In encrypt mode, press {{control:load-parchment}}: the page fills
   with the Latin message Axel deciphers — "descend into the crater
   of Yoculis at Sneffels…"
2. Watch the tool produce Saknussemm's scrambled clusters, then press
   {{control:swap}}: the clusters carry over to the input and the
   output side shows the Latin again — the round-trip is exact.
3. Now press {{control:load-parchment}} in decrypt mode: the same
   button loads the novel's own dictation — "mm.rnlls esruel
   seecJde…". The tool reads it with the 7-by-3 shape and recovers
   the Latin message up to the parchment's quirks: the novel's
   transcription carries the punctuation as grid cells and skips one
   corroded letter.
