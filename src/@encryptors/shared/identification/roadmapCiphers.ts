// Minimal rail fence and columnar transposition helpers for
// identification. The columnar width scan now lives in the shared
// analysis library (@encryptors/shared/analysis/columnar) so the
// identification rules and the Columnar cracker share one
// implementation; this module re-exports it for the rule engine.
export { columnarCandidateScores } from '@encryptors/shared/analysis';

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
