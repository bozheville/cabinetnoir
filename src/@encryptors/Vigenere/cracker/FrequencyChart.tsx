import React, { useEffect, useState } from 'react';
import { Button, Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { ALPHABET_LENGTH, ENGLISH_FREQUENCIES, countLetters, findBestShift, scoreShift } from '../analysis/frequency';
import strings from '../strings';
import { HintSettings } from './hintSettings';

const ChartArea = styled(Pane)`
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px;
  background: #00000005;
`;

const BarsRow = styled(Pane)`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 80px;
  outline: none;
`;

const BarSlot = styled(Pane)<{ $glow: boolean }>`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  box-shadow: ${({ $glow }) => ($glow ? '0 0 8px 2px #f5a62388' : 'none')};
  border-radius: 2px;
`;

const ObservedBar = styled.div`
  width: 100%;
  background: #a9a9a9cc;
  border-radius: 2px 2px 0 0;
`;

const EnglishOutline = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px dashed ${({ theme }) => theme.colorScheme.blue[500]};
  border-bottom: none;
  border-radius: 2px 2px 0 0;
`;

const LetterRow = styled(Pane)`
  display: flex;
  gap: 2px;
  margin-top: 2px;
`;

const LetterCell = styled(Text)`
  flex: 1;
  text-align: center;
  font-size: 9px;
  font-family: monospace;
`;

interface FrequencyChartProps {
  sliceLetters: string;
  hints: HintSettings;
  onLock: (letter: string) => void;
  currentLetter?: string;
}

const FrequencyChart: React.FC<FrequencyChartProps> = ({
  sliceLetters,
  hints,
  onLock,
  currentLetter,
}) => {
  const counts = countLetters(sliceLetters);
  const bestShift = findBestShift(counts);
  const [shift, setShift] = useState(0);

  // New slice: start unaligned so the user rotates into place themselves.
  useEffect(() => {
    setShift(0);
  }, [sliceLetters]);

  const total = counts.reduce((sum, count) => sum + count, 0);
  const maxObserved = Math.max(1, ...counts);
  const maxExpected = Math.max(...ENGLISH_FREQUENCIES) / 100 * total;
  const scale = Math.max(maxObserved, maxExpected);

  const rotate = (delta: number) => {
    setShift((current) => ((current + delta + ALPHABET_LENGTH) % ALPHABET_LENGTH));
  };

  const score = scoreShift(counts, shift);
  const isBest = shift === bestShift;
  const glow = hints.mostLikelyGlow && isBest;
  const shortSlice = sliceLetters.length > 0 && sliceLetters.length < 20;

  return (
      <ChartArea
      tabIndex={0}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          rotate(-1);
          event.preventDefault();
        }
        if (event.key === 'ArrowRight') {
          rotate(1);
          event.preventDefault();
        }
      }}
    >
      {shortSlice && (
        <Text size={300} display="block" marginBottom="4px">
          {strings.wizard.warnings.shortSlice}
        </Text>
      )}
      <Pane display="flex" alignItems="center" gap="8px">
        <Button aria-label="Rotate left" onClick={() => rotate(-1)}>
          {'<'}
        </Button>
        <Heading size={400}>
          {`${strings.wizard.keyLetters.keyLetter}: ${String.fromCharCode(65 + shift)}`}
        </Heading>
        <Button aria-label="Rotate right" onClick={() => rotate(1)}>
          {'>'}
        </Button>
        {hints.matchScore && (
          <Text size={300}>{`Match: ${score}%`}</Text>
        )}
        {currentLetter && (
          <Text size={300} color="muted">{`(${strings.wizard.keyLetters.lockedPrefix} ${currentLetter})`}</Text>
        )}
      </Pane>

      <BarsRow>
        {Array.from({ length: ALPHABET_LENGTH }).map((_, position) => {
          const observedIndex = (position + shift) % ALPHABET_LENGTH;
          const observedHeight = (counts[observedIndex] / scale) * 100;
          const expectedHeight = (ENGLISH_FREQUENCIES[position] / 100 * total / scale) * 100;
          return (
            <BarSlot key={position} $glow={!!glow}>
              {hints.englishReference && expectedHeight > 0 && (
                <EnglishOutline style={{ height: `${expectedHeight}%` }} />
              )}
              <ObservedBar style={{ height: `${Math.max(observedHeight, 2)}%` }} />
            </BarSlot>
          );
        })}
      </BarsRow>
      <LetterRow>
        {Array.from({ length: ALPHABET_LENGTH }).map((_, position) => (
          <LetterCell key={position}>{String.fromCharCode(65 + position)}</LetterCell>
        ))}
      </LetterRow>

      <Button
        marginTop="8px"
        appearance="primary"
        onClick={() => onLock(String.fromCharCode(65 + shift))}
      >
        {strings.wizard.keyLetters.lock}
      </Button>
    </ChartArea>
  );
};

FrequencyChart.displayName = 'FrequencyChart';

export default FrequencyChart;
