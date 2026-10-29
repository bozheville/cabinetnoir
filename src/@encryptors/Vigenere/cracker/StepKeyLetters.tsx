import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React from 'react';
import styled from 'styled-components';

import { Minion } from '@typography';
import { CipherText, HIGHLIGHT_COLORS } from '@encryptors/shared/cracker';
import { FrequencyChart, useCrackerKey } from '@encryptors/shared/cracker';
import CribPanel from './CribPanel';
import KeyStrip from './KeyStrip';
import { LockedLetter, useCracker } from './useCracker';

const StepRoot = styled.div`
  width: 100%;
`;

const SliceTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

// One tab per key slice: bordered by the slice's data ink when
// selected, faintly washed otherwise.
const SliceTab = styled.div<{ $selected: boolean; $color: string }>`
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  border: ${({ $selected }) => ($selected ? '2px' : '1px')} solid
    ${({ $color, $selected }) => ($selected ? $color : 'transparent')};
  background: ${({ $color, $selected }) => ($selected ? `${$color}22` : 'transparent')};
`;

const SliceTabText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
`;

const AllLockedNote = styled(Minion)`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
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
    transform,
  } = cracker;
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.');
  const tooltip = useCrackerKey('tooltips.');


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
    <StepRoot>
      <CipherText input={cracker.input} normalized={analysis.normalized} colorFor={colorFor} />

      <Tooltip content={t(`${tooltip}sliceTabs`)}>
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
              <SliceTabText>
                {`${t(`${base}keyLetters.sliceLabel`, { index: slice + 1, total: keyLength })}`}
                {locked ? ` (${t(`${base}keyLetters.lockedPrefix`)} ${locked.letter})` : ''}
              </SliceTabText>
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
        mapIndex={transform.mapIndex}
      />

      {allLettersSet && (
        <AllLockedNote>
          {t(`${base}keyLetters.allLocked`)}
        </AllLockedNote>
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
    </StepRoot>
  );
};

StepKeyLetters.displayName = 'StepKeyLetters';

export default StepKeyLetters;
