import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Paper } from '@atoms';
import GlossaryTerm from '@molecues/GlossaryTerm';
import { BodyCopy, Caption, Minion } from '@typography';

import { getLearningConfig } from '@learning/config';

const Wrap = styled.div`
  margin-top: 24px;
  width: 100%;
  max-width: ${({ theme }) => theme.widths.read};
  text-align: left;
`;

const Title = styled.h4`
  margin: 0 0 8px;
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.metal.brass.light};
`;

// Paper cards in a grid: engraved caption term, body-text definition.
const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 8px 16px;
`;

const TermCard = styled(Paper)`
  padding: 10px 12px;
`;

const Links = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LinksTitle = styled(Caption)`
  color: ${({ theme }) => theme.metal.brass.light};
`;

const LinkText = styled(Minion)`
  color: ${({ theme }) => theme.ink.primary};

  a {
    color: ${({ theme }) => theme.metal.copper.dark};
  }
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
    <Wrap>
      <Title>{t('learning.glossary.title')}</Title>
      <List>
        {config.glossary.map((id) => (
          <TermCard key={id}>
            <BodyCopy>
              <GlossaryTerm id={id} />
              {' — '}
              {t(`glossary.${id}.definition`)}
            </BodyCopy>
          </TermCard>
        ))}
      </List>
      {config.furtherReading.length > 0 && (
        <Links>
          <LinksTitle>{t('learning.glossary.furtherReading')}</LinksTitle>
          {config.furtherReading.map((link) => (
            <LinkText key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {t(link.labelKey)}
              </a>
            </LinkText>
          ))}
        </Links>
      )}
    </Wrap>
  );
};

GlossarySection.displayName = 'GlossarySection';

export default GlossarySection;
