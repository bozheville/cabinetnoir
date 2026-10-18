import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button, IconButton, Pane, TrashIcon } from 'evergreen-ui';
import styled from 'styled-components';

import { getPigpenVariant, DEFAULT_PIGPEN_VARIANT } from '@encryptors/Pigpen/variants';
import { getGlyphGeometry } from '@encryptors/Pigpen/glyphs';
import Tooltip from '@atoms/Tooltip';

const Grid = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  justify-items: center;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: repeat(9, 1fr);
  }
`;

const Key = styled.button`
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.white};
  color: ${({ theme }) => theme.colorScheme.black};
  cursor: pointer;
  line-height: 0;

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colorScheme.red_violet[300]};
    background: ${({ theme }) => theme.colorScheme.red_violet[100]};
  }
`;

const KeyGlyph = styled.svg`
  display: block;
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
    <Pane display="flex" flexDirection="column" gap="4px" alignItems="center" width="100%">
      <Grid>
        {keys.map((letter) => {
          const geometry = getGlyphGeometry(glyphOf[letter]);
          if (!geometry) {
            return null;
          }
          return (
            <Tooltip key={letter} content={t('learning.tooltips.pigpen.key')}>
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
      <Pane display="flex" gap="8px">
        <Tooltip content={t('learning.tooltips.pigpen.delete')}>
          <Button size="small" onClick={onDelete}>
            {t('processing.pigpen.deleteKey')}
          </Button>
        </Tooltip>
        <Tooltip content={t('learning.tooltips.pigpen.clear')}>
          <IconButton
            size="small"
            icon={TrashIcon}
            onClick={onClear}
            aria-label={t('learning.tooltips.pigpen.clear')}
          />
        </Tooltip>
      </Pane>
    </Pane>
  );
};

GlyphKeyboard.displayName = 'GlyphKeyboard';

export default GlyphKeyboard;
