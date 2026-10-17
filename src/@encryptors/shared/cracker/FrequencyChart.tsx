import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React, { useEffect, useState } from 'react';
import { Button, Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { ALPHABET_LENGTH, ENGLISH_FREQUENCIES, countLetters, englishFrequencyAt, findBestShift, scoreShift } from '../analysis/frequency';

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
  hints: Record<string, boolean>;
  alphabet?: string;
  letter?: string;
  onLetterChange: (letter: string) => void;
  // How a display position maps to the observed letter under the current
  // shift. The default is a plain rotation (Vigenère/Caesar-style slices);
  // Affine passes `(position, shift) => (multiplier * position + shift) % 26`.
  mapIndex?: (displayIndex: number, shift: number) => number;
  // Label of the rotated parameter ("Key letter", "Shift (b)"…).
  // Defaults to the shared cracker string.
  keyLetterLabel?: string;
}

// Two-bar frequency chart: observed gray bars vs dashed English reference
// outline. Rotation IS the key parameter — rotating rewrites the key
// letter through `onLetterChange`.
const FrequencyChart: React.FC<FrequencyChartProps> = ({
  sliceLetters,
  hints,
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  letter,
  onLetterChange,
  mapIndex = (position, shift) => (position + shift) % ALPHABET_LENGTH,
  keyLetterLabel,
}) => {
  const counts = countLetters(sliceLetters, alphabet);
  const bestShift = findBestShift(counts, alphabet, mapIndex);
  // The chart shift IS the key letter: rotating rewrites the key live.
  // Start from the letter currently set for this slice, if any.
  const [shift, setShift] = useState(letter ? Math.max(0, alphabet.indexOf(letter)) : 0);
  const { t } = useTranslation('common');

  // New slice: start from its current key letter, if any.
  useEffect(() => {
    setShift(letter ? Math.max(0, alphabet.indexOf(letter)) : 0);
  }, [sliceLetters]);

  const total = counts.reduce((sum, count) => sum + count, 0);
  const maxObserved = Math.max(1, ...counts);
  const maxExpected = Math.max(...ENGLISH_FREQUENCIES) / 100 * total;
  const scale = Math.max(maxObserved, maxExpected);

  const rotate = (delta: number) => {
    const next = ((shift + delta + ALPHABET_LENGTH) % ALPHABET_LENGTH);
    setShift(next);
    onLetterChange(alphabet[next]);
  };

  const score = scoreShift(counts, shift, alphabet, mapIndex);
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
          {t('processing.cracker.wizard.warnings.shortSlice')}
        </Text>
      )}
      <Tooltip content={t('processing.cracker.tooltips.chartArrows')}>
      <Pane display="flex" alignItems="center" gap="8px" data-guide="chart-arrows">
        <Button aria-label="Rotate left" onClick={() => rotate(-1)}>
          {'<'}
        </Button>
        <Heading size={400}>
          {`${keyLetterLabel || t('processing.cracker.wizard.keyLetters.keyLetter')}: ${alphabet[shift]}`}
        </Heading>
        <Button aria-label="Rotate right" onClick={() => rotate(1)}>
          {'>'}
        </Button>
        {hints.matchScore && (
          <Tooltip content={t('processing.cracker.tooltips.matchScore')}>
            <Text size={300}>{`Match: ${score}%`}</Text>
          </Tooltip>
        )}
      </Pane>
      </Tooltip>

      <BarsRow>
        {Array.from({ length: ALPHABET_LENGTH }).map((_, position) => {
          const observedIndex = mapIndex(position, shift);
          const observedHeight = (counts[observedIndex] / scale) * 100;
          const englishFrequency = alphabet[position] ? englishFrequencyAt(position, alphabet) : 0;
          const expectedHeight = (englishFrequency / 100 * total / scale) * 100;
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
          <LetterCell key={position}>{alphabet[position]}</LetterCell>
        ))}
      </LetterRow>
    </ChartArea>
  );
};

FrequencyChart.displayName = 'FrequencyChart';

export default FrequencyChart;
