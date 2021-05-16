interface CaesarEncryptProps {
  input: string
  shift: number;
  keepSpaces?: boolean;
  keepCase?: boolean;
}

const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

const getDisAllowedSymbolsRegex = (keepSpaces: boolean) =>
  new RegExp(`[^a-zA-Z${keepSpaces ? ' ' : ''}]`, 'gi');

export const caesarEncrypt = ({
  input,
  shift,
  keepSpaces = false,
  keepCase = false
}: CaesarEncryptProps) => {
  if (!input || !shift) {
    return '';
  }

  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [input]: alphabet[(index + shift)%26],
    [input.toLowerCase()]: alphabet[(index + shift)%26].toLowerCase(),
  }), {});

  return input
    .replace(getDisAllowedSymbolsRegex(keepSpaces), '')
    .replace(
      /./g,
      (input) => `${keepCase ? (alias[input] || input) : (alias[input.toUpperCase()] || input)}`
    );
};

export const caesarDecrypt = ({
  input,
  shift,
}: CaesarEncryptProps) => {
  if (!input || !shift) {
    return '';
  }

  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [alphabet[(index + shift)%26]]: input,
    [alphabet[(index + shift)%26].toLowerCase()]: input.toLowerCase(),
  }), {});


  return input
    .replace(getDisAllowedSymbolsRegex(true), '')
    .replace(
      /./g,
      (input) => `${alias[input] || input}`
    );
};
