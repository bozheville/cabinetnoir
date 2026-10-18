import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { EncryptionInputs, EncryptionSettings } from '@organisms';
import CipherTabs from '@molecues/CipherTabs';
import AtGlanceCard from '@molecues/AtGlanceCard';
import { useRouter } from 'next/router';
import { getExample } from '@learning/examples';
import { getChallenge } from '@learning/challenges';
import { PendingExampleContext, PendingExampleLoad } from '@learning/pendingExample';

const EncryptorSection = styled(Section)`
  flex: 1 0 auto;
`;

const EncryptorWrapper = styled.div`
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

const Encryptor: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [pendingExample, setPendingExample] = useState<PendingExampleLoad | null>(null);
  const router = useRouter();
  const { algorithm } = router.query;

  // "Try it in the tool" / practice challenges: pick the content id up
  // from the URL, pre-fill the tool from it and remove the parameter.
  // Only our own content ids travel through the URL, never user text.
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

  return (
    <>
      <EncryptorSection stitch="both" color="encryptor">
        <AtGlanceCard />
        <CipherTabs algorithm={algorithm as string} activeTab="tool" />
        <EncryptorWrapper>
          <PendingExampleContext.Provider value={pending}>
            <EncryptionSettings
              input={input}
              onOutputUpdate={({ output }) => {
                setOutput(output);
              }}
              onInputChange={setInput}
            />
            <EncryptionInputs
              onChange={setInput}
              output={output}
              input={input}
            />
          </PendingExampleContext.Provider>
        </EncryptorWrapper>
      </EncryptorSection>
    </>
  );
};

Encryptor.displayName = 'Encryptor';

export default Encryptor;
