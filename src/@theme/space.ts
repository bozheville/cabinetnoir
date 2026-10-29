// 4px base scale. The only source of spacing after migration.
// See specs/leather-deco-redesign/03-layout-and-proportions.md.

export const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
  8: '64px',
  9: '96px',
} as const;

export type SpaceToken = keyof typeof space;

export const radius = {
  none: '0',
  paper: '2px',
  metal: '4px',
  leather: '10px',
  round: '999px',
} as const;

// Depth levels, one shadow each. No other shadows are allowed.
export const shadow = {
  band: 'none',
  card: '0 2px 0 rgba(0,0,0,0.25), 0 6px 14px -6px rgba(0,0,0,0.5)',
  metal: '0 1px 0 rgba(0,0,0,0.45), 0 2px 4px -1px rgba(0,0,0,0.5)',
  metalPressed: 'inset 0 2px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(0,0,0,0.3)',
  float: '0 12px 28px -8px rgba(0,0,0,0.6)',
} as const;

// Widths from content, not arbitrary. 03-layout-and-proportions.md §4.
export const widths = {
  read: '640px',
  sheet: '800px',
  tool: '1120px',
  case: '1280px',
} as const;
