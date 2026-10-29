import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import styled from 'styled-components';

import { Minion } from '@typography';
import { Repeat } from '@encryptors/shared/analysis';
import { CipherText, HIGHLIGHT_COLORS, useCrackerKey } from '@encryptors/shared/cracker';
import KeyLengthCards from './KeyLengthCards';
import { CrackerAnalysis } from './useCracker';
import { HintSettings } from './hintSettings';

// Longer repeats are more meaningful than stray 3-grams.
const MAX_HIGHLIGHTED_REPEATS = 6;

const StepRoot = styled.div`
  width: 100%;
`;

const RepeatsList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// One row per repeat: the data ink of its slices as the left rule.
const RepeatRow = styled.div<{ $color: string; $dimmed: boolean }>`
  cursor: default;
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.ink.cream};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.35 : 1)};
  border-left: 3px solid ${({ $color }) => $color};
  padding-left: 8px;
`;

const EmptyNote = styled(Minion)`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

interface StepKeyLengthRepeatsProps {
  input: string;
  analysis: CrackerAnalysis | null;
  hints: HintSettings;
  selectedKeyLength: number | null;
  onSelectKeyLength: (length: number) => void;
}

const StepKeyLength: React.FC<StepKeyLengthRepeatsProps> = ({
  input,
  analysis,
  hints,
  selectedKeyLength,
  onSelectKeyLength,
}) => {
  const [hoveredRepeat, setHoveredRepeat] = useState<number | null>(null);
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.repeats.');


  const shownRepeats: Repeat[] = analysis
    ? [...analysis.repeats]
      .sort((a, b) => b.sequence.length - a.sequence.length)
      .slice(0, MAX_HIGHLIGHTED_REPEATS)
    : [];

  const colorFor = (cleanIndex: number): string | undefined => {
    if (!hints.highlightRepeats) {
      return undefined;
    }

    for (let i = 0; i < shownRepeats.length; i += 1) {
      if (hoveredRepeat !== null && hoveredRepeat !== i) {
        continue;
      }
      const repeat = shownRepeats[i];
      if (repeat.positions.some((position) => cleanIndex >= position && cleanIndex < position + repeat.sequence.length)) {
        return HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
      }
    }
    return undefined;
  };

  return (
    <StepRoot>
      {analysis ? (
        <>
          <CipherText input={input} normalized={analysis.normalized} colorFor={colorFor} />
          {shownRepeats.length > 0 ? (
            <RepeatsList>
              {shownRepeats.map((repeat, index) => {
                const color = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
                return (
                  <RepeatRow
                    key={repeat.sequence + repeat.positions[0]}
                    $color={color}
                    $dimmed={hoveredRepeat !== null && hoveredRepeat !== index}
                    onMouseEnter={() => setHoveredRepeat(index)}
                    onMouseLeave={() => setHoveredRepeat(null)}
                  >
                    <strong>{repeat.sequence}</strong>
                    {` at ${repeat.positions.join(', ')}`}
                    {hints.showGaps ? `, ${t(`${base}gapsLabel`)}: ${repeat.gaps.join(', ')}` : ''}
                  </RepeatRow>
                );
              })}
            </RepeatsList>
          ) : (
            <EmptyNote>
              {t(`${base}none`)}
            </EmptyNote>
          )}
        </>
      ) : (
        <EmptyNote>{t(`${base}emptyInput`)}</EmptyNote>
      )}

      {/* Key length cards come in task 19. */}
      <KeyLengthCards
        analysis={analysis}
        hints={hints}
        selected={selectedKeyLength}
        onSelect={onSelectKeyLength}
      />
    </StepRoot>
  );
};

StepKeyLength.displayName = 'StepKeyLength';

export default StepKeyLength;
