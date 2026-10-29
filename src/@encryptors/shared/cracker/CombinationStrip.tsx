import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { GreatPrimer } from '@typography';
import {
  DigraphSuggestion,
  DoubleSuggestion,
  TrigraphSuggestion,
} from '../analysis/substitution';

// The letter-combination hints, one level per section: recurring
// symbol pairs (digraph layer), recurring triples (THE-class anchors,
// trigraph layer) and doubled symbols (the classic mono-cipher tell).
// Each row shows the corpus-ranked plaintext candidates consistent
// with the letters the user already placed. Hovering a row asks the
// preview to highlight that symbol sequence's occurrences. Pure
// hints — the user places every letter.

const Strip = styled.div`
  padding: 10px 12px;
  border-radius: 4px;
`;

const SectionTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};

  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const Row = styled.div`
  display: block;
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.creamMuted};
  font-size: 13px;
  line-height: 1.8;
  cursor: default;
`;

const PairText = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.cream};
  font-weight: 700;
  font-size: 13px;
`;

interface CombinationStripProps {
  digraphs: DigraphSuggestion[];
  trigraphs: TrigraphSuggestion[];
  doubles: DoubleSuggestion[];
  // Hover feedback: the symbol sequence of the hovered row, or null
  // on leave. Lets the preview light up where the hint occurs.
  onHoverRow?: (symbols: string[] | null) => void;
}

const CombinationStrip: React.FC<CombinationStripProps> = ({
  digraphs,
  trigraphs,
  doubles,
  onHoverRow,
}) => {
  const { t } = useTranslation('common');
  const hint = (count: number, candidates: string[]) =>
    t('processing.cracker.combinations.hint', {
      count,
      candidates: candidates.join(', '),
    });

  const hoverProps = (symbols: string[]) => onHoverRow
    ? {
      onMouseEnter: () => onHoverRow(symbols),
      onMouseLeave: () => onHoverRow(null),
    }
    : {};

  const hasDigraphs = digraphs.length > 0;
  const hasTrigraphs = trigraphs.length > 0;
  const hasDoubles = doubles.length > 0;
  if (!hasDigraphs && !hasTrigraphs && !hasDoubles) {
    return null;
  }

  return (
    <Strip data-guide="combination-strip">
      {hasDigraphs && (
        <SectionTitle>
          {t('processing.cracker.combinations.title')}
        </SectionTitle>
      )}
      {digraphs.map(({ first, second, count, candidates }) => (
        <Row key={`d-${first}-${second}`} {...hoverProps([first, second])}>
          <PairText>{first} + {second}</PairText>
          {' '}
          {hint(count, candidates)}
        </Row>
      ))}
      {hasTrigraphs && (
        <SectionTitle>
          {t('processing.cracker.combinations.tripletsTitle')}
        </SectionTitle>
      )}
      {trigraphs.map(({ first, second, third, count, candidates }) => (
        <Row key={`t-${first}-${second}-${third}`} {...hoverProps([first, second, third])}>
          <PairText>{first} + {second} + {third}</PairText>
          {' '}
          {hint(count, candidates)}
        </Row>
      ))}
      {hasDoubles && (
        <SectionTitle>
          {t('processing.cracker.combinations.doublesTitle')}
        </SectionTitle>
      )}
      {doubles.map(({ symbol, count, candidates }) => (
        <Row key={`x-${symbol}`} {...hoverProps([symbol, symbol])}>
          <PairText>{symbol} + {symbol}</PairText>
          {' '}
          {hint(count, candidates)}
        </Row>
      ))}
    </Strip>
  );
};

CombinationStrip.displayName = 'CombinationStrip';

export default CombinationStrip;
