import React, { useMemo } from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import strings from '../strings';
import { LockedLetter, useCracker } from './useCracker';
import { decryptPartial } from './decryptPartial';

const PreviewBox = styled(Pane)`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};

  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

// Renders the partial decryption: locked letters show their plaintext,
// unlocked ones a dimmed underscore, everything in the original layout.
const DecryptPreview: React.FC<{ cracker: ReturnType<typeof useCracker> }> = ({ cracker }) => {
  const { input, analysis, keyLength, lockedLetters, alphabet } = cracker;

  const preview = useMemo(() => {
    if (!analysis || keyLength === null) {
      return null;
    }
    return decryptPartial(input, analysis.normalized, keyLength, lockedLetters as Record<number, LockedLetter>, alphabet);
  }, [input, analysis, keyLength, lockedLetters, alphabet]);

  if (!preview) {
    return null;
  }

  return (
    <Pane width="100%">
      <Heading size={300}>{strings.wizard.previewTitle}</Heading>
      <PreviewBox marginTop="4px">
        {preview.split('').map((char, index) => (
          char === '_'
            ? <Placeholder key={index}>_</Placeholder>
            : <span key={index}>{char}</span>
        ))}
      </PreviewBox>
    </Pane>
  );
};

DecryptPreview.displayName = 'DecryptPreview';

export default DecryptPreview;
