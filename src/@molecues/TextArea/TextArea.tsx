import React, {forwardRef, useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';

const useCombinedRef = (...refs) => {
  return useCallback(current => {
    for (const ref of refs) {
      if (ref == null) continue;
      if (typeof ref === 'function') {
        ref(current);
      } else {
        ref.current = current;
      }
    }
  }, refs);
}

const StyledTextArea = styled.textarea`
  resize: none;
  flex-grow: 1;
  padding: 16px 16px 32px 16px;
  border: 0;
  font-size: 24px;
  line-height: 36px;
  max-height: 350px;
  color: ${({ theme }) => theme.colors.text};
  font-family: Helvetica, Arial, Sans-Serif;
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.default}px;

  &[readonly] {
    background-color: #f2f2f2;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.default}px;

    ${({ theme }) => theme.breakpoints.small} {
      border-bottom-left-radius: ${({ theme }) => theme.borderRadius.default}px;
      border-bottom-right-radius: ${({ theme }) => theme.borderRadius.default}px;
    }
  }

  &:focus {
    border: 0;
    outline: 0;
  }
`;

const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((
  props,
  forwardedRef
) => {
  const localref = useRef<HTMLTextAreaElement>(null);
  const ref = useCombinedRef(localref, forwardedRef);

  useEffect(() => {
    if (localref?.current?.style) {
      localref.current.style.height = "0";
      localref.current.style.height = `${localref.current.scrollHeight + 48}px`;
    }
  }, [localref?.current?.value]);

  return (
    <StyledTextArea {...props} ref={ref} />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
