// Rebuilding a square from a decipher mapping: the shared step every
// Polybius-based cracker ends on. The mapping speaks in coordinate pairs
// ("23" on digit labels, "DG" on ADFGVX letters) and the assembler reads
// each pair back to its cell, filling untouched cells either with dots
// (the worksheet view) or with the remaining alphabet in order (the
// hand-off case, where the tool needs a complete square).
//
// Pure string in / string out, same contract as the shared square core.

import {
  coordinatesToIndex,
  mergeFolds,
  squareAlphabet,
  squareLabels,
  SquareMerge,
  SquareSize,
} from './polybius';

export interface AssembleSquareOptions {
  size?: SquareSize;
  // Row/column labels the mapping's pairs use; defaults to the digits
  // 1–size. ADFGVX passes its fractionation letters.
  labels?: string;
  merge?: SquareMerge;
  // The alphabet untouched cells fill from in 'auto' mode; defaults to
  // the square's own alphabet.
  alphabet?: string;
  // 'dots': untouched cells render as '·' — the decipher worksheet, so
  // the user sees exactly what is still unknown.
  // 'auto': untouched cells take the remaining alphabet letters in
  // order, so the result is always a complete square.
  fill?: 'dots' | 'auto';
}

export const assembleSquareFromMapping = (
  mapping: Record<string, string>,
  {
    size = 5,
    labels = squareLabels(size),
    merge = 'IJ',
    alphabet,
    fill = 'dots',
  }: AssembleSquareOptions = {},
): string => {
  const alphabetString = squareAlphabet(size, merge, alphabet);
  const cells: (string | null)[] = new Array(size * size).fill(null);
  const used = new Set<string>();

  for (const [pair, letter] of Object.entries(mapping)) {
    if (!letter) {
      continue;
    }
    const index = coordinatesToIndex(pair, labels);
    if (index === -1) {
      continue;
    }
    cells[index] = letter;
    used.add(letter);
  }

  if (fill === 'auto') {
    const rest = alphabetString.split('').filter((char) => !used.has(char));
    let cursor = 0;
    return cells.map((cell) => cell ?? rest[cursor++] ?? '').join('');
  }
  return cells.map((cell) => cell ?? '·').join('');
};

// The deciphered square re-expanded into the full alphabet so the
// keyword engine can read it: the fold letter rides in right after its
// merged partner (J after I on the Latin square) — the position that
// keying a square with the original keyword would have produced. Used
// by the cracker hand-off, where the keyword guess recovers the user's
// keyword rather than the folded 25-letter square.
export const expandSquare = (
  square: string,
  merge: SquareMerge = 'IJ',
): string => {
  const { fold, into } = mergeFolds(merge);
  if (!fold || square.includes(fold)) {
    return square;
  }
  const intoIndex = square.indexOf(into);
  if (intoIndex === -1) {
    return square;
  }
  return `${square.slice(0, intoIndex + 1)}${fold}${square.slice(intoIndex + 1)}`;
};
