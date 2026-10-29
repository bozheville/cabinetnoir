import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { TextInput } from '@atoms';
import { Caption } from '@typography';
import { HIGHLIGHT_COLORS, useCrackerKey } from '@encryptors/shared/cracker';
import { LockedLetter } from './useCracker';

const Strip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

// The slice's typewriter key: a small mono field bordered with the
// slice's data ink, the slice number engraved below-right as a second
// colour cue.
const LetterInput = styled(TextInput)<{ $color: string; $active: boolean }>`
  width: 40px;

  input {
    height: 34px;
    padding: 0;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    border-color: ${({ $color }) => $color};
  }

  ${({ $color, $active }) => ($active
    ? `input { box-shadow: inset 0 1px 2px rgba(0,0,0,0.18), 0 0 4px ${$color}80; }`
    : '')}
`;

const SliceTag = styled(Caption)`
  align-self: flex-end;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.metal.brass.light};
`;

interface KeyStripProps {
  keyLength: number;
  lockedLetters: Record<number, LockedLetter>;
  activeSlice?: number;
  onJump: (slice: number) => void;
  onOverride: (slice: number, letter: string) => void;
  onClear: (slice: number) => void;
}

// One cell per key letter. Clicking focuses the cell (and jumps to that
// slice's chart); typing a letter is a manual override that wins over the
// chart choice; clearing the letter un-locks the slice.
const KeyStrip: React.FC<KeyStripProps> = ({
  keyLength,
  lockedLetters,
  activeSlice,
  onJump,
  onOverride,
  onClear,
}) => {
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.keyLetters.');
  return (
  <Strip data-guide="key-strip">
    {Array.from({ length: keyLength }).map((_, slice) => {
      const locked = lockedLetters[slice];
      const color = HIGHLIGHT_COLORS[slice % HIGHLIGHT_COLORS.length];
      return (
        <Cell key={slice}>
          <LetterInput
            $color={color}
            $active={activeSlice === slice}
            mono
            maxLength={1}
            value={locked?.letter ?? ''}
            placeholder="_"
            onFocus={() => onJump(slice)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value.toUpperCase();
              const letter = value.slice(-1);
              if (!letter) {
                onClear(slice);
                return;
              }
              if (/[A-Z]/.test(letter)) {
                onOverride(slice, letter);
              }
            }}
          />
          <SliceTag>
            {locked?.source === 'manual'
              ? t(`${base}manualTag`)
              : locked?.source === 'crib'
                ? t(`${base}suggestedTag`)
                : `${slice + 1}`}
          </SliceTag>
        </Cell>
      );
    })}
  </Strip>
  );
};

export default KeyStrip;
