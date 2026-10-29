import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import { paper } from '@theme/mixins';

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

// Small vellum index cards on the leather.
const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const Card = styled.button<{ $active: boolean }>`
  ${paper('vellum')}
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.paper};
  cursor: pointer;
  text-align: left;

  ${({ $active, theme }) => ($active
    ? `box-shadow: 0 0 0 1.5px ${theme.metal.copper.base}, ${theme.shadow.card};`
    : '')}

  &:hover {
    border-color: ${({ theme }) => theme.metal.copper.dark};
  }
`;

const CardValue = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  font-weight: 700;
  font-size: 13px;
  color: ${({ theme }) => theme.ink.primary};
`;

const CardHint = styled.span`
  font-family: ${({ theme }) => theme.type.body};
  font-size: 10px;
  color: ${({ theme }) => theme.ink.secondary};
`;

// Confidence: a brass rail with a copper fill.
const ConfidenceTrack = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background: ${({ theme }) => theme.metal.brass.base};
`;

const ConfidenceFill = styled.div<{ $confidence: number }>`
  width: ${({ $confidence }) => $confidence}%;
  height: 100%;
  border-radius: 1px;
  background: ${({ theme }) => theme.metal.copper.base};
`;

const MatchText = styled.span`
  font-family: ${({ theme }) => theme.type.body};
  font-size: 11px;
  color: ${({ theme }) => theme.ink.secondary};
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
          type="button"
          $active={selectedId === item.id}
          onClick={() => onSelect(item.id)}
        >
          <CardValue>{item.label}</CardValue>
          <ConfidenceTrack>
            <ConfidenceFill $confidence={item.confidence} />
          </ConfidenceTrack>
          <MatchText>{matchLabel.replace('{{score}}', String(item.confidence))}</MatchText>
          {item.hint && <CardHint>{item.hint}</CardHint>}
        </Card>
      ))}
    </CardsRow>
  );

  return tooltip ? <Tooltip content={tooltip}>{cards}</Tooltip> : cards;
};

CandidateCards.displayName = 'CandidateCards';

export default CandidateCards;
