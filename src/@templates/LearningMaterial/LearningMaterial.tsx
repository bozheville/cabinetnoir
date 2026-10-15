import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Heading, Pane, Text } from 'evergreen-ui';

import Section from '@atoms/Section/Section';
import CipherTabs from '@molecues/CipherTabs';
import AtGlanceCard from '@molecues/AtGlanceCard';
import MarkdownContent from '@molecues/MarkdownContent';
import GlossarySection from '@molecues/GlossarySection';

const LearningWrapper = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1 0 auto;
  padding-top: 48px;
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
    <LearningWrapper stitch="both" color="encryptor">
      <AtGlanceCard />
      <CipherTabs algorithm={algorithm as string} activeTab={tab as any} />
      <Heading size={500}>{t(`learning.tabs.${tab}`)}</Heading>
      <Text size={300}>{t(`processing.${algorithm as string}.title`)}</Text>
      {Object.keys(learningContent).length === 0 && (
        <Pane>
          <Text size={300}>{t('learning.placeholder')}</Text>
        </Pane>
      )}
      {TOPIC_ORDER.filter((topic) => learningContent[topic]).map((topic) => (
        <MarkdownContent key={topic} source={learningContent[topic]} />
      ))}
      {tab === 'learn' && <GlossarySection algorithm={algorithm as string} />}
    </LearningWrapper>
  );
};

LearningMaterial.displayName = 'LearningMaterial';

export default LearningMaterial;
