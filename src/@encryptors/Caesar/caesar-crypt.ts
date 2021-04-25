export const caesarEncrypt = (input: string, shift: number) => {
  if (!input || !shift) {
    return '';
  }

  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [input]: alphabet[(index + shift)%26],
  }), {});

  return input
    .replace(/[^a-zA-Z]/gi, '')
    .toUpperCase()
    .replace(/./g, (input) => `${alias[input]}`);
};

export const caesarDecrypt = (input: string, shift: number) => {
  if (!input || !shift) {
    return '';
  }

  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [alphabet[(index + shift)%26]]: input,
  }), {});

  return input
    .replace(/[^a-zA-Z]/gi, '')
    .toUpperCase()
    .replace(/./g, (input) => `${alias[input]}`);
};
