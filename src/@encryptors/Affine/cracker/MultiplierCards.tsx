import { useTranslation } from 'next-i18next';
import React from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { MultiplierCandidate } from '../analysis/rank';

// Ranked multiplier cards for step 1 of the Affine wizard: every valid
// multiplier with the English-likeness of its best shift. A hint, not a
// verdict — any card can be picked.
const CardsRow = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const Card = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colorScheme.blue[500] : theme.colorScheme.gray[300])};
  background: ${({ theme, $active }) => ($active ? theme.colorScheme.blue[100] : theme.colors.background)};
  cursor: pointer;
  text-align: left;

  &:hover {
    border-color: ${({ theme }) => theme.colorScheme.blue[500]};
  }
`;

const CardValue = styled(Text)`
  font-family: monospace;
  font-weight: 700;
`;

const ConfidenceTrack = styled(Pane)`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.gray[200]};
`;

const ConfidenceFill = styled(Pane)<{ $confidence: number }>`
  width: ${({ $confidence }) => $confidence}%;
  height: 100%;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
`;

interface MultiplierCardsProps {
  candidates: MultiplierCandidate[];
  selected: number | null;
  onSelect: (multiplier: number) => void;
}

const MultiplierCards: React.FC<MultiplierCardsProps> = ({ candidates, selected, onSelect }) => {
  const { t } = useTranslation('common');

  return (
    <Pane>
      <Heading size={100}>{t('processing.affine.cracker.wizard.multiplier.title')}</Heading>
      <CardsRow data-guide="cracker-multiplier">
        {candidates.map((candidate) => (
          <Card
            key={candidate.multiplier}
            $active={selected === candidate.multiplier}
            onClick={() => onSelect(candidate.multiplier)}
          >
            <CardValue size={300}>{`a = ${candidate.multiplier}`}</CardValue>
            <ConfidenceTrack>
              <ConfidenceFill $confidence={candidate.confidence} />
            </ConfidenceTrack>
            <Text size={300}>{t('processing.affine.cracker.wizard.multiplier.match', { score: candidate.confidence })}</Text>
          </Card>
        ))}
      </CardsRow>
    </Pane>
  );
};

MultiplierCards.displayName = 'MultiplierCards';

export default MultiplierCards;
