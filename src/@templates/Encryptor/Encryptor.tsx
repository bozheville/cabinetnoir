import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { EncryptionInputs, EncryptionSettings, ToolCase } from '@organisms';
import TabPlates from '@molecues/TabPlates';
import AtGlanceCard from '@molecues/AtGlanceCard';
import { useRouter } from 'next/router';
import { getExample } from '@learning/examples';
import { getChallenge } from '@learning/challenges';
import { PendingExampleContext, PendingExampleLoad } from '@learning/pendingExample';

const EncryptorSection = styled(Section)`
  flex: 1 0 auto;
`;

const Encryptor: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  // Pigpen's variant selection lives in its pane; the mirror here lets
  // the output side render the glyph strip for the chosen variant.
  const [pigpenVariant, setPigpenVariant] = useState<string | null>(null);
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
          crib: challenge.crib,
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
      <EncryptorSection stitch="both" zone="tool">
        <AtGlanceCard />
        <ToolCase tabs={<TabPlates algorithm={algorithm as string} activeTab="tool" />}>
          <PendingExampleContext.Provider value={pending}>
            <EncryptionSettings
              input={input}
              onOutputUpdate={({ output }) => {
                setOutput(output);
              }}
              onInputChange={setInput}
              onVariantChange={setPigpenVariant}
            />
            <EncryptionInputs
              onChange={setInput}
              output={output}
              input={input}
              glyphVariant={pigpenVariant}
            />
          </PendingExampleContext.Provider>
        </ToolCase>
      </EncryptorSection>
    </>
  );
};

Encryptor.displayName = 'Encryptor';

export default Encryptor;
