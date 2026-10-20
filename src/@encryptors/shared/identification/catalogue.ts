import type { BreakingTarget, Family } from './types';

// The candidate catalogue: every cipher the tool can suggest, in its
// fixed tie-break order. Roadmap ciphers (`inApp: false`) are still
// candidates — shown with a "not in the app yet" badge and no way to
// break them here.
//
// The breaking target decides what "Try breaking it" opens (task 17/18):
// - `cracker` — the cipher's Cryptoanalysis tab;
// - `tool` — the decrypt tool;
// - `null` — nothing, not in the app.
export interface CatalogueEntry {
  id: string;
  family: Family;
  inApp: boolean;
  breakingTarget: BreakingTarget;
}

export const CATALOGUE: CatalogueEntry[] = [
  // Substitution (monoalphabetic).
  { id: 'caesar', family: 'substitution', inApp: true, breakingTarget: 'tool' },
  { id: 'rot13', family: 'substitution', inApp: true, breakingTarget: 'tool' },
  { id: 'atbash', family: 'substitution', inApp: true, breakingTarget: 'tool' },
  { id: 'affine', family: 'substitution', inApp: true, breakingTarget: 'cracker' },
  { id: 'keyword', family: 'substitution', inApp: true, breakingTarget: 'cracker' },
  { id: 'homophonic', family: 'substitution', inApp: false, breakingTarget: null },

  // Polyalphabetic.
  { id: 'vigenere', family: 'polyalphabetic', inApp: true, breakingTarget: 'cracker' },
  { id: 'alberti', family: 'polyalphabetic', inApp: true, breakingTarget: 'cracker' },
  { id: 'enigma', family: 'polyalphabetic', inApp: true, breakingTarget: 'tool' },

  // Transposition.
  { id: 'railFence', family: 'transposition', inApp: true, breakingTarget: 'cracker' },
  { id: 'columnar', family: 'transposition', inApp: true, breakingTarget: 'cracker' },
  // Easter egg: recognised only by known-ciphertext match (task 08),
  // never by statistics.
  { id: 'saknussemm', family: 'transposition', inApp: false, breakingTarget: null },

  // Block (classical polygraphic).
  { id: 'playfair', family: 'block', inApp: true, breakingTarget: 'cracker' },
  { id: 'adfgvx', family: 'block', inApp: true, breakingTarget: 'cracker' },
  { id: 'nihilist', family: 'block', inApp: false, breakingTarget: null },
];

// Fixed tie-break order: catalogue position.
export const CATALOGUE_ORDER: Record<string, number> = Object.fromEntries(
  CATALOGUE.map((entry, index) => [entry.id, index]),
);

export const catalogueEntry = (id: string): CatalogueEntry | undefined =>
  CATALOGUE.find((entry) => entry.id === id);

export const FAMILY_ORDER: Family[] = [
  'substitution',
  'polyalphabetic',
  'transposition',
  'block',
];
