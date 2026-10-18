// Minimal rail fence and columnar transposition helpers for
// identification. These two ciphers are roadmap items (no engine in the
// app yet), but their rules need to *try undoing* the transposition and
// score the result — so the decryption side lives here, next to the
// identification rules. The test-only reference encryptors (task 10)
// reuse them for round-trip sanity.

// Rail fence: the classic zigzag. `rails` rails, reading the fence row
// by row (no offset variants in v1).
export const railFenceDecrypt = (letters: string, rails: number): string => {
  if (rails < 2 || letters.length < rails) {
    return letters;
  }

  // Which row each position belongs to.
  const pattern: number[] = [];
  let row = 0;
  let direction = 1;
  for (let index = 0; index < letters.length; index += 1) {
    pattern.push(row);
    row += direction;
    if (row === rails - 1 || row === 0) {
      direction = -direction;
    }
  }

  const rows: string[][] = Array.from({ length: rails }, () => []);
  let cursor = 0;
  for (let r = 0; r < rails; r += 1) {
    for (let index = 0; index < letters.length; index += 1) {
      if (pattern[index] === r) {
        rows[r].push(letters[cursor]);
        cursor += 1;
      }
    }
  }

  const rowCursors = new Array(rails).fill(0);
  const output: string[] = [];
  for (let index = 0; index < letters.length; index += 1) {
    const r = pattern[index];
    output.push(rows[r][rowCursors[r]]);
    rowCursors[r] += 1;
  }
  return output.join('');
};

// Columnar transposition without the key: read the ciphertext into
// `width` columns row by row, then take the columns in turn as
// candidate plaintext fragments. A correct width gives rows (or columns)
// that read like English fragments; scored with digraph statistics.
export const columnarCandidateScores = (
  letters: string,
  scoreText: (text: string) => number,
  maxWidth: number = 12,
): Array<{ width: number; score: number }> => {
  const scores: Array<{ width: number; score: number }> = [];
  for (let width = 2; width <= maxWidth; width += 1) {
    if (letters.length < width * 2) {
      break;
    }
    // Plaintext was written in rows of `width`; the ciphertext hides the
    // column order, but reading the ciphertext back into rows of `width`
    // keeps *some* rows close to plaintext fragments when the column
    // order is a permutation of consecutive columns. Score every column
    // read top-to-bottom as a sequence.
    const rows = Math.ceil(letters.length / width);
    let sum = 0;
    let counted = 0;
    for (let column = 0; column < width; column += 1) {
      const sequence: string[] = [];
      for (let row = 0; row < rows; row += 1) {
        const index = row * width + column;
        if (index < letters.length) {
          sequence.push(letters[index]);
        }
      }
      if (sequence.length >= 4) {
        sum += scoreText(sequence.join(''));
        counted += 1;
      }
    }
    scores.push({ width, score: counted > 0 ? Math.round(sum / counted) : 0 });
  }
  return scores.sort((a, b) => b.score - a.score || a.width - b.width);
};

// Rail fence: undo rails 2..10 and score the plaintext candidate.
export const railFenceCandidateScores = (
  letters: string,
  scoreText: (text: string) => number,
  maxRails: number = 10,
): Array<{ rails: number; score: number }> => {
  const scores: Array<{ rails: number; score: number }> = [];
  for (let rails = 2; rails <= maxRails; rails += 1) {
    if (letters.length < rails * 3) {
      break;
    }
    scores.push({ rails, score: scoreText(railFenceDecrypt(letters, rails)) });
  }
  return scores.sort((a, b) => b.score - a.score || a.rails - b.rails);
};
