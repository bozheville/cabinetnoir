import React, { forwardRef, MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { Label, Pane, Textarea, TextareaProps } from 'evergreen-ui';

interface TextAreaFieldProps extends TextareaProps {
  label: string;
}

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

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    { label, ...props },
    forwardedRef: MutableRefObject<HTMLTextAreaElement>
  ) => {
    const localref = useRef<HTMLTextAreaElement>(null);
    const ref = useCombinedRef(localref, forwardedRef) as unknown as MutableRefObject<HTMLTextAreaElement>;

    useEffect(() => {
      if (localref?.current?.style) {
        localref.current.style.height = "0";
        localref.current.style.height = `${localref.current.scrollHeight}px`;
      }
    }, [localref?.current?.value]);

    return (
      <Pane
        display="flex"
        flexDirection="column"
        flexGrow={1}
      >
        <Label>{label}</Label>
        <Textarea
          {...props}
          className="expandable-text-area"
          ref={ref}
        />
        <style jsx global>{`
          .expandable-text-area {
            box-shadow: none!important;
          }
        `}</style>
      </Pane>
    );
  }
);

TextAreaField.defaultProps = {
  resize: 'none',
  padding: '0',
  fontSize: '24px',
  lineHeight: '36px',
  maxHeight: '250px',
};

TextAreaField.displayName = 'TextAreaField';

export default TextAreaField;
