import React from 'react';
import { Checkbox, Pane, Select } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { alphabetCollection } from '../constants';
import useCaesar from './useCaesar';
import RotationPicker from './RotationPicker';
import AlphabetSelector from '@molecues/AlphabetSelector';

const Caesar: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {
    alphabetLength,
    secretKey,
    keepCase,
    keepSpaces,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleAlphabetChange,
  } = useCaesar({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <RotationPicker
          value={secretKey}
          onChange={handleKeyChange}
          max={alphabetLength}
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
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <AlphabetSelector onChange={handleAlphabetChange} />
      </Pane>
    </Pane>
  );
};

Caesar.displayName = 'Caesar';

export default Caesar;
