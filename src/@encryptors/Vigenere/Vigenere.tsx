import React, { useEffect, useState } from 'react';
import {Checkbox, Heading, Pane, TextInput } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { CrypterProps } from '../types';
import { vigenereEncrypt, vigenereDecrypt } from './vigenere-encryption';
import CrackerSettings from './cracker/CrackerSettings';
import CrackerWizard from './cracker/CrackerWizard';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig } from './cracker/hintSettings';
import strings from './strings';

const Vigenere: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const [ secretKey, setSecretKey ] = useState('');
  const [ isUnknownKey, setIsUnknownKey ] = useState(false);
  const [ hintConfig, setHintConfig ] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const cracker = useCracker({ input, enabled: isUnknownKey, hintConfig });
  const router = useRouter();

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
      ? vigenereDecrypt(input, secretKey)
      : vigenereEncrypt(input, secretKey);

      onProcessingEnd({ output });
  }, [input, secretKey, isDecryptMode]);

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
        <Heading size={100}>{strings.keyLabel}</Heading>
        <TextInput
          width="150px"
          value={secretKey}
          onChange={(event) => setSecretKey(event.target.value)}
        />
        <Checkbox
          marginLeft="6px"
          label={strings.unknownKey}
          checked={isUnknownKey}
          onChange={(event) => setIsUnknownKey(event.target.checked)}
        />
      </Pane>
      {isUnknownKey && (
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
