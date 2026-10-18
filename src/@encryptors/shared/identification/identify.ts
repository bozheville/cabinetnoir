import { profileText, TextProfile } from './profile';
import {
  CIPHER_RULES,
  FAMILY_RULES,
  Rule,
  evaluateRules,
} from './rules';
import { matchKnownTexts } from './knownTexts';
import { CATALOGUE, CATALOGUE_ORDER, FAMILY_ORDER } from './catalogue';
import type {
  CipherCandidate,
  Confidence,
  FamilyCandidate,
  IdentificationResult,
  Reason,
} from './types';
import {
  POSSIBLE,
  VERY_LIKELY,
} from './thresholds';

// The identification engine: profile → rules → ranked candidates.
//
// Deterministic by construction: the same input yields the same result
// object. Reasons come only from rule IDs — the locale layer turns them
// into sentences (no generated text anywhere).
export const identify = (input: string): IdentificationResult => {
  const profile = profileText(input);

  if (profile.tier === 'tooShort') {
    return { tier: profile.tier, families: [] };
  }

  const familyFires = evaluateRules(profile, FAMILY_RULES);
  const cipherFires = evaluateRules(profile, CIPHER_RULES);

  // Family-level weights apply to every cipher of that family.
  const familyWeights = new Map<string, { score: number; reasons: Reason[] }>();
  const collect = (
    fires: Array<{ rule: Rule; params?: Record<string, number | string> }>,
    keyOf: (rule: Rule) => string,
  ): Map<string, { score: number; reasons: Reason[] }> => {
    const map = new Map<string, { score: number; reasons: Reason[] }>();
    for (const fire of fires) {
      const key = keyOf(fire.rule);
      const entry = map.get(key) || { score: 0, reasons: [] };
      entry.score += fire.rule.weight;
      entry.reasons.push({ id: fire.rule.id, params: fire.params });
      map.set(key, entry);
    }
    return map;
  };
  const familySignals = collect(familyFires, (r) => (r.target.kind === 'family' ? r.target.family : ''));
  const cipherSignals = collect(cipherFires, (r) => (r.target.kind === 'cipher' ? r.target.id : ''));

  // Known-ciphertext match: the easter-egg path. The candidate appears
  // only when the fingerprint matched (no statistical rule exists for
  // it) and ranks above everything else.
  const knownMatch = matchKnownTexts(profile.letters);

  const confidenceOf = (score: number): Confidence => {
    if (score < 0) {
      return 'ruledOut';
    }
    if (score >= VERY_LIKELY) {
      return 'veryLikely';
    }
    if (score >= POSSIBLE) {
      return 'possible';
    }
    return 'unlikely';
  };

  const candidates: CipherCandidate[] = CATALOGUE
    .map((entry): CipherCandidate | null => {    const familySignal = familySignals.get(entry.family);
    const cipherSignal = cipherSignals.get(entry.id);

    let score = (familySignal?.score || 0) + (cipherSignal?.score || 0);
    const reasons: Reason[] = [
      ...(familySignal?.reasons || []),
      ...(cipherSignal?.reasons || []),
    ];
    const params: Record<string, string | number> = {};
    for (const fire of [...familyFires, ...cipherFires]) {
      const target = fire.rule.target;
      const belongs = target.kind === 'family'
        ? target.family === entry.family
        : target.id === entry.id;
      if (belongs && fire.params) {
        Object.assign(params, fire.params);
      }
    }

    if (entry.id === 'saknussemm') {
      if (knownMatch && knownMatch.id === 'saknussemm') {
        score = 95;
        reasons.push(knownMatch.reason);
      } else {
        // Without a fingerprint match the candidate never appears —
        // there is no statistical rule for it.
        return null;
      }
    }

    // Reasons: strongest evidence first, at most three.
    const orderedReasons = reasons
      .map((reason, index) => {
        const rule = [...FAMILY_RULES, ...CIPHER_RULES].find((r) => r.id === reason.id);
        return { reason, weight: rule ? Math.abs(rule.weight) : 0, index };
      })
      .sort((a, b) => b.weight - a.weight || a.index - b.index)
      .slice(0, 3)
      .map((entry) => entry.reason);

    return {
      id: entry.id,
      family: entry.family,
      inApp: entry.inApp,
      confidence: confidenceOf(score),
      score: Math.max(0, Math.min(100, score)),
      reasons: orderedReasons,
      params: Object.keys(params).length > 0 ? params : undefined,
    };
    })
    .filter((candidate): candidate is CipherCandidate => candidate !== null);

  const families: FamilyCandidate[] = FAMILY_ORDER.map((family) => {
    const ciphers = candidates
      .filter((candidate) => candidate.family === family)
      .sort((a, b) => b.score - a.score || CATALOGUE_ORDER[a.id] - CATALOGUE_ORDER[b.id]);
    const familySignal = familySignals.get(family);
    return {
      family,
      confidence: ciphers.length > 0 ? ciphers[0].confidence : 'ruledOut',
      score: ciphers.length > 0 ? ciphers[0].score : 0,
      reasons: (familySignal?.reasons || [])
        .slice()
        .sort((a, b) => Math.abs(weightOf(b.id)) - Math.abs(weightOf(a.id)))
        .slice(0, 3),
      ciphers,
    };
  }).sort((a, b) => b.score - a.score);

  return { tier: profile.tier, families, profile };
};

const weightOf = (ruleId: string): number =>
  [...FAMILY_RULES, ...CIPHER_RULES].find((rule) => rule.id === ruleId)?.weight || 0;

// Types re-exported for the UI layer.
export type { TextProfile };
