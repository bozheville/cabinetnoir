// Pure helpers for breaking monoalphabetic substitution ciphers by
// assignment: the user maps cipher symbols to plain letters, these
// helpers only measure and suggest. Nothing here assigns anything on its
// own (the IKEA-effect rule). No React, no i18n.
import { STANDARD_ALPHABET } from './frequency';
import {
  BIGRAM_ENGLISH_AVERAGE,
  TRIGRAM_ENGLISH_AVERAGE,
  TRIGRAM_FLOOR_LOG,
} from './ngram-data';
import { bigramScore, trigramScore } from './ngrams';
import { CRIB_WORDS } from './english-stats';

export interface SymbolFrequency {
  symbol: string;
  count: number;
}

export type SymbolMapping = Record<string, string>;

// English letter frequency order, most common first (Lewand table).
export const ENGLISH_FREQUENCY_ORDER: string[] = [
  'E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D', 'L', 'C', 'U', 'M',
  'W', 'F', 'G', 'Y', 'P', 'B', 'V', 'K', 'J', 'X', 'Q', 'Z',
];

// The classic doubles of English, for the "doubled letters" hint.
export const COMMON_DOUBLES = ['LL', 'TT', 'SS', 'EE', 'OO', 'FF', 'RR', 'MM', 'NN', 'PP', 'DD', 'CC', 'GG'];

// Common English words for pattern matching. Patterns (not the
// words themselves) do the work: the candidate list stays small and the
// UI presents matches as "could be THE" — the user still decides.
// The hand-picked core keeps the classic function words; the corpus
// half (top Google Books words) widens coverage — generated via
// scripts/generate-english-stats.py, see english-stats.ts.
const HAND_PICKED_WORDS = [
  'THE', 'AND', 'THAT', 'HAVE', 'FOR', 'NOT', 'WITH', 'YOU', 'THIS',
  'ARE', 'FROM', 'WOULD', 'COULD', 'SHOULD', 'THERE', 'THEIR', 'WHICH',
  'ABOUT', 'WHEN', 'WHAT', 'YOUR', 'WILL', 'CAN', 'THESE', 'OTHER',
  'INTO', 'MORE', 'SOME', 'TIME', 'VERY', 'FIRST', 'BEEN', 'WHO', 'ITS',
  'NOW', 'FIND', 'LONG', 'DOWN', 'DAY', 'DID', 'GET', 'HAS', 'HIM',
  'HIS', 'HOW', 'MAN', 'NEW', 'OLD', 'SEE', 'TWO', 'WAY', 'BOY', 'LET',
  'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'ALL', 'ANY', 'BUT', 'BY', 'CAN',
  'DO', 'GO', 'IF', 'IN', 'IS', 'IT', 'ME', 'MY', 'NO', 'OF', 'ON',
  'OR', 'SO', 'TO', 'UP', 'US', 'WE',
];
export const PATTERN_WORDS = [...new Set([...HAND_PICKED_WORDS, ...CRIB_WORDS])];

