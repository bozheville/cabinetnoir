import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {Checkbox, Heading, Pane, TextInput } from 'evergreen-ui';
import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { vigenereEncrypt, vigenereDecrypt, DEFAULT_ALPHABET, isEnglishAlphabet } from './vigenere-encryption';
import { CrackerSettings } from '@encryptors/shared/cracker';
import CrackerWizard from './cracker/CrackerWizard';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig, HINT_KEYS, applyPreset, PresetName } from './cracker/hintSettings';
import { usePendingExample } from '@learning/pendingExample';

const Vigenere: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [ secretKey, setSecretKey ] = useState('');
  const [ isUnknownKey, setIsUnknownKey ] = useState(false);
  const [ customAlphabet, setCustomAlphabet ] = useState(DEFAULT_ALPHABET);
  const [ hintConfig, setHintConfig ] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const { t } = useTranslation('common');

  // An unknown key (and the cracker it enables) only exists in the decrypt
  // mode; the raw flag is dropped when switching back to encryption.
  const unknownKey = isDecryptMode && isUnknownKey;
  const cracker = useCracker({ input, enabled: unknownKey, hintConfig, alphabet: customAlphabet });

  // The cracker handles any reshuffling of the 26 English letters, but not
  // foreign letters (its frequency tables are English).
  const canCrack = unknownKey && isEnglishAlphabet(customAlphabet);

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
    if (pendingExample.cracker) {
      setIsUnknownKey(true);
    }
    if (pendingExample.hintPreset) {
      setHintConfig((current) => applyPreset(current, pendingExample.hintPreset as PresetName));
    }
  }, [pendingExample]);

  // An unknown key only makes sense while decrypting; drop the flag when
  // switching back to the encrypt mode.
  useEffect(() => {
    if (!isDecryptMode) {
      setIsUnknownKey(false);
    }
  }, [isDecryptMode]);

  // Uppercase, unique letters only; reject edits that leave fewer than two.
  // "Is a letter" via case asymmetry: target is es5, so no unicode property
  // escapes. Digits and punctuation have no case and are dropped.
  const cleanAlphabet = (value: string): string => {
    const letters = value
      .toUpperCase()
      .split('')
      .filter((letter, index, all) =>
        letter.toUpperCase() !== letter.toLowerCase()
        && all.indexOf(letter) === index)
      .join('');
    return letters.length >= 2 ? letters : DEFAULT_ALPHABET;
  };

  const handleAlphabetChange = (event) => {
    setCustomAlphabet(cleanAlphabet(event.target.value));
  };

  const handleUseKey = (key: string) => {
    setSecretKey(key);
    setIsUnknownKey(false);
  };

  const handleSkipCracker = () => {
    setIsUnknownKey(false);
  };

  useEffect(() => {
    const output = isDecryptMode
      ? vigenereDecrypt(input, secretKey, customAlphabet)
      : vigenereEncrypt(input, secretKey, customAlphabet);

      onProcessingEnd({ output });
  }, [input, secretKey, isDecryptMode, customAlphabet]);

  return (
    <>
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingX="16px"
        paddingBottom="16px"
        {...paneProps}
      >
        <Heading size={100} data-guide="key">{t('processing.vigenere.cracker.keyLabel')}</Heading>
        <Tooltip content={t('processing.vigenere.cracker.tooltips.key')}>
          <TextInput
            width="150px"
            value={secretKey}
            onChange={(event) => setSecretKey(event.target.value)}
          />
        </Tooltip>
        <Heading size={100} marginLeft="12px" data-guide="alphabet">{t('processing.vigenere.cracker.alphabetLabel')}</Heading>
        <Tooltip content={t('processing.vigenere.cracker.tooltips.alphabet')}>
          <TextInput
            width="280px"
            fontFamily="monospace"
            value={customAlphabet}
            onChange={handleAlphabetChange}
          />
        </Tooltip>
        {isDecryptMode && isEnglishAlphabet(customAlphabet) && (
          <Tooltip content={t('processing.vigenere.cracker.tooltips.unknownKey')}>
            <Checkbox
              data-guide="unknown-key"
              marginLeft="6px"
              label={t('processing.vigenere.cracker.unknownKey')}
              checked={unknownKey}
              onChange={(event) => setIsUnknownKey(event.target.checked)}
            />
          </Tooltip>
        )}
      </Pane>
      {canCrack && (
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
          <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkipCracker} />
        </Pane>
      )}
    </>
  );
};

Vigenere.displayName = 'Vigenere';

export default Vigenere;
