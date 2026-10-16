import React from 'react';
import { useTranslation } from 'next-i18next';
import { CrypterProps } from '../types';
import useEnigma from './useEnigma';
import TextInput from '@atoms/TextInput';
import Tooltip from '@atoms/Tooltip';

const Enigma: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const {
    secretKey,
    handleKeyChange,
  } = useEnigma({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <div>
      <div>
        <span>{t('processing.enigma.keyLabel')}</span>
        <Tooltip content={t('learning.tooltips.enigma.key')}>
          <TextInput
            data-guide="key"
            width="100px"
            value={secretKey}
            onChange={handleKeyChange}
          />
        </Tooltip>
      </div>
      <div>{t('processing.enigma.rotors')}</div>
      <div>{t('processing.enigma.reflector')}</div>
    </div>
  );
};

Enigma.displayName = 'Enigma';

export default Enigma;