export const countSymbols = (symbols: string[]): SymbolFrequency[] => {
  const counts: Record<string, number> = {};
  for (const symbol of symbols) {
    counts[symbol] = (counts[symbol] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count);
};

// A letter each unassigned symbol "should be" if frequency ranking held:
// the most frequent symbol gets E, the next T, and so on, skipping plain
// letters the user already used elsewhere. Highlights only — the user
// confirms every assignment with a click.
export const suggestByFrequency = (
  frequencies: SymbolFrequency[],
  mapping: SymbolMapping,
): Record<string, string> => {
  const used = new Set(Object.values(mapping));
  const suggestions: Record<string, string> = {};
  let rank = 0;
  for (const { symbol } of frequencies) {
    if (mapping[symbol]) {
      continue;
    }
    while (used.has(ENGLISH_FREQUENCY_ORDER[rank])) {
      rank += 1;
    }
    suggestions[symbol] = ENGLISH_FREQUENCY_ORDER[rank];
    used.add(ENGLISH_FREQUENCY_ORDER[rank]);
    rank += 1;
  }
  return suggestions;
};

// Contextual suggestions: same contract as suggestByFrequency, but each
// candidate plain letter is ranked by how well it reads next to the
// letters the user already assigned around every occurrence of the
// symbol — digram fit when one neighbour is known, trigram fit when
// both are. The plain frequency ranking is the prior (and the whole
// signal until the first assignment lands). Hints only — nothing is
// ever assigned automatically.
export const suggestByContext = (
  stream: string[],
  mapping: SymbolMapping,
  alphabet: string = STANDARD_ALPHABET,
): Record<string, string> => {
  const used = new Set(Object.values(mapping));
  const candidates = alphabet
    .split('')
    .filter((letter) => !used.has(letter))
    .sort((a, b) => ENGLISH_FREQUENCY_ORDER.indexOf(a)
      - ENGLISH_FREQUENCY_ORDER.indexOf(b));

  // The evidence around one symbol's occurrences: letters the user
  // already placed to its left and right, if any.
  const contextsOf = (symbol: string): Array<[string | null, string | null]> => {
    const contexts: Array<[string | null, string | null]> = [];
    for (let index = 0; index < stream.length; index += 1) {
      if (stream[index] !== symbol) {
        continue;
      }
      contexts.push([
        mapping[stream[index - 1]] || null,
        mapping[stream[index + 1]] || null,
      ]);
    }
    return contexts;
  };

  // Evidence on a shared 0-1 scale so digrams and trigrams average.
  // Both scorers run on the full corpus tables — the hand-curated
  // digraph list has gaps (ET is missing from it) that would floor
  // strong evidence to zero.
  const normDigraph = (bigram: string): number =>
    (bigramScore(bigram) - TRIGRAM_FLOOR_LOG)
    / (BIGRAM_ENGLISH_AVERAGE - TRIGRAM_FLOOR_LOG);
  const normTrigram = (trigram: string): number =>
    (trigramScore(trigram) - TRIGRAM_FLOOR_LOG)
    / (TRIGRAM_ENGLISH_AVERAGE - TRIGRAM_FLOOR_LOG);

  // Symbols with no evidence yet keep the distinct-letter frequency
  // ranking (E, then T, then A…) rather than all suggesting E.
  const frequencyFallback = suggestByFrequency(countSymbols(stream), mapping);

  const suggestions: Record<string, string> = {};
  for (const symbol of new Set(stream)) {
    if (mapping[symbol]) {
      continue;
    }
    const contexts = contextsOf(symbol);
    if (!contexts.some(([previous, next]) => previous || next)) {
      if (frequencyFallback[symbol]) {
        suggestions[symbol] = frequencyFallback[symbol];
      }
      continue;
    }
    let best = candidates[0];
    let bestScore = -Infinity;
    for (let rank = 0; rank < candidates.length; rank += 1) {
      const letter = candidates[rank];
      let evidenceSum = 0;
      let evidenceCount = 0;
      for (const [previous, next] of contexts) {
        if (previous && next) {
          evidenceSum += normTrigram(previous + letter + next);
        } else if (previous) {
          evidenceSum += normDigraph(previous + letter);
        } else if (next) {
          evidenceSum += normDigraph(letter + next);
        } else {
          continue;
        }
        evidenceCount += 1;
      }
      // The frequency prior: small enough that one piece of evidence
      // outweighs it, big enough to break evidence ties toward the
      // common letters — and to rank everything when nothing is known.
      const score = evidenceCount > 0
        ? evidenceSum / evidenceCount + (candidates.length - rank) * 0.002
        : (candidates.length - rank) * 0.002;
      if (score > bestScore) {
        bestScore = score;
        best = letter;
      }
    }
    suggestions[symbol] = best;
  }
  return suggestions;
};

// Plain letters assigned to more than one cipher symbol — always a
// mistake in a substitution, so the board can flag it.
export const findConflicts = (
  mapping: SymbolMapping,
): Array<{ letter: string; symbols: string[] }> => {
  const byLetter: Record<string, string[]> = {};
  for (const [symbol, letter] of Object.entries(mapping)) {
    byLetter[letter] = [...(byLetter[letter] || []), symbol];
  }
  return Object.entries(byLetter)
    .filter(([, symbols]) => symbols.length > 1)
    .map(([letter, symbols]) => ({ letter, symbols }));
};

// Pattern of a word: letters numbered by first occurrence.
// THE → ABC, THAT → ABCA, LOOK → ABBC.
export const wordPattern = (word: string): string => {
  const codes: Record<string, string> = {};
  let next = 0;
  return word.split('').map((letter) => {
    if (!(letter in codes)) {
      codes[letter] = String.fromCharCode(65 + next);
      next += 1;
    }
    return codes[letter];
  }).join('');
};

export interface PatternMatch {
  // where the word starts in the symbol stream
  position: number;
  word: string;
  candidates: string[];
}

// Words in the ciphertext whose shape matches a common English word and
// whose letters are consistent with the current (partial) mapping:
// - an assigned cipher letter must already map to the candidate's letter
// - an unassigned cipher letter must not be forced onto a plain letter
//   that another symbol already owns
// Only words with at least one candidate come back, best matches first.
export const findPatternMatches = (
  words: Array<{ word: string; position: number }>,
  mapping: SymbolMapping,
): PatternMatch[] => {
  const usedLetters = new Set(Object.values(mapping));
  const matches: PatternMatch[] = [];

  for (const { word, position } of words) {
    const pattern = wordPattern(word);
    const candidates = PATTERN_WORDS
      .filter((candidate) => candidate.length === word.length
        && wordPattern(candidate) === pattern)
      .filter((candidate) => {
        const hypothetical = new Set(usedLetters);
        for (let i = 0; i < word.length; i += 1) {
          const assigned = mapping[word[i]];
          if (assigned) {
            if (assigned !== candidate[i]) {
              return false;
            }
          } else if (hypothetical.has(candidate[i])) {
            return false;
          } else {
            hypothetical.add(candidate[i]);
          }
        }
        return true;
      });
    if (candidates.length > 0) {
      matches.push({ position, word, candidates });
    }
  }

  return matches.sort((a, b) => a.candidates.length - b.candidates.length);
};

// Doubled letters in the ciphertext (LOOK, LETTER) — in English these
// are usually L, T, E, S, O, F, R.
export const findDoubles = (symbols: string[]): Array<{ position: number; symbol: string }> => {
  const doubles: Array<{ position: number; symbol: string }> = [];
  for (let i = 0; i < symbols.length - 1; i += 1) {
    if (symbols[i] === symbols[i + 1]) {
      doubles.push({ position: i, symbol: symbols[i] });
    }
  }
  return doubles;
};

// One-letter words (when spaces survive): in English only A and I.
export const findOneLetterWords = (
  words: Array<{ word: string; position: number }>,
): Array<{ position: number; word: string }> =>
  words.filter(({ word }) => word.length === 1);

// Words of the raw input (letter runs, uppercase), with their start
// offsets — the input of the pattern-word hints.
export const extractWords = (input: string): Array<{ word: string; position: number }> => {
  const words: Array<{ word: string; position: number }> = [];
  const regex = /[A-Za-z]{1,}/g;
  let match = regex.exec(input);
  while (match) {
    words.push({ word: match[0].toUpperCase(), position: match.index });
    match = regex.exec(input);
  }
  return words;
};

// --- Symbol digraphs: the letter-combination layer of the hints ---
// A monoalphabetic substitution hides letter combinations the same way
// it hides letters: adjacent symbol pairs map to plaintext digraphs.
// These helpers count the pairs and attach corpus-ranked candidate
// digraphs to the frequent ones — the same trick as the per-cell
// suggestions, one level up. Hints only; the user places every letter.

export interface SymbolDigraph {
  first: string;
  second: string;
  count: number;
}

// Adjacent symbol pairs of the stream, most frequent first.
export const countSymbolDigraphs = (stream: string[]): SymbolDigraph[] => {
  const counts = new Map<string, number>();
  for (let index = 0; index + 1 < stream.length; index += 1) {
    const key = `${stream[index]}\u0000${stream[index + 1]}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => {
      const [first, second] = key.split('\u0000');
      return { first, second, count };
    })
    .sort((a, b) => b.count - a.count);
};

export interface DigraphSuggestion {
  first: string;
  second: string;
  count: number;
  // Candidate plaintext digraphs, corpus-ranked, consistent with the
  // letters the user already placed.
  candidates: string[];
}

const DIGRAPH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// For every frequent symbol pair still undecided (at least one side
// unassigned), the top plaintext digraphs it could be: corpus bigram
// scoring, filtered so each candidate agrees with the letters already
// assigned and reuses no letter owned by another symbol. Pairs whose
// both sides are decided are skipped — those are the user's answers.
export const suggestSymbolDigraphs = (
  stream: string[],
  mapping: SymbolMapping,
  pairLimit: number = 6,
  candidatesPerPair: number = 3,
): DigraphSuggestion[] => {
  const used = new Set(Object.values(mapping));
  const suggestions: DigraphSuggestion[] = [];
  for (const { first, second, count } of countSymbolDigraphs(stream)) {
    if (count < 2 || suggestions.length >= pairLimit) {
      break;
    }
    const fixedFirst = mapping[first];
    const fixedSecond = mapping[second];
    if (fixedFirst && fixedSecond) {
      continue;
    }
    // The same symbol twice must decode to the same letter twice —
    // only doubled digraphs (LL, EE...) are possible there.
    const doubledPair = first === second;
    const scored: Array<{ digraph: string; score: number }> = [];
    for (const a of DIGRAPH_ALPHABET) {
      if (fixedFirst && a !== fixedFirst) {
        continue;
      }
      if (!fixedFirst && used.has(a)) {
        continue;
      }
      for (const b of DIGRAPH_ALPHABET) {
        if (fixedSecond && b !== fixedSecond) {
          continue;
        }
        if (!fixedSecond && used.has(b)) {
          continue;
        }
        if (doubledPair && a !== b) {
          continue;
        }
        scored.push({ digraph: `${a}${b}`, score: bigramScore(`${a}${b}`) });
      }
    }
    scored.sort((x, y) => y.score - x.score);
    suggestions.push({
      first,
      second,
      count,
      candidates: scored.slice(0, candidatesPerPair).map(({ digraph }) => digraph),
    });
  }
  return suggestions;
};

// --- Symbol trigraphs: THE-shaped anchors, made visible ---
// The trigram layer of the hints: a frequent symbol triple maps to a
// plaintext trigraph, and THE/THA/ING-class anchors crack a square
// faster than any single letter. Same consistency rules as the
// digraphs, one position deeper.

export interface SymbolTrigraph {
  first: string;
  second: string;
  third: string;
  count: number;
}

// Adjacent symbol triples of the stream, most frequent first.
export const countSymbolTrigraphs = (stream: string[]): SymbolTrigraph[] => {
  const counts = new Map<string, number>();
  for (let index = 0; index + 2 < stream.length; index += 1) {
    const key = `${stream[index]}\u0000${stream[index + 1]}\u0000${stream[index + 2]}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => {
      const [first, second, third] = key.split('\u0000');
      return { first, second, third, count };
    })
    .sort((a, b) => b.count - a.count);
};

export interface TrigraphSuggestion {
  first: string;
  second: string;
  third: string;
  count: number;
  candidates: string[];
}

// For every frequent undecided symbol triple, the top plaintext
// trigraphs it could be: corpus trigram scoring under the mapping's
// constraints — assigned symbols fix their letter, the same symbol in
// several positions forces the same letter, and no candidate may
// reuse a letter owned by another symbol.
export const suggestSymbolTrigraphs = (
  stream: string[],
  mapping: SymbolMapping,
  tripleLimit: number = 4,
  candidatesPerTriple: number = 3,
): TrigraphSuggestion[] => {
  const used = new Set(Object.values(mapping));
  const suggestions: TrigraphSuggestion[] = [];
  for (const { first, second, third, count } of countSymbolTrigraphs(stream)) {
    if (count < 2 || suggestions.length >= tripleLimit) {
      break;
    }
    const fixed = [mapping[first], mapping[second], mapping[third]];
    if (fixed.every(Boolean)) {
      continue;
    }
    const symbols = [first, second, third];
    const scored: Array<{ trigraph: string; score: number }> = [];
    for (const a of DIGRAPH_ALPHABET) {
      if (fixed[0] ? a !== fixed[0] : used.has(a)) {
        continue;
      }
      for (const b of DIGRAPH_ALPHABET) {
        if (symbols[1] === symbols[0] && b !== a) {
          continue;
        }
        if (fixed[1] ? b !== fixed[1] : used.has(b)) {
          continue;
        }
        for (const c of DIGRAPH_ALPHABET) {
          if ((symbols[2] === symbols[0] && c !== a)
            || (symbols[2] === symbols[1] && c !== b)) {
            continue;
          }
          if (fixed[2] ? c !== fixed[2] : used.has(c)) {
            continue;
          }
          scored.push({ trigraph: `${a}${b}${c}`, score: trigramScore(`${a}${b}${c}`) });
        }
      }
    }
    scored.sort((x, y) => y.score - x.score);
    suggestions.push({
      first,
      second,
      third,
      count,
      candidates: scored.slice(0, candidatesPerTriple).map(({ trigraph }) => trigraph),
    });
  }
  return suggestions;
};

// --- Doubled symbols: the classic mono-cipher tell ---
// A symbol that follows itself must be a doubled letter (LOOK, LETTER),
// and English doubles are few — the strongest single hint a
// monoalphabetic stream offers, so it gets its own guaranteed rows.

export interface DoubleSuggestion {
  symbol: string;
  count: number;
  candidates: string[];
}

// Top doubled symbols with the doubled digraphs they could be —
// corpus-ranked, consistent with the placed letters. Already-assigned
// symbols are decided, so they drop out.
export const suggestDoubledSymbols = (
  stream: string[],
  mapping: SymbolMapping,
  limit: number = 3,
  candidatesPerSymbol: number = 3,
): DoubleSuggestion[] => {
  const used = new Set(Object.values(mapping));
  const counts = new Map<string, number>();
  for (let index = 0; index + 1 < stream.length; index += 1) {
    if (stream[index] === stream[index + 1]) {
      const symbol = stream[index];
      counts.set(symbol, (counts.get(symbol) || 0) + 1);
    }
  }
  const suggestions: DoubleSuggestion[] = [];
  for (const [symbol, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    if (mapping[symbol]) {
      continue;
    }
    const scored: Array<{ digraph: string; score: number }> = [];
    for (const letter of DIGRAPH_ALPHABET) {
      if (used.has(letter)) {
        continue;
      }
      const digraph = `${letter}${letter}`;
      scored.push({ digraph, score: bigramScore(digraph) });
    }
    scored.sort((x, y) => y.score - x.score);
    suggestions.push({
      symbol,
      count,
      candidates: scored.slice(0, candidatesPerSymbol).map(({ digraph }) => digraph),
    });
    if (suggestions.length >= limit) {
      break;
    }
  }
  return suggestions;
};
