// Identification thresholds: every magic number of the detector in one
// place (spec: specs/cipher-identification/cipher-identification.md).
// Tuned by the fixture-corpus accuracy suite (task 11).

// Length tiers (in letters after normalisation).
export const MIN_LETTERS = 20; // below: no analysis at all
export const RELIABLE_LETTERS = 100; // below: results + "unreliable" banner

// Index of Coincidence anchors, same values the cracker library uses.
export const IC_RANDOM = 0.0385;
export const IC_ENGLISH = 0.0667;

// Periodic polyalphabetic: the slice-vs-whole IC gain and the absolute
// slice quality the periodic rule demands. Two bars: the family rule
// (strong, needs a clear gain) and the Alberti-specific rule (catches
// the mixed-disc case where the gain is smaller).
export const PERIOD_GAIN = 0.012;
export const PERIOD_GAIN_LOW = 0.010;
export const PERIOD_SLICE_IC = 0.055;

// English-like IC is a band, not a floor: an IC far ABOVE English means
// a restricted alphabet (ADFGVX-style), not plain English.
export const IC_BAND_MIN = 0.048;
export const IC_BAND_MAX = 0.085;

// A profile counts as "English-like IC" from this share of the way from
// random to English.
export const IC_ENGLISH_LIKE = 0.55; // of the random->English range

// Chi-squared → 0-100 score mapping shares the cracker's decay; the
// scores below decide whether a fit "explains" the text.
export const CHI_FIT_GOOD = 65; // direct/sorted fit score at least this
export const CHI_FIT_BAD = 45; // fit score at most this = "bad fit"

// Caesar: best shift must beat the runner-up by this margin (0-100).
export const CAESAR_GAP = 10;

// Playfair / digraph structure.
export const MAX_DISTINCT_PLAYFAIR = 25;

// ADFGVX: the fractionated letter set.
export const ADFGVX_LETTERS = ['A', 'D', 'F', 'G', 'V', 'X'];

// Polybius / Nihilist digit structure.
export const POLYBIUS_MIN = 11;
export const POLYBIUS_MAX = 55;
export const NIHILIST_MIN = 22;
export const NIHILIST_MAX = 110;
// Alberti disc: shorter than the alphabet, so its ciphertext uses fewer
// distinct letters.
export const ALBERTI_MAX_DISTINCT = 23;
export const MIN_DIGIT_PAIRS = 4; // below: not enough evidence for a flag

// Homophonic hint: distinct symbols well above the alphabet size, plus
// a nearly flat letter distribution.
export const HOMOPHONIC_SYMBOLS = 32;
export const HOMOPHONIC_UNIFORMITY = 75;

// Block-of-5 grouping: at least this many groups of exactly 5 before
// the "grouped" flag fires.
export const GROUP_SIZE = 5;
export const MIN_GROUPS_FOR_FLAG = 4;

// Confidence label cutoffs for summed rule weights (0-100 scale).
export const VERY_LIKELY = 60;
export const POSSIBLE = 30;

// Known-ciphertext matching (Saknussemm): a contiguous fragment of at
// least this many letters counts as a match.
export const KNOWN_TEXT_MIN_FRAGMENT = 60;
