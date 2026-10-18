import type { Family } from './types';
import type { TextProfile } from './profile';
import { isEnglishLikeIc } from './profile';
import {
  ADFGVX_LETTERS,
  CHI_FIT_BAD,
  CHI_FIT_GOOD,
  HOMOPHONIC_SYMBOLS,
  HOMOPHONIC_UNIFORMITY,
  IC_RANDOM,
  MAX_DISTINCT_PLAYFAIR,
} from './thresholds';

// The rule engine: deterministic tests over the text profile. Each rule
// targets a family or a specific cipher and carries a signed weight —
// positive weights support the candidate, negative ones push it toward
// `ruledOut`. A fired rule also emits a reason ID (locale key
// `identify.reasons.<id>`) plus numeric params for its placeholders.
//
// Scoring (task 09) sums weights per target and maps the total onto the
// confidence labels; the reasons travel with the candidate.
export interface RuleFire {
  rule: Rule;
  params?: Record<string, number | string>;
}

export type RuleTarget =
  | { kind: 'family'; family: Family }
  | { kind: 'cipher'; id: string };

export interface Rule {
  id: string;
  target: RuleTarget;
  weight: number;
  // Returns the reason params when the rule fires ({} when the reason
  // needs none), null when it does not fire.
  test: (profile: TextProfile) => Record<string, number | string> | null;
}

const rule = (
  id: string,
  target: RuleTarget,
  weight: number,
  test: Rule['test'],
): Rule => ({ id, target, weight, test });

// Evaluate a rule list against a profile; fired rules only.
export const evaluateRules = (profile: TextProfile, rules: Rule[]): RuleFire[] =>
  rules
    .map((r): RuleFire | null => {
      const params = r.test(profile);
      return params === null ? null : { rule: r, params };
    })
    .filter((fire): fire is NonNullable<typeof fire> => fire !== null);

const family = (fam: Family): RuleTarget => ({ kind: 'family', family: fam });
const cipher = (id: string): RuleTarget => ({ kind: 'cipher', id });

// --- Family-level rules ---

export const FAMILY_RULES: Rule[] = [
  // Transposition: the letter multiset is untouched — frequencies match
  // English exactly and the IC is English-like.
  rule('transpositionShape', family('transposition'), 45,
    (profile) => (isEnglishLikeIc(profile.ic) && profile.directChiScore >= CHI_FIT_GOOD
      ? { ic: Math.round(profile.ic * 1000) / 1000 }
      : null)),

  // Transposition excluded: the letters as they stand are far from
  // English, so letters were replaced, not just moved.
  rule('transpositionNotEnglish', family('transposition'), -30,
    (profile) => (profile.directChiScore <= CHI_FIT_BAD && profile.sortedChiScore >= CHI_FIT_GOOD
      ? {}
      : null)),

  // Monoalphabetic substitution: the frequency *shape* is English but
  // the letters stand in the wrong places.
  rule('substitutionShape', family('substitution'), 45,
    (profile) => (profile.sortedChiScore >= CHI_FIT_GOOD && profile.directChiScore < CHI_FIT_GOOD
      ? {}
      : null)),

  // Substitution unlikely: the text already reads English in its
  // original letter order.
  rule('substitutionNotShuffled', family('substitution'), -30,
    (profile) => (profile.directChiScore >= CHI_FIT_GOOD
      ? {}
      : null)),

  // Periodic polyalphabetic: the slices at the best period are much more
  // English-like than the text as a whole.
  rule('periodicPolyalphabetic', family('polyalphabetic'), 45,
    (profile) => (profile.periodIcGain >= 0.015 && profile.bestPeriod !== null
      ? { period: profile.bestPeriod, gain: Math.round(profile.periodIcGain * 1000) / 1000 }
      : null)),

  // Aperiodic polyalphabetic (Enigma-style): IC near random and no
  // periodic structure. Low weight — hard to tell apart from noise.
  rule('aperiodicPolyalphabetic', family('polyalphabetic'), 15,
    (profile) => (profile.ic < IC_RANDOM * 1.15 && profile.periodIcGain < 0.015
      ? { ic: Math.round(profile.ic * 1000) / 1000 }
      : null)),

  // Polyalphabetic excluded: plain English-like IC with no periodic
  // gain.
  rule('polyalphabeticNotPeriodic', family('polyalphabetic'), -30,
    (profile) => (isEnglishLikeIc(profile.ic) && profile.periodIcGain < 0.015
      ? {}
      : null)),

  // Block/polygraphic: the structural fingerprints (shared by the
  // concrete ciphers; the cipher rules do the precise matching).
  rule('blockStructure', family('block'), 20,
    (profile) => (profile.evenLength && profile.distinctLetters.length <= MAX_DISTINCT_PLAYFAIR
      ? {}
      : null)),

  // Block excluded: odd length rules out every digraph cipher.
  rule('blockOddLength', family('block'), -25,
    (profile) => (!profile.evenLength && !profile.digitsOnly
      ? {}
      : null)),

  // Fractionated output: the strongest possible signal — the text uses
  // only ADFGVX letters.
  rule('adfgvxSet', cipher('adfgvx'), 60,
    (profile) => (profile.adfgvxSet
      ? { letters: ADFGVX_LETTERS.join('') }
      : null)),

  // Homophonic: many distinct symbols and a nearly flat distribution.
  rule('homophonicFlat', cipher('homophonic'), 55,
    (profile) => (profile.distinctSymbols >= HOMOPHONIC_SYMBOLS
      && profile.uniformityScore >= HOMOPHONIC_UNIFORMITY
      ? { symbols: profile.distinctSymbols }
      : null)),
];
