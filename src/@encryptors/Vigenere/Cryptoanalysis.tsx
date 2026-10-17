import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Heading, Pane, Text, TextInput } from 'evergreen-ui';

import Tooltip from '@atoms/Tooltip';
import { DEFAULT_ALPHABET, cleanAlphabet, isEnglishAlphabet } from './vigenere-encryption';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig, HINT_KEYS, applyPreset, PresetName } from './cracker/hintSettings';
import CrackerWizard from './cracker/CrackerWizard';
import { CrackerInput, CrackerSettings } from '@encryptors/shared/cracker';
import { usePendingExample } from '@learning/pendingExample';
import { setKeyHandoff } from '@learning/keyHandoff';

// Vigenère cracker on the Cryptoanalysis tab: the guided wizard owns the
// page. "Use this key" hands the recovered key to the Tool tab (in-memory
// hand-off, nothing persisted).
const VigenereCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [customAlphabet, setCustomAlphabet] = useState(DEFAULT_ALPHABET);
  const [hintConfig, setHintConfig] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const router = useRouter();
  const { t } = useTranslation('common');

  const cracker = useCracker({ input, enabled: true, hintConfig, alphabet: customAlphabet });

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

  const handleUseKey = (key: string) => {
    setKeyHandoff({ cipher: 'vigenere', input, keys: [key] });
    router.push('/encoder/vigenere/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/vigenere/direct');
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
        <Heading size={100} data-guide="alphabet">{t('processing.vigenere.cracker.alphabetLabel')}</Heading>
        <Tooltip content={t('processing.vigenere.cracker.tooltips.alphabet')}>
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
          <CrackerSettings config={hintConfig} onChange={setHintConfig} keys={HINT_KEYS} i18nScope="processing.vigenere.cracker" />
          <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkip} />
        </Pane>
      ) : (
        <Pane padding="16px">
          <Text>{t('processing.vigenere.cracker.alphabetUnsupported')}</Text>
        </Pane>
      )}
    </Pane>
  );
};

VigenereCryptoanalysis.displayName = 'VigenereCryptoanalysis';

export default VigenereCryptoanalysis;
