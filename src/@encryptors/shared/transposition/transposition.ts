// Shared transposition core: the columnar transposition every layered
// cipher needs (ADFGVX today, the standalone Columnar cipher and rail
// fence follow-ups tomorrow). Pure math only — no React, no i18n.
//
// Two shapes are supported, mirroring the classic split:
// - padded (complete rectangle): the text is padded up to rows × width
//   and read off column by column — ADFGVX's stage 2.
// - irregular (incomplete last row): no padding; columns have uneven
//   lengths, the classic manual columnar cipher.

export interface ColumnarOptions {
  // false: pad the text to a full rectangle before reading the columns.
  // true: no padding; the last row stays incomplete.
  irregular?: boolean;
  // Pad character for padded mode ('X' is the classic filler).
  padChar?: string;
}

// Transposition key: letters only, uppercase. Duplicates are allowed and
// resolved left-to-right (standard columnar convention).
export const normalizeTranspositionKey = (key: string): string =>
  key.toUpperCase().replace(/[^A-Z]/g, '');

// Sorted column order: by key letter, ties broken left-to-right.
// E.g. 'CAB' → [2, 0, 1] (column 2 reads first, then 0, then 1).
export const columnOrder = (keyword: string): number[] =>
  keyword
    .split('')
    .map((letter, index) => ({ letter, index }))
    .sort((a, b) => (a.letter === b.letter ? a.index - b.index : a.letter < b.letter ? -1 : 1))
    .map((item) => item.index);

// How many letters column `column` holds for a text of `length` letters
// and `width` columns.
const columnLength = (length: number, width: number, column: number, irregular: boolean): number => {
  const rows = Math.ceil(length / width);
  const remainder = length % width;
  if (!irregular) {
    return rows;
  }
  return remainder === 0 || column < remainder ? rows : rows - 1;
};

export const columnarEncrypt = (
  text: string,
  order: number[],
  { irregular = false, padChar = 'X' }: ColumnarOptions = {},
): string => {
  if (order.length === 0) {
    return text;
  }
  const width = order.length;
  const length = text.length;
  const rows = Math.ceil(length / width);
  const grid = irregular
    ? text
    : text.padEnd(rows * width, padChar);
  let result = '';
  for (const column of order) {
    const height = columnLength(length, width, column, irregular);
    for (let row = 0; row < height; row += 1) {
      result += grid[row * width + column];
    }
  }
  return result;
};

// Inverse of columnarEncrypt. With irregular=false the text is assumed
// to be a full rectangle (possibly padded); with irregular=true the
// uneven column lengths are reconstructed from the remainder — this
// also decodes padded ciphertexts, whose remainder is 0.
export const columnarDecrypt = (
  ciphertext: string,
  order: number[],
  { irregular = false }: ColumnarOptions = {},
): string => {
  if (order.length === 0) {
    return ciphertext;
  }
  const width = order.length;
  const length = ciphertext.length;
  const rows = Math.ceil(length / width);
  const grid: (string | null)[] = new Array(rows * width).fill(null);
  let cursor = 0;
  for (const column of order) {
    const height = columnLength(length, width, column, irregular);
    for (let row = 0; row < height; row += 1) {
      grid[row * width + column] = ciphertext[cursor];
      cursor += 1;
    }
  }
  return grid.map((cell) => cell ?? '').join('');
};

// Double transposition: columnar applied twice with two keys — the
// classic WWI strengthening of the plain columnar cipher.
export const doubleColumnarEncrypt = (
  text: string,
  order1: number[],
  order2: number[],
  options: ColumnarOptions = {},
): string => columnarEncrypt(columnarEncrypt(text, order1, options), order2, options);

export const doubleColumnarDecrypt = (
  ciphertext: string,
  order1: number[],
  order2: number[],
  options: ColumnarOptions = {},
): string => columnarDecrypt(columnarDecrypt(ciphertext, order2, options), order1, options);
