// Playfair hill-climbing: guided, user-triggered improvement passes.
//
// One pass tries every cell swap, decrypts with the best-scoring result
// and keeps it only if the digraph score improves — the user watches the
// preview turn readable instead of an opaque auto-solve.
import { playfairDecrypt } from '../playfair-encryption';
import { scoreTrigrams } from '@encryptors/shared/analysis';

const ALPHABET_25 = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';

// The square as 25 letters, row by row; the key string format of the
// tool (letters joined row-wise) reproduces the exact same square via
// getSquare, so a recovered square is directly usable.
export const squareToKey = (square: string[]): string => square.join('');

export const keyToSquare = (key: string): string[] => {
  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const rest = ALPHABET_25
    .split('')
    .filter((letter) => !keyUpper.includes(letter));
  return [...new Set([...keyUpper.split(''), ...rest])].slice(0, 25);
};

export const randomSquare = (): string[] => {
  const letters = ALPHABET_25.split('');
  for (let i = letters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
};

// Digits-only score of the current square against the ciphertext.
export const scoreSquare = (square: string[], ciphertext: string): number => {
  const plaintext = playfairDecrypt(ciphertext, squareToKey(square));
  return scoreTrigrams(plaintext.replace(/[^A-Z]/g, ''));
};

// One best-improvement pass: try all 300 swaps, apply the single best
// one if (and only if) it improves the score. Returns whether anything
// changed — the auto-improve loop stops when a pass is a no-op.
export const improveOnce = (
  square: string[],
  ciphertext: string,
): { square: string[]; score: number; improved: boolean } => {
  let bestSquare = square;
  let bestScore = scoreSquare(square, ciphertext);

  for (let i = 0; i < 24; i += 1) {
    for (let j = i + 1; j < 25; j += 1) {
      const candidate = [...square];
      [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
      const score = scoreSquare(candidate, ciphertext);
      if (score > bestScore) {
        bestScore = score;
        bestSquare = candidate;
      }
    }
  }

  return {
    square: bestSquare,
    score: bestScore,
    improved: bestSquare !== square,
  };
};

// Repeated passes until nothing improves, then random perturbations
// (2-cell kicks) to escape local optima — iterated local search. The
// best square ever seen wins; every pass is cheap enough to stay
// synchronous in the UI.
export const autoImprove = (
  square: string[],
  ciphertext: string,
  maxPasses: number = 60,
): { square: string[]; score: number } => {
  let current = square;
  let currentScore = scoreSquare(current, ciphertext);
  let best = current;
  let bestScore = currentScore;
  let stalled = 0;

  for (let pass = 0; pass < maxPasses; pass += 1) {
    const result = improveOnce(current, ciphertext);
    if (result.improved) {
      current = result.square;
      currentScore = result.score;
      stalled = 0;
      if (currentScore > bestScore) {
        best = current;
        bestScore = currentScore;
      }
      continue;
    }
    // Stalled: kick with a random 2-cell swap and keep climbing.
    stalled += 1;
    if (stalled > 4) {
      break;
    }
    const i = Math.floor(Math.random() * 25);
    let j = Math.floor(Math.random() * 25);
    if (j === i) {
      j = (j + 1) % 25;
    }
    const kicked = [...current];
    [kicked[i], kicked[j]] = [kicked[j], kicked[i]];
    current = kicked;
    currentScore = scoreSquare(current, ciphertext);
  }

  return { square: best, score: bestScore };
};
