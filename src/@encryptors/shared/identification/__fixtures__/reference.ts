// Reference implementations of the still-roadmap ciphers, for the
// accuracy fixture corpus ONLY. Keyword, columnar and rail fence shipped
// real engines (m1-01/m1-07/m1-13); Polybius and Nihilist followed in M2
// (m2-01..m2-12) — the corpus encrypts with those now. Homophonic
// remains a roadmap item, so its test-only implementation lives here.
// Never imported from UI code.
//
// Deterministic: same text + same key → same output, always.

// --- Homophonic ---

// The classic numeric homophonic table: common letters get several
// two-digit codes, rare letters one. 84 codes in total (11-94), so the
// ciphertext carries far more distinct symbols than any 26-letter
// substitution could — the fingerprint the rule looks for.
const HOMOPHONE_COUNTS: Record<string, number> = {
  E: 10, T: 8, A: 7, O: 7, I: 6, N: 6, S: 5, H: 5, R: 5, D: 4, L: 4,
  C: 3, U: 3, M: 2, W: 2, F: 2, G: 2, Y: 2, P: 1, B: 1, V: 1, K: 1,
  J: 1, X: 1, Q: 1, Z: 1,
};

// code assignment: letters in frequency order, codes running 11, 12, ...
const HOMOPHONE_CODES: Record<string, string[]> = (() => {
  const table: Record<string, string[]> = {};
  let code = 11;
  for (const letter of 'ETAOINSHRDLCUMWFGYPBVKJXQZ') {
    const count = HOMOPHONE_COUNTS[letter];
    table[letter] = Array.from({ length: count }, () => {
      const value = code;
      code += 1;
      return String(value).padStart(2, '0');
    });
  }
  return table;
})();

export const homophonicEncrypt = (letters: string): string =>
  letters.split('').map((letter, index) => {
    if (!/[A-Z]/.test(letter)) {
      return letter;
    }
    const homophones = HOMOPHONE_CODES[letter] || [letter];
    // Deterministic but aperiodic pick: the stride mixes the index with
    // the code, so no linear period survives in the ciphertext.
    return homophones[(index * 31 + letter.charCodeAt(0) * 17) % homophones.length];
  }).join('');

// --- Nihilist ---

// Polybius square (5x5, I/J merged) + key addition: plaintext coords
// plus key coords, digit by digit, no carry — the classic Nihilist sum.
const polybiusCoords = (letter: string): [number, number] => {
  const index = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.indexOf(letter === 'J' ? 'I' : letter);
  return [Math.floor(index / 5) + 1, (index % 5) + 1];
};

export const nihilistEncrypt = (letters: string, key: string): string => {
  const keyCoords = key
    .toUpperCase().replace(/[^A-Z]/g, '').split('')
    .map(polybiusCoords);
  if (keyCoords.length === 0) {
    return '';
  }
  const noCarry = (a: number, b: number): number => {
    const digits = [Math.floor(a / 10) + Math.floor(b / 10), (a % 10) + (b % 10)];
    return digits[0] * 10 + digits[1];
  };
  return letters
    .split('')
    .map((letter, index) => {
      const [r, c] = polybiusCoords(letter);
      const [kr, kc] = keyCoords[index % keyCoords.length];
      return String(noCarry(r * 10 + c, kr * 10 + kc));
    })
    .join(' ');
};
