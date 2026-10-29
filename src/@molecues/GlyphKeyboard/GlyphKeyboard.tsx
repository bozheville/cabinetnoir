import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { metal, focusRing } from '@theme/mixins';

import { getPigpenVariant, DEFAULT_PIGPEN_VARIANT } from '@encryptors/Pigpen/variants';
import { getGlyphGeometry } from '@encryptors/Pigpen/glyphs';
import { Button, IconButton } from '@atoms';
import { EraseIcon } from '@ornaments';
import Tooltip from '@atoms/Tooltip';

const Keyboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  justify-items: center;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: repeat(9, 1fr);
  }
`;

// Small square brass stamp: press to append the glyph.
const Key = styled.button`
  padding: 4px;
  line-height: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.ink.primary};

  ${metal('brass')}
  ${focusRing}
`;

const KeyGlyph = styled.svg`
  display: block;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

interface GlyphKeyboardProps {
  // Variant id from the pigpen registry.
  variant?: string;
  // Clicking a key appends the letter it stands for.
  onKey: (letter: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

// Glyph-only virtual keyboard for decrypt mode: a grid of clickable SVG
// keys drawn per the selected variant, no letters on the keys — the user
// picks symbols by shape, like reading a real ciphertext. Typed text is
// still accepted in the input field for accessibility; the keyboard is
// stateless, every click is a callback.
const GlyphKeyboard: React.FC<GlyphKeyboardProps> = ({
  variant = DEFAULT_PIGPEN_VARIANT,
  onKey,
  onDelete,
  onClear,
}) => {
  const { t } = useTranslation('common');
  const { glyphOf } = getPigpenVariant(variant);

  const keys = Object.keys(glyphOf).sort();

  return (
    <Keyboard>
      <Grid>
        {keys.map((letter) => {
          const geometry = getGlyphGeometry(glyphOf[letter]);
          if (!geometry) {
            return null;
          }
          return (
            <Tooltip key={letter} content={t('learning.tooltips.pigpen.key')} trigger="children">
              <Key
                type="button"
                onClick={() => onKey(letter)}
                aria-label={t('learning.tooltips.pigpen.key')}
              >
                <KeyGlyph
                  width={26}
                  height={26}
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  {geometry.paths.map((path) => (
                    <path
                      key={path}
                      d={path}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                  {geometry.dot && (
                    <circle
                      cx={geometry.dot.cx}
                      cy={geometry.dot.cy}
                      r={8}
                      fill="currentColor"
                    />
                  )}
                </KeyGlyph>
              </Key>
            </Tooltip>
          );
        })}
      </Grid>
      <Actions>
        <Tooltip content={t('learning.tooltips.pigpen.delete')}>
          <Button variant="secondary" size="sm" onClick={onDelete}>
            {t('processing.pigpen.deleteKey')}
          </Button>
        </Tooltip>
        <Tooltip content={t('learning.tooltips.pigpen.clear')}>
          <IconButton label={t('learning.tooltips.pigpen.clear')} onClick={onClear}>
            <EraseIcon />
          </IconButton>
        </Tooltip>
      </Actions>
    </Keyboard>
  );
};

GlyphKeyboard.displayName = 'GlyphKeyboard';

export default GlyphKeyboard;
