// Assembling the recovered keys from the cracker state, so the wizard can
// hand them back to the tool.
//
// The square is defined by the user's symbol mapping itself: the symbol
// (row coordinate, column coordinate) maps to the letter that belongs in
// that cell. Whatever orientation the column pairs ended up in, the
// mapping and the square stay consistent — the square is simply "the
// square that decrypts this ciphertext the way the user read it".
// Cells the mapping never touched are filled with the remaining alphabet
// letters in order, so the square is always a full permutation.

import { AdfgvxVariant, SQUARE_ALPHABET } from '../adfgvx-encryption';
import { SymbolMapping } from './frequency';

// Letters for the derived transposition key: distinct, so the column order
// is unambiguous. key[slot] gets the letter whose alphabetical rank equals
// the chunk index sitting in that slot.
const KEY_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const assembleSquare = (
  mapping: SymbolMapping,
  variant: AdfgvxVariant,
): string => {
  const fractionChars = variant === 'adfgx' ? 'ADFGX' : 'ADFGVX';
  const size = fractionChars.length;
  const alphabet = SQUARE_ALPHABET[variant];

  const square: (string | null)[] = new Array(size * size).fill(null);
  const used = new Set<string>();

  for (const [symbol, letter] of Object.entries(mapping)) {
    const row = fractionChars.indexOf(symbol[0]);
    const column = fractionChars.indexOf(symbol[1]);
    if (row === -1 || column === -1 || !letter) continue;
    square[row * size + column] = letter;
    used.add(letter);
  }

  // Fill untouched cells with the letters (and digits) not used yet.
  const rest = alphabet.split('').filter((char) => !used.has(char));
  let cursor = 0;
  return square
    .map((cell) => cell ?? rest[cursor++] ?? '')
    .join('');
};

// Transposition key reconstructed from the arrangement: slot i holds chunk
// arrangement[i], so key[i] must be the letter whose alphabetical rank
// equals arrangement[i]. Distinct letters keep the column order exact.
export const deriveTranspositionKey = (arrangement: number[]): string =>
  arrangement.map((chunk) => KEY_LETTERS[chunk] ?? '').join('');
