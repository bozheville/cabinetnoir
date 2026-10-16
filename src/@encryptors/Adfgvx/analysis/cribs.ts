// Cribs for the substitution stage: a guessed plaintext fragment, checked
// against the symbol stream under the current partial mapping.

import { SymbolMapping } from './frequency';

export interface CribMatch {
  // Index of the first symbol of the match.
  start: number;
}

// A position matches when, for every crib letter with a known symbol
// mapping, the symbol at that position maps to exactly that letter, and
// no symbol maps to two different letters. Unknown positions stay open —
// the crib may reveal them.
export const findCribMatches = (
  symbols: string[],
  crib: string,
  mapping: SymbolMapping,
): CribMatch[] => {
  const matches: CribMatch[] = [];

  for (let start = 0; start + crib.length <= symbols.length; start += 1) {
    const symbolToLetter: SymbolMapping = {};
    let consistent = true;

    for (let offset = 0; offset < crib.length; offset += 1) {
      const symbol = symbols[start + offset];
      const letter = crib[offset];
      const mapped = mapping[symbol];

      if (mapped && mapped !== letter) {
        consistent = false;
        break;
      }
      if (symbolToLetter[symbol] && symbolToLetter[symbol] !== letter) {
        consistent = false;
        break;
      }
      symbolToLetter[symbol] = letter;
    }

    if (consistent) matches.push({ start });
  }

  return matches;
};
