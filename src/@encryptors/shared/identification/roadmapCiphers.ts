// Minimal rail fence and columnar transposition helpers for
// identification. The columnar width scan now lives in the shared
// analysis library (@encryptors/shared/analysis/columnar) so the
// identification rules and the Columnar cracker share one
// implementation; this module re-exports it for the rule engine.
export { columnarCandidateScores } from '@encryptors/shared/analysis';

// Rail fence: the classic zigzag. `rails` rails, reading the fence row
// by row (no offset variants in v1). The engine moved to the shared
// transposition library when the RailFence tool shipped; the guards keep
// the identification behaviour for short texts byte-identical.
import { railFenceDecrypt as railFenceDecryptEngine } from '@encryptors/shared/transposition';

export const railFenceDecrypt = (letters: string, rails: number): string =>
  rails < 2 || letters.length < rails
    ? letters
    : railFenceDecryptEngine(letters, rails);

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
