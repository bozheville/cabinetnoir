import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { Button } from '@atoms';

import { getChallenge } from '@learning/challenges';
import { hasCryptoanalysis } from '@learning/config';

const Inline = styled.span`
  display: inline-flex;
  margin: 8px 0;
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
    <Inline>
      <Button
        href={`/encoder/${challenge.cipher}/${action}?challenge=${challenge.id}`}
        variant="primary"
        size="sm"
      >
        {t('learning.tryInTool')}
      </Button>
    </Inline>
  );
};

ChallengeLinkButton.displayName = 'ChallengeLinkButton';

export default ChallengeLinkButton;
