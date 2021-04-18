export const caesarEncrypt = (message: string, shift: number) => {
  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [input]: alphabet[(index + shift)%26],
  }), {});

  return message
    .replace(/[^a-zA-Z]/gi, '')
    .toUpperCase()
    .replace(/./g, (input) => `${alias[input]}`);
};

export const caesarDecrypt = (cryptogram: string, shift: number) => {
  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  const alias = alphabet.split('').reduce((result, input, index) => ({
    ...result,
    [alphabet[(index + shift)%26]]: input,
  }), {});

  return cryptogram
    .replace(/[^a-zA-Z]/gi, '')
    .toUpperCase()
    .replace(/./g, (input) => `${alias[input]}`);
};
