import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Heading, Pane, Select } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import { useAdfgvx } from './useAdfgvx';
import TextInput from '@atoms/TextInput/TextInput';
import Tooltip from '@atoms/Tooltip';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';

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
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width="100%"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Heading size={100} data-guide="variant">{t('processing.adfgvx.variantLabel')}</Heading>
      <Tooltip content={t('learning.tooltips.adfgvx.variant')}>
        <Select
          data-guide="variant-selector"
          width="160px"
          value={variant}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setVariant(event.target.value as typeof variant)
          }
        >
          <option value="adfgx">{t('processing.adfgvx.variants.adfgx')}</option>
          <option value="adfgvx">{t('processing.adfgvx.variants.adfgvx')}</option>
        </Select>
      </Tooltip>
      <Heading size={100} marginLeft="12px" data-guide="square-key">{t('processing.adfgvx.squareKeyLabel')}</Heading>
      <Tooltip content={t('learning.tooltips.adfgvx.square-key')}>
        <TextInput
          data-guide="square-key"
          width="150px"
          value={squareKey}
          onChange={(event) => setSquareKey(event.target.value)}
        />
      </Tooltip>
      <Heading size={100} marginLeft="12px" data-guide="transposition-key">{t('processing.adfgvx.transpositionKeyLabel')}</Heading>
      <Tooltip content={t('learning.tooltips.adfgvx.transposition-key')}>
        <TextInput
          data-guide="transposition-key"
          width="150px"
          value={transpositionKey}
          onChange={(event) => setTranspositionKey(event.target.value)}
        />
      </Tooltip>
    </Pane>
  );
};

Adfgvx.displayName = 'Adfgvx';

export default Adfgvx;
