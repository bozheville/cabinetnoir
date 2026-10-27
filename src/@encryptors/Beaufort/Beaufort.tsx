import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Heading, Pane, Select, Text, TextInput } from 'evergreen-ui';
import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import {
  BeaufortVariant,
  DEFAULT_ALPHABET,
  beaufortDecrypt,
  beaufortEncrypt,
  isBeaufortVariant,
} from './beaufort-crypt';
import TabulaRecta from './TabulaRecta';
import { cleanAlphabet } from '../Vigenere/vigenere-encryption';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';

// The Beaufort tool: encrypt/decrypt with a known key, in either variant.
// Classic Beaufort is reciprocal — encrypt and decrypt are the same
// operation, so switching modes with the same key restores the text.
// The cracker lives on the Cryptoanalysis tab and hands its recovered
// key over via the in-memory key hand-off.
const Beaufort: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [secretKey, setSecretKey] = useState('');
  const [variant, setVariant] = useState<BeaufortVariant>('beaufort');
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
    if (handoff?.cipher === 'beaufort' && handoff.keys[0]) {
      setSecretKey(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  const handleAlphabetChange = (event) => {
    setCustomAlphabet(cleanAlphabet(event.target.value));
  };

  const handleVariantChange = (event) => {
    const next = event.target.value;
    if (isBeaufortVariant(next)) {
      setVariant(next);
    }
  };

  useEffect(() => {
    const options = { variant };
    const output = isDecryptMode
      ? beaufortDecrypt(input, secretKey, customAlphabet, options)
      : beaufortEncrypt(input, secretKey, customAlphabet, options);

    onProcessingEnd({ output });
  }, [input, secretKey, variant, isDecryptMode, customAlphabet]);

  return (
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Heading size={100} data-guide="key">{t('processing.beaufort.cracker.keyLabel')}</Heading>
      <Tooltip content={t('processing.beaufort.tooltips.key')}>
        <TextInput
          width="150px"
          value={secretKey}
          onChange={(event) => setSecretKey(event.target.value)}
        />
      </Tooltip>
      <Heading size={100} marginLeft="12px" data-guide="variant">{t('processing.beaufort.tool.variantLabel')}</Heading>
      <Tooltip content={t('processing.beaufort.tooltips.variant')}>
        <Select data-guide="variant-select" value={variant} onChange={handleVariantChange}>
          <option value="beaufort">{t('processing.beaufort.tool.variant.beaufort')}</option>
          <option value="variantBeaufort">{t('processing.beaufort.tool.variant.variantBeaufort')}</option>
        </Select>
      </Tooltip>
      <Heading size={100} marginLeft="12px" data-guide="alphabet">{t('processing.beaufort.cracker.alphabetLabel')}</Heading>
      <Tooltip content={t('processing.beaufort.tooltips.alphabet')}>
        <TextInput
          width="280px"
          fontFamily="monospace"
          value={customAlphabet}
          onChange={handleAlphabetChange}
        />
      </Tooltip>
      <TabulaRecta keyString={secretKey} variant={variant} input={input} alphabet={customAlphabet} />
      {variant === 'beaufort' && (
        <Text size={300} marginTop="6px">
          {t('processing.beaufort.tool.reciprocal')}
        </Text>
      )}
    </Pane>
  );
};

Beaufort.displayName = 'Beaufort';

export default Beaufort;
