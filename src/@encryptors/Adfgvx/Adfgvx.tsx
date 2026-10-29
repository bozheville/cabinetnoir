import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import { useAdfgvx } from './useAdfgvx';
import { Cluster, Select, Stack } from '@atoms';
import TextInput from '@atoms/TextInput/TextInput';
import Tooltip from '@atoms/Tooltip';
import { ControlGroup } from '@organisms/ControlPanel';
import { engraved } from '@theme/mixins';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

// Engraved brass label on the leather control panel.
const PaneLabel = styled.span`
  ${engraved('leather')}
  font-size: 11px;
`;

// "Try it in the tool": the example carries both keys in one string,
// square key first, transposition key second ("NIGHT GERMAN").
const SPLIT_EXAMPLE_KEY = (key: string): [string, string] => {
  const [square = '', transposition = ''] = key.split(' ');
  return [square, transposition];
};

// The ADFGVX tool: encrypt/decrypt with known keys. The cracker lives on
// its own Cryptoanalysis tab (/encoder/adfgvx/cryptoanalysis) and hands
// both recovered keys over via the in-memory key hand-off.
const Adfgvx: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    squareKey,
    setSquareKey,
    transpositionKey,
    setTranspositionKey,
    variant,
    setVariant,
  } = useAdfgvx({ input, onProcessingEnd, isDecryptMode });

  const pendingExample = usePendingExample();
  useEffect(() => {
    if (pendingExample?.key) {
      const [square, transposition] = SPLIT_EXAMPLE_KEY(pendingExample.key);
      setSquareKey(square);
      setTranspositionKey(transposition);
    }
  }, [pendingExample]);

  // "Use these keys" on the Cryptoanalysis tab: pick both recovered keys
  // up from the in-memory hand-off (the URL carries only the usedKey
  // flag).
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'adfgvx') {
      if (handoff.keys[0]) {
        setSquareKey(handoff.keys[0]);
      }
      if (handoff.keys[1]) {
        setTranspositionKey(handoff.keys[1]);
      }
    }
  }, [router.query.usedKey]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <PaneLabel data-guide="variant">{t('processing.adfgvx.variantLabel')}</PaneLabel>
          <Tooltip content={t('learning.tooltips.adfgvx.variant')}>
            <Select
              data-guide="variant-selector"
              width="160px"
              value={variant}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setVariant(event.target.value as typeof variant)
              }
              options={[
                { value: 'adfgx', label: t('processing.adfgvx.variants.adfgx') },
                { value: 'adfgvx', label: t('processing.adfgvx.variants.adfgvx') },
              ]}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.adfgvx.square-key')}>
            <TextInput
              data-guide="square-key"
              label={t('processing.adfgvx.squareKeyLabel')}
              mono
              width="150px"
              value={squareKey}
              onChange={(event) => setSquareKey(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.adfgvx.transposition-key')}>
            <TextInput
              data-guide="transposition-key"
              label={t('processing.adfgvx.transpositionKeyLabel')}
              mono
              width="150px"
              value={transpositionKey}
              onChange={(event) => setTranspositionKey(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
      </Cluster>
    </PaneStack>
  );
};

Adfgvx.displayName = 'Adfgvx';

export default Adfgvx;
