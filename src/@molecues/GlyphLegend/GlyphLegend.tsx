import React from 'react';
import { Pane } from 'evergreen-ui';
import styled from 'styled-components';

import { getPigpenVariant } from '@encryptors/Pigpen/variants';
import { getGlyphGeometry } from '@encryptors/Pigpen/glyphs';

const Sheet = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  width: 100%;
`;

const Card = styled(Pane)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 4px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.white};
  color: ${({ theme }) => theme.colorScheme.black};
`;

const KeyGlyph = styled.svg`
  display: block;
`;

const Letter = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colorScheme.gray[500]};
`;

interface GlyphLegendProps {
  // Variant id from the pigpen registry.
  variant: string;
}

// The letter-to-glyph key sheet shown above the text areas in the
// pigpen tool: every letter of the variant with the drawing it maps
// to, for the selected variant. Pure presentational.
const GlyphLegend: React.FC<GlyphLegendProps> = ({ variant }) => {
  const { glyphOf } = getPigpenVariant(variant);

  return (
    <Sheet>
      {Object.keys(glyphOf).sort().map((letter) => {
        const geometry = getGlyphGeometry(glyphOf[letter]);
        if (!geometry) {
          return null;
        }
        return (
          <Card key={letter}>
            <KeyGlyph width={22} height={22} viewBox="0 0 100 100" aria-hidden="true">
              {geometry.paths.map((path) => (
                <path
                  key={path}
                  d={path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {geometry.dot && (
                <circle cx={geometry.dot.cx} cy={geometry.dot.cy} r={9} fill="currentColor" />
              )}
            </KeyGlyph>
            <Letter>{letter}</Letter>
          </Card>
        );
      })}
    </Sheet>
  );
};

GlyphLegend.displayName = 'GlyphLegend';

export default GlyphLegend;
