# Nihilist cipher: guides

## Guide 1 — your first addition table

1. Open the tool, leave the square key empty, type the key `RUSSIA` and
   encrypt `ATTACK AT DAWN`. The output is a stream of numbers.
2. Look at the addition table under the text: each cell shows one
   letter's `plain + key = sum`. Follow the key column — it repeats
   every six letters, RUSSIA's length.
3. Switch to decrypt mode and paste the numbers back. Subtraction
   undoes the addition digit by digit; no borrowing, ever.

## Guide 2 — the keyed square

1. Add a square key, say `MOSCOW`, and encrypt the same message. The
   sums change because the coordinates underneath changed — the
   additive key works on whatever square it is given.
2. Clear the square key again and compare: the same key word produces
   different numbers over a different square. Two independent keys,
   one cipher.

## Guide 3 — seeing the period by eye

1. Encrypt a longer message with the key `REVOLUTION` (10 letters) and
   write the numbers in rows of 10, one key position per column.
2. Scan each column: its values cluster in a narrow band — the bias of
   one fixed key number. Columns of a wrong width scatter.
3. That clustering is the whole secret: the band of each column pins
   the key number almost by eye, which is what the cracker's green and
   red feedback makes explicit.

## Guide 4 — the 10s

1. Encrypt `ZZZZZ` with the key `ZZZZZ`: every sum is `110`, the
   largest possible — `5 + 5` in both digits.
2. Now decrypt a stream containing `30` or `100`: those mean a column
   sum of 10 (`2|10`, `9|10`), not a zero column. The overflowed 10 is
   the Nihilist quirk that trips every casual attack.
