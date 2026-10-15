import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Heading, Pane, Text } from 'evergreen-ui';

import Section from '@atoms/Section/Section';

const LearningWrapper = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1 0 auto;
  padding-top: 48px;
`;

// Learning tab layout (Learn / History / Practice). Each tab replaces the
// encryption UI on screen and gets its own URL. Content is filled in by
// later tasks; for now every tab shows a placeholder.
const LearningMaterial: React.FC = () => {
  const { t } = useTranslation('common');
  const { algorithm, action } = useRouter().query;

  return (
    <LearningWrapper stitch="both" color="encryptor">
      <Heading size={500}>{t(`learning.tabs.${action as string}`)}</Heading>
      <Text size={300}>{t(`processing.${algorithm as string}.title`)}</Text>
      <Pane>
        <Text size={300}>{t('learning.placeholder')}</Text>
      </Pane>
    </LearningWrapper>
  );
};

LearningMaterial.displayName = 'LearningMaterial';

export default LearningMaterial;
