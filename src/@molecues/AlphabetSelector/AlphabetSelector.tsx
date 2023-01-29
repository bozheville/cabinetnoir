import React from 'react';
import styled from 'styled-components';
import { Select } from 'evergreen-ui';

import { useAlphabetSelector } from './useAlphabetSelector';
import { AlphabetInput } from './AlphabetInput';

const AlphabetSelectorWrapper = styled.div``;

interface AlphabetSelectorProps {
  onChange?: (value: string) => void;
}

const AlphabetSelector: React.FC<AlphabetSelectorProps> = ({
  onChange,
}) => {
  const {
    alphabetKey,
    handleAphabetKeyChange,
    handleChange,
    value,
    options,
    t,
  } = useAlphabetSelector(onChange);

  return (
    <AlphabetSelectorWrapper>
      <Select onChange={handleAphabetKeyChange}>
        {options.map((item) => (
          <option
            key={item.type}
            value={item.type}
            selected={item.type === alphabetKey}
            disabled={item.type === 'custom'}
          >
            {`${t(`alphabet.${item.type}`)}`}
          </option>
        ))}
      </Select>
      <AlphabetInput value={value} onChange={handleChange} />
    </AlphabetSelectorWrapper>
  );
};

AlphabetSelector.displayName = 'AlphabetSelector';

export default AlphabetSelector;
