import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import styled from 'styled-components';

import { CipherLadder, Footer, Hero, Roadmap, StartHereCard } from '@molecues';
import Section from '@atoms/Section/Section';
import { GreatPrimer, Minion } from '@typography';

const LadderSection = styled(Section)`
  flex: 1 0 auto;

  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: 720px;
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

const IdentifyCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue_green[500]};
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.blue_green[50]};
  text-decoration: none;

  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colorScheme.blue_green[500]};
  }
`;

// Landing page (#73): hero, pinned "Start here", the cipher ladder
// (#74) and the roadmap (#75).
const Index: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Hero />
      <StartHereCard />
      <LadderSection stitch="both" color="description">
        <div>
          <CipherLadder />
        </div>
      </LadderSection>
      <IdentifySection stitch="both" color="footer">
        <div>
          <IdentifyCard href="/identify">
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
