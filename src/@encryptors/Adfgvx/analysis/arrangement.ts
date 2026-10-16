// Column arrangement: turning ciphertext chunks back into the
// fractionated stream.
//
// The engine pads the fractionated text to a full rectangle and reads the
// grid columns off in key order, so the ciphertext is K chunks, one per
// grid column, in an unknown order. Given an arrangement (which chunk sits
// in which grid slot), the fractionated stream is the row-major weave of
// the chunks, and the symbols — the "letters" of the monoalphabetic
// substitution the square stage has to solve — are consecutive pairs of
// that stream.
//
// For an even key length every symbol stays inside one row, so the
// arrangement is just a matching of adjacent slot pairs (0,1), (2,3)...;
// the order of the pairs among themselves only permutes letter positions,
// which the substitution stage does not care about. For an odd key length
// symbols cross row boundaries, so the full slot order matters.
//
// The pairing signal: a chi-square independence test on the contingency
// table of the zipped coordinate pairs. A true adjacent pair zips a
// row-coordinate stream with a column-coordinate stream of the SAME
// letters — the square ties them together, and the table departs strongly
// from independence. Random or same-parity pairings stay much closer to
// independent. (Raw index of coincidence fails here: a keyed square makes
// the row marginals themselves heavily skewed, which inflates same-parity
// pairings; the chi-square test corrects for the marginals.)

import { splitColumns } from './columns';

// Chi-square statistic of independence on the coordinate contingency
// table of two zipped columns. dof = (rows-1)*(cols-1) of the square, so
// a value well above it means the two coordinates are tied — a true pair.
export const edgeScore = (
  columns: string[],
  left: number,
  right: number,
  fractionChars: string,
): number => {
  const leftColumn = columns[left];
  const rightColumn = columns[right];
  const size = fractionChars.length;
  const length = Math.min(leftColumn.length, rightColumn.length);
  if (length < 4 * size) return 0;

  const rowIndex = new Map<string, number>();
  for (let i = 0; i < size; i += 1) rowIndex.set(fractionChars[i], i);

  const table: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));
  for (let i = 0; i < length; i += 1) {
    const row = rowIndex.get(leftColumn[i]);
    const column = rowIndex.get(rightColumn[i]);
    if (row === undefined || column === undefined) continue;
    table[row][column] += 1;
  }

  const rowSums = table.map((row) => row.reduce((a, b) => a + b, 0));
  const columnSums = Array.from({ length: size }, (_, j) => table.reduce((a, row) => a + row[j], 0));

  let chi2 = 0;
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const expected = (rowSums[i] * columnSums[j]) / length;
      if (expected > 0) chi2 += (table[i][j] - expected) ** 2 / expected;
    }
  }
  return chi2;
};

// The row-major weave of the chunks under an arrangement: arrangement[i]
// is the ciphertext chunk that sits in grid slot i.
export const weave = (columns: string[], arrangement: number[]): string => {
  if (columns.length === 0) return '';
  const rows = columns[0].length;
  let woven = '';
  for (let row = 0; row < rows; row += 1) {
    for (const chunk of arrangement) {
      woven += columns[chunk][row] || '';
    }
  }
  return woven;
};

// Consecutive pairs of the woven stream: the substitution symbols.
export const symbolsOf = (woven: string): string[] => {
  const symbols: string[] = [];
  for (let i = 0; i + 1 < woven.length; i += 2) {
    symbols.push(woven.slice(i, i + 2));
  }
  return symbols;
};

// Symbols of an arrangement, straight through.
export const arrangementSymbols = (columns: string[], arrangement: number[]): string[] =>
  symbolsOf(weave(columns, arrangement));

// Suggested arrangement for a candidate key length.
//
// Even K: greedy slot-pair matching — repeatedly take the unused chunk
// pair with the best edge score and place the pairs left to right (pair
// order only permutes letters).
// Odd K: greedy path — start from the chunk with the strongest outgoing
// edge and repeatedly append the unused chunk with the best edge from the
// current tail.
export const suggestArrangement = (
  columns: string[],
  keyLength: number,
  fractionChars: string,
): number[] => {
  const unused = new Set(columns.map((_, index) => index));
  const arrangement: number[] = [];

  if (keyLength % 2 === 0) {
    while (unused.size >= 2) {
      let best: { left: number; right: number; score: number } | null = null;
      for (const left of unused) {
        for (const right of unused) {
          if (left === right) continue;
          const score = edgeScore(columns, left, right, fractionChars);
          if (!best || score > best.score) best = { left, right, score };
        }
      }
      if (!best) break;
      arrangement.push(best.left, best.right);
      unused.delete(best.left);
      unused.delete(best.right);
    }
    if (unused.size === 1) arrangement.push([...unused][0]);
    return arrangement;
  }

  // Odd K: greedy path.
  let tail = -1;
  let bestStart = -Infinity;
  for (const start of unused) {
    let outgoing = 0;
    for (const other of unused) {
      if (other === start) continue;
      outgoing = Math.max(outgoing, edgeScore(columns, start, other, fractionChars));
    }
    if (outgoing > bestStart) {
      bestStart = outgoing;
      tail = start;
    }
  }
  if (tail === -1) return [];

  arrangement.push(tail);
  unused.delete(tail);
  while (unused.size > 0) {
    let best: { chunk: number; score: number } | null = null;
    for (const candidate of unused) {
      const score = edgeScore(columns, tail, candidate, fractionChars);
      if (!best || score > best.score) best = { chunk: candidate, score };
    }
    if (!best) break;
    arrangement.push(best.chunk);
    unused.delete(best.chunk);
    tail = best.chunk;
  }
  return arrangement;
};

// Rebuild the split + arrangement from a ciphertext for the wizard.
export const analyzeArrangement = (
  cipherText: string,
  keyLength: number,
  fractionChars: string,
) => {
  const { columns, rows } = splitColumns(cipherText, keyLength);
  const arrangement = suggestArrangement(columns, keyLength, fractionChars);
  const symbols = arrangementSymbols(columns, arrangement);
  return { columns, rows, arrangement, symbols };
};

// Mean edge score of an arrangement's slot-adjacencies — the quality
// number the wizard shows for a candidate key length. For an odd key
// length only the edges that actually carry symbols count (every second
// slot edge), and they carry half the rows each, so the mean is a rougher
// hint there.
export const arrangementQuality = (
  columns: string[],
  arrangement: number[],
  keyLength: number,
  fractionChars: string,
): number => {
  if (arrangement.length < 2) return 0;
  const step = keyLength % 2 === 0 ? 2 : 1;
  let total = 0;
  let count = 0;
  for (let slot = 0; slot + step < arrangement.length; slot += step) {
    total += edgeScore(columns, arrangement[slot], arrangement[slot + step], fractionChars);
    count += 1;
  }
  return count === 0 ? 0 : total / count;
};
