import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pane, Select } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';

import {
  Caesar,
  Morse,
  Playfair,
  Vigenere,
  encryptorsList,
} from '@encryptors';

interface EncryptionSettingsProps {
  input: string;
  onOutputUpdate: (props: {output: string, actionType: string}) => void;
}

const EncryptionSettings: React.FC<EncryptionSettingsProps> = ({
  input,
  onOutputUpdate,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { algorythm, action } = router.query;

  const isDecryptMode = action === 'reverse';

  useEffect(() => {
    if (!encryptorsList.includes(algorythm as string)) {
      router.push(`/`, undefined, { shallow: true });
    }
  }, [algorythm]);

  const handleChangeAlgorythm = (event) => {
    router.push(
      `/encoder/${event.target.value}/${action}`,
      undefined,
      {
        shallow: true
      }
    );
  };

  const EncryptionComponent =
    algorythm === 'caesar' ? Caesar :
    algorythm === 'playfair' ? Playfair :
    algorythm === 'vigenere' ? Vigenere :
    algorythm === 'morse' ? Morse :
    null;


  return (
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <EncryptionComponent
        input={input}
        onProcessingEnd={onOutputUpdate}
        isDecryptMode={isDecryptMode}
      />
      <Pane maxWidth="200px">
        <Select
          onChange={handleChangeAlgorythm}
          defaultValue={algorythm}
        >
          {encryptorsList.map((item) => (
            <option key={`anlorythm-${item}`} value={item}>
              {t(`processing.${item}.title`)}
            </option>
          ))}
        </Select>
      </Pane>
    </Pane>
  );
};

EncryptionSettings.displayName = 'EncryptionSettings';

export default EncryptionSettings;
