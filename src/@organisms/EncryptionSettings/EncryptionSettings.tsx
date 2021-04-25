import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pane, Select,
  IconButton,
  SwapHorizontalIcon,
} from 'evergreen-ui';
import { useTranslation } from 'next-i18next';

import {
  Caesar,
  Morse,
  Playfair,
  Vigenere,
  encryptorsList,
  Base64,
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


  const handleSwapMode = () => {
    router.push(
      `/encoder/${algorythm}/${isDecryptMode ? 'direct' : 'reverse'}`,
      undefined,
      {
        shallow: true
      }
    );
  };

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
    algorythm === 'base64' ? Base64 :
    algorythm === 'caesar' ? Caesar :
    algorythm === 'playfair' ? Playfair :
    algorythm === 'vigenere' ? Vigenere :
    algorythm === 'morse' ? Morse :
    null;

  return (
    <Pane
      borderBottom="1px solid #999"
    >
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        padding="16px"
        alignItems="center"
      >
        <Pane
          width="100%"
          order={isDecryptMode ? 3 : 1}
          textAlign={isDecryptMode ? 'right' : 'left'}

        >
          {t('message')}
        </Pane>
        <IconButton
          icon={SwapHorizontalIcon}
          onClick={handleSwapMode}
          appearance="minimal"
          padding="9px"
          order={2}
        />
        <Pane
          display="flex"
          flexDirection="row"
          width="100%"
          order={isDecryptMode ? 1 : 3}
          justifyContent={isDecryptMode ? 'start': 'end'}
        >
          <Select
            maxWidth="200px"
            onChange={handleChangeAlgorythm}
            defaultValue={algorythm}
            order={isDecryptMode ? 1 : 2}
            display="flex"
          >
            {encryptorsList.map((item) => (
              <option key={`anlorythm-${item}`} value={item}>
                {t(`processing.${item}.title`)}
              </option>
            ))}
          </Select>
        </Pane>
      </Pane>
      <Pane
        display="flex"
        flexDirection="row"
        paddingX="16px"
        paddingBottom="16px"
      >
        <EncryptionComponent
          input={input}
          onProcessingEnd={onOutputUpdate}
          isDecryptMode={isDecryptMode}
        />
      </Pane>
    </Pane>
  );
};

EncryptionSettings.displayName = 'EncryptionSettings';

export default EncryptionSettings;
