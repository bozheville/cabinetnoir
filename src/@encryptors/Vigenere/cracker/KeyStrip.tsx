import React from 'react';
import { Pane, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';

import strings from '../strings';
import { HIGHLIGHT_COLORS } from './CipherText';
import { LockedLetter } from './useCracker';

const Strip = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Cell = styled(Pane)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const LetterInput = styled(TextInput)<{ $color: string; $active: boolean }>`
  width: 34px;
  height: 34px;
  text-align: center;
  font-family: monospace;
  font-weight: 700;
  font-size: 16px;
  border-color: ${({ $color, $active }) => ($active ? $color : undefined)};
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
}) => (
  <Strip>
    {Array.from({ length: keyLength }).map((_, slice) => {
      const locked = lockedLetters[slice];
      const color = HIGHLIGHT_COLORS[slice % HIGHLIGHT_COLORS.length];
      return (
        <Cell key={slice}>
          <LetterInput
            $color={color}
            $active={activeSlice === slice}
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
          <Text size={300}>{locked?.source === 'manual' ? strings.wizard.keyLetters.manualTag : `${slice + 1}`}</Text>
        </Cell>
      );
    })}
  </Strip>
);

export default KeyStrip;
