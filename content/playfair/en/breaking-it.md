# Breaking the Playfair cipher

Playfair was the last classical cipher to hold real field value —
and the first to fall to statistics in a new way: not letter
frequencies but *pair* frequencies. This page shows why the digraph
idea delayed the old attacks, and what replaces them.

{{challenge:playfair-demo}}

## The flaw: pairs still have habits

Single-letter frequency dies here: an E may encrypt to a dozen
different letters depending on its partner. But digraphs have habits
of their own — TH, HE, AN, RE and ER tower over the rest of English
pairs — and the cipher's own structure amplifies the leak: many
plaintext pairs map to ciphertext pairs that share a letter, and the
rectangle rule links pairs that differ in only one letter.

## Attack 1 — digraph frequency analysis

1. Gather a few hundred pairs of {{term:ciphertext}}.
2. Build a digraph frequency table and match the giants (TH, HE, AN,
   RE, ON…) against the most common ciphertext pairs.
3. Each confirmed mapping pins letters into the square; each pinned
   letter constrains the rows and columns of several others. The
   square reconstructs itself like a crossword grid.
4. With enough text the square falls whole; with too little, the
   mixed-up guesses multiply — this is why short field messages
   survived.

## Attack 2 — when the keyword leaks

The square is only as secret as its keyword, and field keywords are
chosen by humans: unit names, place names, the week's codeword.
Given a {{term:crib}} or a guess, build the candidate square and
decrypt a line — sense confirms the key instantly. The practice
challenges work exactly this way.

## Why there is no cracker in the tool (yet)

A digraph-frequency cracker needs a corpus-level solver, not a
key-search loop: the search space of squares (25!) dwarfs any
Caesar-style sweep, but the constraint propagation is the
interesting part. The tool therefore leaves Playfair cracking as an
exercise — the demo above shows the mechanics of a known crib, and
the guides above show where the statistics would attach.

## The historical verdict

Playfair held the field from 1854 until radio made volume fatal:
large wireless traffic fed the digraph tables, and by the end of
WWI the cipher was transparent to serious opponents. Its legacy is
the digraph itself — the idea that grouping letters before
substituting multiplies the work of the analyst. Every later
two-square, four-square and even rotor design inherits it.
