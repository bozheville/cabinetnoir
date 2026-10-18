// SVG geometry for every pigpen glyph id, in a 0 0 100 100 viewBox.
// Stroke-based, currentColor — the components stay theme-aware. The
// fallback strings are rough unicode approximations used by the
// "copy as text" legend; the drawing is the real cipher.

export interface GlyphGeometry {
  // One or more SVG path data strings, stroked.
  paths: string[];
  // Optional filled dot.
  dot?: { cx: number; cy: number };
  // Rough unicode approximation for the text legend (approximate by
  // design: real pigpen is graphics).
  fallback: string;
}

// --- Grid family (masonic grids, rosicrucian pens) ---------------------
// A pen's glyph is drawn from the inner lines only: the outer border of
// the grid is not part of any glyph (per the classic key image). So a
// pen keeps the walls that separate it from its neighbours.

const CELL = 100 / 3;

const gridWalls = (cell: number): string[] => {
  const row = Math.floor((cell - 1) / 3);
  const col = (cell - 1) % 3;
  const x0 = col * CELL;
  const x1 = (col + 1) * CELL;
  const y0 = row * CELL;
  const y1 = (row + 1) * CELL;
  const walls: string[] = [];
  if (col > 0) {
    walls.push(`M ${x0} ${y0} L ${x0} ${y1}`);
  }
  if (col < 2) {
    walls.push(`M ${x1} ${y0} L ${x1} ${y1}`);
  }
  if (row > 0) {
    walls.push(`M ${x0} ${y0} L ${x1} ${y0}`);
  }
  if (row < 2) {
    walls.push(`M ${x0} ${y1} L ${x1} ${y1}`);
  }
  return walls;
};

const penCenter = (cell: number) => {
  const row = Math.floor((cell - 1) / 3);
  const col = (cell - 1) % 3;
  return {
    cx: col * CELL + CELL / 2,
    cy: row * CELL + CELL / 2,
  };
};

// --- X arms (masonic X shapes, templar baseless triangles) --------------
// Each arm is the pair of half-diagonals bounding it, vertex at the
// cross centre.

const ARM_CENTRE = { x: 50, y: 57 };
const ARM_TIPS = {
  topLeft: { x: 16, y: 23 },
  topRight: { x: 84, y: 23 },
  bottomLeft: { x: 16, y: 91 },
  bottomRight: { x: 84, y: 91 },
};

const armPaths = (tips: Array<{ x: number; y: number }>): string[] =>
  tips.map((tip) => `M ${ARM_CENTRE.x} ${ARM_CENTRE.y} L ${tip.x} ${tip.y}`);

const TOP_ARM = [ARM_TIPS.topLeft, ARM_TIPS.topRight];
const LEFT_ARM = [ARM_TIPS.topLeft, ARM_TIPS.bottomLeft];
const RIGHT_ARM = [ARM_TIPS.topRight, ARM_TIPS.bottomRight];
const BOTTOM_ARM = [ARM_TIPS.bottomLeft, ARM_TIPS.bottomRight];

const ARM_DOTS = {
  top: { cx: 50, cy: 35 },
  left: { cx: 30, cy: 57 },
  right: { cx: 70, cy: 57 },
  bottom: { cx: 50, cy: 79 },
};

// --- Templar: closed triangular arms and lozenges -----------------------

const TRI_DOTS = {
  top: { cx: 50, cy: 30 },
  left: { cx: 28, cy: 57 },
  right: { cx: 72, cy: 57 },
  bottom: { cx: 50, cy: 84 },
};

const LOZ_PATHS = {
  top: 'M 50 16 L 64 40 L 50 64 L 36 40 Z',
  left: 'M 14 57 L 38 43 L 50 57 L 38 71 Z',
  right: 'M 86 57 L 62 43 L 50 57 L 62 71 Z',
  bottom: 'M 50 98 L 64 74 L 50 50 L 36 74 Z',
};

const LOZ_DOTS = {
  top: { cx: 50, cy: 40 },
  left: { cx: 32, cy: 57 },
  right: { cx: 68, cy: 57 },
  bottom: { cx: 50, cy: 74 },
};

// --- The table -----------------------------------------------------------

const GRID_WALL_FALLBACKS = ['┘', '⊔', '└', '⊐', '□', '⊏', '┐', '⊓', '┌'];
const ARM_FALLBACKS = { top: '∨', left: '<', right: '>', bottom: '∧' };
const TRI_FALLBACKS = { top: '▽', left: '◁', right: '▷', bottom: '△' };
const LOZ_FALLBACKS = { top: '◇', left: '◁', right: '▷', bottom: '◇' };

