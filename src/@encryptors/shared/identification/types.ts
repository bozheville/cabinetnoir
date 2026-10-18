// Cipher identification: shared types.
//
// `identify(input)` turns a text profile into a ranked tree of
// candidate families and ciphers. Every string the user sees comes from
// locale keys (`identify.reasons.<id>`); the engine only emits reason
// IDs and numeric params, so the same input always produces the same
// result (spec: specs/cipher-identification/cipher-identification.md).

import type { TextProfile } from './profile';

// The four cipher families the tool distinguishes. Encodings (Base64,
// Morse, Pigpen) are out of scope.
export type Family = 'substitution' | 'polyalphabetic' | 'transposition' | 'block';

// Confidence vocabulary, extended from the cracker labels
// (`processing.cracker.*`): `ruledOut` means the profile contradicts
// the cipher — the candidate stays visible (collapsed) because the
// "why not" is educational too.
export type Confidence = 'veryLikely' | 'possible' | 'unlikely' | 'ruledOut';

// One predefined explanation. `id` is a locale key under
// `identify.reasons.`; params fill the string's placeholders.
export interface Reason {
  id: string;
  params?: Record<string, number | string>;
}

// How the user can continue with this cipher.
// - `cracker`: cipher has a Cryptoanalysis tab (guided wizard).
// - `tool`: decrypt tool only.
// - `null`: roadmap cipher, not in the app yet.
export type BreakingTarget = 'cracker' | 'tool' | null;

// A concrete candidate cipher inside a family.
export interface CipherCandidate {
  // Catalogue id, matches locale `processing.<id>.title` where possible.
  id: string;
  family: Family;
  // False for roadmap ciphers: shown with a badge, no breaking button.
  inApp: boolean;
  confidence: Confidence;
  // 0-100. Ranking order inside the family; family score derives from it.
  score: number;
  // Up to 3 predefined explanations, strongest first.
  reasons: Reason[];
  // Parameters the analysis already recovered (e.g. Caesar shift),
  // consumed by the handoff to prefill the target tool.
  params?: Record<string, string | number>;
}

// A family row of the results tree.
export interface FamilyCandidate {
  family: Family;
  confidence: Confidence;
  score: number;
  reasons: Reason[];
  ciphers: CipherCandidate[];
}

// How much text there was to work with: below 20 letters the analysis
// refuses, 20-100 gives results with an "unreliable" banner.
export type LengthTier = 'tooShort' | 'unreliable' | 'ok';

// The full output of `identify`: families sorted best-first, each with
// its ciphers sorted best-first. `profile` carries the raw measurements
// for the metrics panel.
export interface IdentificationResult {
  tier: LengthTier;
  families: FamilyCandidate[];
  profile?: TextProfile;
}
