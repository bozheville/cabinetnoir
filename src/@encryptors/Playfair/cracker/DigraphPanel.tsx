import { useTranslation } from 'next-i18next';
import React from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { topDigraphs, commonEnglishDigraphs } from '../analysis/digraphs';

// Step 1 hints: the ciphertext's most common digraphs next to the most
// common English digraphs — the pairing is the user's call.
const Lists = styled(Pane)`
  display: flex;
  gap: 24px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const Chip = styled(Text)`
  display: inline-block;
  padding: 2px 8px;
  margin: 0 4px 4px 0;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  font-family: monospace;
  font-size: 12px;
`;

const DigraphPanel: React.FC<{ letters: string }> = ({ letters }) => {
  const { t } = useTranslation('common');
  const observed = topDigraphs(letters);
  const english = commonEnglishDigraphs();

  return (
    <Pane marginTop="12px" data-guide="digraph-panel">
      <Heading size={100}>{t('processing.playfair.cracker.digraphs.title')}</Heading>
      <Lists>
        <Pane>
          <Text size={300} display="block" marginBottom="4px">
            {t('processing.playfair.cracker.digraphs.observed')}
          </Text>
          <div>
            {observed.map(({ digraph, count }) => (
              <Chip key={digraph}>{`${digraph} ×${count}`}</Chip>
            ))}
          </div>
        </Pane>
        <Pane>
          <Text size={300} display="block" marginBottom="4px">
            {t('processing.playfair.cracker.digraphs.englishCommon')}
          </Text>
          <div>
            {english.map((digraph) => (
              <Chip key={digraph}>{digraph}</Chip>
            ))}
          </div>
        </Pane>
      </Lists>
    </Pane>
  );
};

DigraphPanel.displayName = 'DigraphPanel';

export default DigraphPanel;
