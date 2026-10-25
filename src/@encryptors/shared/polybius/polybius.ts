// Shared Polybius square: the 5x5 (or 6x6) coordinate grid used by the
// Polybius cipher, Nihilist, tap code, ADFGVX and later Bifid.
//
// Pure string in / string out, no React, no i18n — the same contract as
// the shared transposition and analysis cores. The square is a 25/36
// character string; coordinates are label pairs ("11"…"55" for digits,
// "AA"…"XX" for the ADFGVX letters).

export type SquareSize = 5 | 6;

// How two letters share one cell on a square that has no room for both:
// either a named preset or an explicit rule. 'IJ' merges J into I (the
// classic English 5x5 square, I kept); 'CK' merges K into C (the
// classical Greek-friendly variant, C kept). Ignored when the square's
// alphabet has a cell for every letter (6x6 Latin, custom alphabets
// shorter than the grid).
export interface SquareMergeRule {
  // The letter that disappears (J on an IJ square).
  fold: string;
  // The letter that keeps the cell (I on an IJ square).
  into: string;
}

export type SquareMerge = 'IJ' | 'CK' | SquareMergeRule;

// Resolves a merge spec into its fold/into pair.
export const mergeFolds = (merge: SquareMerge): SquareMergeRule =>
  merge === 'IJ'
    ? { fold: 'J', into: 'I' }
    : merge === 'CK'
      ? { fold: 'K', into: 'C' }
      : merge;

export interface PolybiusSquareOptions {
  size?: SquareSize;
  merge?: SquareMerge;
  // The letters the square holds, as a plain string read in cell order.
  // Absent → the Latin defaults (25 letters for 5x5, letters + digits
  // for 6x6). Any alphabet fits: a Greek 24-letter string on a 5x5
  // square leaves its last cell unused.
  alphabet?: string;
}

// Row/column labels. 5x5 squares default to digits 1–5; a 6x6 square
// digits 1–6. ADFGVX passes its fractionation letters instead.
export const squareLabels = (size: SquareSize): string =>
  Array.from({ length: size }, (_, index) => String(index + 1)).join('');

// The alphabet a square of this size holds. 5x5: 25 letters with the
// merge applied (IJ → J folded into I; CK → K folded into C). 6x6: all
// 26 letters plus the 10 digits. A custom alphabet replaces the Latin
// default wholesale. A preset merge only kicks in when the alphabet
// cannot fit the grid (26 letters on a 25-cell square) — on a square
// with room for every letter (6x6 Latin, a shorter custom alphabet)
// nothing folds. An explicit merge rule always folds.
export const squareAlphabet = (
  size: SquareSize,
  merge: SquareMerge = 'IJ',
  alphabet?: string,
): string => {
  const base = alphabet
    ?? (size === 6
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const { fold } = mergeFolds(merge);
  const cannotFit = base.length > size * size;
  if (!fold || (typeof merge === 'string' && !cannotFit)) {
    return base;
  }
  // The fold letter drops: its partner keeps the shared cell.
  return base.split('').filter((char) => char !== fold).join('');
};

// The letter a square cell stands for when reading it back — the fold
// letter comes back as its merged partner (J reads as I on an IJ square).
export const foldForSquare = (letter: string, merge: SquareMerge = 'IJ'): string => {
  const { fold, into } = mergeFolds(merge);
  return letter === fold ? into : letter;
};

// Builds the keyed square: the key letters (deduplicated) come first,
// the rest of the alphabet follows. An empty key gives the plain square,
// so every consumer stays predictable even with no key. Key letters the
// alphabet has no cell for fold into their merged partner (J → I on the
// classic 5x5 Latin square; on a 6x6 square J has a cell, so it stays).
export const buildSquare = (
  key: string,
  { size = 5, merge = 'IJ', alphabet }: PolybiusSquareOptions = {},
): string => {
  const alphabetString = squareAlphabet(size, merge, alphabet);
  const folded = key
    .toUpperCase()
    .split('')
    .map((char) => (alphabetString.includes(char) ? char : foldForSquare(char, merge)))
    .join('');
  const keyClean = folded.replace(
    new RegExp(`[^${alphabetString.replace(/[\\^\]\-]/g, '\\$&')}]`, 'g'),
    '',
  );

  const square: string[] = [];
  for (const char of keyClean) {
    if (alphabetString.includes(char) && !square.includes(char)) square.push(char);
  }
  for (const char of alphabetString) {
    if (!square.includes(char)) square.push(char);
  }
  return square.join('');
};

// Letter → coordinate pair using the given row/column labels ("23"
// with digit labels, "DG" with ADFGVX labels). Unknown letters yield
// an empty string.
const labelsForSquare = (square: string): string =>
  squareLabels(square.length > 0 ? Math.round(Math.sqrt(square.length)) as SquareSize : 5);

export const toCoordinates = (
  letter: string,
  square: string,
  labels: string = labelsForSquare(square),
): string => {
  const index = square.indexOf(letter.toUpperCase());
  if (index === -1) {
    return '';
  }
  const size = labels.length;
  return `${labels[Math.floor(index / size)]}${labels[index % size]}`;
};

// Coordinate pair → letter via the square. Unknown coordinates yield
// an empty string.
export const fromCoordinates = (
  coordinates: string,
  square: string,
  labels: string = labelsForSquare(square),
): string => {
  if (coordinates.length !== 2) {
    return '';
  }
  const row = labels.indexOf(coordinates[0].toUpperCase());
  const column = labels.indexOf(coordinates[1].toUpperCase());
  if (row === -1 || column === -1) {
    return '';
  }
  const size = labels.length;
  return square[row * size + column] ?? '';
};

// Every coordinate pair of a square, reading order — '11' through '55'
// for a 5×5 square. Square-rebuilding UIs lay their cells out in this
// order so the assignment board IS the square.
export const squareCoordinates = (size: SquareSize): string[] =>
  Array.from({ length: size * size }, (_, index) =>
    `${Math.floor(index / size) + 1}${(index % size) + 1}`);

// The square cell index (0-based) of a coordinate pair, or -1.
export const coordinatesToIndex = (
  coordinates: string,
  labels: string = squareLabels(5),
): number => {
  if (coordinates.length !== 2) {
    return -1;
  }
  const row = labels.indexOf(coordinates[0].toUpperCase());
  const column = labels.indexOf(coordinates[1].toUpperCase());
  if (row === -1 || column === -1) {
    return -1;
  }
  const size = labels.length;
  return row * size + column;
};
