import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { Paper } from '@atoms';
import { ToolCase } from '@organisms';
import HeadingRule from '@ornaments/HeadingRule';
import TabPlates from '@molecues/TabPlates';
import AtGlanceCard from '@molecues/AtGlanceCard';
import MarkdownContent from '@molecues/MarkdownContent';
import GlossarySection from '@molecues/GlossarySection';
import ChallengeCard from '@molecues/ChallengeCard';
import { Minion } from '@typography';
import { getChallenges } from '@learning/challenges';

const LearningWrapper = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1 0 auto;
  padding-top: 48px;
`;

// The storytelling tabs dock onto a lintel (double rule + lozenge),
// not the full tool frame; the case is sheet-wide.
const StoryCase = styled(ToolCase)`
  max-width: ${({ theme }) => theme.widths.sheet};
  width: 100%;
  margin-top: 8px;
`;

const StoryBody = styled.div`
  padding: 24px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

// Each markdown block is a paper sheet on the green band.
const Sheet = styled(Paper)`
  width: 100%;
  max-width: ${({ theme }) => theme.widths.sheet};
  padding: 24px;
  margin-top: 8px;
`;

const TabTitle = styled(HeadingRule)`
  width: 100%;
  max-width: ${({ theme }) => theme.widths.sheet};
`;

const CipherSubtitle = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const PlaceholderText = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// Learning tab layout (Learn / History / Practice). Each tab replaces the
// encryption UI on screen and gets its own URL. Markdown content arrives
// via getStaticProps (build time) and renders in the tab's topic order.
const TOPIC_ORDER = ['how-it-works', 'guides', 'breaking-it', 'history'];
interface LearningMaterialProps {
  learningContent?: Record<string, string>;
}

const LearningMaterial: React.FC<LearningMaterialProps> = ({ learningContent = {} }) => {
  const { t } = useTranslation('common');
  const { algorithm, action } = useRouter().query;
  const tab = action as string;

  return (
    <LearningWrapper stitch="both" zone="learn">
      <AtGlanceCard />
      <StoryCase
        variant="lintel"
        tabs={<TabPlates algorithm={algorithm as string} activeTab={tab as any} />}
      >
        <StoryBody>
          <TabTitle on="dark">{t(`learning.tabs.${tab}`)}</TabTitle>
          <CipherSubtitle>{t(`processing.${algorithm as string}.title`)}</CipherSubtitle>
          {Object.keys(learningContent).length === 0 && (
            <div>
              <PlaceholderText>{t('learning.placeholder')}</PlaceholderText>
            </div>
          )}
          {TOPIC_ORDER.filter((topic) => learningContent[topic]).map((topic) => (
            <Sheet key={topic}>
              <MarkdownContent source={learningContent[topic]} />
            </Sheet>
          ))}
          {tab === 'learn' && <GlossarySection algorithm={algorithm as string} />}
          {tab === 'practice' && getChallenges(algorithm as string).map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </StoryBody>
      </StoryCase>
    </LearningWrapper>
  );
};

LearningMaterial.displayName = 'LearningMaterial';

export default LearningMaterial;
