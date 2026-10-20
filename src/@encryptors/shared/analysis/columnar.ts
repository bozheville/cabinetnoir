// Columnar-width helpers moved here from the identification rules
// (roadmapCiphers.ts) so the identify tool and the Columnar cracker use
// one implementation instead of two drifting copies. The identification
// rule imports this through roadmapCiphers' re-export; the cracker uses
// it directly.
//
// Reading a transposed text back into rows of `width` and scoring the
// column sequences is the cheap first-pass width scan. The cracker's
// stronger chain scorer lives in @encryptors/Columnar/analysis.

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
