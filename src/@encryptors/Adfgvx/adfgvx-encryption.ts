// ADFGVX / ADFGX cipher: a fractionated Polybius square (letters, or
// letters + digits for ADFGVX) followed by a keyed columnar transposition.
//
// The same engine handles both variants: the variant only changes the
// Polybius square size (5x5 letters for ADFGX, 6x6 letters + digits for
// ADFGVX) and therefore the fractionation alphabet (ADFGX vs ADFGVX).
//
// Pure string in / string out, shared by the tool, the cracker, the worked
// examples and the challenges, so all of them stay consistent.

import {
  columnOrder,
  columnarEncrypt,
  columnarDecrypt,
  normalizeTranspositionKey,
} from '@encryptors/shared/transposition';

export type AdfgvxVariant = 'adfgx' | 'adfgvx';

// Column headers of the Polybius square, per variant.
const FRACTION_CHARS: Record<AdfgvxVariant, string> = {
  adfgx: 'ADFGX',
  adfgvx: 'ADFGVX',
};

// Square alphabet per variant. ADFGX: 25 letters, I and J share a cell
// (I is kept, J is folded into it). ADFGVX: 26 letters + 10 digits.
export const SQUARE_ALPHABET: Record<AdfgvxVariant, string> = {
  adfgx: 'ABCDEFGHIKLMNOPQRSTUVWXYZ',
  adfgvx: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
};

const isAdfgvxChar = (char: string, variant: AdfgvxVariant): boolean =>
  FRACTION_CHARS[variant].includes(char);

// Builds the keyed square: the key letters (deduplicated, J folded into I)
// come first, the rest of the alphabet follows. An empty key gives the
// plain square, so the engine stays predictable even with no key.
export function buildSquare(key: string, variant: AdfgvxVariant): string {
  const alphabet = SQUARE_ALPHABET[variant];
  const square: string[] = [];
  const keyClean = key
    .toUpperCase()
    .replace(/J/g, 'I')
    .replace(/[^A-Z0-9]/g, '');

  for (const char of keyClean) {
    if (alphabet.includes(char) && !square.includes(char)) square.push(char);
  }
  for (const char of alphabet) {
    if (!square.includes(char)) square.push(char);
  }
  return square.join('');
}

// Plaintext cleaning: uppercase, strip separators. ADFGX only takes
// letters (J -> I, no digits); ADFGVX takes letters and digits.
function cleanPlaintext(text: string, variant: AdfgvxVariant): string {
  const cleaned = text.toUpperCase().replace(/J/g, 'I');
  const allowed = variant === 'adfgx' ? /[^A-Z]/g : /[^A-Z0-9]/g;
  return cleaned.replace(allowed, '');
}

// Columnar transposition lives in the shared transposition core
// (@encryptors/shared/transposition): the fractionated text is padded
// with 'X' coordinates up to a full rectangle (rows x key length) and
// read off column by column in key-letter order. Padding keeps every
// column the same length, so the ciphertext splits back into columns
// without knowing the key — this is what makes the guided cracker's
// column analysis possible. Decryption runs the remainder-aware
// irregular decode, which handles both the padded rectangle and
// external ciphertexts with a short last row (trailing pad coordinates
// decode to a few junk letters at the end of the plaintext).

// Fractionate: every plaintext letter becomes its square coordinates.
function fractionate(plaintext: string, square: string, variant: AdfgvxVariant): string {
  const size = FRACTION_CHARS[variant].length;
  let fractionated = '';
  for (const char of plaintext) {
    const index = square.indexOf(char);
    if (index === -1) continue;
    fractionated += FRACTION_CHARS[variant][Math.floor(index / size)];
    fractionated += FRACTION_CHARS[variant][index % size];
  }
  return fractionated;
}

// Map coordinate pairs back to letters via the square.
function unfractionate(fractionated: string, square: string, variant: AdfgvxVariant): string {
  const size = FRACTION_CHARS[variant].length;
  let plaintext = '';
  for (let i = 0; i + 1 < fractionated.length; i += 2) {
    const row = FRACTION_CHARS[variant].indexOf(fractionated[i]);
    const column = FRACTION_CHARS[variant].indexOf(fractionated[i + 1]);
    if (row === -1 || column === -1) continue;
    plaintext += square[row * size + column];
  }
  return plaintext;
}

export function adfgvxEncrypt(
  text: string,
  squareKey: string,
  transpositionKey: string,
  variant: AdfgvxVariant = 'adfgvx',
): string {
  const square = buildSquare(squareKey, variant);
  const plaintext = cleanPlaintext(text, variant);
  const fractionated = fractionate(plaintext, square, variant);
  return columnarEncrypt(
    fractionated,
    columnOrder(normalizeTranspositionKey(transpositionKey)),
  );
}

export function adfgvxDecrypt(
  text: string,
  squareKey: string,
  transpositionKey: string,
  variant: AdfgvxVariant = 'adfgvx',
): string {
  const square = buildSquare(squareKey, variant);
  const fractionChars = FRACTION_CHARS[variant];
  // Ciphertext tolerance: anything that is not a fractionation letter is
  // ignored, so pasted ciphertext with stray characters still decodes.
  const ciphertext = text.toUpperCase().replace(new RegExp(`[^${fractionChars}]`, 'g'), '');
  const fractionated = columnarDecrypt(
    ciphertext,
    columnOrder(normalizeTranspositionKey(transpositionKey)),
    { irregular: true },
  );
  return unfractionate(fractionated, square, variant);
}
