import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { CipherLadder, Footer, Hero, Roadmap, StartHereCard } from '@molecues';
import Section from '@atoms/Section/Section';
import styled from 'styled-components';

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

// Landing page (#73): hero, pinned "Start here", the cipher ladder
// (#74) and the roadmap (#75).
const Index: React.FC = () => {
  return (
    <>
      <Hero />
      <StartHereCard />
      <LadderSection stitch="both" color="description">
        <div>
          <CipherLadder />
        </div>
      </LadderSection>
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
