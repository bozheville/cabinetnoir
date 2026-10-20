# Breaking the Columnar transposition

A transposition hides the *order* of the letters, not the letters
themselves — so the frequencies that kill substitution ciphers are flat
here, and a different weakness takes over: structure. The wizard on the
Cryptoanalysis tab walks the attack; this page explains what each step
does and why it works.

{{challenge:columnar-demo}}

## The flaw: the grid has a shape

The ciphertext is whole columns of a grid concatenated. If you guess
the column count right, the ciphertext falls apart into exactly those
columns — real, unbroken vertical slices of the plaintext grid. Guess
wrong and you slice through columns at arbitrary points, mixing
unrelated letters. That is the lever the whole attack works from.

## The wizard, step by step

1. **Column count.** For a padded (complete) grid, the ciphertext
   length must divide evenly by the width — only the divisors are
   candidates, ranked by how English-like the best arrangement of their
   columns looks. The score is a hint, not an answer: on short texts a
   wrong width can outrank the right one, and the real test is step 2.
2. **Order the columns.** The ciphertext stands upright as columns;
   {{term:anagramming}} means dragging them side by side until rows
   read like English. Each neighbouring pair is scored by the digraphs
   their rows form together — TH, HE, IN light up, QX does not. Watch
   the badges, move the promising partners together, and trust your
   eye for the language over the numbers: the tool never reorders a
   column by itself.
3. **Done.** When the rows read, the plaintext is recovered — padding
   letters may trail at the very end. "Use this result" carries the
   column order to the Tool tab, which decrypts the whole message.

## Why it works: digraphs remember order

English letters are not independent: certain pairs are common, most are
rare. Two true neighbouring columns zip their rows into real English
digraphs; two strangers zip into noise. That single statistic is enough
to rebuild the key one decision at a time — the same principle the
ADFGVX cracker applies to its second stage, where the columns are the
same object.

## What double transposition changes

The {{term:column-order}} of a single transposition is recoverable
column pair by column pair. Apply the cipher twice and no pair of
ciphertext chunks is ever a true pair of plaintext neighbours — every
simple statistic goes flat. Breaking double transposition by hand means
writing out probable words on grid paper and sliding shapes around;
glorious manual labour, and outside this tool's scope.
