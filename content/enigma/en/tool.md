# About the Enigma machine

Enigma was an electro-mechanical cipher machine used by the German
armed forces from the late 1920s through the Second World War. Each
key press sends current through three {{term:rotor}}s and a
{{term:reflector}}, and the rotors step after every letter, so the
substitution alphabet changes with each character. Polish
cryptologists broke it first; Bletchley Park read it at scale.

## How to use this tool

- Type your message into {{control:message-input}}; the result appears
  in {{control:output}}. Only the letters A–Z are processed — spaces,
  digits and punctuation are dropped, as on the real machine, which had
  no space bar.
- Enter the three-letter start position in {{control:key}}, for
  example `AAA` (the default). Anything other than exactly three
  letters gives no output.
- The machine is fixed: an Enigma I with rotors I, II and III, reflector
  B and no plugboard. On a real key sheet the start position was only
  one part of the key.
- Enigma is self-reciprocal: with the same start position, encrypting
  the ciphertext gives the plaintext back. {{control:swap}} is there
  only for symmetry.

## A quick example

`AAAAA` with the start position `AAA` gives `BDZGO`. The same letter
comes out five different ways, because the right rotor steps before
each key press — and no letter ever encrypts to itself.

## Go further

- [How the Enigma machine works](/encoder/enigma/learn): rotors,
  stepping and the reflector
- [The history of Enigma](/encoder/enigma/history), from Scherbius to
  the Polish bomba and Bletchley Park
- [Enigma practice challenges](/encoder/enigma/practice)
