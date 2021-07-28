import React from 'react';
import { Checkbox, Pane } from 'evergreen-ui';
import { CrypterProps } from '../types';
import useAffine from './useAffine';
import { NumberInput } from '@atoms';

const Affine: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
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
      <NumberInput
        value={multiplier}
        onChange={handleMultiplierChange}
      />
      <NumberInput
        value={secretKey}
        onChange={handleKeyChange}
      />
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
