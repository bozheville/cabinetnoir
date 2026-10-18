import React from 'react';
import styled from 'styled-components';

import { getPigpenVariant } from '@encryptors/Pigpen/variants';
import { getGlyphGeometry } from '@encryptors/Pigpen/glyphs';

// The "why" figure: the complete key of a variant drawn as its source
// shapes — grids and crosses with every letter at the pen it belongs
// to. Every glyph the cipher produces is one pen or arm of these
// figures, cut out and carried alone; the dot marks the second set.
// Geometry comes from glyphs.ts, so the diagram can never disagree
// with the glyphs the tool actually draws.
//
// Two cross styles:
// - 'cross' (masonic): the four arms are drawn full size and meet at
//   the centre — the arms ARE the diagonals of the X.
// - 'arms' (templar): the four arms are small detached shapes arranged
//   around an empty centre, matching the historical Templar key, where
//   each arm keeps its identity instead of fusing into one outline.

const PEN = 100 / 3;
const DOT_RADIUS = 3.2;
const STROKE = 6.5;
const GAP = 16;
const PADDING = 6;
const FIGURE = 100;
// Detached-arm figures: 100 units of glyph area inside a margin that
// carries the letter labels.
const MARGIN = 15;
const ARMS_FIGURE = FIGURE + MARGIN * 2;
// Scale of a detached arm glyph inside its quadrant.
const ARM_SCALE = 0.5;
// Quadrant origins for a half-size glyph box (box centre lands on the
// quadrant centre of the glyph area), figure-local.
const ARM_BOX = {
  top: { x: MARGIN + 25, y: MARGIN },
  left: { x: MARGIN, y: MARGIN + 25 },
  right: { x: MARGIN + 50, y: MARGIN + 25 },
  bottom: { x: MARGIN + 25, y: MARGIN + 50 },
} as const;

interface Figure {
  kind: 'grid' | 'cross' | 'pens' | 'arms' | 'single';
  ids: string[];
}

const figureSize = (kind: Figure['kind']): number =>
  kind === 'arms' || kind === 'single' ? ARMS_FIGURE : FIGURE;

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1);

// Figure layout per variant: which shapes group which glyph ids.
const FIGURES: Record<string, Figure[]> = {
  masonic: [
    { kind: 'grid', ids: range(9).map((n) => `grid-${n}`) },
    { kind: 'grid', ids: range(9).map((n) => `grid-${n}-dot`) },
    { kind: 'cross', ids: ['arm-top', 'arm-left', 'arm-right', 'arm-bottom'] },
    { kind: 'cross', ids: ['arm-top-dot', 'arm-left-dot', 'arm-right-dot', 'arm-bottom-dot'] },
  ],
  rosicrucian: [
    {
      kind: 'pens',
      ids: range(9).flatMap((n) => ['left', 'center', 'right'].map((p) => `pen-${n}-${p}`)),
    },
  ],
  templar: [
    { kind: 'arms', ids: ['tri-top', 'tri-right', 'tri-bottom', 'tri-left'] },
    { kind: 'arms', ids: ['stri-left', 'stri-right', 'stri-bottom', 'stri-top'] },
    { kind: 'arms', ids: ['loz-top', 'loz-right', 'loz-bottom', 'loz-left'] },
    { kind: 'single', ids: ['andrew'] },
    { kind: 'arms', ids: ['tri-top-dot', 'tri-right-dot', 'tri-bottom-dot', 'tri-left-dot'] },
    { kind: 'arms', ids: ['stri-left-dot', 'stri-right-dot', 'stri-bottom-dot', 'stri-top-dot'] },
    { kind: 'arms', ids: ['loz-bottom-dot', 'loz-top-dot', 'loz-right-dot', 'loz-left-dot'] },
  ],
};

