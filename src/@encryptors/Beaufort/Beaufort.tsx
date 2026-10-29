import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import { Cluster, Select, Stack, TextInput } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { ControlGroup } from '@organisms/ControlPanel';
import { engraved } from '@theme/mixins';
import { Minion } from '@typography';
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

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

const ToolNote = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// Engraved brass label on the leather control panel.
const PaneLabel = styled.span`
  ${engraved('leather')}
  font-size: 11px;
`;

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
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('processing.beaufort.tooltips.key')}>
            <TextInput
              data-guide="key"
              label={t('processing.beaufort.cracker.keyLabel')}
              mono
              width="150px"
              value={secretKey}
              onChange={(event) => setSecretKey(event.target.value)}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <PaneLabel data-guide="variant">{t('processing.beaufort.tool.variantLabel')}</PaneLabel>
          <Tooltip content={t('processing.beaufort.tooltips.variant')}>
            <Select
              data-guide="variant-select"
              value={variant}
              onChange={handleVariantChange}
              options={[
                { value: 'beaufort', label: t('processing.beaufort.tool.variant.beaufort') },
                { value: 'variantBeaufort', label: t('processing.beaufort.tool.variant.variantBeaufort') },
              ]}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('processing.beaufort.tooltips.alphabet')}>
            <TextInput
              data-guide="alphabet"
              label={t('processing.beaufort.cracker.alphabetLabel')}
              mono
              width="280px"
              value={customAlphabet}
              onChange={handleAlphabetChange}
            />
          </Tooltip>
        </ControlGroup>
      </Cluster>
      <TabulaRecta keyString={secretKey} variant={variant} input={input} alphabet={customAlphabet} />
      {variant === 'beaufort' && (
        <ToolNote>
          {t('processing.beaufort.tool.reciprocal')}
        </ToolNote>
      )}
    </PaneStack>
  );
};

Beaufort.displayName = 'Beaufort';

export default Beaufort;
