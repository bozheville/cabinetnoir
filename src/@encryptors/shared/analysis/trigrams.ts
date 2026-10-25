// The trigram scorer: the strongest English-likeness signal the IKEA
// rule allows in the bundle. A full 17,576-entry table quantized to one
// byte per trigram (~10 KB gzipped), corpus-derived — see
// trigram-data.ts for provenance and the quadgram upgrade path.
//
// Same contract as scoreDigraphs: clean uppercase letters in, 0-100
// out, English text near the top, random text near the floor. Every
// scorer-injection seam (columnar/rail-fence candidate scores, the
// Playfair ranking, the Nihilist square meter) takes this function the
// way they took the digraph scorer before it.
import {
  TRIGRAM_ENGLISH_AVERAGE,
  TRIGRAM_FLOOR_LOG,
  TRIGRAM_SCORES,
  TRIGRAM_TOP_LOG,
} from './trigram-data';

const offsetOf = (trigram: string): number =>
  ((trigram.charCodeAt(0) - 65) * 26
    + trigram.charCodeAt(1) - 65) * 26
  + trigram.charCodeAt(2) - 65;

// The decoded log10(frequency percent) of a trigram — the floor for a
// trigram the corpus never produced (byte 0).
export const trigramScore = (trigram: string): number => {
  const byte = TRIGRAM_SCORES[offsetOf(trigram.toUpperCase())];
  if (byte === 0) {
    return TRIGRAM_FLOOR_LOG;
  }
  return (byte / 255) * (TRIGRAM_TOP_LOG - TRIGRAM_FLOOR_LOG) + TRIGRAM_FLOOR_LOG;
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

  const span = TRIGRAM_ENGLISH_AVERAGE - TRIGRAM_FLOOR_LOG;
  const normalized = (average - TRIGRAM_FLOOR_LOG) / span;
  return Math.round(100 * Math.max(0, Math.min(1, normalized)));
};
