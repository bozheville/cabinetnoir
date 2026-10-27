import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Heading, Pane, Select, Text, TextInput } from 'evergreen-ui';

import Tooltip from '@atoms/Tooltip';
import {
  BeaufortVariant,
  DEFAULT_ALPHABET,
  isBeaufortVariant,
} from './beaufort-crypt';
import {
  BEAUFORT_TRANSFORM,
  SliceTransform,
  VARIANT_BEAUFORT_TRANSFORM,
} from '@encryptors/shared/analysis';
import { cleanAlphabet, isEnglishAlphabet } from '../Vigenere/vigenere-encryption';
import useCracker from '../Vigenere/cracker/useCracker';
import {
  DEFAULT_HINT_CONFIG,
  HintConfig,
  HINT_KEYS,
  applyPreset,
  PresetName,
} from '../Vigenere/cracker/hintSettings';
import CrackerWizard from '../Vigenere/cracker/CrackerWizard';
import { CrackerInput, CrackerSettings } from '@encryptors/shared/cracker';
import { usePendingExample } from '@learning/pendingExample';
import { setKeyHandoff } from '@learning/keyHandoff';

// Beaufort cracker on the Cryptoanalysis tab: the Vigenère wizard with
// the slice arithmetic swapped (reflected shifts). The variant select
// switches between the two transforms live; "use this key" hands the
// recovered key to the Tool tab (in-memory hand-off, nothing persisted).
const BeaufortCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [customAlphabet, setCustomAlphabet] = useState(DEFAULT_ALPHABET);
  const [variant, setVariant] = useState<BeaufortVariant>('beaufort');
  const [hintConfig, setHintConfig] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const router = useRouter();
  const { t } = useTranslation('common');

  const transform: SliceTransform = variant === 'beaufort'
    ? BEAUFORT_TRANSFORM
    : VARIANT_BEAUFORT_TRANSFORM;

  const cracker = useCracker({
    input,
    enabled: true,
    hintConfig,
    alphabet: customAlphabet,
    transform,
  });

  // The cracker handles any reshuffling of the 26 English letters, but not
  // foreign letters (its frequency tables are English).
  const canCrack = isEnglishAlphabet(customAlphabet);

  // Challenges and examples: apply the hint preset (and alphabet) once.
  const pendingExample = usePendingExample();
  const appliedExample = React.useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.alphabet) {
      setCustomAlphabet(cleanAlphabet(pendingExample.alphabet));
    }
    if (pendingExample.hintPreset) {
      setHintConfig((current) => applyPreset(current, pendingExample.hintPreset as PresetName));
    }
  }, [pendingExample]);

  const handleAlphabetChange = (event) => {
    setCustomAlphabet(cleanAlphabet(event.target.value));
  };

  const handleVariantChange = (event) => {
    const next = event.target.value;
    if (isBeaufortVariant(next)) {
      setVariant(next);
    }
  };

  const handleUseKey = (key: string) => {
    setKeyHandoff({ cipher: 'beaufort', input, keys: [key] });
    router.push('/encoder/beaufort/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/beaufort/direct');
  };

  return (
    <Pane
      display="flex"
      flexDirection="column"
      width="100%"
    >
      <CrackerInput value={input} onChange={onInputChange} />
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingX="16px"
        paddingY="12px"
      >
        <Heading size={100} data-guide="variant">{t('processing.beaufort.tool.variantLabel')}</Heading>
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
      </Pane>
      {canCrack ? (
        <Pane
          display="flex"
          flexDirection="column"
          width="100%"
          padding="12px"
          marginX="16px"
          marginBottom="16px"
          border="muted"
          borderRadius="4px"
        >
          <CrackerSettings config={hintConfig} onChange={setHintConfig} keys={HINT_KEYS} i18nScope="processing.beaufort.cracker" />
          <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkip} scope="beaufort" />
        </Pane>
      ) : (
        <Pane padding="16px">
          <Text>{t('processing.beaufort.cracker.alphabetUnsupported')}</Text>
        </Pane>
      )}
    </Pane>
  );
};

BeaufortCryptoanalysis.displayName = 'BeaufortCryptoanalysis';

export default BeaufortCryptoanalysis;