const geometry: Record<string, GlyphGeometry> = {};

// Masonic grids: 1–9 plain, dotted twins.
GRID_WALL_FALLBACKS.forEach((fallback, index) => {
  const cell = index + 1;
  const { cx, cy } = penCenter(cell);
  geometry[`grid-${cell}`] = { paths: gridWalls(cell), fallback };
  geometry[`grid-${cell}-dot`] = {
    paths: gridWalls(cell),
    dot: { cx, cy },
    fallback: `${fallback}·`,
  };
});

// Rosicrucian pens: same walls, dot position picks the letter.
['left', 'center', 'right'].forEach((position, positionIndex) => {
  const offset = [1 / 6, 1 / 2, 5 / 6][positionIndex];
  GRID_WALL_FALLBACKS.forEach((fallback, index) => {
    const cell = index + 1;
    const row = Math.floor(index / 3);
    const col = index % 3;
    geometry[`pen-${cell}-${position}`] = {
      paths: gridWalls(cell),
      dot: { cx: col * CELL + CELL * offset, cy: row * CELL + CELL / 2 },
      fallback: position === 'left' ? `·${fallback}` : position === 'center' ? `·${fallback}·` : `${fallback}·`,
    };
  });
});

// Masonic X arms, plain and dotted.
(['top', 'left', 'right', 'bottom'] as const).forEach((arm) => {
  const tips = { top: TOP_ARM, left: LEFT_ARM, right: RIGHT_ARM, bottom: BOTTOM_ARM }[arm];
  geometry[`arm-${arm}`] = {
    paths: armPaths(tips),
    fallback: ARM_FALLBACKS[arm],
  };
  geometry[`arm-${arm}-dot`] = {
    paths: armPaths(tips),
    dot: ARM_DOTS[arm],
    fallback: `${ARM_FALLBACKS[arm]}·`,
  };
});

// Templar group 1: baseless triangles — same geometry as the X arms.
(['top', 'left', 'right', 'bottom'] as const).forEach((arm) => {
  const tips = { top: TOP_ARM, left: LEFT_ARM, right: RIGHT_ARM, bottom: BOTTOM_ARM }[arm];
  geometry[`tri-${arm}`] = {
    paths: armPaths(tips),
    fallback: ARM_FALLBACKS[arm],
  };
  geometry[`tri-${arm}-dot`] = {
    paths: armPaths(tips),
    dot: TRI_DOTS[arm],
    fallback: `${ARM_FALLBACKS[arm]}·`,
  };
});

// Templar group 2: closed triangular arms.
const TRIANGLES = {
  top: 'M 20 20 L 80 20 L 50 56 Z',
  left: 'M 16 26 L 16 90 L 52 58 Z',
  right: 'M 84 26 L 84 90 L 48 58 Z',
  bottom: 'M 20 94 L 80 94 L 50 58 Z',
};
(['top', 'left', 'right', 'bottom'] as const).forEach((arm) => {
  geometry[`stri-${arm}`] = {
    paths: [TRIANGLES[arm]],
    fallback: TRI_FALLBACKS[arm],
  };
  geometry[`stri-${arm}-dot`] = {
    paths: [TRIANGLES[arm]],
    dot: TRI_DOTS[arm],
    fallback: `${TRI_FALLBACKS[arm]}·`,
  };
});

// Templar group 3: lozenges.
(['top', 'left', 'right', 'bottom'] as const).forEach((arm) => {
  geometry[`loz-${arm}`] = {
    paths: [LOZ_PATHS[arm]],
    fallback: LOZ_FALLBACKS[arm],
  };
  geometry[`loz-${arm}-dot`] = {
    paths: [LOZ_PATHS[arm]],
    dot: LOZ_DOTS[arm],
    fallback: `${LOZ_FALLBACKS[arm]}·`,
  };
});

// Templar N: the St Andrew's cross.
geometry.andrew = {
  paths: [
    `M ${ARM_TIPS.topLeft.x} ${ARM_TIPS.topLeft.y} L ${ARM_TIPS.bottomRight.x} ${ARM_TIPS.bottomRight.y}`,
    `M ${ARM_TIPS.topRight.x} ${ARM_TIPS.topRight.y} L ${ARM_TIPS.bottomLeft.x} ${ARM_TIPS.bottomLeft.y}`,
  ],
  fallback: '✕',
};

export const getGlyphGeometry = (glyphId: string): GlyphGeometry | undefined =>
  geometry[glyphId];
