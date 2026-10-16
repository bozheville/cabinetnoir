# How the Alberti cipher works

## The idea in one sentence

Alberti's cipher disk is the first {{term:polyalphabetic}} cipher: two
concentric discs carry two different {{term:alphabet}}s, and the inner
disc turns after every few letters, so the {{term:substitution}} keeps
changing while you write — the same plaintext letter becomes different
{{term:ciphertext}} letters.

## The recipe

1. Write your message and keep only the letters that sit on the disc —
   Alberti's ring holds 20 Latin letters (no H, J, K, U, W, Y) plus the
   digits 1–4. The tool drops the rest.
2. Set the period: how many letters are encrypted before the disc
   turns.
3. Set the increment: how many positions the inner disc jumps at every
   turn.
4. For each chunk of `period` letters, read the ciphertext letter
   sitting opposite on the inner disc. Then turn the inner disc by the
   increment and continue with the next chunk.

## A worked example

{{example:alberti-basic}}

The disc column shows the alignment at work: it starts with the outer
**A** over the inner **m**, so **S** becomes **r** and **E** becomes
**f**. After the two-letter chunk the disc jumps three positions —
**A** now sits over **h**, and **C** becomes **d**. Every restart of
the alignment gives the alphabet a fresh shuffle; that is the
polyalphabetic idea in miniature.

## The formula

Each chunk is a substitution, and the substitution changes between
chunks. With position counting on the discs:

```
cipher = target[(index of plain) ]        # within one chunk
target = rotate(target, increment)        # after every chunk
```

Decryption runs the same story backwards: read each chunk through the
current alignment, and turn the disc by the increment after every
chunk. Because the receiver needs period, increment *and* the starting
alignment, the shared secret has three parts.

## The discs of the tool

The tool reproduces Alberti's rings exactly: the fixed outer disc
(Stabilis) carries the uppercase Latin alphabet **ABCDEFGILMNOPQRSTVXZ**
plus the digits **1234**, which Alberti used for a second, numeric code.
The movable inner disc (Mobilis) carries a mixed lowercase alphabet
**mqihfdbacegklnprtuz&xyso** — the mix is Alberti's own extra shuffle
on top of the turning. The arrows turn the inner disc by hand if you
want to start somewhere other than the default alignment.

{{try:alberti-basic}}