// Where the letter label sits inside its pen/arm, in figure-local
// coordinates — placed clear of the dot's true position.
const ARM_LABELS: Record<string, Record<string, { x: number; y: number }>> = {
  arm: { top: { x: 50, y: 46 }, left: { x: 38, y: 61 }, right: { x: 62, y: 61 }, bottom: { x: 41, y: 79 } },
};

// Detached arms are too small to hold a letter — the label sits
// outside the arm, in the figure's margin, like the historical key.
const DETACHED_LABELS: Record<string, { x: number; y: number }> = {
  top: { x: MARGIN + 50, y: 22 },
  left: { x: 8, y: MARGIN + 57 },
  right: { x: MARGIN + 100 + 7, y: MARGIN + 57 },
  bottom: { x: MARGIN + 50, y: ARMS_FIGURE - 6 },
};

const labelFor = (glyphId: string, kind: Figure['kind']): { x: number; y: number; size: number } => {
  const grid = glyphId.match(/^grid-(\d)(-dot)?$/);
  if (grid) {
    const n = Number(grid[1]);
    const row = Math.floor((n - 1) / 3);
    const col = (n - 1) % 3;
    return grid[2]
      ? { x: col * PEN + PEN / 2, y: row * PEN + 11, size: 11 }
      : { x: col * PEN + PEN / 2, y: row * PEN + 21.5, size: 12 };
  }
  const pen = glyphId.match(/^pen-(\d)-(left|center|right)$/);
  if (pen) {
    const n = Number(pen[1]);
    const row = Math.floor((n - 1) / 3);
    const col = (n - 1) % 3;
    const offset = { left: 1 / 6, center: 1 / 2, right: 5 / 6 }[pen[2]];
    return { x: col * PEN + PEN * offset, y: row * PEN + 29, size: 10 };
  }
  if (kind === 'arms' || kind === 'single') {
    const arm = glyphId.match(/^(?:arm|tri|stri|loz)-(top|left|right|bottom)(-dot)?$/);
    const direction = arm ? arm[1] : 'top'; // andrew: label above the cross
    const base = kind === 'single'
      ? { x: MARGIN + 50, y: MARGIN + 27 }
      : DETACHED_LABELS[direction];
    return { ...base, size: 13 };
  }
  const plainArm = glyphId.match(/^(arm|tri|stri|loz)-(top|left|right|bottom)(-dot)?$/);
  if (plainArm) {
    return { ...ARM_LABELS[plainArm[1]][plainArm[2]], size: 11 };
  }
  return { x: 50, y: 57, size: 11 };
};

interface GlyphKeyDiagramProps {
  // Variant id from the pigpen registry.
  variant: string;
  // Optional letter to spotlight: its pen is drawn in the accent color
  // and the extracted glyph is shown beside the figures.
  highlight?: string;
}

const Wrapper = styled.div<{ $maxWidth: number }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth}px;
  overflow-x: auto;
  --glyph-accent: ${({ theme }) => theme.colorScheme.red_violet[500]};
