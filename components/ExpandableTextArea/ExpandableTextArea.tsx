import React, { forwardRef, MutableRefObject, TextareaHTMLAttributes, useEffect } from 'react';
import { Textarea, TextareaProps } from 'evergreen-ui';

const ExpandableTextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref: MutableRefObject<HTMLTextAreaElement>) => {
    useEffect(() => {
      const { current } = ref;
      if (current?.style) {
        current.style.height = "0";
        current.style.height = `${current.scrollHeight}px`;
      }
    }, [ref?.current?.value]);

    return (
      <>
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
      </>
    );
  }
);

ExpandableTextArea.defaultProps = {
  resize: 'none',
  padding: '0',
  fontSize: '24px',
  lineHeight: '36px',
  maxHeight: '250px',
};

ExpandableTextArea.displayName = 'ExpandableTextArea';

export default ExpandableTextArea;
