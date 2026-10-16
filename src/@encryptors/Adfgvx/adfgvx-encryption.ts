// ADFGVX / ADFGX cipher: a fractionated Polybius square (letters, or
// letters + digits for ADFGVX) followed by a keyed columnar transposition.
//
// The same engine handles both variants: the variant only changes the
// Polybius square size (5x5 letters for ADFGX, 6x6 letters + digits for
// ADFGVX) and therefore the fractionation alphabet (ADFGX vs ADFGVX).
//
// Pure string in / string out, shared by the tool, the cracker, the worked
// examples and the challenges, so all of them stay consistent.

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

// Transposition key: letters only, uppercase. Duplicates are allowed and
// resolved left-to-right (standard columnar convention).
function normalizeTranspositionKey(key: string): string {
  return key.toUpperCase().replace(/[^A-Z]/g, '');
}

// Sorted column order: by key letter, ties broken left-to-right.
function columnOrder(key: string): number[] {
  return key
    .split('')
    .map((letter, index) => ({ letter, index }))
    .sort((a, b) => (a.letter === b.letter ? a.index - b.index : a.letter < b.letter ? -1 : 1))
    .map((item) => item.index);
}

// Columnar transposition, encryption side: the fractionated text is padded
// with 'X' coordinates up to a full rectangle (rows x key length) and
// written row-major, then read off column by column in key-letter order.
// Padding keeps every column the same length, so the ciphertext splits
// back into columns without knowing the key — this is what makes the
// guided cracker's column analysis possible.
function transpose(fractionated: string, key: string): string {
  if (!key) return fractionated;

  const length = fractionated.length;
  const columns = key.length;
  const rows = Math.ceil(length / columns);
  const padded = fractionated.padEnd(rows * columns, 'X');

  let result = '';
  for (const column of columnOrder(key)) {
    for (let row = 0; row < rows; row += 1) {
      result += padded[row * columns + column];
    }
  }
  return result;
}

// Columnar transposition, decryption side: each column in key order gets
// an equal slice of the ciphertext (full rectangle), then the grid is read
// row-major. Unpadded (external) ciphertext with a short last row still
// decodes through the remainder logic. Trailing pad coordinates decode to
// a few junk letters at the end of the plaintext.
function untranspose(ciphertext: string, key: string): string {
  if (!key) return ciphertext;

  const length = ciphertext.length;
  const columns = key.length;
  const rows = Math.ceil(length / columns);
  const remainder = length % columns;
  const order = columnOrder(key);

  const grid: (string | null)[] = new Array(rows * columns).fill(null);
  let cursor = 0;
  for (const column of order) {
    const columnLength = remainder === 0 || column < remainder ? rows : rows - 1;
    for (let row = 0; row < columnLength; row += 1) {
      grid[row * columns + column] = ciphertext[cursor];
      cursor += 1;
    }
  }
  return grid.map((cell) => cell ?? '').join('');
}

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
  return transpose(fractionated, normalizeTranspositionKey(transpositionKey));
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
  const fractionated = untranspose(ciphertext, normalizeTranspositionKey(transpositionKey));
  return unfractionate(fractionated, square, variant);
}
