import React from 'react';
import { Checkbox, Pane } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import { CrypterProps } from '../types';
import useAffine from './useAffine';
import { NumberInput } from '@atoms';
import Tooltip from '@atoms/Tooltip';

const Affine: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const {
    secretKey,
    keepCase,
    keepSpaces,
    multiplier,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleMultiplierChange,
  } = useAffine({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <Pane
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width="100%"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Tooltip content={t('learning.tooltips.affine.multiplier')}>
        <NumberInput
          data-guide="multiplier"
          value={multiplier}
          onChange={handleMultiplierChange}
        />
      </Tooltip>
      <Tooltip content={t('learning.tooltips.affine.shift')}>
        <NumberInput
          data-guide="shift"
          value={secretKey}
          onChange={handleKeyChange}
        />
      </Tooltip>
      {!isDecryptMode && (
        <>
          <Checkbox
            marginLeft="6px"
            label="Keep spaces"
            checked={keepSpaces}
            onChange={handleKeepSpacesChange}
          />
          <Checkbox
            marginLeft="6px"
            label="Keep case"
            checked={keepCase}
            onChange={handleKeepCaseChange}
          />
        </>
      )}
    </Pane>
  );
};

Affine.displayName = 'Affine';

export default Affine;
