export const DEFAULT_ALPHABET = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

// The cracker's analysis is built on the 26 English letters; a reshuffled
// alphabet still works, but foreign letters (Cyrillic etc.) do not.
export const isEnglishAlphabet = (alphabet: string): boolean =>
  alphabet.length === 26
  && alphabet.split('').every((letter) => letter >= 'A' && letter <= 'Z');

const l2n = (letter: string, alphabet: string): number => alphabet.indexOf(letter);
const n2l = (number: number, alphabet: string): string =>
  alphabet[(number + alphabet.length) % (alphabet.length)];

export const vigenereEncrypt = (input: string, key: string, alphabet: string = DEFAULT_ALPHABET): string => {
  if (!input || !key) {
    return '';
  }

  const keyArray = key
    .toUpperCase()
    .split('')
    .filter((letter) => alphabet.includes(letter))
    .join('');
  if (!keyArray) {
    return '';
  }
  let keyIndex = 0;

  return input
    .toUpperCase()
    .split('')
    .reduce((output, c) => alphabet.includes(c)
        ? `${output}${n2l(l2n(c, alphabet) + l2n(keyArray[keyIndex++ % keyArray.length], alphabet), alphabet)}`
        : output
    , '');
};

export const vigenereDecrypt = (input: string, key: string, alphabet: string = DEFAULT_ALPHABET): string => {
  if (!input || !key) {
    return '';
  }

  const keyArray = key
    .toUpperCase()
    .split('')
    .filter((letter) => alphabet.includes(letter))
    .join('');
  if (!keyArray) {
    return '';
  }
  let keyIndex = 0;

  return input
    .toUpperCase()
    .split('')
    .reduce((output, c) => alphabet.includes(c)
        ? `${output}${n2l(l2n(c, alphabet) - l2n(keyArray[keyIndex++ % keyArray.length], alphabet), alphabet)}`
        : output
    , '');
};
