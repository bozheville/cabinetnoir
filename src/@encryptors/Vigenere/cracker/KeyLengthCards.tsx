import { useTranslation } from 'next-i18next';
import Tooltip from '@atoms/Tooltip';
import React from 'react';
import styled from 'styled-components';

import { TextInput } from '@atoms';
import { GreatPrimer, Minion } from '@typography';
import { paper } from '@theme/mixins';
import { MAX_KEY_LENGTH } from '@encryptors/shared/analysis';
import { CrackerAnalysis } from './useCracker';
import { HintSettings } from './hintSettings';
import { useCrackerKey } from '@encryptors/shared/cracker';

const MAX_CARDS = 6;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

// A vellum index card; the selected one gets a copper frame.
const Card = styled.div<{ $selected: boolean }>`
  ${paper('vellum')}
  cursor: pointer;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  border: 1px solid ${({ theme, $selected }) => ($selected ? theme.metal.copper.dark : theme.paper.rule)};
  border-width: ${({ $selected }) => ($selected ? '2px' : '1px')};
  color: ${({ theme }) => theme.ink.primary};
`;

const CardTitle = styled(GreatPrimer)``;

const CardText = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.secondary};
`;

// Confidence: a brass rail with a copper fill.
const ConfidenceBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.metal.brass.base};
  margin-top: 8px;
  overflow: hidden;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.metal.copper.base};
`;

interface KeyLengthCardsProps {
  analysis: CrackerAnalysis | null;
  hints: HintSettings;
  selected: number | null;
  onSelect: (length: number) => void;
}

const KeyLengthCards: React.FC<KeyLengthCardsProps> = ({
  analysis,
  hints,
  selected,
  onSelect,
}) => {
  const { t } = useTranslation('common');
  const base = useCrackerKey('');
  const tooltip = useCrackerKey('tooltips.');
  if (!analysis) {
    return null;
  }

  const candidates = analysis.rankedLengths;
  const cards = candidates.slice(0, MAX_CARDS);

  // Hard mode (no confidence bars): unsorted, no labels, lengths with raw gaps.
  const hardMode = !hints.confidenceBars;

  if (hardMode) {
    const byLength = new Map<number, number[]>();
    for (let length = 1; length <= MAX_KEY_LENGTH; length += 1) {
      const gaps: number[] = [];
      for (const repeat of analysis.repeats) {
        for (const gap of repeat.gaps) {
          if (gap % length === 0) {
            gaps.push(gap);
          }
        }
      }
      if (gaps.length > 0) {
        byLength.set(length, gaps);
      }
    }

    return (
      <>
        <Tooltip content={t(`${tooltip}keyLengthCards`)}>
        <CardsGrid data-guide="key-length-cards">
          {[...byLength.entries()].map(([length, gaps]) => (
            <Card key={length} $selected={selected === length} onClick={() => onSelect(length)}>
              <CardTitle>{length}</CardTitle>
              <CardText>{`${t(`${base}repeats.gapsLabel`)}: ${gaps.join(', ')}`}</CardText>
            </Card>
          ))}
        </CardsGrid>
        </Tooltip>
        <OtherLengthInput selected={selected} onSelect={onSelect} />
      </>
    );
  }

  return (
    <>
      <Tooltip content={t(`${tooltip}keyLengthCards`)}>
      <CardsGrid data-guide="key-length-cards">
        {cards.map((candidate) => (
          <Card
            key={candidate.length}
            $selected={selected === candidate.length}
            onClick={() => onSelect(candidate.length)}
          >
            <CardTitle>{candidate.length}</CardTitle>
            <CardText>
              {t(`${base}keyLengthLabels.${candidate.label}`)}
            </CardText>
            <CardText>
              {t(`${base}reason.${candidate.reasonKind}`, {
                count: candidate.divisorCount,
                ic: candidate.averageIC.toFixed(3),
              })}
            </CardText>
            <ConfidenceBar>
              <ConfidenceFill style={{ width: `${candidate.confidence}%` }} />
            </ConfidenceBar>
          </Card>
        ))}
      </CardsGrid>
      </Tooltip>
      <OtherLengthInput selected={selected} onSelect={onSelect} />
    </>
  );
};

const OtherRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OtherLabel = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
`;

const OtherLengthInput: React.FC<{ selected: number | null; onSelect: (length: number) => void }> = ({
  selected,
  onSelect,
}) => {
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.keyLength.');
  const tooltip = useCrackerKey('tooltips.');
  return (
  <OtherRow>
    <OtherLabel>{t(`${base}otherLabel`)}</OtherLabel>
    <Tooltip content={t(`${tooltip}otherLength`)}>
    <TextInput
      mono
      width="80px"
      type="number"
      min={1}
      max={MAX_KEY_LENGTH}
      value={selected ?? ''}
      placeholder={t(`${base}otherPlaceholder`)}
      onChange={(event) => {
        const value = parseInt((event.target as HTMLInputElement).value, 10);
        if (!Number.isNaN(value) && value >= 1 && value <= MAX_KEY_LENGTH) {
          onSelect(value);
        }
      }}
    />
    </Tooltip>
  </OtherRow>
  );
};

export default KeyLengthCards;
