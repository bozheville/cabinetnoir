// Pure math for the Columnar cracker: width candidates and the
// column-pair adjacency matrix the "order the columns" step scores with.
// Complete (padded) grids only — the ciphertext length divides evenly by
// the true width, which is itself the first width filter. Irregular
// cracking is a later stretch.
//
// The width scorer: for a candidate width, cut the ciphertext into that
// many contiguous columns (true when the width is right) and measure how
// English-like the best column *chain* is — the sum over a greedy chain
// of column pairs, each pair scored by the digraphs its rows form when
// placed side by side. At the true width, real English neighbours light
// up; at wrong widths the pairs are noise. The cheap identify width scan
// (columnarCandidateScores in shared analysis) serves as a tie-breaker.

import {
  columnarCandidateScores,
  scoreDigraphs,
  scoreTrigrams,
} from '@encryptors/shared/analysis';

export interface WidthCandidate {
  width: number;
  score: number;
}

// Cut a ciphertext whose length divides evenly by `width` into that many
// contiguous columns (each of length rows). Complete grids only.
export const splitIntoColumns = (ciphertext: string, width: number): string[] => {
  if (width < 2 || ciphertext.length % width !== 0) {
    return [];
  }
  const rows = ciphertext.length / width;
  return Array.from({ length: width }, (_, column) =>
    ciphertext.slice(column * rows, (column + 1) * rows));
};

// English-likeness of two columns standing side by side in the plaintext
// grid: the row-wise pairs (columnA[r], columnB[r]) are exactly the
// horizontal digraphs the pair contributes.
export const digraphPairScore = (columnA: string, columnB: string): number =>
  scoreDigraphs(columnA.split('').map((letter, index) => letter + columnB[index]).join(''));

// Full adjacency matrix: matrix[i][j] = score of column i followed by
// column j (the vertical digraphs they form together).
export const pairScoreMatrix = (columns: string[]): number[][] => {
  const width = columns.length;
  const matrix: number[][] = Array.from({ length: width }, () => new Array(width).fill(0));
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (i !== j) {
        matrix[i][j] = digraphPairScore(columns[i], columns[j]);
      }
    }
  }
  return matrix;
};

// Greedy best chain through the pair matrix: repeatedly take the highest
// scored pair whose tail has no outgoing and whose head has no incoming
// edge until w-1 edges form a chain. Cheap, deterministic, and a good
// upper-bound proxy for the best column arrangement.
export const bestChainScore = (matrix: number[][]): number => {
  const width = matrix.length;
  if (width < 2) {
    return 0;
  }
  const pairs: Array<{ score: number; from: number; to: number }> = [];
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < width; j += 1) {
      if (i !== j) {
        pairs.push({ score: matrix[i][j], from: i, to: j });
      }
    }
  }
  pairs.sort((a, b) => b.score - a.score);
  const hasOutgoing: boolean[] = new Array(width).fill(false);
  const hasIncoming: boolean[] = new Array(width).fill(false);
  let sum = 0;
  let used = 0;
  for (const { score, from, to } of pairs) {
    if (hasOutgoing[from] || hasIncoming[to]) {
      continue;
    }
    hasOutgoing[from] = true;
    hasIncoming[to] = true;
    sum += score;
    used += 1;
    if (used === width - 1) {
      break;
    }
  }
  return sum / (width - 1);
};

// The source column that reads best immediately after `source` — the
// easy hint's "best partner" outline. null when the matrix is trivial.
export const bestPartnerOf = (matrix: number[][], source: number): number | null => {
  if (matrix.length < 2 || source >= matrix.length) {
    return null;
  }
  let best = -1;
  let bestScore = -Infinity;
  for (let candidate = 0; candidate < matrix.length; candidate += 1) {
    if (candidate !== source && matrix[source][candidate] > bestScore) {
      bestScore = matrix[source][candidate];
      best = candidate;
    }
  }
  return best === -1 ? null : best;
};

// Ranked width candidates: complete-grid divisors of the ciphertext
// length only, scored by the adjacency chain, tie-broken by the identify
// width scan. The user picks from these cards — the ranking is a hint.
export const rankWidths = (
  ciphertext: string,
  maxWidth: number = 12,
): WidthCandidate[] => {
  const scan = columnarCandidateScores(ciphertext, scoreTrigrams, maxWidth);
  const scanScoreOf = (width: number): number =>
    scan.find((entry) => entry.width === width)?.score ?? 0;

  const candidates: WidthCandidate[] = [];
  for (let width = 2; width <= maxWidth; width += 1) {
    if (ciphertext.length < width * 2 || ciphertext.length % width !== 0) {
      continue;
    }
    const matrix = pairScoreMatrix(splitIntoColumns(ciphertext, width));
    // Blend: the chain carries the signal, the scan breaks near-ties.
    const score = Math.round(bestChainScore(matrix) + 0.25 * scanScoreOf(width));
    candidates.push({ width, score });
  }
  return candidates.sort((a, b) => b.score - a.score || a.width - b.width);
};
