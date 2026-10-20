// Shared Polybius square: the 5x5 (or 6x6) coordinate grid used by the
// Polybius cipher, Nihilist, tap code, ADFGVX and later Bifid.
//
// Pure string in / string out, no React, no i18n — the same contract as
// the shared transposition and analysis cores. The square is a 25/36
// character string; coordinates are label pairs ("11"…"55" for digits,
// "AA"…"XX" for the ADFGVX letters).

export type SquareSize = 5 | 6;

// How the 25th cell is shared on a 5x5 square: I/J merged (the classic
// English square, I kept) or C/K merged (the classical Greek-friendly
// variant, C kept). Ignored on a 6x6 square, which has room for all 26
// letters (plus the digits).
export type SquareMerge = 'IJ' | 'CK';

export interface PolybiusSquareOptions {
  size?: SquareSize;
  merge?: SquareMerge;
}

// Row/column labels. 5x5 squares default to digits 1–5; a 6x6 square
// digits 1–6. ADFGVX passes its fractionation letters instead.
export const squareLabels = (size: SquareSize): string =>
  Array.from({ length: size }, (_, index) => String(index + 1)).join('');

// The alphabet a square of this size holds. 5x5: 25 letters with the
// merge applied (IJ → J folded into I; CK → K folded into C). 6x6: all
// 26 letters plus the 10 digits.
export const squareAlphabet = (size: SquareSize, merge: SquareMerge = 'IJ'): string => {
  if (size === 6) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  const full = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (merge === 'CK') {
    // K shares C's cell: the K is dropped, C is kept.
    return full.replace('K', '');
  }
  // IJ: the J is dropped, I is kept.
  return full.replace('J', '');
};

// The letter a square cell stands for when reading it back (J and K
// come back as their merged partners).
export const foldForSquare = (letter: string, merge: SquareMerge = 'IJ'): string => {
  if (merge === 'CK') {
    return letter === 'K' ? 'C' : letter;
  }
  return letter === 'J' ? 'I' : letter;
};

// Builds the keyed square: the key letters (deduplicated, merge applied)
// come first, the rest of the alphabet follows. An empty key gives the
// plain square, so every consumer stays predictable even with no key.
export const buildSquare = (
  key: string,
  { size = 5, merge = 'IJ' }: PolybiusSquareOptions = {},
): string => {
  const alphabet = squareAlphabet(size, merge);
  const folded = size === 5
    ? key.toUpperCase().split('').map((char) => foldForSquare(char, merge)).join('')
    : key.toUpperCase();
  const keyClean = folded.replace(
    new RegExp(`[^${alphabet.replace(/[\\^\]]/g, '')}]`, 'g'),
    '',
  );

  const square: string[] = [];
  for (const char of keyClean) {
    if (alphabet.includes(char) && !square.includes(char)) square.push(char);
  }
  for (const char of alphabet) {
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
