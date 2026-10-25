// Assembling the recovered keys from the cracker state, so the wizard can
// hand them back to the tool.
//
// The square is defined by the user's symbol mapping itself: the symbol
// (row coordinate, column coordinate) maps to the letter that belongs in
// that cell. Whatever orientation the column pairs ended up in, the
// mapping and the square stay consistent — the square is simply "the
// square that decrypts this ciphertext the way the user read it".
// Delegates to the shared Polybius assembler ('auto' fill: cells the
// mapping never touched take the remaining alphabet letters in order, so
// the square is always a full permutation).

import { assembleSquareFromMapping } from '@encryptors/shared/polybius';
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
  return assembleSquareFromMapping(mapping, {
    size: fractionChars.length as 5 | 6,
    labels: fractionChars,
    alphabet: SQUARE_ALPHABET[variant],
    fill: 'auto',
  });
};

// Transposition key reconstructed from the arrangement: slot i holds chunk
// arrangement[i], so key[i] must be the letter whose alphabetical rank
// equals arrangement[i]. Distinct letters keep the column order exact.
export const deriveTranspositionKey = (arrangement: number[]): string =>
  arrangement.map((chunk) => KEY_LETTERS[chunk] ?? '').join('');
