// The autokey cipher — the cipher actually described by Blaise de
// Vigenère in 1586 (Giovan Battista Bellaso invented the idea in 1553).
// The key starts with a short primer and then feeds on itself: every
// plaintext letter becomes key material one primer-length later, so the
// keystream is `primer + plaintext` and the period breaks down — no
// repeating key for Kasiski to find.
//
//   keystream: QUEENLYATTACKAT   (primer QUEENLY, then the plaintext
//                                 ATTACKATDAWN itself)
//   plaintext: ATTACKATDAWN
//   ciphertext: C = P + K (mod 26) — exactly Vigenère's sum, only the
//               keystream differs.
//
// Conventions follow the Vigenère engine: letters-only, uppercased
// output, the keystream advances over the clean letters only.

export const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface AutokeyOptions {
  // Keep spaces in the output, riding between the enciphered letters
  // exactly where they sat in the input (rail-fence convention). The
  // keystream advances on letters only.
  keepSpaces?: boolean;
}

const mod = (value: number, length: number): number => ((value % length) + length) % length;

const cleanPrimer = (primer: string, alphabet: string): string =>
  primer.toUpperCase().split('').filter((letter) => alphabet.includes(letter)).join('');

// The keystream for a known plaintext: primer followed by the plaintext
// itself. Exported for the tool's keystream row — the "aha" visual.
export const autokeyKeystream = (
  plaintext: string,
  primer: string,
  alphabet: string = DEFAULT_ALPHABET,
): string => [
  ...cleanPrimer(primer, alphabet).split(''),
  ...plaintext.toUpperCase().split('').filter((letter) => alphabet.includes(letter)),
].join('');

const transform = (
  input: string,
  primer: string,
  alphabet: string,
  decrypt: boolean,
  keepSpaces: boolean,
): string => {
  const primerArray = cleanPrimer(primer, alphabet);
  if (!input || !primerArray) {
    return '';
  }

  const primerLength = primerArray.length;
  const length = alphabet.length;
  // Plain letters recovered so far (encryption: the input's letters,
  // decryption: the output's letters) — exactly what the keystream needs
  // one primer-length later. Kept apart from the output so keepSpaces
  // cannot offset the memory.
  const plainLetters: string[] = [];
  const output: string[] = [];

  for (const char of input.toUpperCase()) {
    if (char === ' ' && keepSpaces) {
      output.push(' ');
      continue;
    }
    if (!alphabet.includes(char)) {
      continue;
    }

    const i = plainLetters.length;
    const keyLetter = i < primerLength
      ? primerArray[i]
      : plainLetters[i - primerLength];

    const key = alphabet.indexOf(keyLetter);
    const letter = alphabet.indexOf(char);
    if (key < 0 || letter < 0) {
      continue;
    }

    const result = decrypt
      ? mod(letter - key, length) // P = C − K
      : mod(letter + key, length); // C = P + K
    const plainChar = decrypt ? alphabet[result] : char;
    plainLetters.push(plainChar);
    output.push(alphabet[result]);
  }
  return output.join('');
};

export const autokeyEncrypt = (
  input: string,
  primer: string,
  alphabet: string = DEFAULT_ALPHABET,
  options: AutokeyOptions = {},
): string =>
  transform(input, primer, alphabet, false, options.keepSpaces ?? false);

export const autokeyDecrypt = (
  input: string,
  primer: string,
  alphabet: string = DEFAULT_ALPHABET,
  options: AutokeyOptions = {},
): string =>
  transform(input, primer, alphabet, true, options.keepSpaces ?? false);
