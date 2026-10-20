# Breaking the Keyword cipher

A keyword alphabet feels personal and memorisable — and it is still a
monoalphabetic {{term:substitution}}, so the classic statistics apply
unchanged. The wizard on the Cryptoanalysis tab walks the attack; this
page explains what each step does and why it works.

{{challenge:keyword-demo}}

## The flaw: one fixed mapping

Whatever the alphabet's shape — keyword, continued keyword or free
permutation — every plaintext letter encrypts to the same cipher letter
for a whole message. That is the invariant
{{term:frequency-analysis}} feeds on: counts of cipher letters are
counts of plain letters in disguise.

## The wizard, step by step

1. **Count the letters.** The board sorts the cipher symbols by how
   often they appear and draws each count as a bar. Compare the shape
   with English — E, T, A, O lead — and check that the text is long
   enough to be trustworthy (the tool warns below 100 letters).
2. **Assign the obvious ones.** Click the most frequent cell and pick
   the letter you think it stands for; the suggestion under a cell is
   only a hint. After every click the partial plaintext updates, so a
   wrong guess shows immediately — undo it and try the runner-up.
3. **Find the words.** With a few letters placed, whole words light up.
   The panel lists cipher words whose shape matches a common English
   word ({{term:pattern-word}} matching — THE has the shape ABC, THAT
   ABCA) and only shows candidates consistent with your assignments.
   Clicking a candidate places the whole word in one click. Doubled
   letters and one-letter words (only A and I in English) are clues too.
4. **Fill the gaps.** Rare symbols are last: use the partial text as
   your guide, assigning until every cell is taken.
5. **Done.** The recovered alphabet appears; if it is keyword-shaped,
   the wizard names the keyword it hides. "Use this key" carries the
   alphabet to the Tool tab, which decrypts the rest.

The tool never assigns a letter on its own. Every click is yours, and
every click can be taken back — that is deliberate: breaking it yourself
is the lesson.

## What the keyword adds — and what it does not

A keyword shrinks the alphabet choices a designer must memorise, not
the choices an attacker must consider. Frequency analysis does not care
how the permutation was written down. The keyword only matters after
the fact: a recovered alphabet may reveal the password-like word it was
built from, which is satisfying — and a warning about choosing keys
your ciphertext can confess.
