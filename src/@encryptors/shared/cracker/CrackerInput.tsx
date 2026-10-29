import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Caption } from '@typography';
import TextArea from '@molecues/TextArea';

// Shared ciphertext input for every Cryptoanalysis tab: one labeled
// textarea, owned by the template, fed into the cipher's cracker.
interface CrackerInputProps {
  value: string;
  onChange: (value: string) => void;
}

const InputWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.paper.rule};
  padding: 0 16px 16px;
`;

const InputLabel = styled(Caption)`
  display: block;
  padding: 8px 0;
  color: ${({ theme }) => theme.metal.brass.light};
`;

const CrackerInput: React.FC<CrackerInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation('common');

  return (
    <InputWrapper>
      <InputLabel>{t('processing.cracker.inputLabel')}</InputLabel>
      <TextArea
        data-guide="cracker-input"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
      />
    </InputWrapper>
  );
};

CrackerInput.displayName = 'CrackerInput';

export default CrackerInput;
