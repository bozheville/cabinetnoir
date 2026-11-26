# How to decrypt the Saknussemm cipher

To decrypt a Saknussemm message you need its shape: letters per
cluster and clusters per line. The tool lays the clusters side by
side as columns, reads the rows across, then reverses the result. The
letters never change, so a mistake only scrambles their order.

## Using the decrypt tool

- Paste the clusters into {{control:message-input}}; the plaintext
  appears in {{control:output}} as one run of capitals.
- Keep the spaces between clusters if you have them. The tool then
  takes each group as a column, and the shape settings do not matter.
- For a solid block of letters, set the sender's shape with
  {{control:cluster-width-picker}} and
  {{control:clusters-per-line-picker}}. The tool cuts the block with
  that shape.
- Digits and punctuation are dropped. The word breaks are lost, so add
  them yourself.
- Press {{control:load-parchment}} to load the scrambled text
  Lidenbrock dictates in the novel. It comes back as the Latin
  message, with a few letters out of place or missing, as in the
  printed text.
- To encrypt a reply, switch back with {{control:swap}}.

## A quick example

`SF LE EN FS`, with 3 letters per cluster and 2 clusters per line,
gives `SNEFFELS`. The rows read `SLEF`, `FENS`; reversed, they spell
the volcano.

Paste the same letters as one block, `SFLEENFS`, and keep the default
7 by 3 shape. The tool cuts the block in the wrong places and gives
`NLSEFFES`. Swap the first two clusters, `LE SF EN FS`, and you get
`SNFEFESL`: same letters, wrong order.

## Lost the shape?

- [How the Saknussemm cipher works](/encoder/saknussemm/learn), and
  how to find a lost shape by hand
- [The history of the Saknussemm cipher](/encoder/saknussemm/history),
  from Verne's novel to puzzle books
- [Saknussemm practice challenges](/encoder/saknussemm/practice) to
  decrypt
- [Identify an unknown cipher](/identify) if you are not sure it is a
  transposition
