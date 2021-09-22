import React from 'react';
import { Checkbox, Pane, Select } from 'evergreen-ui';

import { alphabetCollection } from '../constants';
import { CrypterProps } from '../types';
import { useAtbash } from './useAtbash';

const Atbash: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {
    keepCase,
    keepSpaces,
    alphabetKey,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleAphabetKeyChange,
  } = useAtbash({
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
      <Select onChange={handleAphabetKeyChange}>
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

Atbash.displayName = 'Atbash';

export default Atbash;
