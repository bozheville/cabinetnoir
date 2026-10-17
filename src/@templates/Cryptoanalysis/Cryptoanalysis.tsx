import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import Section from '@atoms/Section/Section';
import CipherTabs from '@molecues/CipherTabs';
import AtGlanceCard from '@molecues/AtGlanceCard';
import CipherCracker from '@organisms/CipherCracker/CipherCracker';
import { getExample } from '@learning/examples';
import { getChallenge } from '@learning/challenges';
import { PendingExampleContext, PendingExampleLoad } from '@learning/pendingExample';
import { hasCryptoanalysis } from '@learning/config';

const CryptoanalysisSection = styled(Section)`
  flex: 1 0 auto;
`;

const CryptoanalysisWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue_green[500]};

  box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.colorScheme.blue_green[200]};;
  margin: 24px auto;
  background-color: ${({ theme }) => theme.colorScheme.orange[50]};
  overflow: hidden;
  border-radius: 8px;

  ${({ theme }) => theme.breakpoints.small} {
    margin: 4px;
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    max-width: 1016px;
  }
`;

// The Cryptoanalysis tab: guided cracking as a first-class tab. The
// template owns the ciphertext input and hands it to the cipher's
// cracker organism; the wizard lives entirely inside.
const Cryptoanalysis: React.FC = () => {
  const [input, setInput] = useState('');
  const [pendingExample, setPendingExample] = useState<PendingExampleLoad | null>(null);
  const router = useRouter();
  const { algorithm } = router.query;

  // Practice challenges ("Breaking it" demos): pick the challenge id up
  // from the URL, pre-fill the ciphertext and remove the parameter. Only
  // our own content ids travel through the URL, never user text.
  useEffect(() => {
    if (!router.isReady || pendingExample) {
      return;
    }
    const exampleId = router.query.example;
    const challengeId = router.query.challenge;

    if (typeof exampleId === 'string') {
      const example = getExample(exampleId);
      if (example) {
        setPendingExample({
          cipher: example.cipher,
          input: example.input,
          key: example.key,
          alphabet: example.alphabet,
        });
        clearParam();
        return;
      }
    }

    if (typeof challengeId === 'string') {
      const challenge = getChallenge(challengeId);
      if (challenge) {
        setPendingExample({
          cipher: challenge.cipher,
          input: challenge.ciphertext,
          cracker: true,
          hintPreset: challenge.difficulty,
        });
        clearParam();
      }
    }
  }, [router.isReady, pendingExample]);

  const clearParam = () => {
    const { example: _e, challenge: _c, ...restQuery } = router.query;
    router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
  };

  const pending = pendingExample && pendingExample.cipher === algorithm ? pendingExample : null;

  if (typeof algorithm !== 'string' || !hasCryptoanalysis(algorithm)) {
    return null;
  }

  return (
    <CryptoanalysisSection stitch="both" color="encryptor">
      <AtGlanceCard />
      <CipherTabs algorithm={algorithm} activeTab="cryptoanalysis" />
      <CryptoanalysisWrapper>
        <PendingExampleContext.Provider value={pending}>
          <CipherCracker
            algorithm={algorithm}
            input={input}
            onInputChange={setInput}
          />
        </PendingExampleContext.Provider>
      </CryptoanalysisWrapper>
    </CryptoanalysisSection>
  );
};

Cryptoanalysis.displayName = 'Cryptoanalysis';

export default Cryptoanalysis;
