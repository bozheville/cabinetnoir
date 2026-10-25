// Nihilist cipher: a Polybius square plus a periodic numeric key. Every
// plaintext letter becomes its square coordinates ("34"), the key word
// becomes its own coordinate numbers, and the two add digit by digit
// WITHOUT carry — so the sum stays a coordinate-shaped number (22–110)
// and the ciphertext is a stream of numbers.
//
// Substitution + additive key: think Vigenère on numbers. Decryption
// subtracts the key's digits and looks the coordinates up in the square.
//
// Pure string in / string out, shared by the tool, the cracker, the
// worked examples and the challenges.

import {
  buildSquare,
  foldForSquare,
  fromCoordinates,
  toCoordinates,
} from '@encryptors/shared/polybius';

export interface NihilistCryptProps {
  input: string;
  // Keyed square keyword; empty → the plain 5x5 square (I/J merged).
  squareKey?: string;
  // The additive key word; its letters' coordinates repeat over the text.
  key: string;
  // Space-separated numbers (the classic presentation) or a continuous
  // digit stream.
  spaced?: boolean;
}

// Plaintext and key cleaning: uppercase, J folded into I (the shared
// square fold — the 5x5 Latin square has no J cell), letters only.
const cleanLetters = (text: string): string =>
  text
    .toUpperCase()
    .split('')
    .map((char) => foldForSquare(char))
    .join('')
    .replace(/[^A-Z]/g, '');

// Digit-by-digit addition without carry: 53 + 41 = 94, and 55 + 55 = 110
// (a sum of 10 overflows into the next decimal place — the famous "10"
// of Nihilist sums). Because the column sum can itself be 10, a value
// like 30 means 2|10, not 3|0.
export const noCarryAdd = (a: number, b: number): number =>
  (Math.floor(a / 10) + Math.floor(b / 10)) * 10 + (a % 10) + (b % 10);

// A ciphertext number's two digit-sums: 94 → [9, 4], 30 → [2, 10],
// 103 → [10, 3], 110 → [10, 10].
export const splitSum = (value: number): [number, number] => {
  if (value >= 30 && value % 10 === 0) {
    // The column sum overflowed to 10: 30–100 carry [v/10 − 1, 10].
    return [value / 10 - 1, 10];
  }
  if (value >= 100) {
    return [10, value - 100];
  }
  return [Math.floor(value / 10), value % 10];
};

// A value is a possible no-carry sum when both digit-sums land in
// 2–10 (two coordinates, each 11–55, added without carry).
export const isNihilistSum = (value: number): boolean => {
  // Column sum 10 first: 30, 40 … 100, and 110 for both sums at 10.
  if (value >= 30 && value <= 110 && value % 10 === 0) {
    return true;
  }
  if (value >= 22 && value <= 99) {
    return Math.floor(value / 10) >= 2 && value % 10 >= 2;
  }
  return value >= 102 && value <= 109;
};

const keyNumbers = (key: string, square: string): number[] =>
  cleanLetters(key).split('').map((letter) => {
    const pair = toCoordinates(letter, square);
    return Number(pair) || 0;
  });

export const nihilistEncrypt = ({
  input,
  squareKey,
  key,
  spaced = true,
}: NihilistCryptProps): string => {
  const square = buildSquare(squareKey ?? '', { size: 5 });
  const numbers = keyNumbers(key, square);
  if (numbers.length === 0) {
    return '';
  }
  const plaintext = cleanLetters(input);
  const sums = plaintext.split('').map((letter, index) => {
    const plain = Number(toCoordinates(letter, square)) || 0;
    const keyNumber = numbers[index % numbers.length];
    return noCarryAdd(plain, keyNumber);
  });
  return sums.join(spaced ? ' ' : '');
};

// Parses a ciphertext into its numbers. Whitespace / punctuation split
// the stream into groups; inside a group the digits are read as valid
// Nihilist sums with backtracking, so an ambiguous run ("1102" = 11 02
// or 110 + junk) resolves the way that keeps every number legal.
export const parseNihilistNumbers = (input: string): number[] => {
  const parseGroup = (digits: string): number[] | null => {
    const memo = new Map<number, number[] | null>();
    const walk = (start: number): number[] | null => {
      if (start === digits.length) {
        return [];
      }
      if (memo.has(start)) {
        return memo.get(start);
      }
      memo.set(start, null);
      for (const length of [3, 2]) {
        if (start + length > digits.length) {
          continue;
        }
        const value = Number(digits.slice(start, start + length));
        if (!isNihilistSum(value)) {
          continue;
        }
        const rest = walk(start + length);
        if (rest) {
          const result = [value, ...rest];
          memo.set(start, result);
          return result;
        }
      }
      return null;
    };
    return walk(0);
  };

  const groups = input.split(/[^0-9]+/).filter(Boolean);
  const numbers: number[] = [];
  for (const group of groups) {
    const parsed = parseGroup(group);
    if (parsed) {
      numbers.push(...parsed);
    }
  }
  return numbers;
};

export const nihilistDecrypt = ({
  input,
  squareKey,
  key,
}: NihilistCryptProps): string => {
  const square = buildSquare(squareKey ?? '', { size: 5 });
  const numbers = keyNumbers(key, square);
  if (numbers.length === 0) {
    return '';
  }
  return parseNihilistNumbers(input)
    .map((value, index) => {
      const [sumRow, sumColumn] = splitSum(value);
      const [keyRow, keyColumn] = splitSum(numbers[index % numbers.length]);
      const row = sumRow - keyRow;
      const column = sumColumn - keyColumn;
      if (row < 1 || row > 5 || column < 1 || column > 5) {
        return '';
      }
      return fromCoordinates(`${row}${column}`, square);
    })
    .join('');
};

// The key word's own coordinate numbers, as the tool's addition table
// shows them (one per key letter, repeating over the text).
export const nihilistKeyNumbers = (key: string, squareKey = ''): number[] =>
  keyNumbers(key, buildSquare(squareKey, { size: 5 }));
