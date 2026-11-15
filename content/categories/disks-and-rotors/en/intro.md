## What unites the family

Cipher disks and rotor machines change the alphabet mechanically. A ring or a wheel turns, and with it the whole table of substitutions shifts, so the cipher can move between alphabets without a written table. The key is the starting position of the wheels and the rule for turning them.

## How it works

[Alberti's disk](/encoder/alberti/learn) is two concentric rings of letters. Line them up by an agreed index letter, read off a few letters, then turn the inner ring to a new position, announced by a capital letter in the ciphertext. The [Enigma machine](/encoder/enigma/learn) automated the idea with electric {{term:rotor}} wheels: one rotor steps with every key press, the others step like an odometer, and a reflector sends the current back through them. Type AAAA and the lamps show a different letter almost every time, but never A, because the reflector never lets a letter map to itself.

## How it is broken

Turning wheels hide letter frequencies well, but each machine leaves its own regularities. Alberti's disk changes alphabet only when told to, so a long stretch on one setting falls to frequency analysis; the [Alberti cracker](/encoder/alberti/cryptanalysis) shows how. Enigma was broken through its structure and its operators: repeated message keys, the rule that no letter encrypts to itself, and cribs, known words such as weather reports, that let machines test thousands of rotor settings.

## History

Leon Battista Alberti described his disk in 1467, the first polyalphabetic cipher in print. Arthur Scherbius patented the Enigma in 1918. In December 1932 Marian Rejewski of the Polish cipher bureau reconstructed its wiring, and at Bletchley Park Alan Turing designed the bombe that read German traffic for the rest of the war.
