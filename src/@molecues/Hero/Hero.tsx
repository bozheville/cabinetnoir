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

// Sunburst anchored to the bottom centre of the band, rays fanning
// upward behind the nameplate (mock-home.svg: translate(640 512)).
const SunburstBack = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  color: ${({ theme }) => theme.metal.brass.light};
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

// The nameplate: double brass rule around the app name, no corners
// (mock-home.svg: 600×96 plate, 1.5px outer + 0.75px inner rule).
const NameplatePlate = styled.div`
  position: relative;
  padding: 24px 32px;
  border: 1.5px solid ${({ theme }) => theme.metal.brass.light};

  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border: 0.75px solid ${({ theme }) => theme.metal.brass.light};
    opacity: 0.8;
    pointer-events: none;
  }

  @media (forced-colors: active) {
    &::after { display: none; }
  }
`;

const Nameplate = styled(Canon)`
  color: ${({ theme }) => theme.ink.cream};
  letter-spacing: 0.18em;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
`;

const Subtitle = styled(DoublePica)`
  color: ${({ theme }) => theme.ink.cream};
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

// Home-page hero (#73): what Cabinet Noir is and who it serves — the
// total beginner learning by breaking, and the expert who just wants
// the tool.
const Hero: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <HeroBand stitch="bottom" zone="hero">
      <SunburstBack aria-hidden="true">
        <Sunburst size={1400} radius={700} />
      </SunburstBack>
      <HeroInner>
        <NameplatePlate>
          <Nameplate>{t('name')}</Nameplate>
        </NameplatePlate>
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
      </HeroInner>
    </HeroBand>
  );
};

Hero.displayName = 'Hero';

export default Hero;
