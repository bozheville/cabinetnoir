import { Rotor, Reflector, Plugboard, EntryWheel, Enigma } from 'enigma';

// The tool's fixed configuration: Enigma I with rotors I-II-III
// (left to right), reflector B, no plugboard and a straight entry
// wheel. The three-letter key sets the rotor start positions only —
// a real Enigma key also carried the rotor order, the ring settings
// and the plugboard pairs (see the learning content).
export const createEnigmaMachine = (): Enigma =>
  new Enigma(
    [
      new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q'),
      new Rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE', 'E'),
      new Rotor('BDFHJLCPRTXVZNYEIWGAKMUSQO', 'V'),
    ],
    new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT'),
    new Plugboard(''),
    new EntryWheel('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
  );

// One full signal pass, identical to Enigma.prototype.signal minus the
// stepping — lets callers encipher at an exactly known rotor state
// (the worked example shows the window reading for every letter).
export const enigmaPass = (machine: Enigma, letter: string): string => {
  let signal = machine.steckerbrett.signal(letter);
  signal = machine.etw.signal(signal);
  for (let i = machine.rotors.length - 1; i >= 0; i--) {
    signal = machine.rotors[i].signal(signal);
  }
  signal = machine.ukw.signal(signal);
  for (let j = 0; j < machine.rotors.length; j++) {
    signal = machine.rotors[j].signal(signal, true);
  }
  signal = machine.etw.signal(signal, true);
  return machine.steckerbrett.signal(signal, true);
};
