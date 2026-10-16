# How the Enigma machine works

## The idea in one sentence

The Enigma is an electromechanical {{term:polyalphabetic}} machine:
three {{term:rotor}} wheels reshuffle the {{term:alphabet}} with every
keypress, and a {{term:reflector}} bounces the signal back through the
wheels — so the same letter almost never encrypts the same way twice.

## The machine on this site

The tool models an Enigma I in a fixed configuration:

- **Rotors I, II and III**, left to right, starting from the key you
  type (three letters, A–Z — the *Grundstellung*, the start positions);
- **Reflector B**;
- **no plugboard** and a straight entry wheel.

Be honest with yourself about the word *key*: on the real machine the
key sheet also carried the rotor order (five rotors to choose three
from), the ring settings and up to ten {{term:plugboard}} pairs. The
three letters here are only the start positions — the smallest slice
of a real Enigma key.

## The recipe

1. Set the three rotors to the key, for example `AAA`.
2. Type a letter. **First the rotors step** — the rightmost wheel
   advances one position on every keypress.
3. The signal then runs: through the entry wheel, right-to-left
   through the three rotors, into the reflector, which sends it back
   left-to-right through the same rotors, out through the entry wheel.
4. A lamp above the keyboard lights: that is the ciphertext letter.

## A worked example

{{example:enigma-basic}}

This is the most famous sanity check in cryptology: Enigma I, rotors
I-II-III, reflector B, start positions `AAA`, typing `AAAAA` gives
**BDZGO**. Watch the middle column — the rotor window advances
`AAB, AAC, AAD…` as you type, and every A is enciphered at a
different rotor state, which is why the outputs differ.

## The rolling alphabet

- The **right rotor** advances on every keypress — 26 steps, then it
  carries into the middle rotor.
- Each rotor has a **notch**: when it steps *past* its notch (rotor I
  carries after Q), the wheel to its left steps too.
- The middle rotor has the famous **double-step** quirk: being at its
  own notch makes it step on two consecutive keypresses, so the left
  rotor turns sooner than a clean odometer would suggest.

## Why the same machine encrypts and decrypts

The reflector maps letters in pairs (A↔Y, R↔U…) and never maps a
letter to itself. Because every stage of the path is traversed
forward and then backward in mirror order, the whole machine is its
own inverse: set the same start positions, type the ciphertext, and
the plaintext lamps light. That is why the tool has no real
"decrypt mode" — the swap button is a courtesy, not a necessity.

{{try:enigma-basic}}
