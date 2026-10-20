# Breaking the Polybius square

There is no cracker tab for this cipher — and that is not an oversight,
it is the lesson.

{{challenge:polybius-easy-1}}

## The square is a substitution wearing a grid

Every plaintext letter maps to one fixed symbol, always: `E` is always
`15` of the plain square, whatever comes before or after it. Strip the
pairs back to letters and you are holding an ordinary
{{term:substitution}} — the very cipher whose guided breaking the
Keyword page teaches.

## The way in: the frequency of pairs

1. Count the pairs in the ciphertext. With the plain square, the most
   frequent pair is E (`15`), then T (`44`), A (`11`), O (`34`) — the
   usual English order wearing numbers.
2. Assign candidate letters to the frequent pairs, exactly like the
   {{term:frequency-analysis}} step of the keyword cracker.
3. When the square is keyed, the assignment *is* the square: recover
   enough letters and the grid fills itself in — then the keyword
   reveals itself the way it does in the keyword cracker.

## Try it in the app

Take a keyed-square Polybius ciphertext, paste it into the **Keyword
substitution** cracker after rewriting each pair as its plain-square
letter (or as any fixed placeholder), and the assignment board does the
rest. The coordinates change the costume, not the weaknesses: a
monoalphabetic cipher is a monoalphabetic cipher, whether its symbols
are letters or numbers.

## Where the square gets dangerous

On its own the square is trivial. Chained into fractionation and
transposition — ADFGVX — or given a periodic numeric key — the
Nihilist cipher — the same 25 cells become the substrate of far tougher
systems. That is why this page exists: to teach the coordinate idea
once, cleanly, before the heavier ciphers borrow it.
