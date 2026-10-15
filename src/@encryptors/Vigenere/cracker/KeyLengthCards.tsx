import { useTranslation } from 'next-i18next';
import React from 'react';
import { Heading, Pane, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';

import { MAX_KEY_LENGTH } from '../analysis/keyLength';
import { CrackerAnalysis } from './useCracker';
import { HintSettings } from './hintSettings';

const MAX_CARDS = 6;

const CardsGrid = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const Card = styled(Pane)<{ $selected: boolean }>`
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme, $selected }) => ($selected ? theme.colorScheme.blue[500] : 'muted')};
  border-width: ${({ $selected }) => ($selected ? '2px' : '1px')};
  background: ${({ theme, $selected }) => ($selected ? theme.colorScheme.blue[50] : 'transparent')};
`;

const ConfidenceBar = styled(Pane)`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.gray[300]};
  margin-top: 8px;
  overflow: hidden;
`;

const ConfidenceFill = styled(Pane)`
  height: 100%;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
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
        <CardsGrid data-guide="key-length-cards">
          {[...byLength.entries()].map(([length, gaps]) => (
            <Card key={length} $selected={selected === length} onClick={() => onSelect(length)}>
              <Heading size={400}>{length}</Heading>
              <Text size={300} display="block">{`${t('processing.vigenere.cracker.wizard.repeats.gapsLabel')}: ${gaps.join(', ')}`}</Text>
            </Card>
          ))}
        </CardsGrid>
        <OtherLengthInput selected={selected} onSelect={onSelect} />
      </>
    );
  }

  return (
    <>
      <CardsGrid data-guide="key-length-cards">
        {cards.map((candidate) => (
          <Card
            key={candidate.length}
            $selected={selected === candidate.length}
            onClick={() => onSelect(candidate.length)}
          >
            <Heading size={400}>{candidate.length}</Heading>
            <Text size={300} display="block">
              {t(`processing.vigenere.cracker.keyLengthLabels.${candidate.label}`)}
            </Text>
            <Text size={300} display="block">
              {t(`processing.vigenere.cracker.reason.${candidate.reasonKind}`, {
                count: candidate.divisorCount,
                ic: candidate.averageIC.toFixed(3),
              })}
            </Text>
            <ConfidenceBar>
              <ConfidenceFill style={{ width: `${candidate.confidence}%` }} />
            </ConfidenceBar>
          </Card>
        ))}
      </CardsGrid>
      <OtherLengthInput selected={selected} onSelect={onSelect} />
    </>
  );
};

const OtherLengthInput: React.FC<{ selected: number | null; onSelect: (length: number) => void }> = ({
  selected,
  onSelect,
}) => {
  const { t } = useTranslation('common');
  return (
  <Pane marginTop="12px" display="flex" alignItems="center" gap="8px">
    <Text size={300}>{t('processing.vigenere.cracker.wizard.keyLength.otherLabel')}</Text>
    <TextInput
      width="80px"
      type="number"
      min={1}
      max={MAX_KEY_LENGTH}
      value={selected ?? ''}
      placeholder={t('processing.vigenere.cracker.wizard.keyLength.otherPlaceholder')}
      onChange={(event) => {
        const value = parseInt((event.target as HTMLInputElement).value, 10);
        if (!Number.isNaN(value) && value >= 1 && value <= MAX_KEY_LENGTH) {
          onSelect(value);
        }
      }}
    />
  </Pane>
  );
};

export default KeyLengthCards;
