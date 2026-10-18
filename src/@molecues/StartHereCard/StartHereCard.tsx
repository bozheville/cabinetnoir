import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { GreatPrimer, Minion } from '@typography';
import { START_HERE_CIPHER } from '@learning/config';

const Card = styled(Pane)`
  margin: 0 auto;
  width: 100%;
  max-width: 640px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue[500]};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colorScheme.blue[200]};
  background: ${({ theme }) => theme.colorScheme.blue[100]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${({ theme }) => theme.breakpoints.small} {
    flex-direction: column;
    text-align: center;
  }
`;

const PinnedLabel = styled(Text)`
  display: inline-block;
  padding: 2px 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
  color: ${({ theme }) => theme.colorScheme.white};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Cta = styled(Link)`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue[500]};
  background: ${({ theme }) => theme.colorScheme.blue[500]};
  color: ${({ theme }) => theme.colorScheme.white};
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;

  &:hover {
    background: ${({ theme }) => theme.colorScheme.blue[600]};
  }
`;

// Pinned "Start here" card on the home page (#74): one pointer to the
// classic first cipher's Learn tab.
const StartHereCard: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Section stitch="both" color="description">
      <Card>
        <Pane>
          <PinnedLabel>{`★ ${t('home.startHere.label')}`}</PinnedLabel>
          <GreatPrimer>{t(`processing.${START_HERE_CIPHER}.title`)}</GreatPrimer>
          <Minion>{t('home.startHere.text')}</Minion>
        </Pane>
        <Cta href={`/encoder/${START_HERE_CIPHER}/learn`}>
          {t('home.startHere.cta')}
        </Cta>
      </Card>
    </Section>
  );
};

StartHereCard.displayName = 'StartHereCard';

export default StartHereCard;
