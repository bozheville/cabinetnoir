import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';

const Term = styled.em`
  font-style: normal;
  border-bottom: 1px dashed ${({ theme }) => theme.colorScheme.blue[400]};
  cursor: help;
`;

interface GlossaryTermProps {
  id: string;
}

// Inline glossary term with the definition on hover/focus. Terms are
// shared site-wide (locale JSON), so a term means the same thing on every
// page.
const GlossaryTerm: React.FC<GlossaryTermProps> = ({ id }) => {
  const { t } = useTranslation('common');
  const name = t(`glossary.${id}.name`);
  const definition = t(`glossary.${id}.definition`);

  if (name.startsWith('glossary.')) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[glossary] unknown term id: ${id}`);
    }
    return null;
  }

  return (
    <Tooltip content={definition}>
      <Term>{name}</Term>
    </Tooltip>
  );
};

GlossaryTerm.displayName = 'GlossaryTerm';

export default GlossaryTerm;
