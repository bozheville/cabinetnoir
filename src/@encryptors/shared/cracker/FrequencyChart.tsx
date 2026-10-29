import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { IconButton } from '@atoms';
import { Chevron } from '@ornaments';
import { GreatPrimer, Minion } from '@typography';
import { paper } from '@theme/mixins';
import { ALPHABET_LENGTH, ENGLISH_FREQUENCIES, countLetters, englishFrequencyAt, findBestShift, scoreShift } from '../analysis/frequency';

// The instrument panel: parchment background, brass columns for the
// observed counts, a dashed copper outline for the English reference.
// Rotation IS the key parameter — rotating rewrites the key letter
// through `onLetterChange`.

const ChartArea = styled.div`
  ${paper('parchment')}
  margin-top: 12px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  color: ${({ theme }) => theme.ink.primary};
`;

const BarsRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 80px;
  outline: none;
`;

const BarSlot = styled.div<{ $glow: boolean }>`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  box-shadow: ${({ $glow, theme }) => ($glow ? `0 0 8px 2px ${theme.metal.copper.base}55` : 'none')};
  border-radius: 2px;
`;

// Brushed brass column.
const ObservedBar = styled.div`
  width: 100%;
  background: linear-gradient(180deg, ${({ theme }) => theme.metal.brass.light}, ${({ theme }) => theme.metal.brass.dark});
  border-radius: 2px 2px 0 0;
`;

const EnglishOutline = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border: 2px dashed ${({ theme }) => theme.metal.copper.dark};
  border-bottom: none;
  border-radius: 2px 2px 0 0;
`;

const LetterRow = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 2px;
`;

const LetterCell = styled.span`
  flex: 1;
  text-align: center;
  font-size: 9px;
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.secondary};
`;

const ShortSliceNote = styled(Minion)`
  display: block;
  margin-bottom: 4px;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartHeading = styled(GreatPrimer)``;

const MatchText = styled(Minion)``;

const RotateLeftChevron = styled(Chevron)`
  transform: rotate(90deg);
`;

const RotateRightChevron = styled(Chevron)`
  transform: rotate(-90deg);
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

// Two-bar frequency chart: observed brass bars vs dashed copper English
// reference outline.
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
        <ShortSliceNote>
          {t('processing.cracker.wizard.warnings.shortSlice')}
        </ShortSliceNote>
      )}
      <Tooltip content={t('processing.cracker.tooltips.chartArrows')}>
      <ControlsRow data-guide="chart-arrows">
        <IconButton label="Rotate left" kind="copper" size="sm" onClick={() => rotate(-1)}>
          <RotateLeftChevron size={8} />
        </IconButton>
        <ChartHeading>
          {`${keyLetterLabel || t('processing.cracker.wizard.keyLetters.keyLetter')}: ${alphabet[shift]}`}
        </ChartHeading>
        <IconButton label="Rotate right" kind="copper" size="sm" onClick={() => rotate(1)}>
          <RotateRightChevron size={8} />
        </IconButton>
        {hints.matchScore && (
          <Tooltip content={t('processing.cracker.tooltips.matchScore')}>
            <MatchText>{`Match: ${score}%`}</MatchText>
          </Tooltip>
        )}
      </ControlsRow>
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
