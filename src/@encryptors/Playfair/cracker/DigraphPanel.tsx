import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { GreatPrimer, Minion } from '@typography';
import { topDigraphs, commonEnglishDigraphs } from '../analysis/digraphs';

// Step 1 hints: the ciphertext's most common digraphs next to the most
// common English digraphs — the pairing is the user's call.
const PanelRoot = styled.div`
  margin-top: 12px;
`;

const PanelTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
`;

const Lists = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const ListLabel = styled(Minion)`
  display: block;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const Chip = styled.span`
  display: inline-block;
  padding: 2px 8px;
  margin: 0 4px 4px 0;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.cream};
  font-size: 12px;
`;

const DigraphPanel: React.FC<{ letters: string }> = ({ letters }) => {
  const { t } = useTranslation('common');
  const observed = topDigraphs(letters);
  const english = commonEnglishDigraphs();

  return (
    <PanelRoot data-guide="digraph-panel">
      <PanelTitle>{t('processing.playfair.cracker.digraphs.title')}</PanelTitle>
      <Lists>
        <div>
          <ListLabel>
            {t('processing.playfair.cracker.digraphs.observed')}
          </ListLabel>
          <div>
            {observed.map(({ digraph, count }) => (
              <Chip key={digraph}>{`${digraph} ×${count}`}</Chip>
            ))}
          </div>
        </div>
        <div>
          <ListLabel>
            {t('processing.playfair.cracker.digraphs.englishCommon')}
          </ListLabel>
          <div>
            {english.map((digraph) => (
              <Chip key={digraph}>{digraph}</Chip>
            ))}
          </div>
        </div>
      </Lists>
    </PanelRoot>
  );
};

DigraphPanel.displayName = 'DigraphPanel';

export default DigraphPanel;
