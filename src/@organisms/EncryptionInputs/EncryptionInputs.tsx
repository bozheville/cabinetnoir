import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import {
  DuplicateIcon,
  IconButton,
} from 'evergreen-ui';

import { TextArea } from '@molecues';
import styled, { keyframes } from 'styled-components';
import { usePendingExample } from '@learning/pendingExample';
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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const CopiedToast = styled.div`
  position: absolute;
  bottom: 8px;
  right: 48px;
  z-index: 10;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.default}px;
  background-color: ${({ theme }) => theme.colorScheme.blue_green[700]};
  color: ${({ theme }) => theme.colorScheme.white};
  font-size: 12px;
  pointer-events: none;
  animation: ${fadeIn} 150ms ease-out;
`;

const EncryptionInputs: React.FC<EncryptionInputsProps> = ({
  onChange,
  output,
}) => {
  const [isInitialized, setIsInitialized] = useState(null);
  const [input, setInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const { action } = router.query;
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (isInitialized) {
      // The Vigenere cracker flags its "use this key" navigation so the
      // original text stays in the input instead of being replaced by the
      // stale output of the previous mode.
      if (router.query.usedKey === '1') {
        const { usedKey, ...restQuery } = router.query;
        router.replace({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true });
      } else {
        onChange(outputRef?.current?.value);
        setInput(outputRef?.current?.value);
      }
    }

    setIsInitialized(true);
  }, [action, isInitialized]);

  useEffect(() => () => clearTimeout(copiedTimeoutRef.current), []);

  // "Try it in the tool": pre-fill the input from the loaded example. The
  // context is only non-null when the example targets the current cipher.
  const pendingExample = usePendingExample();
  useEffect(() => {
    if (!pendingExample) {
      return;
    }
    setInput(pendingExample.input);
    onChange(pendingExample.input);
  }, [pendingExample]);

  const handleCopy = () => {
    outputRef?.current?.select();
    document.execCommand('copy');

    clearTimeout(copiedTimeoutRef.current);
    setIsCopied(true);
    copiedTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
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
      {isCopied && <CopiedToast>Copied to clipboard</CopiedToast>}
      {output && (
        <IconButton
          icon={DuplicateIcon}
          appearance="minimal"
          position="absolute"
          bottom="8px"
          right="8px"
          zIndex={10}
          onClick={handleCopy}
        />
      )}
    </EncryptionInputsWrapper>
  );
};

EncryptionInputs.displayName = 'EncryptionInputs';

export default EncryptionInputs;
