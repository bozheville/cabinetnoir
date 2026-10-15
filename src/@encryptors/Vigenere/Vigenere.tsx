import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import {Checkbox, Heading, Pane, TextInput } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { CrypterProps } from '../types';
import { vigenereEncrypt, vigenereDecrypt, DEFAULT_ALPHABET, isEnglishAlphabet } from './vigenere-encryption';
import CrackerSettings from './cracker/CrackerSettings';
import CrackerWizard from './cracker/CrackerWizard';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig } from './cracker/hintSettings';

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
  const cracker = useCracker({ input, enabled: isUnknownKey, hintConfig, alphabet: customAlphabet });
  const router = useRouter();
  const { t } = useTranslation('common');

  // The cracker handles any reshuffling of the 26 English letters, but not
  // foreign letters (its frequency tables are English).
  const canCrack = isUnknownKey && isEnglishAlphabet(customAlphabet);

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

    const { algorithm, action } = router.query;
    if (action !== 'reverse' && typeof algorithm === 'string') {
      // usedKey marker: keeps the original text in the input (EncryptionInputs
      // skips its swap-copy for it and cleans the marker up afterwards).
      router.push(
        { pathname: `/encoder/${algorithm}/reverse`, query: { usedKey: '1' } },
        undefined,
        { shallow: true },
      );
    }
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
        <Heading size={100}>{t('processing.vigenere.cracker.keyLabel')}</Heading>
        <TextInput
          width="150px"
          value={secretKey}
          onChange={(event) => setSecretKey(event.target.value)}
        />
        <Heading size={100} marginLeft="12px">{t('processing.vigenere.cracker.alphabetLabel')}</Heading>
        <TextInput
          width="280px"
          fontFamily="monospace"
          value={customAlphabet}
          onChange={handleAlphabetChange}
        />
        {isEnglishAlphabet(customAlphabet) && (
          <Checkbox
            marginLeft="6px"
            label={t('processing.vigenere.cracker.unknownKey')}
            checked={isUnknownKey}
            onChange={(event) => setIsUnknownKey(event.target.checked)}
          />
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
          <CrackerSettings config={hintConfig} onChange={setHintConfig} />
          <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkipCracker} />
        </Pane>
      )}
    </>
  );
};

Vigenere.displayName = 'Vigenere';

export default Vigenere;
