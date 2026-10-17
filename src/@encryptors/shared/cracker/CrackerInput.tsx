import React from 'react';
import { useTranslation } from 'next-i18next';
import { Heading, Pane } from 'evergreen-ui';
import styled from 'styled-components';

import TextArea from '@molecues/TextArea';

// Shared ciphertext input for every Cryptoanalysis tab: one labeled
// textarea, owned by the template, fed into the cipher's cracker.
interface CrackerInputProps {
  value: string;
  onChange: (value: string) => void;
}

const InputWrapper = styled(Pane)`
  border-bottom: 1px solid #999;
  padding: 0 16px 16px;
`;

const CrackerInput: React.FC<CrackerInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation('common');

  return (
    <InputWrapper>
      <Heading size={100} paddingY="8px">{t('processing.cracker.inputLabel')}</Heading>
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
