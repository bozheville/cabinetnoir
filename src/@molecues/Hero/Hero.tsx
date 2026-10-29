import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { Button } from '@atoms';
import { Sunburst } from '@ornaments';
import { BodyCopy, Canon, DoublePica } from '@typography';

const HeroBand = styled(Section)`
  overflow: hidden;
`;

const SunburstBack = styled.div`
  position: absolute;
  top: -360px;
  left: 50%;
  transform: translateX(-50%);
  color: ${({ theme }) => theme.leather.green.thread};
  pointer-events: none;
`;

const HeroInner = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 48px 16px;
  width: 100%;
  max-width: 640px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Nameplate = styled(Canon)`
  color: ${({ theme }) => theme.ink.cream};
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
`;

const Subtitle = styled(DoublePica)`
  color: ${({ theme }) => theme.metal.brass.light};
`;

const HeroBody = styled(BodyCopy)`
  color: ${({ theme }) => theme.ink.creamMuted};
  margin: 0 auto;
`;

const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`;

const Audiences = styled.div`
  margin-top: 8px;
  display: grid;
  gap: 4px;
  justify-items: center;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 24px;
  }

  ${BodyCopy} {
    color: ${({ theme }) => theme.ink.creamMuted};
  }
`;

// Home-page hero (#73): what Cabinet Noir is and who it serves — the
// total beginner learning by breaking, and the expert who just wants
// the tool.
const Hero: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <HeroBand stitch="bottom" zone="hero">
      <SunburstBack aria-hidden="true">
        <Sunburst size={720} radius={360} />
      </SunburstBack>
      <HeroInner>
        <Nameplate>{t('name')}</Nameplate>
        <Subtitle>{t('home.title')}</Subtitle>
        <HeroBody>{t('home.subtitle')}</HeroBody>
        <Ctas>
          <Button href="#cipher-ladder" variant="primary" size="lg">
            {t('home.hero.ctaPrimary')}
          </Button>
          <Button href="/identify" variant="secondary" size="lg">
            {t('home.hero.ctaIdentify')}
          </Button>
        </Ctas>
        <Audiences>
          <BodyCopy>{t('home.hero.beginner')}</BodyCopy>
          <BodyCopy>{t('home.hero.expert')}</BodyCopy>
        </Audiences>
      </HeroInner>
    </HeroBand>
  );
};

Hero.displayName = 'Hero';

export default Hero;
