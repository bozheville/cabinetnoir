# How ROT13 works

## The idea in one sentence

ROT13 is a Caesar cipher with the dial glued at half a turn: every
letter moves 13 places along the {{term:alphabet}}, so A becomes N
and N becomes A.

## The recipe

1. Count 13 positions past the letter — or don't count: the second
   half of the alphabet is a mirror of the first.
2. Replace each letter with its partner. Spaces and case stay put.
3. To undo it, do it again. Because 13 + 13 = 26, applying ROT13
   twice is the identity — the operation is its own inverse.

## A worked example

{{example:rot13-basic}}

HELLO becomes URYYB. Look at the shift column: every row says 13,
and that constancy is the entire cipher. Check the symmetry: U back
to H, R back to E — the same table runs both directions.

## The formula

```
encrypt: y = (x + 13) mod 26
decrypt: y = (x + 13) mod 26   # the same line!
```

That repetition is no accident: 13 is half of 26, the only shift
that pairs every letter with exactly one partner and inverts itself.
No other Caesar shift has this property.

## Obfuscation, not encryption

Nobody has ever claimed ROT13 is secure — it would be absurd: no
key, one fixed mapping, instant undo. Its job is *convenience*: text
that a passing eye cannot read accidentally, but that a willing
reader reveals without tools. Think of it as a paper bag over the
punchline, not a safe around the treasure — the practice tab's
challenges all open with one click.
