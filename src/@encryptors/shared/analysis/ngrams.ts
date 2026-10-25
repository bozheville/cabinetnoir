// The n-gram scorers: the strongest English-likeness signals the IKEA
// rule allows in the bundle. Full bigram (676) and trigram (17,576)
// tables quantized to one byte per n-gram (~10 KB gzipped together),
// corpus-derived — see ngram-data.ts for provenance and the quadgram
// upgrade path.
//
// scoreTrigrams has the same contract as scoreDigraphs: clean
// uppercase letters in, 0-100 out, English text near the top, random
// text near the floor. Every scorer-injection seam (columnar/rail-fence
// candidate scores, the Playfair ranking, the Nihilist square meter)
// takes this function the way they took the digraph scorer before it.
// bigramScore feeds the contextual assignment suggestions; the
// hand-curated digraph table stays for display hints and the
// long-stable scoreDigraphs thresholds.
import {
  BIGRAM_SCORES,
  BIGRAM_TOP_LOG,
  TRIGRAM_ENGLISH_AVERAGE,
  TRIGRAM_FLOOR_LOG,
  TRIGRAM_SCORES,
  TRIGRAM_TOP_LOG,
} from './ngram-data';

const FLOOR_LOG = TRIGRAM_FLOOR_LOG;

const offsetOf = (ngram: string): number => {
  let offset = 0;
  for (let index = 0; index < ngram.length; index += 1) {
    offset = offset * 26 + ngram.charCodeAt(index) - 65;
  }
  return offset;
};

// The decoded log10(frequency percent) of a trigram — the floor for a
// trigram the corpus never produced (byte 0).
export const trigramScore = (trigram: string): number => {
  const byte = TRIGRAM_SCORES[offsetOf(trigram.toUpperCase())];
  if (byte === 0) {
    return FLOOR_LOG;
  }
  return (byte / 255) * (TRIGRAM_TOP_LOG - FLOOR_LOG) + FLOOR_LOG;
};

// Same for a bigram — both n-gram families share the quantization
// scale, anchored in ngram-data.ts.
export const bigramScore = (bigram: string): number => {
  const byte = BIGRAM_SCORES[offsetOf(bigram.toUpperCase())];
  if (byte === 0) {
    return FLOOR_LOG;
  }
  return (byte / 255) * (BIGRAM_TOP_LOG - FLOOR_LOG) + FLOOR_LOG;
};

// English-likeness of a plaintext candidate: average log-frequency of
// its overlapping trigrams, normalized to 0-100 against the corpus's
// own average trigram. Random text collapses to the floor.
export const scoreTrigrams = (plaintextLetters: string): number => {
  if (plaintextLetters.length < 3) {
    return 0;
  }

  let sum = 0;
  for (let index = 0; index + 3 <= plaintextLetters.length; index += 1) {
    sum += trigramScore(plaintextLetters.slice(index, index + 3));
  }
  const average = sum / (plaintextLetters.length - 2);

  const span = TRIGRAM_ENGLISH_AVERAGE - FLOOR_LOG;
  const normalized = (average - FLOOR_LOG) / span;
  return Math.round(100 * Math.max(0, Math.min(1, normalized)));
};
