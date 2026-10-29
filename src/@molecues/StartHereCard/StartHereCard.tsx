import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { Button, Paper } from '@atoms';
import { GreatPrimer, Minion, Caption } from '@typography';
import { START_HERE_CIPHER } from '@learning/config';

// A paper letter pinned to the beige band with two copper rivets.
const Letter = styled(Paper)`
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 640px;
  padding: 16px;
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

const Rivet = styled.span`
  position: absolute;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.metal.copper.base};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 0 rgba(0, 0, 0, 0.35);

  &:first-of-type { left: 8px; }
  &:last-of-type { right: 8px; }
`;

const PinnedLabel = styled(Caption)`
  display: inline-block;
  padding: 2px 10px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.metal.brass.dark};
`;

const CardTitle = styled(GreatPrimer)`
  margin-bottom: 4px;
`;

const CardText = styled(Minion)`
  color: ${({ theme }) => theme.ink.secondary};
`;

// Pinned "Start here" card on the home page (#74): one pointer to the
// classic first cipher's Learn tab.
const StartHereCard: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Section stitch="both" color="description">
      <Letter>
        <Rivet aria-hidden="true" />
        <Rivet aria-hidden="true" />
        <div>
          <PinnedLabel>{`★ ${t('home.startHere.label')}`}</PinnedLabel>
          <CardTitle>{t(`processing.${START_HERE_CIPHER}.title`)}</CardTitle>
          <CardText>{t('home.startHere.text')}</CardText>
        </div>
        <Button href={`/encoder/${START_HERE_CIPHER}/learn`} variant="primary">
          {t('home.startHere.cta')}
        </Button>
      </Letter>
    </Section>
  );
};

StartHereCard.displayName = 'StartHereCard';

export default StartHereCard;
