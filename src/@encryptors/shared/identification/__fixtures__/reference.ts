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

// Each plaintext letter maps to one of its homophones (extra symbols
// for common letters), rotated deterministically through the list.
// The homophones are letters of the same alphabet (the simplest
// letter-preserving variant), which flattens the frequency profile.
const HOMOPHONE_TABLE: Record<string, string[]> = {
  A: ['Q', 'X'], B: ['B'], C: ['C'], D: ['D'], E: ['Z', 'J', 'K'],
  F: ['F'], G: ['G'], H: ['H'], I: ['Y', 'W'], J: ['J'], K: ['K'],
  L: ['L'], M: ['M'], N: ['N'], O: ['V'], P: ['P'], Q: ['Q'], R: ['R'],
  S: ['S'], T: ['T'], U: ['U'], V: ['V'], W: ['W'], X: ['X'], Y: ['Y'], Z: ['Z'],
};

export const homophonicEncrypt = (letters: string): string =>
  letters.split('').map((letter, index) => {
    const homophones = HOMOPHONE_TABLE[letter] || [letter];
    return homophones[index % homophones.length];
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
