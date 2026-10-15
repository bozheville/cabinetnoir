import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Heading, Pane, Text } from 'evergreen-ui';

import { getLearningConfig } from '@learning/config';
import GlossaryTerm from '@molecues/GlossaryTerm';

const List = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px 24px;
  margin-top: 8px;
`;

const TermRow = styled(Pane)`
  line-height: 1.5;
`;

const Links = styled(Pane)`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

interface GlossarySectionProps {
  algorithm: string;
}

// Last section of the Learn tab: every glossary term the cipher uses plus
// further reading links from the learning config.
const GlossarySection: React.FC<GlossarySectionProps> = ({ algorithm }) => {
  const { t } = useTranslation('common');
  const config = getLearningConfig(algorithm);

  if (!config) {
    return null;
  }

  return (
    <Pane marginTop="24px" width="100%">
      <Heading size={300}>{t('learning.glossary.title')}</Heading>
      <List>
        {config.glossary.map((id) => (
          <TermRow key={id}>
            <GlossaryTerm id={id} />
            {' — '}
            <Text size={300}>{t(`glossary.${id}.definition`)}</Text>
          </TermRow>
        ))}
      </List>
      {config.furtherReading.length > 0 && (
        <Links>
          <Heading size={200}>{t('learning.glossary.furtherReading')}</Heading>
          {config.furtherReading.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
              <Text size={300}>{t(link.labelKey)}</Text>
            </a>
          ))}
        </Links>
      )}
    </Pane>
  );
};

GlossarySection.displayName = 'GlossarySection';

export default GlossarySection;
