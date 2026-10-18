import { getPigpenVariant, DEFAULT_PIGPEN_VARIANT } from './variants';

// Pigpen engine: letter <-> glyph id per variant. The ciphertext is
// graphics, so the engine's output is a sequence of glyph ids — the
// renderer turns ids into SVG. Unknown characters (spaces, punctuation,
// letters a variant does not cover, e.g. J in templar) pass through
// unchanged in both directions.

// Plaintext -> glyph id sequence. Case is folded: pigpen glyphs have no
// case.
export const pigpenEncode = (text: string, variantId: string = DEFAULT_PIGPEN_VARIANT): string[] => {
  const { glyphOf } = getPigpenVariant(variantId);
  return text.toUpperCase().split('').map((char) => glyphOf[char] || char);
};

// Glyph id sequence (mixed with passed-through characters) -> plaintext.
export const pigpenDecode = (glyphIds: string[], variantId: string = DEFAULT_PIGPEN_VARIANT): string => {
  const { glyphOf } = getPigpenVariant(variantId);
  const letterOf: Record<string, string> = {};
  Object.entries(glyphOf).forEach(([letter, glyphId]) => {
    letterOf[glyphId] = letter;
  });
  return glyphIds.map((glyphId) => letterOf[glyphId] || glyphId).join('');
};

// Letters this variant can draw, in alphabet order — the keyboard's keys.
export const pigpenVariantLetters = (variantId: string = DEFAULT_PIGPEN_VARIANT): string[] =>
  Object.keys(getPigpenVariant(variantId).glyphOf).sort();
