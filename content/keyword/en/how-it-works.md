# How the Keyword substitution cipher works

## The idea in one sentence

Keyword substitution is a {{term:substitution}} whose
{{term:cipher-alphabet}} is spelled out for you: write the
{{term:key}}word first, then continue with the letters the keyword
missed — the alphabet remembers the keyword in its very shape.

## The recipe

1. Choose a keyword, say `KRYPTOS`. Write its letters in order, dropping
   every repeat: `K R Y P T O S`.
2. Underneath the plain alphabet, continue with the remaining letters in
   their normal order: `A B C D E F G H I J L M N Q U V W X Z`.
3. The two rows together are the cipher alphabet:
   `KRYPTOSABCDEFGHIJLMNQUVWXZ`.
4. Encrypt each plaintext letter by the cipher letter standing under it:
   A becomes K, B becomes R, C becomes Y. Decryption runs the rows the
   other way round.

## A worked example

{{example:keyword-basic}}

The middle column shows where each cipher letter comes from: `K` marks
letters that belong to the keyword, `·` marks the plain remainder that
follows. That split is the whole trick — and the whole weakness.

## The continuation variant

Some keyword alphabets do not restart at A after the keyword; they keep
counting from the keyword's last letter. With `KRYPTOS` that gives
`KRYPTOSUVWXZABCDEFGHIJLMNQ` — after S comes U (T is already used), then
V, W, X, Z, then the wrap-around A, B, C… The tool offers both modes
with the "Continue after the keyword" checkbox.

## Free alphabets

Any arrangement of the 26 letters works as a cipher alphabet — the
keyword is just the memorable way to write one down. The tool's
"Free alphabet" mode accepts any permutation, which is exactly what the
cryptoanalysis wizard produces: a recovered alphabet need not come from
any keyword at all.

{{try:keyword-basic}}
