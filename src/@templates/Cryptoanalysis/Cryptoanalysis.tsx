import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import Section from '@atoms/Section/Section';
import TabPlates from '@molecues/TabPlates';
import AtGlanceCard from '@molecues/AtGlanceCard';
import CipherCracker from '@organisms/CipherCracker/CipherCracker';
import { ToolCase } from '@organisms';
import { getExample } from '@learning/examples';
import { getChallenge } from '@learning/challenges';
import { PendingExampleContext, PendingExampleLoad } from '@learning/pendingExample';
import { hasCryptoanalysis } from '@learning/config';
import { getCipherHandoff, clearCipherHandoff } from '@learning/cipherHandoff';

const CryptoanalysisSection = styled(Section)`
  flex: 1 0 auto;
`;

const IdentifyHint = styled.div`
  margin: 0 auto 8px;
  max-width: ${({ theme }) => theme.widths.read};
  font-size: 13px;
  text-align: center;

  a {
    color: ${({ theme }) => theme.ink.cream};
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.metal.brass.dark};
    text-underline-offset: 3px;

    &:hover {
      color: ${({ theme }) => theme.metal.copper.light};
      text-decoration-color: ${({ theme }) => theme.metal.copper.base};
    }
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
  const { t } = useTranslation('common');
  const shouldShowIdentifyerLink = false;

  // "Try breaking it" on /identify: the ciphertext travels in the
  // in-memory hand-off slot and lands here once, then the slot clears.
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const handoff = getCipherHandoff();
    if (handoff && handoff.target === 'cracker' && handoff.cipher === algorithm) {
      setInput(handoff.input);
      clearCipherHandoff();
    }
  }, [router.isReady, algorithm]);

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
    <CryptoanalysisSection stitch="both" zone="tool">
      <AtGlanceCard />
      {shouldShowIdentifyerLink && (
        <IdentifyHint>
          <Link href="/identify">{t('identify.backEntry')}</Link>
        </IdentifyHint>
      )}
      <ToolCase tabs={<TabPlates algorithm={algorithm} activeTab="cryptoanalysis" />}>
        <PendingExampleContext.Provider value={pending}>
          <CipherCracker
            algorithm={algorithm}
            input={input}
            onInputChange={setInput}
          />
        </PendingExampleContext.Provider>
      </ToolCase>
    </CryptoanalysisSection>
  );
};

Cryptoanalysis.displayName = 'Cryptoanalysis';

export default Cryptoanalysis;
