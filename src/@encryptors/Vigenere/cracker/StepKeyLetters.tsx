import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React from 'react';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { CipherText, HIGHLIGHT_COLORS } from '@encryptors/shared/cracker';
import { FrequencyChart } from '@encryptors/shared/cracker';
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
    setSliceLetter,
    activeSlice,
    setActiveSlice,
    hintConfig,
    alphabet,
  } = cracker;
  const { t } = useTranslation('common');


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

  const colorFor = (cleanIndex: number): string => {
    const slice = cleanIndex % keyLength;
    const color = HIGHLIGHT_COLORS[slice % HIGHLIGHT_COLORS.length];
    return slice === activeSlice ? color : `${color}55`;
  };

  const allLettersSet = Array.from({ length: keyLength }).every((_, slice) => lockedLetters[slice]);

  return (
    <Pane width="100%">
      <CipherText input={cracker.input} normalized={analysis.normalized} colorFor={colorFor} />

      <Tooltip content={t('processing.vigenere.cracker.tooltips.sliceTabs')}>
      <SliceTabs data-guide="slice-tabs">
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
                {`${t('processing.vigenere.cracker.wizard.keyLetters.sliceLabel', { index: slice + 1, total: keyLength })}`}
                {locked ? ` (${t('processing.vigenere.cracker.wizard.keyLetters.lockedPrefix')} ${locked.letter})` : ''}
              </Text>
            </SliceTab>
          );
        })}
      </SliceTabs>
      </Tooltip>

      <FrequencyChart
        sliceLetters={sliceLettersFor(activeSlice)}
        hints={hints}
        alphabet={alphabet}
        letter={lockedLetters[activeSlice]?.letter}
        onLetterChange={(letter) => setSliceLetter(activeSlice, letter, 'chart')}
      />

      {allLettersSet && (
        <Text size={300} display="block" marginTop="8px">
          {t('processing.vigenere.cracker.wizard.keyLetters.allLocked')}
        </Text>
      )}

      {hints.cribs && <CribPanel cracker={cracker} alphabet={alphabet} />}

      <KeyStrip
        keyLength={keyLength}
        lockedLetters={lockedLetters}
        activeSlice={activeSlice}
        onJump={setActiveSlice}
        onOverride={(slice, letter) => setSliceLetter(slice, letter, 'manual')}
        onClear={(slice) => setSliceLetter(slice, '')}
      />
    </Pane>
  );
};

StepKeyLetters.displayName = 'StepKeyLetters';

export default StepKeyLetters;
