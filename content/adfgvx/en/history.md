# History of the ADFGVX cipher

## A new cipher for a new war

By 1918 the German army sent most of its tactical traffic by radio,
and every word of it was available to the Allies. Field ciphers of the
day could not survive that volume: substitution ciphers drowned in
frequency tables, transpositions leaked with every repeated phrase.
Colonel Max Rongé's office responded in March 1918 with a design by
signal officer Fritz Nebel that stacked both defences — a keyed
Polybius square ({{term:fractionation}}) followed by a keyed column
shuffle ({{term:transposition}}).

## Six letters on the dial

The first variant used a 5×5 square and the letters A D F G X —
chosen because they sound clearly different in Morse code and survive
noisy radio links. Within weeks the square gained a sixth row for the
digits, and the alphabet grew to A D F G V X. The name followed the
alphabet, and German operators entered every message through a
strutted "box" of letters and numbers.

## Painvin, exhausted

Georges Painvin of the French decryption bureau — known for working
until his hair turned grey in weeks and he collapsed with
tuberculosis — took on the traffic. For months he managed only
fragments. The break came from volume: many messages sent each day on
the same key let him compare column lengths and match columns across
messages, until a long intercepted pair on a Sunday in March 1918
cracked the day's key open.

## The offensive that mattered

The decrypted traffic pointed at Amiens. When the German offensive
opened there in June 1918, the French were waiting, and the attack
stalled. ADFGVX traffic stayed readable for the rest of the war — the
Germans kept changing keys daily, the French kept up.

## The legacy

ADFGVX fixed the template that modern ciphers still follow: confuse
(substitute) the symbols, then diffuse (transpose) them — in reverse
order of what later became Shannon's maxim. Its square also seeded the
bifid-style family of fractionating ciphers. Every "two layers are
stronger than one" argument in classical cryptography starts here.
