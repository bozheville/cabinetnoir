# How the Saknussemm cipher works

## The idea in one sentence

Saknussemm is a {{term:transposition}} in two moves — the whole message
written backwards, then the reversed letter stream sliced into
column-shaped clusters — the runic parchment Arne Saknussemm left
inside Jules Verne's "Journey to the Centre of the Earth".

## The recipe

1. Take the {{term:plaintext}}, keep the letters only and reverse the
   stream: DESCENDE becomes EDNECSED. This is the step that stops the
   professor in the novel — he reads the runes for days before Axel
   suggests reading the message "backwards, like the people of
   Thule".
2. Choose the shape: how many letters each cluster holds (the
   parchment: 7) and how many clusters each line prints (the
   parchment: 3). Lines themselves are unlimited — the text simply
   flows onto as many lines as it needs.
3. Write the reversed stream across the rows of a grid whose columns
   are the clusters: letter number k of the reversed stream lands in
   cluster k mod W, row k div W, where W is the total number of
   clusters.
4. Read the grid down its columns and print what you see:
   `clustersPerLine` clusters per line, separated by spaces. The
   {{term:ciphertext}} of DESCENDE in the parchment's shape is
   `EEE DCD NS` — three clusters, all on one line.

## A worked example

{{example:saknussemm-basic}}

Each row adds one cluster in print order. SNEFFELS reversed is
SLEFFENS; the 3-by-2 shape needs four clusters, and cluster number 1
takes every 4th letter of the reversed stream starting from the first:
S, then F. Cluster 2 takes L and E, cluster 3 takes E and N, cluster 4
takes F and S. The printed cryptogram is `SF LE EN FS` — four clusters,
two per line.

## The mechanics

Everything follows from one relation: **cluster k holds the letters
S[k], S[k+W], S[k+2W], …** where S is the reversed message and W the
cluster count. Reading the clusters side by side rebuilds the grid's
rows, which read across spell S — and one more reversal spells the
plaintext. No letter is ever changed, duplicated or dropped: the
ciphertext is always an anagram of the message, which is both the
cipher's charm and its weakness.

## Tool-specific notes

- Input is uppercased and stripped to letters before encrypting —
  punctuation and spaces never enter the grid. The parchment's Latin,
  commas and all, becomes a 133-letter stream.
- The output carries spaces and line breaks on purpose: they mark the
  cluster boundaries. Decrypting accepts either form — the
  whitespace-separated clusters, or one solid blob of letters sliced
  with the same shape rule.
- The shape defaults to the parchment's 7 and 3. Any other shape
  encrypts the same way, but only 7-by-3 reproduces the novel's
  dictation.

{{try:saknussemm-basic}}
