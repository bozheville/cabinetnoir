# Breaking the Nihilist cipher

Two keys, two weaknesses. The wizard on the Cryptoanalysis tab walks
the attack in four steps; this page explains what each one listens for.

{{challenge:nihilist-demo}}

## The flaw: the key repeats, and the grid clips

Two facts do all the work. First, the {{term:additive-key}} repeats,
so sums at the same key position share its bias — the stream has a
{{term:key-length}} to find. Second, every coordinate digit lives in
1–5, so a candidate key number is only plausible if subtracting it
from *every* value in its column leaves both digits in 1–5. One wrong
digit and the value falls off the grid.

## The wizard, step by step

1. **Key length.** The tool slices the number stream at each candidate
   period and measures how strongly each slice clusters (the number
   stream's version of the {{term:index-of-coincidence}}), plus how
   often short runs of numbers repeat at key intervals. Pick a card —
   the score is a hint, not an answer.
2. **Pin each key number.** One column at a time: you try key numbers
   (two digits, each 1–5) and every value in the column votes — green
   when the subtraction stays inside the square, red when it does not.
   On easy, numbers that cannot fit any value are greyed out before
   you try; on hard you see only the red and green after each try. No
   column is ever filled for you.
3. **Rebuild the square.** With the key pinned, subtract it and the
   stream collapses back to plain Polybius coordinates — `11` to `55`.
   That is a straight {{term:substitution}}, so the shared assignment
   board takes over: assign letters by frequency, watch the partial
   plaintext, undo anything. The square fills in beside the board as
   you go.
4. **Done.** The recovered square (and the keyword it spells, if it is
   a keyed one) plus the additive key travel to the Tool tab with
   "use this result".

## Why the two-stage attack works

Neither stage alone is decisive, but each shrinks the other's search:
the range constraint turns 25 possible key numbers per column into a
handful, and once the key is gone the cipher is a textbook frequency
count. It is the same divide-and-conquer the Vigenère cracker uses —
find the period, then attack each slice — with the slices made of
numbers instead of letters.
