# Breaking the Enigma

The Enigma machine itself was never "broken" in the way Caesar or
Vigenère fall — its mathematics, per message, was beyond anyone's
paper arithmetic. What broke was the **system around it**: habits,
procedures and cribs. This page tells that story, because it is the
greatest cryptanalysis lesson of them all.

{{challenge:enigma-demo}}

## The flaw: a strong machine in leaky hands

Three procedural gifts sank Enigma:

1. **The doubled message key.** Operators enciphered each message's
   three-letter key twice at the head of every transmission — six
   letters whose *first and fourth, second and fifth, third and sixth*
   letters were guaranteed relationships. Marian Rejewski exploited
   exactly that structure to reconstruct the rotors mathematically in
   1932 — without ever touching a machine.
2. **The {{term:crib}}.** Routine formulae — weather reports
   (`WETTER…`), salutations, `ANX` headers, predictable placeholders —
   gave Bletchley a stretch of probable plaintext for almost any day's
   traffic.
3. **Keys chosen by humans.** "No letters allowed" rules against AAA
   and QWE made operator-chosen keys *weaker*, and lazy keys (three
   consecutive keyboard rows) appeared anyway.

## The bombe: contradiction machines, not key search

The British **bombe** (designed by Alan Turing, with Gordon
Welchley's crucial improvements after the Polish `bomba`) did not try
keys. Given a crib, it searched for rotor settings that were
*impossible*:

- A crib like `WETTER` says: plaintext letter W becomes ciphertext
  letter X at position 1, E→Y at position 2, and so on.
- For each candidate setting, the bombe tested whether that mapping
  was consistent with the machine's wiring — many cribs produce
  **loops** (chains of letter-pair statements that circle back on
  themselves), and a loop makes a whole class of settings logically
  contradictory.
- Every contradiction eliminated thousands of settings at once; the
  few survivors were tested on a real machine for intelligible German.

That is constraint logic, not brute force — the ancestor of the
solving strategies used across computer science today.

## Why there is no cracker in this tool

A bombe simulation needs a crib, a contradiction engine and a search
over rotor orders, rings and plugboards — a project of its own, far
beyond this site's key-search crackers. The demo above works the way
a real radio operator's opponent would: with a captured or guessed
key, the decryption is one paste; the *hard* part was always getting
that key, and that part lives in history, not in this tool.

## The verdict

Historian Harry Hinsley estimated that the Enigma intelligence
(Ultra) shortened the Second World War by **two to four years**. No
other cipher's defeat has a comparable claim. The machine that lost
was not weak — the procedure around it was, and that distinction is
the deepest lesson on this site: cryptography is a system, and
systems break at their weakest habit.

## Where to go next

- Compare with the Vigenère page: Vigenère fell to statistics; the
  Enigma fell to procedures. Both attacks target the *system*.
- The Polish `bomba` and the British bombe are two different machines
  with one name and one ancestor — the history page untangles them.
