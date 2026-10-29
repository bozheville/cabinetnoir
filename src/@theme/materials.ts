// Materials: leather, paper, metal, thread.
// Source of truth: specs/leather-deco-redesign/01-materials-and-colour.md

export interface LeatherTone {
  base: string;
  seam: string;
  thread: string;
  text: string; // default text colour on this leather
  textMuted: string; // secondary text colour on this leather
}

export const leather = {
  beige: { base: '#d9c4a0', seam: '#b49c74', thread: '#7a5a36', text: '#2a1a12', textMuted: '#5a4636' },
  tan: { base: '#b48a5e', seam: '#8d6a44', thread: '#f3e9d2', text: '#2a1a12', textMuted: '#3d2a1c' },
  saddle: { base: '#8a5a33', seam: '#6a4425', thread: '#e2c47a', text: '#f3e9d2', textMuted: '#c4b08f' },
  chestnut: { base: '#5a3320', seam: '#3f2316', thread: '#d9c4a0', text: '#f3e9d2', textMuted: '#c4b08f' },
  espresso: { base: '#2b1b13', seam: '#1a100b', thread: '#8d6a44', text: '#f3e9d2', textMuted: '#c4b08f' },
  green: { base: '#2f4a3b', seam: '#1f3328', thread: '#c4b08f', text: '#f3e9d2', textMuted: '#c4b08f' },
  olive: { base: '#5b5a34', seam: '#424123', thread: '#d9c4a0', text: '#f3e9d2', textMuted: '#c4b08f' },
  oxblood: { base: '#5e211d', seam: '#421613', thread: '#d9c4a0', text: '#f3e9d2', textMuted: '#c4b08f' },
  navy: { base: '#243246', seam: '#18222f', thread: '#c4b08f', text: '#f3e9d2', textMuted: '#c4b08f' },
} satisfies Record<string, LeatherTone>;

export const paper = {
  vellum: '#f1e7d0',
  ivory: '#f7f0de',
  parchment: '#e8d9b8',
  rule: '#c9b48c',
  shadow: 'rgba(42, 26, 18, 0.25)',
};

export interface MetalRamp {
  highlight: string;
  light: string;
  base: string;
  dark: string;
  shadow: string;
  patina: string;
}

export const metal = {
  brass: { highlight: '#f3dc9a', light: '#e2c47a', base: '#c9a04f', dark: '#8a6212', shadow: '#5a3f0c', patina: '#8f8a6a' },
  copper: { highlight: '#f5c7a4', light: '#e7a77c', base: '#c58052', dark: '#8f4a2a', shadow: '#5c2c16', patina: '#4f8f80' },
} satisfies Record<string, MetalRamp>;

export const thread = {
  cream: '#f3e9d2',
  linen: '#d9c4a0',
  brown: '#7a5a36',
  gold: '#e2c47a',
};

// Desk patchwork: three close dark tones, cut into large patches.
// See specs 01 "Desk patchwork".
export const desk = {
  espresso: '#2b1b13',
  umber: '#35221a',
  walnut: '#3e2a1e',
  seam: '#1a100b',
  thread: '#8d6a44',
};
