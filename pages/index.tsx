import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import styled from 'styled-components';

import { CipherLadder, Footer, Hero, Roadmap, StartHereCard } from '@molecues';
import Section from '@atoms/Section/Section';
import { leather } from '@theme/mixins';
import { Sunburst } from '@ornaments';
import { GreatPrimer, Minion } from '@typography';

const LadderSection = styled(Section)`
  flex: 1 0 auto;

  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: 1280px;
    padding: 0 16px;
  }
`;

const RoadmapSection = styled(Section)`
  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: 720px;
  }
`;

const IdentifySection = styled(Section)`
  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: 720px;
  }
`;

// Navy leather card with a sunburst corner: the identify call-out.
const IdentifyCard = styled(Link)`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.leather};
  ${leather('navy', 0.1)}
  text-decoration: none;
  transition: transform 120ms ease-out;

  &:hover {
    transform: translateY(-2px);
  }

  ${GreatPrimer} {
    color: ${({ theme }) => theme.ink.cream};
  }

  ${Minion} {
    color: ${({ theme }) => theme.ink.creamMuted};
  }
`;

const CardSunburst = styled.span`
  position: absolute;
  right: -40px;
  top: -40px;
  color: ${({ theme }) => theme.metal.brass.light};
  pointer-events: none;
`;

// Landing page (#73): hero, pinned "Start here", the cipher ladder
// (#74) and the roadmap (#75).
const Index: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Hero />
      <StartHereCard />
      <LadderSection stitch="both" color="description" id="cipher-ladder">
        <div>
          <CipherLadder />
        </div>
      </LadderSection>
      <IdentifySection stitch="both" color="footer">
        <div>
          <IdentifyCard href="/identify">
            <CardSunburst aria-hidden="true">
              <Sunburst size={160} radius={80} rays={12} />
            </CardSunburst>
            <GreatPrimer>{t('home.identify.title')}</GreatPrimer>
            <Minion>{t('home.identify.subtitle')}</Minion>
          </IdentifyCard>
        </div>
      </IdentifySection>
      <RoadmapSection stitch="both" color="footer">
        <div>
          <Roadmap />
        </div>
      </RoadmapSection>
      <Footer />
    </>
  );
};

Index.displayName = 'Index';

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale, ['common']),
    },
  };
};

export default Index;
