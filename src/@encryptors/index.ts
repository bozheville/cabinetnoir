export { default as Affine, AffineDescription } from './Affine';
export { default as Base64 } from './Base64';
export { default as Caesar, CaesarDescription } from './Caesar';
export { default as Enigma } from './Enigma';
export { default as Morse, MorseDescription } from './Morse';
export { default as Playfair } from './Playfair';
export { default as Vigenere } from './Vigenere';
export { default as Rot13, Rot13Description } from './Rot13';

export const encodingsList = [
  'base64',
  'rot13',
];

export const encryptorsList = [
  'affine',
  'caesar',
  'enigma',
  'morse',
  'playfair',
  'vigenere',
];
