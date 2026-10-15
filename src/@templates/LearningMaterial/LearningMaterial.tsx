import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Heading, Pane, Text } from 'evergreen-ui';

import Section from '@atoms/Section/Section';
import CipherTabs from '@molecues/CipherTabs';

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
// via getStaticProps (build time); sections are filled in by later tasks.
interface LearningMaterialProps {
  learningContent?: Record<string, string>;
}

const LearningMaterial: React.FC<LearningMaterialProps> = ({ learningContent = {} }) => {
  const { t } = useTranslation('common');
  const { algorithm, action } = useRouter().query;
  const tab = action as string;

  return (
    <LearningWrapper stitch="both" color="encryptor">
      <CipherTabs algorithm={algorithm as string} activeTab={tab as any} />
      <Heading size={500}>{t(`learning.tabs.${tab}`)}</Heading>
      <Text size={300}>{t(`processing.${algorithm as string}.title`)}</Text>
      {Object.keys(learningContent).length === 0 && (
        <Pane>
          <Text size={300}>{t('learning.placeholder')}</Text>
        </Pane>
      )}
    </LearningWrapper>
  );
};

LearningMaterial.displayName = 'LearningMaterial';

export default LearningMaterial;
