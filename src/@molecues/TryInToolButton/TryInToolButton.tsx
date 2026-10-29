import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Button } from '@atoms';

import { getExample } from '@learning/examples';

const Inline = styled.span`
  display: inline-flex;
  margin: 8px 0;
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
    <Inline>
      <Button
        href={`/encoder/${example.cipher}/${modePath}?example=${example.id}`}
        variant="primary"
        size="sm"
      >
        {t('learning.tryInTool')}
      </Button>
    </Inline>
  );
};

TryInToolButton.displayName = 'TryInToolButton';

export default TryInToolButton;
