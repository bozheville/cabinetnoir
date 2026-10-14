import React from 'react';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import strings from '../strings';
import CipherText, { HIGHLIGHT_COLORS } from './CipherText';
import FrequencyChart from './FrequencyChart';
import CribPanel from './CribPanel';
import KeyStrip from './KeyStrip';
import { LockedLetter, useCracker } from './useCracker';

const SliceTabs = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const SliceTab = styled(Pane)<{ $selected: boolean; $color: string }>`
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  border: ${({ $selected }) => ($selected ? '2px' : '1px')} solid
    ${({ $color, $selected }) => ($selected ? $color : 'transparent')};
  background: ${({ $color, $selected }) => ($selected ? `${$color}22` : '#00000008')};
`;

interface StepKeyLettersProps {
  cracker: ReturnType<typeof useCracker>;
}

const StepKeyLetters: React.FC<StepKeyLettersProps> = ({ cracker }) => {
  const {
    input,
    analysis,
    keyLength,
    lockedLetters,
    lockLetter,
    activeSlice,
    setActiveSlice,
    hintConfig,
  } = cracker;

  if (!analysis || keyLength === null) {
    return null;
  }

  const { hints } = hintConfig;

  const sliceLettersFor = (slice: number): string => {
    const letters = [];
    for (let i = slice; i < analysis.normalized.letters.length; i += keyLength) {
      letters.push(analysis.normalized.letters[i]);
    }
    return letters.join('');
  };

  const handleLock = (letter: string) => {
    lockLetter(activeSlice, letter, 'chart');

    // Jump to the next slice without a locked letter.
    for (let offset = 1; offset <= keyLength; offset += 1) {
      const next = (activeSlice + offset) % keyLength;
      if (!lockedLetters[next]) {
        setActiveSlice(next);
        break;
      }
    }
  };

  const colorFor = (cleanIndex: number): string => {
    const slice = cleanIndex % keyLength;
    const color = HIGHLIGHT_COLORS[slice % HIGHLIGHT_COLORS.length];
    return slice === activeSlice ? color : `${color}55`;
  };

  const allLocked = Array.from({ length: keyLength }).every((_, slice) => lockedLetters[slice]);

  return (
    <Pane width="100%">
      <CipherText input={cracker.input} normalized={analysis.normalized} colorFor={colorFor} />

      <SliceTabs>
        {Array.from({ length: keyLength }).map((_, slice) => {
          const locked: LockedLetter | undefined = lockedLetters[slice];
          return (
            <SliceTab
              key={slice}
              $selected={slice === activeSlice}
              $color={HIGHLIGHT_COLORS[slice % HIGHLIGHT_COLORS.length]}
              onClick={() => setActiveSlice(slice)}
            >
              <Text size={300}>
                {`${strings.wizard.keyLetters.sliceLabel(slice, keyLength)}`}
                {locked ? ` (${strings.wizard.keyLetters.lockedPrefix} ${locked.letter})` : ''}
              </Text>
            </SliceTab>
          );
        })}
      </SliceTabs>

      <FrequencyChart
        sliceLetters={sliceLettersFor(activeSlice)}
        hints={hints}
        onLock={handleLock}
        currentLetter={lockedLetters[activeSlice]?.letter}
      />

      {allLocked && (
        <Text size={300} display="block" marginTop="8px">
          {strings.wizard.keyLetters.allLocked}
        </Text>
      )}

      {hints.cribs && <CribPanel cracker={cracker} />}

      <KeyStrip
        keyLength={keyLength}
        lockedLetters={lockedLetters}
        activeSlice={activeSlice}
        onJump={setActiveSlice}
        onOverride={(slice, letter) => lockLetter(slice, letter, 'manual')}
        onClear={cracker.unlockLetter}
      />
    </Pane>
  );
};

StepKeyLetters.displayName = 'StepKeyLetters';

export default StepKeyLetters;
