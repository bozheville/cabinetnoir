interface AffineEncryptProps {
  input: string;
  multiplier: number;
  shift: number;
  keepSpaces?: boolean;
  keepCase?: boolean;
}

const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

const isCoprimePair = (a, b) => {
  const smaller = a > b ? b : a;

  for (let d = 2; d <= smaller; d++) {
    if (a%d === 0 && b%d === 0) {
      return false;
    }
  }

  return true;
}

const mod = (a, m) => {
  let tmp = a;

  while (tmp < 0) {
    tmp = tmp + m;
  }

  return tmp % m;
}

const getDisAllowedSymbolsRegex = (keepSpaces: boolean) =>
  new RegExp(`[^a-zA-Z${keepSpaces ? ' ' : ''}]`, 'gi');

export const affineEncrypt = ({
  input,
  multiplier,
  shift,
  keepSpaces = false,
  keepCase = false
}: AffineEncryptProps) => {
  if (!input || !shift || !multiplier || !isCoprimePair(multiplier, alphabet.length)) {
    return '';
  }

  const alias = alphabet.split('').reduce((result, input, index) => {
    const aliasIndex = mod((multiplier * index + shift), 26);

    return {
      ...result,
      [input]: alphabet[aliasIndex],
      [input.toLowerCase()]: alphabet[aliasIndex].toLowerCase(),
    };
  }, {});

  return input
    .replace(getDisAllowedSymbolsRegex(keepSpaces), '')
    .replace(
      /./g,
      (input) => `${keepCase ? (alias[input] || input) : (alias[input.toUpperCase()] || input)}`
    );
};

export const affineDecrypt = ({
  input,
  multiplier = 3,
  shift,
}: AffineEncryptProps) => {
  if (!input || !shift || !isCoprimePair(multiplier, alphabet.length)) {
    return '';
  }

  const alias = alphabet.split('').reduce((result, input, index) => {
    const aliasIndex =  mod((26 - multiplier) * (index - shift), 26);

    return {
      ...result,
      [input]: alphabet[aliasIndex],
      [input.toLowerCase()]: alphabet[aliasIndex].toLowerCase(),
    };
  }, {});


  return input
    .replace(getDisAllowedSymbolsRegex(true), '')
    .replace(
      /./g,
      (input) => `${alias[input] || input}`
    );
};
