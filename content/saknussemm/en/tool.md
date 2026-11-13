# About the Saknussemm cipher

The Saknussemm cipher comes from Jules Verne's novel "Journey to the
Centre of the Earth" (1864): it is the runic parchment that sends
Professor Lidenbrock to Iceland. It is a {{term:transposition}} in two
moves. The message is written backwards, then the reversed letters are
dealt into column-shaped clusters, so the letters stay the same and
only their order changes.

## How to use this tool

- Type your message into {{control:message-input}}; the clusters
  appear in {{control:output}}, line by line, in a monospace font.
- Only letters are kept. Spaces, digits and punctuation are dropped.
- Set how many letters each cluster holds with
  {{control:cluster-width-picker}} (2 to 12, default 7) and how many
  clusters each line prints with {{control:clusters-per-line-picker}}
  (2 to 6, default 3). The defaults are the parchment's own shape.
- Press {{control:load-parchment}} to fill the input with the text
  from the novel.
- Press {{control:swap}} to decrypt with the same shape. Spaces between
  clusters help the tool find the boundaries; a solid block of letters
  works too.

## A quick example

`SNEFFELS` with 3 letters per cluster and 2 clusters per line gives

```
SF LE
EN FS
```

Reversed, SNEFFELS is SLEFFENS; dealt into four clusters, they read
SF, LE, EN and FS.

## Go further

- [How the Saknussemm cipher works](/encoder/saknussemm/learn), step by
  step
- [The history of the Saknussemm cipher](/encoder/saknussemm/history),
  from Verne's novel to puzzle books
- [Saknussemm practice challenges](/encoder/saknussemm/practice)
