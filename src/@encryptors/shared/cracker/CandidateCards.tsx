import { useTranslation } from 'next-i18next';
import React from 'react';
import { Pane } from 'evergreen-ui';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';

export interface CandidateItem {
  id: string;
  label: string;
  hint?: string;
  // 0-100 English-likeness.
  confidence: number;
}

// Ranked candidate cards shared by the wizards' "pick a parameter"
// steps (Affine's multiplier, Alberti's period and disc step). A hint,
// not a verdict — every card stays selectable.
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

const CardValue = styled.span`
  font-family: monospace;
  font-weight: 700;
  font-size: 13px;
`;

const CardHint = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textLight};
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

interface CandidateCardsProps {
  items: CandidateItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  // Translated "Match: {{score}}%" template.
  matchLabel: string;
  tooltip?: string;
  dataGuide?: string;
}

const CandidateCards: React.FC<CandidateCardsProps> = ({
  items,
  selectedId,
  onSelect,
  matchLabel,
  tooltip,
  dataGuide,
}) => {
  const cards = (
    <CardsRow data-guide={dataGuide}>
      {items.map((item) => (
        <Card
          key={item.id}
          $active={selectedId === item.id}
          onClick={() => onSelect(item.id)}
        >
          <CardValue>{item.label}</CardValue>
          <ConfidenceTrack>
            <ConfidenceFill $confidence={item.confidence} />
          </ConfidenceTrack>
          <span style={{ fontSize: 11 }}>{matchLabel.replace('{{score}}', String(item.confidence))}</span>
          {item.hint && <CardHint>{item.hint}</CardHint>}
        </Card>
      ))}
    </CardsRow>
  );

  return tooltip ? <Tooltip content={tooltip}>{cards}</Tooltip> : cards;
};

CandidateCards.displayName = 'CandidateCards';

export default CandidateCards;
