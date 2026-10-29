// Zone -> leather mapping. Components ask for a zone, never a colour.
// See specs/leather-deco-redesign/01-materials-and-colour.md.

export const zones = {
  header: 'chestnut',
  hero: 'green',
  tool: 'chestnut',
  cryptoanalysis: 'oxblood',
  learn: 'green',
  history: 'navy',
  practice: 'olive',
  identify: 'navy',
  description: 'beige',
  homeMenu: 'green',
  footer: 'espresso',
} as const;

export type ZoneName = keyof typeof zones;
