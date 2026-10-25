import React from 'react';
import { Heading, Text } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { DigraphSuggestion } from '../analysis/substitution';

// The letter-combination hints: the frequent symbol pairs of the
// stream, each with the corpus-ranked plaintext digraphs it could be
// — "34 + 15 seen 12 times — could be TH, IN, TI". The next level up
// from the per-cell "Try X" hints: monoalphabetic ciphers hide
// combinations exactly the way they hide letters, and the strip makes
// that evidence visible instead of burying it in the suggestion math.
// Pure hints — the user places every letter.

const Strip = styled.div`
  padding: 10px 12px;
  border-radius: 4px;
`;

const Row = styled(Text)`
  display: block;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.8;
`;

const PairText = styled(Text)`
  font-family: monospace;
  font-weight: 700;
  font-size: 13px;
`;

interface CombinationStripProps {
  items: DigraphSuggestion[];
}

const CombinationStrip: React.FC<CombinationStripProps> = ({ items }) => {
  const { t } = useTranslation('common');
  if (items.length === 0) {
    return null;
  }
  return (
    <Strip data-guide="combination-strip">
      <Heading size={200} marginBottom={4}>
        {t('processing.cracker.combinations.title')}
      </Heading>
      {items.map(({ first, second, count, candidates }) => (
        <Row key={`${first}+${second}`}>
          <PairText>{first} + {second}</PairText>
          {' '}
          {t('processing.cracker.combinations.hint', {
            count,
            candidates: candidates.join(', '),
          })}
        </Row>
      ))}
    </Strip>
  );
};

CombinationStrip.displayName = 'CombinationStrip';

export default CombinationStrip;
