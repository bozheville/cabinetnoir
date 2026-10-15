import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { getExample } from '@learning/examples';

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
  padding: 6px 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue[500]};
  background: ${({ theme }) => theme.colorScheme.blue[500]};
  color: ${({ theme }) => theme.colorScheme.white};
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colorScheme.blue[600]};
  }
`;

interface TryInToolButtonProps {
  exampleId: string;
}

// Loads a worked example into the Tool tab. The URL carries only the
// example ID; the Tool pre-fills from it and removes the parameter.
const TryInToolButton: React.FC<TryInToolButtonProps> = ({ exampleId }) => {
  const { t } = useTranslation('common');
  const example = getExample(exampleId);

  if (!example) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[try-in-tool] unknown example id: ${exampleId}`);
    }
    return null;
  }

  const modePath = example.mode === 'decrypt' ? 'reverse' : 'direct';

  return (
    <StyledLink href={`/encoder/${example.cipher}/${modePath}?example=${example.id}`}>
      {t('learning.tryInTool')}
    </StyledLink>
  );
};

TryInToolButton.displayName = 'TryInToolButton';

export default TryInToolButton;
