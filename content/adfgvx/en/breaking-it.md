# Breaking the ADFGVX cipher

ADFGVX was designed to resist exactly the two attacks that had killed
earlier field ciphers: {{term:frequency-analysis}} (killed by the
{{term:fractionation}}) and pattern-based attacks (killed by the
{{term:transposition}}). It fell anyway — to one of the most impressive
cryptanalyses of the First World War. The demo challenge opens the
tool's guided cracker on a real ciphertext.

{{challenge:adfgvx-demo}}

## Why one attack is not enough

With the fractionation alone, the ciphertext letters A D F G V X have
no useful frequencies of their own: every letter of the plaintext is
smeared across two of them. With the transposition alone, the letters
of the ciphertext are real fractionated coordinates, but shuffled —
their single-letter frequencies are flat too. The defence is the
stacking, and the attack has to unstack it in the right order: first
undo the shuffle, then solve what is left.

## Attack 1 — reassembling the columns

Undoing the {{term:transposition}} means learning which chunks of the
ciphertext were neighbouring columns of the grid. The tell-tale sign:
when two chunks really were neighbours, zipping them together pairs
every row-coordinate with the matching column-coordinate of the *same*
plaintext letter — the resulting two-letter "symbols" are real
letters, with skewed, language-like frequencies. A chi-square
independence test on the coordinate pairs measures exactly that tie,
and the tool uses it both to rank candidate key lengths and to suggest
which columns belong together. Treat the suggestions as hints: on
short messages a wrong arrangement can look convincing, and the real
test is whether the next stage produces readable text.

## Attack 2 — the square as a substitution puzzle

Once the columns sit in the right slots, the coordinate pairs are the
letters of an ordinary monoalphabetic {{term:substitution}} over 25 or
36 symbols. The old machinery applies: the most frequent symbols are
the most frequent letters, {{term:crib}} words confirm guesses, and
each confirmed symbol pins a cell of the square and constrains its row
and column neighbours. The tool's guided cracker walks this stage with
a frequency chart, letter suggestions and a live preview.

## The historical shortcut: traffic volume

Georges Painvin's breakthrough in the spring of 1918 came from
quantity: dozens of messages enciphered *with the same daily key*,
compared column by column, length against length. Identical long
messages on the same key lined up and betrayed the column order in
days. A single short message gave him almost nothing — which is why
the German radio discipline (or lack of it) decided the battle more
than the cipher did.

## The verdict

Broken traffic helped stop the German spring offensive of 1918. The
cipher itself was sound for its day; the procedures around it were
not. ADFGVX remains the textbook case of fractionation plus
transposition — and of how key reuse defeats even good designs.
