# How to decrypt an Enigma message

To decrypt an Enigma message you set the machine exactly as the sender
did and type the ciphertext. Enigma is reciprocal: if A becomes B at
one position, B becomes A there. So the same settings turn the
ciphertext back into plaintext. In this tool you choose only the
three-letter start position, and any other position gives nonsense.

## Using the decrypt tool

- Paste the ciphertext into {{control:message-input}}; the plaintext
  appears in {{control:output}}.
- Enter the sender's start position in {{control:key}}, for example
  `AAA`. It must be exactly three letters.
- The rest of the machine is fixed: rotors I, II and III, reflector B,
  no plugboard. A real message also needed the sender's rotor order,
  ring settings and plugboard pairs.
- Spaces, digits and punctuation are dropped. The plaintext comes out
  as one run of capitals, so add the word breaks yourself.
- Encrypting and decrypting are the same here, so {{control:swap}}
  only changes the label.

## A quick example

`BDZGO` with the start position `AAA` gives `AAAAA`. Each letter
returns to A because the rotors step through the same five positions
the sender's did.

A wrong start position gives nonsense at once. `AAB` gives `JJJFK`:
moving the right rotor by one place changes every letter.

## No key?

This tool has no Enigma cracker. The machine was not the weak point:
the procedures around it were. Doubled message keys, routine phrases
({{term:crib}}) and lazy keys let Polish and British codebreakers in.

- [Breaking the Enigma](/encoder/enigma/learn#breaking-it): the
  doubled key, cribs and the bombe
- [How the Enigma machine works](/encoder/enigma/learn): rotors,
  stepping and the reflector
- [The history of Enigma](/encoder/enigma/history), from Scherbius to
  the Polish bomba and Bletchley Park
- [Enigma practice challenges](/encoder/enigma/practice) to decrypt
- [Identify an unknown cipher](/identify) if you are not sure it is
  Enigma
