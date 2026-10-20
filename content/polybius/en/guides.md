# Polybius square: guides

## Guide 1 — your first coordinates

1. Open the tool, leave the square key empty and type `HELLO`. The
   output is `23 15 31 31 34` — five letters in, five pairs out.
2. Watch the square under the controls: the highlighted cell jumps to
   the last letter of the output, with its row and column lit.
3. Switch to decrypt mode and paste the pairs back — `HELLO` returns.
   The pairs are just addresses; the grid looks them up either way.

## Guide 2 — the keyed square

1. Type a square key, say `SPARTAN`, and encrypt the same `HELLO`. The
   output changes completely — same pairs in the plain square, new
   letters in the keyed one.
2. Clear the key and compare the two outputs pair by pair: only the
   letters that moved inside the grid changed their numbers.
3. Notice the square keeps exactly 25 letters whatever you type —
   duplicates in the key are skipped, and I/J still share a cell.

## Guide 3 — reading by hand

1. Encrypt `MEET AT NOON` with no key and write the pairs on paper in
   rows of five pairs.
2. Cover the grid and try to read the message from the pairs alone —
   you will find yourself reconstructing the grid from memory, which is
   exactly the lookup table the cipher forces everyone to share.
3. Try the practice challenges: the decode exercises use the plain
   square, and the hardest one uses a keyed square — its keyword
   travels in the hints.
