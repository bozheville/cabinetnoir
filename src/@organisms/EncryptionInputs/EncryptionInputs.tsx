import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import {
  DuplicateIcon,
  IconButton,
  Pane,
} from 'evergreen-ui';

import { TextArea } from '@molecues';
import styled, { keyframes } from 'styled-components';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff, clearKeyHandoff } from '@learning/keyHandoff';
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

interface EncryptionInputsProps {
  onChange: (value: string) => void;
  output: string;
  // The lifted input value: panes that edit the input themselves
  // (pigpen's glyph keyboard) change it outside this component, so the
  // textarea follows the lifted value when it drifts from the local one.
  input?: string;
}

const EncryptionInputs: React.FC<EncryptionInputsProps> = ({
  onChange,
  output,
  input: liftedInput,
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
      // The Cryptoanalysis tab's "use this key" flags its navigation so
      // the ciphertext travels in the in-memory hand-off instead of being
      // replaced by the stale output of the previous mode.
      if (router.query.usedKey === '1') {
        const handoff = getKeyHandoff();
        if (handoff) {
          onChange(handoff.input);
          setInput(handoff.input);
          clearKeyHandoff();
        }
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

  // Follow the lifted input when it was changed outside this component
  // (glyph keyboard clicks).
  useEffect(() => {
    if (liftedInput !== undefined && liftedInput !== input) {
      setInput(liftedInput);
    }
  }, [liftedInput]);

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
      <Pane data-guide="message-input" display="contents">
        <TextArea
          value={input}
          onChange={handleInputChange}
        />
      </Pane>
      <Pane data-guide="output" display="contents">
        <TextArea
          value={output}
          readOnly={true}
          ref={outputRef}
        />
      </Pane>
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
