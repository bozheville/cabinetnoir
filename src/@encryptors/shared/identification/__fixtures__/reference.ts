// Reference implementations of the roadmap ciphers, for the accuracy
// fixture corpus ONLY (task 11). These are not app engines — the app
// has no tool for these ciphers yet — so they live next to the tests
// and are never imported from UI code.
//
// Deterministic: same text + same key → same output, always.

// --- Rail fence ---

export const railFenceEncrypt = (letters: string, rails: number): string => {
  if (rails < 2 || letters.length < rails) {
    return letters;
  }
  const rows: string[][] = Array.from({ length: rails }, () => []);
  let row = 0;
  let direction = 1;
  for (const letter of letters) {
    rows[row].push(letter);
    if (rails > 2) {
      if (row === 0) {
        direction = 1;
      } else if (row === rails - 1) {
        direction = -1;
      }
      row += direction;
    } else {
      row = row === 0 ? 1 : 0;
    }
  }
  return rows.flat().join('');
};

// --- Columnar transposition ---

// Key = column permutation, e.g. [2,0,1]: column 2 first, then 0, 1.
export const columnarEncrypt = (letters: string, key: number[]): string => {
  const width = key.length;
  if (width < 2 || letters.length < width * 2) {
    return letters;
  }
  const rows = Math.ceil(letters.length / width);
  const padded = letters.padEnd(rows * width, 'X');
  const output: string[] = [];
  for (const column of key) {
    for (let row = 0; row < rows; row += 1) {
      output.push(padded[row * width + column]);
    }
  }
  return output.join('');
};

// --- Keyword substitution ---

// Keyword + remaining letters, e.g. key KRYPTOS → KRYPTOSABCDFGH...
export const keywordAlphabet = (keyword: string): string => {
  const seen = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  const rest = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .filter((letter) => !seen.includes(letter));
  return (seen + rest.join('')).slice(0, 26);
};

export const keywordEncrypt = (letters: string, keyword: string): string =>
  letters
    .split('')
    .map((letter) => keywordAlphabet(keyword)[letter.charCodeAt(0) - 65])
    .join('');

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
