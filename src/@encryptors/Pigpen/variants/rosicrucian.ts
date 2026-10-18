import { PigpenVariant } from './types';

// The Rosicrucian variant (17th century; described by Agrippa in 1531 as
// the "Kabbalah of the Nine Chambers"): a single grid of nine "pens",
// each holding up to three letters. The dot's position inside the pen —
// left, center or right — says which of the three letters it marks.
const PENS = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'YZ'];
const DOT_POSITIONS = ['left', 'center', 'right'];

const glyphOf: Record<string, string> = {};
PENS.forEach((pen, penIndex) => {
  pen.split('').forEach((letter, letterIndex) => {
    glyphOf[letter] = `pen-${penIndex + 1}-${DOT_POSITIONS[letterIndex]}`;
  });
});

export const rosicrucian: PigpenVariant = {
  id: 'rosicrucian',
  nameKey: 'processing.pigpen.variants.rosicrucian',
  glyphOf,
};
