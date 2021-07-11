import { mod } from '@math';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const reflection = 'EJMZALYXVBWFCRQUONTSPIKHGD'; // Type A
const reflection = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'; // Type B
// const reflection = 'FVPJIAOYEDRZXWGCTKUQSBNMHL'; // Type C

const offset = 0;

const modBase = alphabet.length;

const getMappings = (localAlphabet) => {

  const values = localAlphabet.split('');

  const mapping = {};
  const reverseMapping = {};

  for (const [index, char] of values.entries()) {
    const alphabetChar = alphabet[index];
    mapping[alphabetChar] = char;
    reverseMapping[char] = alphabetChar;
  }

  return {
    localAlphabet,
    mapping,
    reverseMapping,
  };
};

const ROTOR_TYPES = {
  1: {
    name: 'Type I',
    rotateNextRotor: ['Q'],
    ...getMappings('EKMFLGDQVZNTOWYHXUSPAIBRCJ')
  },
  2: {
    name: 'Type II',
    rotateNextRotor: ['E'],
    ...getMappings('AJDKSIRUXBLHWTMCQGZNPYFVOE')
  },
  3: {
    name: 'Type III',
    rotateNextRotor: ['V'],
    ...getMappings('BDFHJLCPRTXVZNYEIWGAKMUSQO')
  },
  4: {
    name: 'Type IV',
    rotateNextRotor: ['J'],
    localAlphabet: ''
  },
  5: {
    name: 'Type V',
    rotateNextRotor: ['Z'],
    localAlphabet: ''
  },
  6: {
    name: 'Type VI',
    rotateNextRotor: ['M', 'Z'],
    localAlphabet: ''
  },
  7: {
    name: 'Type VII',
    rotateNextRotor: ['M', 'Z'],
    localAlphabet: ''
  },
  8: {
    name: 'Type VIII',
    rotateNextRotor: ['M', 'Z'],
    localAlphabet: ''
  },
}

console.log(ROTOR_TYPES);

const rotatedString = (string, offset) => string.slice(offset) + string.slice(0, offset);

class Rotor {
  value = 0;
  defaultShift = 0;
  rotorType;

  constructor(shift, type = 1) {
    this.setDefaultShift(shift);
    this.rotorType = type;
  }

  getRotorInfo() {
    return `${ROTOR_TYPES[this.rotorType].name} / shift: ${this.value}`;
  }

  sholdIncrementNextRotor() {

  }

  setDefaultShift(shift) {
    this.value = shift;
    this.defaultShift = shift;
  }

  reset() {
    this.value = this.defaultShift;
  }

  increment() {
    const currentValue = this.value;

    this.value = mod(this.value + 1, modBase);

    if (ROTOR_TYPES[this.rotorType].rotateNextRotor.includes(alphabet[currentValue])) {
      return 1;
    }

    return 0;
  }

  getCurrentShift() {
    return this.value;
  }

  encrypt(char) {
    const index = mod(alphabet.indexOf(char) + this.value, modBase);

    return ROTOR_TYPES[this.rotorType].mapping[alphabet[index]];
  }

  decrypt(char) {
    return ROTOR_TYPES[this.rotorType].reverseMapping[char];
  }
}

const recursivelyRotateRotors = (rotors, index = 0) => {
  const result = rotors[index].increment();


  if (result === 1) {
    recursivelyRotateRotors(rotors, index + 1);
  }
}

export const enigmaEncrypt = ({
  input,
  key='AAZ'
}) => {
  console.log('____                                                ___   _____');
  console.log('|  _ \\    ___   _ __ ___     ___   __   __   ___    |_ _| |_   _|');
  console.log('| |_) |  / _ \\ | \'_ ` _ \\   / _ \\  \\ \\ / /  / _ \\    | |    | |');
  console.log('|  _ <  |  __/ | | | | | | | (_) |  \\ V /  |  __/    | |    | |');
  console.log('|_| \\_\\  \\___| |_| |_| |_|  \\___/    \\_/    \\___|   |___|   |_|');
  //
  console.log('key', key);
  // ^^^^^^^^

  const rotors = [
    new Rotor(alphabet.indexOf(key[2]), 3),
    new Rotor(alphabet.indexOf(key[1]), 2),
    new Rotor(alphabet.indexOf(key[0]), 1),
  ]

  return input
    .toUpperCase()
    .replace(/[^A-Z]/gi, '')
    .split('').map((c) => {

    recursivelyRotateRotors(rotors);

    const trace = [];
    let m = c;
    let mm;

    for (let i = 0; i < key.length; i++) {
      mm = m;
      m = rotors[i].encrypt(m);
      trace.push(`${mm} -> ${m} | ${rotors[i].getRotorInfo()}`);
    }

    mm = m;
    m = getMappings(reflection).mapping[m];
    trace.push(`${mm} -> ${m} | Reflected`);

    for (let i = key.length - 1; i >= 0 ; i--) {
      mm = m;
      m = rotors[i].decrypt(m);
      trace.push(`${mm} -> ${m} | ${rotors[i].getRotorInfo()} (inv)`);
    }

    console.log(trace.join('\n'));

    return m;
  })
  .join('');
};
