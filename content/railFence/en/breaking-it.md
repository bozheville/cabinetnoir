# Breaking the Rail fence

Rail fence is a {{term:transposition}} with a two-number key: the rail
count and the offset. There is nothing to analyse slowly — the whole
attack is *trying settings*, and the wizard on the Cryptoanalysis tab
compresses it into one slider.

{{challenge:railFence-demo}}

## The flaw: a key space you can hold in your head

At most ten rails and a handful of offsets: a few dozen settings in
total, each testable at a glance. No statistics course required — the
only question is which setting makes the rows read like English. That
is why rail fence is the on-ramp to transposition breaking: the
experience of *sliding until it reads* is the same skill the Columnar
cracker needs, minus the hard part.

## The wizard, step by step

1. **Slide.** Move the rail-count slider and the offset slider. The
   fence re-draws with every notch, and the plaintext candidate updates
   live — wrong settings show scrambled rows, the right one shows
   words.
2. **Watch the meter.** Each setting is scored by how English-like its
   plaintext looks ({{term:frequency-analysis}}'s digraph cousin: TH,
   HE and IN score high, nonsense pairs score nothing). The meter is a
   measuring stick, not an oracle — on very short texts a wrong setting
   can outscore the right one, and your eye is the final judge.
3. **Done.** "Use this result" carries the rails and offset to the
   Tool tab, which decrypts the message. The setting is the whole key.

The tool never slides for you. The easy preset marks where the meter
peaks — a pointer, not a click — because the finding is the lesson.

## Where it stops working

More rails make the picture messier, not the cipher stronger: the key
space grows linearly while the reading test stays instant. Double
transposition and the columnar grid are the natural next steps — both
break the "try every setting" shortcut, and both wait in the later
chapters of this ladder.
