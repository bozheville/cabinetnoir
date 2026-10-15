import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import { getLearningConfig } from '@learning/config';

const Card = styled(Pane)`
  width: 100%;
  max-width: 720px;
  padding: 12px 16px;
  margin: 0 auto;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  background: ${({ theme }) => theme.colorScheme.gray[50]};
  text-align: left;
`;

const FactsGrid = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 4px 16px;
  margin-top: 8px;
`;

const FactLabel = styled(Text)`
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Toggle = styled.button`
  margin-top: 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colorScheme.blue[500]};
  font-size: 12px;
  padding: 0;
`;

// Short card above the tabs: what the cipher is in five seconds. Data
// comes from the learning config (i18n keys only); collapsible, with the
// collapsed state kept in memory only.
const AtGlanceCard: React.FC = () => {
  const { t } = useTranslation('common');
  const { algorithm } = useRouter().query;
  const [expanded, setExpanded] = useState(true);

  const config = getLearningConfig(algorithm as string);
  if (!config) {
    return null;
  }

  return (
    <Card>
      <Text size={400} display="block">
        {t(`learning.${algorithm}.description`)}
      </Text>
      {expanded && (
        <FactsGrid>
          <Pane>
            <FactLabel>{t('learning.atGlance.type')}</FactLabel>
            <Text size={300}>{t(config.atGlance.type)}</Text>
          </Pane>
          <Pane>
            <FactLabel>{t('learning.atGlance.difficulty')}</FactLabel>
            <Text size={300}>{t(config.atGlance.difficulty)}</Text>
          </Pane>
          <Pane>
            <FactLabel>{t('learning.atGlance.era')}</FactLabel>
            <Text size={300}>{t(config.atGlance.era)}</Text>
          </Pane>
          <Pane>
            <FactLabel>{t('learning.atGlance.origin')}</FactLabel>
            <Text size={300}>{t(config.atGlance.origin)}</Text>
          </Pane>
          <Pane>
            <FactLabel>{t('learning.atGlance.modes')}</FactLabel>
            <Text size={300}>{config.atGlance.modes.map((mode) => t(`learning.modes.${mode}`)).join(' · ')}</Text>
          </Pane>
        </FactsGrid>
      )}
      <Toggle onClick={() => setExpanded(!expanded)}>
        {t(expanded ? 'learning.atGlance.collapse' : 'learning.atGlance.expand')}
      </Toggle>
    </Card>
  );
};

AtGlanceCard.displayName = 'AtGlanceCard';

export default AtGlanceCard;
