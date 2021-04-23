import React, { ChangeEvent, ChangeEventHandler, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import {
  DuplicateIcon,
  IconButton,
  Pane,
  SwapHorizontalIcon,
} from 'evergreen-ui';

import { TextAreaField } from '@molecues';

interface EncryptionInputsProps {
  onChange: (value: string) => void;
  output: string;
}

const EncryptionInputs: React.FC<EncryptionInputsProps> = ({
  onChange,
  output,
}) => {
  const [input, setInput] = useState('');
  const router = useRouter();
  const { t } = useTranslation('common');

  const { algorythm, action } = router.query;
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const isDecryptMode = action === 'reverse';

  const handleSwapMode = () => {
    onChange(outputRef?.current?.value);
    setInput(outputRef?.current?.value);
    router.push(
      `/encoder/${algorythm}/${isDecryptMode ? 'direct' : 'reverse'}`,
      undefined,
      {
        shallow: true
      }
    );
  };

  const handleCopy = () => {
    outputRef?.current?.select();
    document.execCommand('copy');
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    onChange(event.target.value);
  }

  return (
    <Pane
      display="flex"
      flexDirection="row"
      marginTop="24px"
    >
      <TextAreaField
        label={isDecryptMode ? t(`processing.${algorythm}.messageLabel`) : t(`message`)}
        value={input}
        onChange={handleInputChange}
      />
      <Pane width="1px" backgroundColor="#888" marginX="1em" />
      <TextAreaField
        label={isDecryptMode ? t(`message`) : t(`processing.${algorythm}.messageLabel`)}
        value={output}
        readOnly={true}
        ref={outputRef}
      />
      <IconButton
        icon={SwapHorizontalIcon}
        position="absolute"
        bottom="36px"
        left="50%"
        transform="translateX(-50%)"
        zIndex={10}
        onClick={handleSwapMode}
      />
      <IconButton
        icon={DuplicateIcon}
        position="absolute"
        bottom="8px"
        right="8px"
        zIndex={10}
        onClick={handleCopy}
      />
    </Pane>
  );
};

EncryptionInputs.displayName = 'EncryptionInputs';

export default EncryptionInputs;
