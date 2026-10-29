import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Stack, TextInput } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { vigenereEncrypt, vigenereDecrypt, DEFAULT_ALPHABET, cleanAlphabet } from './vigenere-encryption';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

// The Vigenère tool: encrypt/decrypt with a known key. The cracker lives
// on its own Cryptoanalysis tab (/encoder/vigenere/cryptoanalysis) and
// hands its recovered key over via the in-memory key hand-off.
const Vigenere: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [secretKey, setSecretKey] = useState('');
  const [customAlphabet, setCustomAlphabet] = useState(DEFAULT_ALPHABET);
  const { t } = useTranslation('common');
  const router = useRouter();

  // "Try it in the tool": apply the loaded example's key and alphabet once.
  // The context is only non-null when the example targets this cipher.
  const pendingExample = usePendingExample();
  const appliedExample = React.useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.key) {
      setSecretKey(pendingExample.key);
    }
    if (pendingExample.alphabet) {
      setCustomAlphabet(cleanAlphabet(pendingExample.alphabet));
    }
  }, [pendingExample]);

  // "Use this key" on the Cryptoanalysis tab: pick the recovered key up
  // from the in-memory hand-off (the URL carries only the usedKey flag).
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'vigenere' && handoff.keys[0]) {
      setSecretKey(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  const handleAlphabetChange = (event) => {
    setCustomAlphabet(cleanAlphabet(event.target.value));
  };

  useEffect(() => {
    const output = isDecryptMode
      ? vigenereDecrypt(input, secretKey, customAlphabet)
      : vigenereEncrypt(input, secretKey, customAlphabet);

      onProcessingEnd({ output });
  }, [input, secretKey, isDecryptMode, customAlphabet]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('processing.vigenere.cracker.tooltips.key')}>
            <TextInput
              data-guide="key"
              label={t('processing.vigenere.cracker.keyLabel')}
              mono
              width="150px"
              value={secretKey}
              onChange={(event) => setSecretKey(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('processing.vigenere.cracker.tooltips.alphabet')}>
            <TextInput
              data-guide="alphabet"
              label={t('processing.vigenere.cracker.alphabetLabel')}
              mono
              width="280px"
              value={customAlphabet}
              onChange={handleAlphabetChange}
            />
          </Tooltip>
        </ControlGroup>
      </Cluster>
    </PaneStack>
  );
};

Vigenere.displayName = 'Vigenere';

export default Vigenere;
