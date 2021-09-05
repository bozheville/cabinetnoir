interface MonoalphabeticEncryptProps {
  input: string
  targetAlphabet: string;
  keepSpaces?: boolean;
  keepCase?: boolean;
  alphabet: string;
}

const getDisAllowedSymbolsRegex = (keepSpaces: boolean, alphabet: string) =>
  new RegExp(`[^${alphabet}${keepSpaces ? ' ' : ''}]`, 'gi');

export const monoalphabeticEncrypt = ({
  alphabet,
  input,
  targetAlphabet,
  keepSpaces = false,
  keepCase = false
}: MonoalphabeticEncryptProps): string => {
  if (!input || !targetAlphabet) {
    throw new Error('You have to provide both: input and targetAlphabet')
  }

  if (targetAlphabet.length !== alphabet.length) {
    throw new Error('alphabet length mismatch');
  }

  const mod = alphabet.length;

  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [input]: targetAlphabet[(index)%mod],
    [input.toLowerCase()]: targetAlphabet[(index)%mod].toLowerCase(),
  }), {});

  return input
    .replace(getDisAllowedSymbolsRegex(keepSpaces, alphabet), '')
    .replace(
      /./g,
      (input) => `${keepCase ? (alias[input] || input) : (alias[input.toUpperCase()] || input)}`
    );
};

export const monoalphabeticDecrypt = ({
  alphabet,
  input,
  targetAlphabet,
}: MonoalphabeticEncryptProps): string => {
  if (!input || !targetAlphabet) {
    throw new Error('You have to provide both: input and targetAlphabet')
  }

  if (targetAlphabet.length !== alphabet.length) {
    throw new Error('alphabet length mismatch');
  }

  const mod = alphabet.length;

  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [targetAlphabet[(index)%mod]]: input,
    [targetAlphabet[(index)%mod].toLowerCase()]: input.toLowerCase(),
  }), {});

  return input
    .replace(getDisAllowedSymbolsRegex(true, alphabet), '')
    .replace(
      /./g,
      (input) => `${alias[input] || input}`
    );
};
