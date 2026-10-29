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
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: 0;
  font-size: 20px;
  line-height: 32px;
  max-height: 350px;
  color: ${({ theme }) => theme.ink.primary};
  // Paper sheet: vellum for the input side, parchment for readonly
  // output. Monospace so cipher text keeps its column and cluster
  // alignment (the Saknussemm clusters, polybius coordinates, …) —
  // one shared TextArea molecule, every tool benefits.
  font-family: ${({ theme }) => theme.type.mono};
  background-color: ${({ theme }) => theme.paper.vellum};
  background-image: repeating-linear-gradient(
    180deg,
    transparent,
    transparent 31px,
    ${({ theme }) => theme.paper.rule}22 31px,
    ${({ theme }) => theme.paper.rule}22 32px
  );
  background-origin: content-box;

  &[readonly] {
    background-color: ${({ theme }) => theme.paper.parchment};
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.paper.rule};
    outline: 2px solid ${({ theme }) => theme.metal.copper.light};
    outline-offset: -2px;
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
