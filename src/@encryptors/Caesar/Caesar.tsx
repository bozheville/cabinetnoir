import React from 'react';
import { Checkbox, Pane } from 'evergreen-ui';
import { CrypterProps } from '../types';
import useCaesar from './useCaesar';
import RotationPicker from './RotationPicker';

const Caesar: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {
    secretKey,
    keepCase,
    keepSpaces,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
  } = useCaesar({
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
      <RotationPicker
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

Caesar.displayName = 'Caesar';

export default Caesar;
