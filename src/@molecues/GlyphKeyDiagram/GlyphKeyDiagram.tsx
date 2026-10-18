import React from 'react';
import styled from 'styled-components';

import { getPigpenVariant } from '@encryptors/Pigpen/variants';
import { getGlyphGeometry } from '@encryptors/Pigpen/glyphs';

// The "why" figure: the complete key of a variant drawn as its source
// shapes — grids and crosses with every letter sitting in the pen it
// belongs to. Every glyph the cipher produces is one pen of these
// figures, cut out and carried alone; the dot marks the second set.
// Geometry comes from glyphs.ts, so the diagram can never disagree
// with the glyphs the tool actually draws.

const PEN = 100 / 3;
const DOT_RADIUS = 3.2;
const STROKE = 6.5;
const GAP = 16;
const PADDING = 6;
const FIGURE = 100;

interface Figure {
  kind: 'grid' | 'cross' | 'pens' | 'single';
  ids: string[];
}

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
    { kind: 'cross', ids: ['tri-top', 'tri-right', 'tri-bottom', 'tri-left'] },
    { kind: 'cross', ids: ['stri-left', 'stri-right', 'stri-bottom', 'stri-top'] },
    { kind: 'cross', ids: ['loz-top', 'loz-right', 'loz-bottom', 'loz-left'] },
    { kind: 'single', ids: ['andrew'] },
    { kind: 'cross', ids: ['tri-top-dot', 'tri-right-dot', 'tri-bottom-dot', 'tri-left-dot'] },
    { kind: 'cross', ids: ['stri-left-dot', 'stri-right-dot', 'stri-bottom-dot', 'stri-top-dot'] },
    { kind: 'cross', ids: ['loz-bottom-dot', 'loz-top-dot', 'loz-right-dot', 'loz-left-dot'] },
  ],
};

// Where the letter label sits inside its pen/arm, in figure-local
// 0..100 coordinates — placed clear of the dot's true position.
const ARM_LABELS: Record<string, Record<string, { x: number; y: number }>> = {
  arm: { top: { x: 50, y: 46 }, left: { x: 38, y: 61 }, right: { x: 62, y: 61 }, bottom: { x: 41, y: 79 } },
  tri: { top: { x: 50, y: 44 }, left: { x: 38, y: 61 }, right: { x: 62, y: 61 }, bottom: { x: 41, y: 84 } },
  stri: { top: { x: 50, y: 44 }, left: { x: 38, y: 61 }, right: { x: 62, y: 61 }, bottom: { x: 41, y: 84 } },
  loz: { top: { x: 50, y: 28 }, left: { x: 22, y: 61 }, right: { x: 79, y: 61 }, bottom: { x: 50, y: 90 } },
};

const labelFor = (glyphId: string): { x: number; y: number; size: number } => {
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
  const arm = glyphId.match(/^(arm|tri|stri|loz)-(top|left|right|bottom)(-dot)?$/);
  if (arm) {
    return { ...ARM_LABELS[arm[1]][arm[2]], size: 11 };
  }
  // andrew: the letter sits in the top quadrant of the bare cross.
  return { x: 50, y: 32, size: 12 };
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

  const width = PADDING * 2 + figures.length * FIGURE + (figures.length - 1) * GAP
    + (highlightGeometry ? GAP + FIGURE : 0);
  const height = highlightGeometry ? 130 : 112;

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
          const x = figureX;
          figureX += FIGURE + GAP;
          return (
            <g key={figureIndex} transform={`translate(${x}, ${PADDING})`}>
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
                const isCross = figure.kind === 'cross' || figure.kind === 'single';
                const highlighted = glyphId === highlightId;
                const label = labelFor(glyphId);
                return (
                  <g key={glyphId}>
                    {(isCross || highlighted) && geometry.paths.map((path) => (
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
                        r={DOT_RADIUS}
                        fill={highlighted ? 'var(--glyph-accent)' : 'currentColor'}
                      />
                    )}
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
          <g transform={`translate(${width - PADDING - FIGURE}, 0)`}>
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
