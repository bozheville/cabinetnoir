// Ink (text colours) and data colours.
// Contrast ratios are checked in specs/leather-deco-redesign/08-accessibility-and-motion.md.

export const ink = {
  primary: '#2a1a12',
  secondary: '#5a4636',
  faded: '#8a7560', // large text / placeholders only (3.6:1 on vellum)
  cream: '#f3e9d2',
  creamMuted: '#c4b08f',
  red: '#9e2b25',
  green: '#2f6b4f',
};

// Enamel/ink palette for data: key slices, columns, frequency highlights.
export const data = [
  '#9e2b25', // 1 vermilion
  '#2c4f7c', // 2 prussian blue
  '#2f6b4f', // 3 bottle green
  '#8a6212', // 4 ochre
  '#6b3a62', // 5 aubergine
  '#1f6a78', // 6 teal
  '#8f4a2a', // 7 copper dark
  '#3d2a1c', // 8 sepia
] as const;
