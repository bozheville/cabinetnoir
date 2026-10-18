import React from 'react';
import styled from 'styled-components';

import { getPigpenVariant } from '@encryptors/Pigpen/variants';
import { getGlyphGeometry } from '@encryptors/Pigpen/glyphs';

const Strip = styled.span`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
`;

const Glyph = styled.svg`
  display: inline-block;
  flex-shrink: 0;
`;

interface GlyphRendererProps {
  // Plaintext letters; non-letters are skipped, spaces become gaps.
  text?: string;
  // Variant id from the pigpen registry.
  variant: string;
  // Pixel size of one glyph.
  size?: number;
}

// Renders a sequence of letters as pigpen SVG glyphs for a variant.
// Pure presentational: used by the tool's output strip, the keyboard
// keys, the worked example and the challenge cards.
const GlyphRenderer: React.FC<GlyphRendererProps> = ({
  text = '',
  variant,
  size = 28,
}) => {
  const { glyphOf } = getPigpenVariant(variant);

  return (
    <Strip>
      {text.toUpperCase().split('').map((char, index) => {
        const glyphId = glyphOf[char];
        if (!glyphId) {
          // Space makes a visible gap; other unknown characters are
          // dropped from the strip (they survive in the text output).
          return char === ' ' ? <span key={index} style={{ width: size / 2 }} /> : null;
        }
        const geometry = getGlyphGeometry(glyphId);
        if (!geometry) {
          return null;
        }
        return (
          <Glyph
            key={index}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            {geometry.paths.map((path) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {geometry.dot && (
              <circle
                cx={geometry.dot.cx}
                cy={geometry.dot.cy}
                r={7}
                fill="currentColor"
              />
            )}
          </Glyph>
        );
      })}
    </Strip>
  );
};

GlyphRenderer.displayName = 'GlyphRenderer';

export default GlyphRenderer;
