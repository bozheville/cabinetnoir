import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import {
  DuplicateIcon,
  IconButton,
} from 'evergreen-ui';

import { TextArea } from '@molecues';
import styled from 'styled-components';

interface EncryptionInputsProps {
  onChange: (value: string) => void;
  output: string;
}


const EncryptionInputsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${({theme}) => theme.breakpoints.small} {
    flex-direction: column;

    textarea {
      border-radius: 0;
    }
  }
`;

const EncryptionInputs: React.FC<EncryptionInputsProps> = ({
  onChange,
  output,
}) => {
  const [isInitialized, setIsInitialized] = useState(null);
  const [input, setInput] = useState('');
  const router = useRouter();

  const { action } = router.query;
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isInitialized) {
      onChange(outputRef?.current?.value);
      setInput(outputRef?.current?.value);
    }

    setIsInitialized(true);
  }, [action, isInitialized]);

  const handleCopy = () => {
    outputRef?.current?.select();
    document.execCommand('copy');
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    onChange(event.target.value);
  }

  return (
    <EncryptionInputsWrapper>
      <TextArea
        value={input}
        onChange={handleInputChange}
      />
      <TextArea
        value={output}
        readOnly={true}
        ref={outputRef}
      />
      <IconButton
        icon={DuplicateIcon}
        appearance="minimal"
        position="absolute"
        bottom="8px"
        right="8px"
        zIndex={10}
        onClick={handleCopy}
      />
    </EncryptionInputsWrapper>
  );
};

EncryptionInputs.displayName = 'EncryptionInputs';

export default EncryptionInputs;
