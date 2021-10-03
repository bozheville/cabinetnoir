import React from 'react';
import { Checkbox, Pane, Select } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { alphabetCollection } from '../constants';
import useCaesar from './useCaesar';
import RotationPicker from './RotationPicker';

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
    alphabetKey,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleAphabetKey,
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
      <Select onChange={handleAphabetKey}>
        {alphabetCollection.map((item) => (
          <option
            selected={alphabetKey === item.type}
            value={item.type}
            key={item.type}
          >
            {item.value}
          </option>
        ))}
      </Select>
    </Pane>
  );
};

Caesar.displayName = 'Caesar';

export default Caesar;
