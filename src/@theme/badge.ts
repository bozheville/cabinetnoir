// Enamel badge tones (specs/leather-deco-redesign/05-components.md "Badge").
// Difficulty, confidence and count pills; keyed by semantic tone.
export const badgeTones = {
  easy: { bg: '#2f6b4f', fg: '#f3e9d2' },
  medium: { bg: '#8a6212', fg: '#f3e9d2' },
  hard: { bg: '#9e2b25', fg: '#f3e9d2' },
  copper: { bg: '#c58052', fg: '#2a1a12' },
  brass: { bg: '#c9a04f', fg: '#2a1a12' },
  patina: { bg: '#8f8a6a', fg: '#2a1a12' },
} as const;

export type BadgeTone = keyof typeof badgeTones;
