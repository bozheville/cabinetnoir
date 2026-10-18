// A pigpen glyph is identified by a stable id: shape + slot + optional
// dot marking (e.g. "grid-5", "grid-5-dot", "arm-top", "pen-3-left").
// The geometry that turns an id into an SVG path lives in ../glyphs.ts
// (task 02); the engine only ever sees these ids.
export type PigpenGlyphId = string;

export interface PigpenVariant {
  // Stable id used in URLs-free state and the variant selector.
  id: string;
  // i18n key of the display name.
  nameKey: string;
  // letter -> glyph id. This mapping IS the variant's key; decoding is
  // its inverse.
  glyphOf: Record<string, PigpenGlyphId>;
}
