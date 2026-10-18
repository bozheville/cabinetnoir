// Known-ciphertext matches: famous cryptograms recognised by
// fingerprint, not statistics (spec: cipher-identification.md). v1
// ships one — the Arne Saknussemm parchment from Jules Verne's
// "Journey to the Centre of the Earth".
//
// Both faces of the cryptogram are stored, normalised to A-Z letters:
// the scrambled transcription Professor Lidenbrock dictated (the
// Gutenberg/Ward translation), and the plain Latin message itself, so a
// paste in either form matches. Wording differs slightly between
// translations (kem/quem, audas/audax), hence fragment matching instead
// of whole-text equality: a contiguous run of at least
// KNOWN_TEXT_MIN_FRAGMENT letters in either direction counts.
import type { Reason } from './types';
import { KNOWN_TEXT_MIN_FRAGMENT } from './thresholds';

const lettersOnly = (text: string): string =>
  text.toUpperCase().replace(/[^A-Z]/g, '');

// The scrambled parchment, as dictated in chapter III ("mm.rnlls
// esruel seecJde ...").
const SAKNUSSEMM_SCRAMBLED = lettersOnly(
  'mm.rnlls esruel seecJde sgtssmf unteief niedrke kt,samn atrateS '
  + 'Saodrrn emtnaeI nuaect rrilSa Atvaar .nscrc ieaabs ccdrmi eeutul '
  + 'frantu dt,iac oseibo KediiY',
);

// The message itself (the "dog Latin" Lidenbrock reads backwards).
const SAKNUSSEMM_PLAIN = lettersOnly(
  'In Sneffels Yoculis craterem kem delibat umbra Scartaris Julii '
  + 'intra calendas descende, audas viator, et terrestre centrum '
  + 'attinges. Kod feci. Arne Saknussemm',
);

interface KnownText {
  id: string;
  variants: string[];
}

const KNOWN_TEXTS: KnownText[] = [
  { id: 'saknussemm', variants: [SAKNUSSEMM_SCRAMBLED, SAKNUSSEMM_PLAIN] },
];

// The longest contiguous fragment the input shares with the stored
// variant, computed with a simple sliding comparison (texts are short).
const longestSharedFragment = (a: string, b: string): number => {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short.length === 0) {
    return 0;
  }
  for (let length = short.length; length > 0; length -= 1) {
    for (let start = 0; start + length <= short.length; start += 1) {
      if (long.includes(short.slice(start, start + length))) {
        return length;
      }
    }
  }
  return 0;
};

export interface KnownTextMatch {
  id: string;
  reason: Reason;
  // Length of the matched fragment, for the UI.
  fragmentLength: number;
}

export const matchKnownTexts = (letters: string): KnownTextMatch | null => {
  const normalized = lettersOnly(letters);
  if (normalized.length === 0) {
    return null;
  }
  for (const known of KNOWN_TEXTS) {
    for (const variant of known.variants) {
      const fragment = longestSharedFragment(normalized, variant);
      if (fragment >= KNOWN_TEXT_MIN_FRAGMENT) {
        return {
          id: known.id,
          reason: { id: `knownText.${known.id}`, params: { letters: fragment } },
          fragmentLength: fragment,
        };
      }
    }
  }
  return null;
};
