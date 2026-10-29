import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Stack, TextInput } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { CipherText, Minion } from '@typography';
import {
  DEFAULT_ALPHABET,
  autokeyDecrypt,
  autokeyEncrypt,
  autokeyKeystream,
} from './autokey-crypt';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';

const PaneStack = styled(Stack)`
  align-items: center;
  padding: 0 16px 16px;
`;

// The keystream row: the primer letters, then the plaintext letters
// feeding the key. In decrypt mode the plaintext is the recovered one —
// either way the row is the key the engine actually used, letter for
// letter above the text. Primer cells get the copper treatment; the
// plaintext cells are parchment.
const StreamRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  margin-top: 8px;
`;

const StreamLetter = styled(CipherText)<{ $primer: boolean }>`
  font-size: 14px;
  width: 16px;
  text-align: center;
  color: ${({ theme }) => theme.ink.primary};
  background: ${({ $primer, theme }) => ($primer
    ? `${theme.metal.copper.light}73`
    : theme.paper.parchment)};
  border: 1px solid ${({ $primer, theme }) => ($primer ? theme.metal.copper.base : theme.paper.rule)};
  border-radius: 2px;
`;

const StreamWrap = styled.div`
  width: 100%;
  padding: 0 16px;
`;

const StreamCaption = styled(Minion)`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.ink.creamMuted};
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
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('processing.autokey.tooltips.primer')}>
            <TextInput
              data-guide="key"
              label={t('processing.autokey.tool.primerLabel')}
              mono
              width="150px"
              value={primer}
              onChange={(event) => setPrimer(event.target.value.toUpperCase())}
            />
          </Tooltip>
        </ControlGroup>
      </Cluster>
      {stream && (
        <StreamWrap data-guide="keystream">
          <StreamRow>
            {stream.split('').map((letter, index) => (
              <StreamLetter key={`${letter}-${index}`} $primer={index < primerLength}>
                {letter}
              </StreamLetter>
            ))}
          </StreamRow>
          <StreamCaption>
            {t('processing.autokey.tool.streamCaption')}
          </StreamCaption>
        </StreamWrap>
      )}
    </PaneStack>
  );
};

Autokey.displayName = 'Autokey';

export default Autokey;
