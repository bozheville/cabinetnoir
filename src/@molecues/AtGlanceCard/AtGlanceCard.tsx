import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Button, Paper } from '@atoms';
import { BodyCopy, Caption, Minion } from '@typography';

import { getLearningConfig } from '@learning/config';

// Slim library index card on vellum. The 24px top offset keeps it off
// the band's top stitch — the wrapping band carries no padding itself.
const Card = styled(Paper)`
  width: 100%;
  max-width: 720px;
  padding: 12px 16px;
  margin: 24px auto 16px;
  text-align: left;
`;

const Description = styled(BodyCopy)`
  margin: 0;
`;

const FactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 4px 16px;
  margin-top: 8px;
`;

const FactLabel = styled(Caption)`
  display: block;
  color: ${({ theme }) => theme.ink.secondary};
`;

const FactValue = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.primary};
`;

const CollapseToggle = styled(Button)`
  margin-top: 8px;
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
      <Description>{t(`learning.${algorithm}.description`)}</Description>
      {expanded && (
        <FactsGrid>
          <div>
            <FactLabel>{t('learning.atGlance.type')}</FactLabel>
            <FactValue>{t(config.atGlance.type)}</FactValue>
          </div>
          <div>
            <FactLabel>{t('learning.atGlance.difficulty')}</FactLabel>
            <FactValue>{t(config.atGlance.difficulty)}</FactValue>
          </div>
          <div>
            <FactLabel>{t('learning.atGlance.era')}</FactLabel>
            <FactValue>{t(config.atGlance.era)}</FactValue>
          </div>
          <div>
            <FactLabel>{t('learning.atGlance.origin')}</FactLabel>
            <FactValue>{t(config.atGlance.origin)}</FactValue>
          </div>
          <div>
            <FactLabel>{t('learning.atGlance.modes')}</FactLabel>
            <FactValue>{config.atGlance.modes.map((mode) => t(`learning.modes.${mode}`)).join(' · ')}</FactValue>
          </div>
        </FactsGrid>
      )}
      <CollapseToggle
        variant="quiet"
        size="sm"
        onClick={() => setExpanded(!expanded)}
      >
        {t(expanded ? 'learning.atGlance.collapse' : 'learning.atGlance.expand')}
      </CollapseToggle>
    </Card>
  );
};

AtGlanceCard.displayName = 'AtGlanceCard';

export default AtGlanceCard;
