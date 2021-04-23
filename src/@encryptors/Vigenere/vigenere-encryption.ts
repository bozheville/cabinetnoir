const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

const l2n = (letter: string): number => alphabet.indexOf(letter);
const n2l = (number: number): string => alphabet[(number + alphabet.length) % (alphabet.length)];

export const vigenereEncrypt = (input: string, key: string): string => {
  if (!key) {
    return '';
  }

  const keyArray = key.toUpperCase();
  let keyIndex = 0;

  return input
    .toUpperCase()
    .split('')
    .reduce((output, c) => /[A-Z]/.test(c)
        ? `${output}${n2l(l2n(c) + l2n(keyArray[keyIndex++ % keyArray.length]))}`
        : output
    , '');
};

export const vigenereDecrypt = (input: string, key: string): string => {
  if (!key) {
    return '';
  }

  const keyArray = key.toUpperCase();
  let keyIndex = 0;

  return input
    .toUpperCase()
    .split('')
    .reduce((output, c) => /[A-Z]/.test(c)
        ? `${output}${n2l(l2n(c) - l2n(keyArray[keyIndex++ % keyArray.length]))}`
        : output
    , '');
};
