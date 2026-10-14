import React from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import strings from '../strings';
import CipherText, { HIGHLIGHT_COLORS } from './CipherText';
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

const SliceChartPlaceholder = styled(Pane)`
  margin-top: 12px;
  border: dotted 1px ${({ theme }) => theme.colors.textLight};
  border-radius: 4px;
  padding: 12px;
`;

interface StepKeyLettersProps {
  cracker: ReturnType<typeof useCracker>;
}

const StepKeyLetters: React.FC<StepKeyLettersProps> = ({ cracker }) => {
  const {
    analysis,
    keyLength,
    lockedLetters,
    activeSlice,
    setActiveSlice,
  } = cracker;

  if (!analysis || keyLength === null) {
    return null;
  }

  const colorFor = (cleanIndex: number): string => {
    const slice = cleanIndex % keyLength;
    const color = HIGHLIGHT_COLORS[slice % HIGHLIGHT_COLORS.length];
    return slice === activeSlice ? color : `${color}55`;
  };

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

      <SliceChartPlaceholder>
        <Heading size={200}>
          {`Frequency chart for slice ${activeSlice + 1} (task 21)`}
        </Heading>
      </SliceChartPlaceholder>
    </Pane>
  );
};

StepKeyLetters.displayName = 'StepKeyLetters';

export default StepKeyLetters;