`;

const GlyphKeyDiagram: React.FC<GlyphKeyDiagramProps> = ({ variant, highlight }) => {
  const { id, glyphOf } = getPigpenVariant(variant);
  // Unknown ids fall back to the default variant — resolve the id so
  // the figure layout matches the data actually rendered.
  const figures = FIGURES[id] || [];

  const letterOf: Record<string, string> = {};
  Object.entries(glyphOf).forEach(([letter, glyphId]) => {
    letterOf[glyphId] = letter;
  });

  const highlightId = highlight ? glyphOf[highlight.toUpperCase()] : undefined;
  const highlightGeometry = highlightId ? getGlyphGeometry(highlightId) : undefined;

  const sizes = figures.map((figure) => figureSize(figure.kind));
  const figureSpan = sizes.reduce((sum, size) => sum + size, 0) + (figures.length - 1) * GAP;
  const maxSize = Math.max(...sizes, FIGURE);
  const width = PADDING * 2 + figureSpan + (highlightGeometry ? GAP + FIGURE : 0);
  const height = Math.max(PADDING * 2 + maxSize, highlightGeometry ? 140 : 0);

  let figureX = PADDING;

  return (
    <Wrapper $maxWidth={Math.max(260, Math.round(width * 1.4))}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label={`Pigpen key: ${id}`}
      >
        {figures.map((figure, figureIndex) => {
          const size = sizes[figureIndex];
          const x = figureX;
          figureX += size + GAP;
          const y = PADDING + (maxSize - size) / 2;
          const detached = figure.kind === 'arms' || figure.kind === 'single';
          return (
            <g key={figureIndex} transform={`translate(${x}, ${y})`}>
              {(figure.kind === 'grid' || figure.kind === 'pens') && (
                <>
                  <path d={`M ${PEN} 0 L ${PEN} 100`} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
                  <path d={`M ${2 * PEN} 0 L ${2 * PEN} 100`} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
                  <path d={`M 0 ${PEN} L 100 ${PEN}`} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
                  <path d={`M 0 ${2 * PEN} L 100 ${2 * PEN}`} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
                </>
              )}
              {figure.ids.map((glyphId) => {
                const geometry = getGlyphGeometry(glyphId);
                const letter = letterOf[glyphId];
                if (!geometry || !letter) {
                  return null;
                }
                const highlighted = glyphId === highlightId;
                const label = labelFor(glyphId, figure.kind);
                // Detached arms: the glyph is drawn half size inside
                // its quadrant; touching crosses draw it full size.
                let transform: string | undefined;
                if (figure.kind === 'arms') {
                  const direction = glyphId.match(/^(?:arm|tri|stri|loz)-(top|left|right|bottom)(-dot)?$/)?.[1];
                  const box = ARM_BOX[direction || 'top'];
                  transform = `translate(${box.x}, ${box.y}) scale(${ARM_SCALE})`;
                } else if (figure.kind === 'single') {
                  transform = `translate(${MARGIN + 25}, ${MARGIN + 25}) scale(${ARM_SCALE})`;
                }
                return (
                  <g key={glyphId}>
                    <g transform={transform}>
                      {(figure.kind !== 'grid' && figure.kind !== 'pens' || highlighted) && geometry.paths.map((path) => (
                        <path
                          key={path}
                          d={path}
                          fill="none"
                          stroke={highlighted ? 'var(--glyph-accent)' : 'currentColor'}
                          strokeWidth={highlighted ? STROKE + 2 : STROKE}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}
                      {geometry.dot && (
                        <circle
                          cx={geometry.dot.cx}
                          cy={geometry.dot.cy}
                          r={transform ? DOT_RADIUS / ARM_SCALE : DOT_RADIUS}
                          fill={highlighted ? 'var(--glyph-accent)' : 'currentColor'}
                        />
                      )}
                    </g>
                    <text
                      x={label.x}
                      y={label.y}
                      fontSize={label.size}
                      textAnchor="middle"
                      fontWeight={highlighted ? 700 : 400}
                      fill={highlighted ? 'var(--glyph-accent)' : 'currentColor'}
                    >
                      {letter}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        {highlightGeometry && highlight && (
          <g transform={`translate(${width - PADDING - FIGURE}, ${(height - 130) / 2})`}>
            {highlightGeometry.paths.map((path) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke="var(--glyph-accent)"
                strokeWidth={STROKE + 1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {highlightGeometry.dot && (
              <circle
                cx={highlightGeometry.dot.cx}
                cy={highlightGeometry.dot.cy}
                r={DOT_RADIUS + 1}
                fill="var(--glyph-accent)"
              />
            )}
            <text
              x={FIGURE / 2}
              y={126}
              fontSize={16}
              fontWeight={700}
              textAnchor="middle"
              fill="var(--glyph-accent)"
            >
              {highlight.toUpperCase()}
            </text>
          </g>
        )}
      </svg>
    </Wrapper>
  );
};

GlyphKeyDiagram.displayName = 'GlyphKeyDiagram';

export default GlyphKeyDiagram;
