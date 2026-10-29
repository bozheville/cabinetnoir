import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { Button, Paper } from '@atoms';
import { GreatPrimer, Minion, Caption } from '@typography';
import { START_HERE_CIPHER } from '@learning/config';

// The band gets its breathing room here, not via a DOM prop.
const StartHereBand = styled(Section)`
  padding: 32px 16px;
`;

// A paper letter pinned to the beige band with two copper rivets.
const Letter = styled(Paper)`
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 640px;
  padding: 32px 16px;
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

// The two audience notes beside the letter on desktop, below it on
// mobile (spec 06 §1, band 2). Slightly tilted, like pinned slips.
const NotesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 640px;
  margin: 0 auto;
  width: 100%;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: stretch;
  }
`;

const AudienceNote = styled(Paper)`
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadow.card};
  transform: rotate(-1.2deg);

  &:last-of-type { transform: rotate(1.2deg); }

  ${({ theme }) => theme.breakpoints.small} {
    transform: none;
  }

  ${Caption} {
    display: block;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

// Pinned "Start here" card on the home page (#74): one pointer to the
// classic first cipher's Learn tab, flanked by the two audience notes.
const StartHereCard: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <StartHereBand stitch="both" color="description">
      <NotesRow>
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
        <AudienceNote>
          <Caption>{t('home.audiences.curious')}</Caption>
          <Minion>{t('home.hero.beginner')}</Minion>
        </AudienceNote>
        <AudienceNote>
          <Caption>{t('home.audiences.student')}</Caption>
          <Minion>{t('home.hero.expert')}</Minion>
        </AudienceNote>
      </NotesRow>
    </StartHereBand>
  );
};

StartHereCard.displayName = 'StartHereCard';

export default StartHereCard;
