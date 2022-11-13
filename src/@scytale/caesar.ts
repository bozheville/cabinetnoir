import { monoalphabeticEncrypt } from './monoalphabetic-crypt';
import { getAlphabet } from '@encryptors/constants';
import { rotate } from '@encryptors/utils';

const DEFAULT_ALPHABET = getAlphabet({ key: 'latin' }).value;

export const encryptCaesar = (
  input: string,
  shift: number,
  keepSpaces = false,
  keepCase = false
) => {
  const alphabet = DEFAULT_ALPHABET;
  const targetAlphabet = rotate(alphabet, alphabet.length - shift);
  // TODO: Remove console.log
  console.log(`${(new Date()).toLocaleString('de-DE')} caesar.ts -> 15 ~~~ targetAlphabet`, targetAlphabet);


  return monoalphabeticEncrypt({
    alphabet,
    input,
    targetAlphabet,
    keepSpaces,
    keepCase,
  });
};

export const decryptCaesar = (  input: string,
  shift: number,
  keepSpaces = false,
  keepCase = false
) => {
  const alphabet = rotate(DEFAULT_ALPHABET, DEFAULT_ALPHABET.length - shift);
  const targetAlphabet = DEFAULT_ALPHABET;

  return monoalphabeticEncrypt({
    alphabet,
    input,
    targetAlphabet,
    keepSpaces,
    keepCase,
  });
};
