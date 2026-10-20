import { describe, expect, it } from 'vitest';

import {
  countSymbols,
  suggestByFrequency,
  findConflicts,
  wordPattern,
  findPatternMatches,
  findDoubles,
  findOneLetterWords,
} from './substitution';

describe('countSymbols', () => {
  it('counts and sorts by frequency', () => {
    expect(countSymbols(['A', 'B', 'A', 'A', 'C', 'B']))
      .toEqual([
        { symbol: 'A', count: 3 },
        { symbol: 'B', count: 2 },
        { symbol: 'C', count: 1 },
      ]);
  });
});

describe('suggestByFrequency', () => {
  it('ranks unassigned symbols over the English frequency order', () => {
    const frequencies = [
      { symbol: 'Q', count: 9 },
      { symbol: 'Z', count: 5 },
      { symbol: 'X', count: 1 },
    ];
    expect(suggestByFrequency(frequencies, {}))
      .toEqual({ Q: 'E', Z: 'T', X: 'A' });
  });

  it('skips plain letters the user already assigned to other symbols', () => {
    const frequencies = [
      { symbol: 'Q', count: 9 },
      { symbol: 'Z', count: 5 },
    ];
    // Q is assigned; Z must not be suggested E (Q owns it).
    expect(suggestByFrequency(frequencies, { Q: 'E', Z: 'E' }))
      .toEqual({});
    expect(suggestByFrequency(frequencies, { Z: 'E' }))
      .toEqual({ Q: 'T' });
  });
});

describe('findConflicts', () => {
  it('flags plain letters used by more than one symbol', () => {
    expect(findConflicts({ Q: 'E', Z: 'E', X: 'T' }))
      .toEqual([{ letter: 'E', symbols: ['Q', 'Z'] }]);
    expect(findConflicts({ Q: 'E' })).toEqual([]);
  });
});

describe('wordPattern', () => {
  it('numbers letters by first occurrence', () => {
    expect(wordPattern('THE')).toBe('ABC');
    expect(wordPattern('THAT')).toBe('ABCA');
    expect(wordPattern('LOOK')).toBe('ABBC');
  });
});

describe('findPatternMatches', () => {
  const words = (text: string) => text.split(' ').map((word, position) => ({
    word: word.replace(/[^A-Z]/g, ''),
    position,
  })).filter(({ word }) => word);

  it('matches THE against a same-shape cipher word', () => {
    // cipher word ABX has THE's pattern; nothing assigned yet.
    const matches = findPatternMatches(words('ABX CD'), {});
    const abx = matches.find(({ word }) => word === 'ABX');
    expect(abx?.candidates).toContain('THE');
  });

  it('respects the current mapping', () => {
    // T assigned to A, H to B → "THE" stays a candidate for ABX,
    // "AND" (pattern ABC too) is eliminated by the T→A assignment.
    const matches = findPatternMatches(words('ABX'), { A: 'T', B: 'H' });
    expect(matches[0].candidates).toEqual(['THE']);
  });

  it('keeps candidates consistent with the mapping, drops the rest', () => {
    // X is assigned E: THE (X→E) survives, AND (X→D) dies.
    const matches = findPatternMatches(words('ABX'), { X: 'E' });
    const abx = matches.find(({ word }) => word === 'ABX');
    expect(abx?.candidates).toContain('THE');
    expect(abx?.candidates).not.toContain('AND');
  });

  it('keeps only words with at least one candidate', () => {
    // QQQ pattern AAA matches no common word.
    expect(findPatternMatches(words('QQQ'), {})).toEqual([]);
  });
});

describe('findDoubles', () => {
  it('finds doubled letters', () => {
    expect(findDoubles(['A', 'B', 'B', 'C']))
      .toEqual([{ position: 1, symbol: 'B' }]);
    expect(findDoubles(['A', 'B', 'C'])).toEqual([]);
  });
});

describe('findOneLetterWords', () => {
  it('finds single-letter words', () => {
    expect(findOneLetterWords([
      { word: 'Y', position: 0 },
      { word: 'NOT', position: 1 },
    ])).toEqual([{ word: 'Y', position: 0 }]);
  });
});
