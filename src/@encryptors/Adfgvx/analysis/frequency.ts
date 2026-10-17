// Frequency analysis over the un-fractionated symbols: the substitution
// stage of the ADFGVX attack. Once the columns are paired correctly, the
// ciphertext is a plain substitution cipher over 25 (ADFGX) or 36 (ADFGVX)
// symbols — classic frequency analysis plus cribs finishes it.

export interface SymbolFrequency {
  symbol: string;
  count: number;
}

// English letter frequency order, most common first. J is missing (the
// ADFGX square folds it into I); for ADFGVX the digits just sit at the
// bottom of the ranking.
// Derived from the shared Lewand table (see @encryptors/shared/analysis),
// so the two can never drift apart: sort the 26 letter frequencies by
// value, then drop J.
import { ENGLISH_FREQUENCIES } from '@encryptors/shared/analysis';
import { STANDARD_ALPHABET } from '@encryptors/shared/analysis/frequency';

export const ENGLISH_FREQUENCY_ORDER: string[] = ENGLISH_FREQUENCIES
  .map((frequency, index) => ({ letter: STANDARD_ALPHABET[index], frequency }))
  .sort((a, b) => b.frequency - a.frequency)
  .map(({ letter }) => letter)
  .filter((letter) => letter !== 'J');

export const countSymbols = (symbols: string[]): SymbolFrequency[] => {
  const counts: Record<string, number> = {};
  for (const symbol of symbols) {
    counts[symbol] = (counts[symbol] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count);
};

export type SymbolMapping = Record<string, string>;

// Apply the current mapping: unknown symbols render as a dot so the
// partial plaintext stays readable.
export const applyMapping = (symbols: string[], mapping: SymbolMapping): string[] =>
  symbols.map((symbol) => mapping[symbol] || '·');

// A candidate letter ranking: most frequent symbol first.
export const suggestLetters = (
  frequencies: SymbolFrequency[],
  mapping: SymbolMapping,
): Array<{ symbol: string; suggestion: string }> => {
  const used = new Set(Object.values(mapping));
  let rank = 0;
  return frequencies.map(({ symbol }) => {
    if (mapping[symbol]) return { symbol, suggestion: mapping[symbol] };
    while (used.has(ENGLISH_FREQUENCY_ORDER[rank])) rank += 1;
    const suggestion = ENGLISH_FREQUENCY_ORDER[rank];
    used.add(suggestion);
    rank += 1;
    return { symbol, suggestion };
  });
};
