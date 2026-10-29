import React from 'react';
import styled from 'styled-components';
import { Select } from '@atoms';

import { useAlphabetSelector } from './useAlphabetSelector';
import { AlphabetInput } from './AlphabetInput';
import Tooltip from '@atoms/Tooltip';

const AlphabetSelectorWrapper = styled.div``;

// Tooltip wraps a single child; the inner container keeps the select and
// the custom input together under one [i] anchor.
const AlphabetSelectorInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

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
    <AlphabetSelectorWrapper data-guide="alphabet">
      <Tooltip content={t('learning.tooltips.alphabet')}>
        <AlphabetSelectorInner>
          <Select
            value={alphabetKey}
            onChange={handleAphabetKeyChange}
            options={options.map((item) => ({
              value: item.type,
              label: t(`alphabet.${item.type}`),
              disabled: item.type === 'custom',
            }))}
          />
          <AlphabetInput value={value} onChange={handleChange} />
        </AlphabetSelectorInner>
      </Tooltip>
    </AlphabetSelectorWrapper>
  );
};

AlphabetSelector.displayName = 'AlphabetSelector';

export default AlphabetSelector;
