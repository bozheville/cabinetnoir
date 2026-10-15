import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { EncryptionInputs, EncryptionSettings, EncryptionDescription } from '@organisms';
import CipherTabs from '@molecues/CipherTabs';
import AtGlanceCard from '@molecues/AtGlanceCard';
import { useRouter } from 'next/router';
import { getExample } from '@learning/examples';
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

  // "Try it in the tool": pick up the example id from the URL, pre-fill
  // the tool from it and remove the parameter. Only our own content ids
  // travel through the URL, never user text.
  useEffect(() => {
    if (!router.isReady || pendingExample) {
      return;
    }
    const exampleId = router.query.example;
    if (typeof exampleId !== 'string') {
      return;
    }
    const example = getExample(exampleId);
    if (!example) {
      return;
    }

    setPendingExample({
      cipher: example.cipher,
      input: example.input,
      key: example.key,
      alphabet: example.alphabet,
    });

    const { example: _ignored, ...restQuery } = router.query;
    router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
  }, [router.isReady, pendingExample]);

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
            />
            <EncryptionInputs
              onChange={setInput}
              output={output}
            />
          </PendingExampleContext.Provider>
        </EncryptorWrapper>
      </EncryptorSection>
      <EncryptionDescription />
    </>
  );
};

Encryptor.displayName = 'Encryptor';

export default Encryptor;
