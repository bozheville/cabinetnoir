import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { BodyCopy, Canon, DoublePica } from '@typography';

const HeroInner = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 640px;
  text-align: center;
`;

const Audiences = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 4px;
  justify-items: center;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 24px;
  }
`;

// Home-page hero (#73): what Cabinet Noir is and who it serves — the
// total beginner learning by breaking, and the expert who just wants
// the tool.
const Hero: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Section stitch="bottom" color="homeMenu">
      <HeroInner>
        <Canon>{t('name')}</Canon>
        <DoublePica>{t('home.title')}</DoublePica>
        <BodyCopy>{t('home.subtitle')}</BodyCopy>
        <Audiences>
          <BodyCopy>{t('home.hero.beginner')}</BodyCopy>
          <BodyCopy>{t('home.hero.expert')}</BodyCopy>
        </Audiences>
      </HeroInner>
    </Section>
  );
};

Hero.displayName = 'Hero';

export default Hero;
