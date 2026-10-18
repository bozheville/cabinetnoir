import React, { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import {
  DuplicateIcon,
  IconButton,
  Pane,
} from 'evergreen-ui';

import { TextArea } from '@molecues';
import GlyphRenderer from '@molecues/GlyphRenderer';
import styled, { keyframes } from 'styled-components';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff, clearKeyHandoff } from '@learning/keyHandoff';
import { DEFAULT_PIGPEN_VARIANT } from '@encryptors/Pigpen/variants';
interface EncryptionInputsProps {
  onChange: (value: string) => void;
  output: string;
}

const EncryptionInputsWrapper = styled.div<{ $evenColumns?: boolean }>`
  display: flex;
  flex-direction: row;
  /* Pigpen's result side is a div (the glyph strip), whose flex basis
     differs from the textarea's intrinsic one — zero both bases so the
     two sides split evenly like they do for every textarea cipher.
     In the stacked small-screen layout flex-basis would mean height,
     so there it goes back to auto. */
  ${({ $evenColumns }) => $evenColumns && `
    textarea {
      flex-basis: 0;
      min-width: 0;
    }
  `}
  ${({ theme, $evenColumns }) => $evenColumns && `
    ${theme.breakpoints.small} {
      textarea {
        flex-basis: auto;
      }
    }
  `}
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

// Pigpen's result is graphics: in encrypt mode the right side renders
// the live glyph strip in place of the result textarea, styled like it
// (the tool's layout follows the translate pattern: left in, right out).
const GlyphOutput = styled.div`
  flex: 1 1 0;
  min-width: 0;
  padding: 16px;
  max-height: 350px;
  overflow-y: auto;
  background-color: #f2f2f2;
  color: ${({ theme }) => theme.colors.text};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.default}px;

  /* Stacked layout: flex-basis would mean height here — back to auto
     so the strip sizes to its content like the textareas do. */
  ${({ theme }) => theme.breakpoints.small} {
    flex-basis: auto;
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.default}px;
  }
`;

interface EncryptionInputsProps {
  onChange: (value: string) => void;
  output: string;
  // The lifted input value: panes that edit the input themselves
  // (pigpen's glyph keyboard) change it outside this component, so the
  // textarea follows the lifted value when it drifts from the local one.
  input?: string;
  // Pigpen: the pane's selected glyph variant; the result side renders
  // the glyph strip instead of the result textarea.
  glyphVariant?: string | null;
}

const EncryptionInputs: React.FC<EncryptionInputsProps> = ({
  onChange,
  output,
  input: liftedInput,
  glyphVariant: glyphVariantProp,
}) => {
  const [isInitialized, setIsInitialized] = useState(null);
  const [input, setInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const { algorithm, action } = router.query;
  const isPigpenEncrypt = algorithm === 'pigpen' && action !== 'reverse';
  const glyphVariant = glyphVariantProp || DEFAULT_PIGPEN_VARIANT;
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
        // Modes swap seeds the input from the previous output — except
        // when the output side is not a textarea (pigpen's glyph strip):
        // there the current input already is the letter sequence both
        // modes understand, so it simply carries over.
        const carried = outputRef?.current?.value ?? input ?? '';
        onChange(carried);
        setInput(carried);
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
    if (outputRef?.current) {
      outputRef?.current?.select();
      document.execCommand('copy');
    } else if (output && navigator.clipboard) {
      // The glyph output has no textarea to select: copy the text
      // fallback (the letter-to-glyph mapping legend).
      navigator.clipboard.writeText(output);
    }

    clearTimeout(copiedTimeoutRef.current);
    setIsCopied(true);
    copiedTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    onChange(event.target.value);
  }

  return (
    <EncryptionInputsWrapper $evenColumns={isPigpenEncrypt}>
      <Pane data-guide="message-input" display="contents">
        <TextArea
          value={input}
          onChange={handleInputChange}
        />
      </Pane>
      <Pane data-guide="output" display="contents">
        {isPigpenEncrypt ? (
          <GlyphOutput>
            <GlyphRenderer text={input} variant={glyphVariant} size={30} />
          </GlyphOutput>
        ) : (
          <TextArea
            value={output}
            readOnly={true}
            ref={outputRef}
          />
        )}
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
