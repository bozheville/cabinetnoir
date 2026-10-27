import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Heading, Pane, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import {
  DEFAULT_ALPHABET,
  autokeyDecrypt,
  autokeyEncrypt,
  autokeyKeystream,
} from './autokey-crypt';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';

// The keystream row: the primer letters, then the plaintext letters
// feeding the key. In decrypt mode the plaintext is the recovered one —
// either way the row is the key the engine actually used, letter for
// letter above the text.
const StreamRow = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  margin-top: 8px;
  font-family: monospace;
  font-size: 14px;
`;

const StreamLetter = styled(Text)<{ $primer: boolean }>`
  font-family: monospace;
  font-size: 14px;
  width: 16px;
  text-align: center;
  background: ${({ $primer, theme }) => ($primer ? theme.colorScheme.blue[200] : theme.colorScheme.gray[100])};
  border-radius: 2px;
`;

const StreamWrap = styled(Pane)`
  width: 100%;
  padding: 0 16px;
`;

// The autokey tool: encrypt/decrypt with a primer. The keystream row
// under the input shows the primer (highlighted) followed by the
// plaintext letters — the "the key IS the message" visual. The cracker
// lives on the Cryptoanalysis tab and hands its recovered primer over
// via the in-memory key hand-off.
const Autokey: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [primer, setPrimer] = useState('');
  const { t } = useTranslation('common');
  const router = useRouter();

  // "Try it in the tool": apply the loaded example's key once.
  // The context is only non-null when the example targets this cipher.
  const pendingExample = usePendingExample();
  const appliedExample = React.useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.key) {
      setPrimer(pendingExample.key);
    }
  }, [pendingExample]);

  // "Use this key" on the Cryptoanalysis tab: pick the recovered primer
  // up from the in-memory hand-off (the URL carries only the usedKey flag).
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'autokey' && handoff.keys[0]) {
      setPrimer(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  useEffect(() => {
    const output = isDecryptMode
      ? autokeyDecrypt(input, primer)
      : autokeyEncrypt(input, primer);

    onProcessingEnd({ output });
  }, [input, primer, isDecryptMode]);

  // The keystream the engine used: primer + plaintext (encrypt) or
  // primer + recovered plaintext (decrypt).
  const stream = isDecryptMode
    ? autokeyKeystream(autokeyDecrypt(input, primer), primer)
    : autokeyKeystream(input, primer);
  const primerLength = primer.toUpperCase().split('').filter((letter) => DEFAULT_ALPHABET.includes(letter)).length;

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size={100} data-guide="key">{t('processing.autokey.tool.primerLabel')}</Heading>
        <Tooltip content={t('processing.autokey.tooltips.primer')}>
          <TextInput
            width="150px"
            fontFamily="monospace"
            value={primer}
            onChange={(event) => setPrimer(event.target.value.toUpperCase())}
          />
        </Tooltip>
      </Pane>
      {stream && (
        <StreamWrap data-guide="keystream">
          <StreamRow>
            {stream.split('').map((letter, index) => (
              <StreamLetter key={`${letter}-${index}`} $primer={index < primerLength}>
                {letter}
              </StreamLetter>
            ))}
          </StreamRow>
          <Text size={300} marginTop="4px" display="block">
            {t('processing.autokey.tool.streamCaption')}
          </Text>
        </StreamWrap>
      )}
    </Pane>
  );
};

Autokey.displayName = 'Autokey';

export default Autokey;
