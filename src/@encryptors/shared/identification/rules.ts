import type { Family } from './types';
import type { TextProfile } from './profile';
import { isEnglishLikeIc } from './profile';
import { scoreTrigrams } from '@encryptors/shared/analysis/ngrams';
import {
  railFenceCandidateScores,
  columnarCandidateScores,
} from './roadmapCiphers';
import {
  ADFGVX_LETTERS,
  CAESAR_GAP,
  CHI_FIT_BAD,
  CHI_FIT_GOOD,
  HOMOPHONIC_SYMBOLS,
  HOMOPHONIC_UNIFORMITY,
  IC_BAND_MIN,
  IC_RANDOM,
  MAX_DISTINCT_PLAYFAIR,
  ALBERTI_MAX_DISTINCT,
  MIN_DIGIT_PAIRS,
  NIHILIST_IN_RANGE_RATIO,
  PERIOD_GAIN,
  PERIOD_GAIN_LOW,
  PERIOD_SLICE_IC,
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
  // the letters stand in the wrong places. Substitution preserves the
  // IC, so the IC must sit in the English band.
  rule('substitutionShape', family('substitution'), 45,
    (profile) => (isEnglishLikeIc(profile.ic)
      && profile.sortedChiScore >= CHI_FIT_GOOD
      && profile.directChiScore < CHI_FIT_GOOD
      ? {}
      : null)),

  // Substitution unlikely: the text already reads English in its
  // original letter order.
  rule('substitutionNotShuffled', family('substitution'), -30,
    (profile) => (profile.directChiScore >= CHI_FIT_GOOD
      ? {}
      : null)),

  // Periodic polyalphabetic: the slices at the best period are much more
  // English-like than the text as a whole — and the slices really are
  // English-like (a plain English text has English IC at every period,
  // but no gain over its own IC).
  rule('periodicPolyalphabetic', family('polyalphabetic'), 45,
    (profile) => (profile.periodIcGain >= PERIOD_GAIN
      && profile.bestPeriodAverageIC >= PERIOD_SLICE_IC
      && profile.bestPeriod !== null
      ? { period: profile.bestPeriod, gain: Math.round(profile.periodIcGain * 1000) / 1000 }
      : null)),

  // Aperiodic polyalphabetic (Enigma-style): IC below the English-like
  // band and no periodic structure. Low weight — hard to tell apart from
  // noise. Autokey ciphertexts live at the top of this band (their IC is
  // plaintext-diluted, ~0.046), which is why the band runs to
  // IC_BAND_MIN rather than just above random.
  rule('aperiodicPolyalphabetic', family('polyalphabetic'), 15,
    (profile) => (profile.ic < IC_BAND_MIN && profile.periodIcGain < PERIOD_GAIN
      ? { ic: Math.round(profile.ic * 1000) / 1000 }
      : null)),

  // Polyalphabetic excluded: plain English-like IC with no periodic
  // gain.
  rule('polyalphabeticNotPeriodic', family('polyalphabetic'), -30,
    (profile) => (isEnglishLikeIc(profile.ic) && profile.periodIcGain < PERIOD_GAIN
      ? {}
      : null)),

  // Block/polygraphic: the structural fingerprints, only when the text
  // does not already read as English (a plain even-length English text
  // is not a block cipher).
  rule('blockStructure', family('block'), 20,
    (profile) => (profile.evenLength
      && profile.distinctLetters.length <= MAX_DISTINCT_PLAYFAIR
      && profile.directChiScore < CHI_FIT_GOOD
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

  // Homophonic: far more distinct symbols than the 26 letters (or than
  // the 25 Polybius cells) — the classic numeric homophonic table. When
  // every pair fits the Nihilist sum range, the Nihilist rule claims
  // the text instead.
  rule('homophonicFlat', cipher('homophonic'), 55,
    (profile) => ((profile.distinctSymbols >= HOMOPHONIC_SYMBOLS
      || (profile.digitsOnly && profile.distinctDigitPairs >= HOMOPHONIC_SYMBOLS))
      && !profile.nihilistLike
      ? { symbols: Math.max(profile.distinctSymbols, profile.distinctDigitPairs) }
      : null)),
];

// --- Cipher-level rules ---

export const CIPHER_RULES: Rule[] = [
  // Caesar: one shift clearly explains the whole text — and that shift
  // is neither 0 (the text is already plaintext) nor 13 (that is ROT13,
  // which claims it).
  rule('caesarBestShift', cipher('caesar'), 45,
    (profile) => (profile.caesarBestScore >= CHI_FIT_GOOD
      && profile.caesarBestShift !== 0
      && profile.caesarBestShift !== 13
      && profile.caesarBestScore - profile.caesarRunnerUpScore >= CAESAR_GAP
      ? { shift: profile.caesarBestShift }
      : null)),

  // ROT13: the Caesar winner sits exactly at 13.
  rule('rot13Shift', cipher('rot13'), 40,
    (profile) => (profile.caesarBestScore >= CHI_FIT_GOOD && profile.caesarBestShift === 13
      ? {}
      : null)),

  // Atbash: the reversed alphabet explains the text at least as well as
  // the best shift.
  rule('atbashMirror', cipher('atbash'), 45,
    (profile) => (profile.atbashScore >= CHI_FIT_GOOD && profile.atbashScore >= profile.caesarBestScore
      ? {}
      : null)),

  // Affine: a non-trivial multiplier explains the text better than any
  // plain shift (with a margin, so noise on long texts doesn't win).
  rule('affineKey', cipher('affine'), 45,
    (profile) => (profile.affineScore >= CHI_FIT_GOOD
      && profile.affineMultiplier !== 1
      && profile.affineScore > profile.caesarBestScore + CAESAR_GAP
      ? { key: `${profile.affineMultiplier}/${profile.affineShift}` }
      : null)),

  // Keyword substitution: substitution-shaped, but no simple key fits
  // decisively (a plain shift or an affine key would claim it) — and the
  // text does not carry the full Playfair digraph structure, which is a
  // stronger claim.
  rule('keywordNoSimpleKey', cipher('keyword'), 30,
    (profile) => (profile.sortedChiScore >= CHI_FIT_GOOD
      && profile.caesarBestScore < CHI_FIT_GOOD
      && profile.affineScore - profile.caesarBestScore < CAESAR_GAP
      && profile.atbashScore < CHI_FIT_GOOD
      && !(profile.evenLength
        && !profile.hasDoubledDigraph
        && !profile.hasJ
        && profile.distinctLetters.length <= MAX_DISTINCT_PLAYFAIR)
      ? {}
      : null)),

  // Vigenère: a periodic polyalphabetic whose slices decrypt with plain
  // shifts — and whose reflected score does not beat the plain one (the
  // latter would point at classic Beaufort).
  rule('vigenereSlices', cipher('vigenere'), 35,
    (profile) => (profile.periodIcGain >= PERIOD_GAIN
      && profile.sliceShiftScore >= CHI_FIT_GOOD
      && profile.sliceShiftScore >= profile.sliceReflectScore
      ? { period: profile.bestPeriod ?? 0 }
      : null)),

  // Beaufort: the same periodic fingerprint, but the slices fit
  // reflected shifts clearly better than plain ones — the mirror is the
  // cipher's signature. Variant Beaufort stays statistically identical
  // to Vigenère and is deliberately not separable here.
  rule('beaufortSlices', cipher('beaufort'), 35,
    (profile) => (profile.periodIcGain >= PERIOD_GAIN
      && profile.sliceReflectScore >= CHI_FIT_GOOD
      && profile.sliceReflectScore > profile.sliceShiftScore + CAESAR_GAP
      ? { period: profile.bestPeriod ?? 0 }
      : null)),

  // Autokey: aperiodic like Enigma (its keystream never repeats), with
  // no measurable statistical fingerprint of its own — the honest
  // position is a small weight in the aperiodic bucket, documented as
  // indistinguishable (primer recovery needs crib-dragging, not
  // statistics). Its IC sits at the top of the aperiodic band: the
  // keystream is mostly plaintext, so the ciphertext keeps some of
  // English's unevenness.
  rule('autokeyAperiodic', cipher('autokey'), 15,
    (profile) => (profile.ic < IC_BAND_MIN && profile.periodIcGain < PERIOD_GAIN
      ? { ic: Math.round(profile.ic * 1000) / 1000 }
      : null)),

  // Alberti: its mixed-alphabet disc leaves a double fingerprint — the
  // reduced letter set (the disc is shorter than the alphabet) with a
  // substitution-like shape but no working plain shift or affine key,
  // or a small periodic gain whose slices resist plain shifts.
  rule('albertiMixedDisc', cipher('alberti'), 40,
    (profile) => {
      const playfairLike = profile.evenLength
        && !profile.hasDoubledDigraph
        && !profile.hasJ;
      if (profile.distinctLetters.length <= ALBERTI_MAX_DISTINCT
        && profile.sortedChiScore >= CHI_FIT_GOOD
        && profile.directChiScore < CHI_FIT_GOOD
        && profile.sliceShiftScore < 55
        && !playfairLike) {
        return { evidence: 'reducedDisc' };
      }
      if (profile.periodIcGain >= PERIOD_GAIN_LOW && profile.sliceShiftScore < 55) {
        return { evidence: 'periodic', period: profile.bestPeriod ?? 0 };
      }
      return null;
    }),

  // Enigma: only rides on the aperiodic family signal; capped low by
  // its small weight, never above `possible`.
  rule('enigmaAperiodic', cipher('enigma'), 20,
    (profile) => (profile.ic < IC_RANDOM * 1.15 && profile.periodIcGain < PERIOD_GAIN
      ? { ic: Math.round(profile.ic * 1000) / 1000 }
      : null)),

  // Rail fence: undoing a small zigzag makes the digraphs English.
  rule('railFenceUndo', cipher('railFence'), 30,
    (profile) => {
      if (!isEnglishLikeIc(profile.ic) || profile.directChiScore < CHI_FIT_GOOD) {
        return null;
      }
      const best = railFenceCandidateScores(profile.letters, scoreTrigrams)[0];
      const asIs = scoreTrigrams(profile.letters);
      return best && best.score > asIs + 10
        ? { rails: best.rails }
        : null;
    }),

  // Columnar: some column width reads like English fragments.
  rule('columnarWidth', cipher('columnar'), 30,
    (profile) => {
      if (!isEnglishLikeIc(profile.ic) || profile.directChiScore < CHI_FIT_GOOD) {
        return null;
      }
      const best = columnarCandidateScores(profile.letters, scoreTrigrams)[0];
      const asIs = scoreTrigrams(profile.letters);
      return best && best.score > asIs + 10
        ? { width: best.width }
        : null;
    }),

  // Playfair: even-length digraph text, no J, no doubled pair, at most
  // 25 distinct letters, and not plain English.
  rule('playfairDigraphs', cipher('playfair'), 40,
    (profile) => (profile.evenLength
      && !profile.hasDoubledDigraph
      && !profile.hasJ
      && profile.distinctLetters.length <= MAX_DISTINCT_PLAYFAIR
      && profile.directChiScore < CHI_FIT_GOOD
      ? {}
      : null)),

  // Playfair excluded: the letter J cannot appear in its output.
  rule('playfairHasJ', cipher('playfair'), -40,
    (profile) => (profile.hasJ ? {} : null)),

  // ADFGVX excluded: any letter outside the fractionation set.
  rule('adfgvxNotSet', cipher('adfgvx'), -35,
    (profile) => (!profile.adfgvxSet
      ? {}
      : null)),

  // Nihilist: every parsed number is a legal no-carry sum (the Nihilist
  // tool's own validity check, so three-digit 100–110 sums count).
  rule('nihilistDigits', cipher('nihilist'), 45,
    (profile) => (profile.nihilistLike
      ? { pairs: profile.digitPairs }
      : null)),

  // Nihilist support: digits-only text where most numbers are legal
  // sums — keeps a near-miss (one stray number) from dropping to zero.
  rule('nihilistDigitsDominant', cipher('nihilist'), 15,
    (profile) => (profile.digitsOnly
      && profile.digitPairs >= MIN_DIGIT_PAIRS
      && profile.nihilistInRangeRatio >= NIHILIST_IN_RANGE_RATIO
      ? { ratio: Math.round(profile.nihilistInRangeRatio * 100) }
      : null)),

  // Nihilist block shape: digit-only output carries no letter-level
  // block signal (blockStructure never fires on numbers), so the digit
  // structure itself fills the block-family slot.
  rule('nihilistBlockShape', cipher('nihilist'), 20,
    (profile) => (profile.digitsOnly && profile.nihilistInRangeRatio >= NIHILIST_IN_RANGE_RATIO
      ? {}
      : null)),

  // Polybius: digit pairs confined to the 11–55 square range — but only
  // when the Nihilist rule does not claim the wider sum range first.
  rule('polybiusPairs', cipher('polybius'), 40,
    (profile) => ((profile.polybiusLike && !profile.nihilistLike)
      ? { pairs: profile.digitPairs }
      : null)),
];
