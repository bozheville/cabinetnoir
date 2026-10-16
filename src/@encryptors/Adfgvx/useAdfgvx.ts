import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CrypterProps } from '../types';
import { adfgvxDecrypt, adfgvxEncrypt, AdfgvxVariant } from './adfgvx-encryption';

export const DEFAULT_VARIANT: AdfgvxVariant = 'adfgvx';

export interface UseAdfgvxProps {
  input: string;
  onProcessingEnd: (props: { output: string }) => void;
  isDecryptMode: boolean;
}

export const useAdfgvx = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}: UseAdfgvxProps) => {
  const [squareKey, setSquareKey] = useState('');
  const [transpositionKey, setTranspositionKey] = useState('');
  const [variant, setVariant] = useState<AdfgvxVariant>(DEFAULT_VARIANT);

  useEffect(() => {
    const output = isDecryptMode
      ? adfgvxDecrypt(input, squareKey, transpositionKey, variant)
      : adfgvxEncrypt(input, squareKey, transpositionKey, variant);

    onProcessingEnd({ output });
  }, [input, squareKey, transpositionKey, variant, isDecryptMode]);

  return {
    squareKey,
    setSquareKey,
    transpositionKey,
    setTranspositionKey,
    variant,
    setVariant,
  };
};
