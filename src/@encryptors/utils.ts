export const rotate = (input: string, n: number): string =>
  `${input.slice(n)}${input.slice(0, n)}`;

export const reverse = (input: string): string =>
  input.split('').reverse().join('');

export const isCoprimePair = (a: number, b: number) => {
  const smaller = a > b ? b : a;

  for (let d = 2; d <= smaller; d++) {
    if (a%d === 0 && b%d === 0) {
      return false;
    }
  }

  return true;
};

export const mod = (a: number, m: number) => {
  let tmp = a;

  while (tmp < 0) {
    tmp = tmp + m;
  }

  return tmp % m;
};

export const getAffineAlphabet = ({
  alphabet,
  multiplier,
  shift,
}) => {
  if (!isCoprimePair(alphabet.length, multiplier)) {
    throw new Error('multiplier and alphabet.length should be coprime');
  }

  return alphabet
    .split('')
    .reduce(
      (result, input, index) => `${result}${alphabet[mod(multiplier * index + shift, alphabet.length)]}`
      , ''
    );
};
