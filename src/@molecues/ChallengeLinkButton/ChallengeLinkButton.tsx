import { useTranslation } from 'next-i18next';
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { getChallenge } from '@learning/challenges';
import { hasCryptoanalysis } from '@learning/config';

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

interface ChallengeLinkButtonProps {
  challengeId: string;
}

// Opens the challenge's ciphertext with the hint preset matching the
// challenge difficulty. Ciphers with a cracker open the Cryptoanalysis
// tab; the rest open the tool with the ciphertext pre-filled. The URL
// carries only the challenge id.
const ChallengeLinkButton: React.FC<ChallengeLinkButtonProps> = ({ challengeId }) => {
  const { t } = useTranslation('common');
  const challenge = getChallenge(challengeId);

  if (!challenge) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[challenge-link] unknown challenge id: ${challengeId}`);
    }
    return null;
  }

  const action = hasCryptoanalysis(challenge.cipher)
    ? 'cryptoanalysis'
    : challenge.mode === 'decrypt' ? 'reverse' : 'direct';

  return (
    <StyledLink href={`/encoder/${challenge.cipher}/${action}?challenge=${challenge.id}`}>
      {t('learning.tryInTool')}
    </StyledLink>
  );
};

ChallengeLinkButton.displayName = 'ChallengeLinkButton';

export default ChallengeLinkButton;
