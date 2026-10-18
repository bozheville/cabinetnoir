import { useEffect, useState } from 'react';

import { pigpenDecode, pigpenEncode, pigpenLegend } from './pigpen-crypt';
import { DEFAULT_PIGPEN_VARIANT } from './variants';

export const usePigpen = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  onInputChange,
  onVariantChange,
}) => {
  const [variantId, setVariantId] = useState(DEFAULT_PIGPEN_VARIANT);

  // Report the selection upward: the output side renders the glyph
  // strip for the chosen variant.
  useEffect(() => {
    onVariantChange?.(variantId);
  }, [variantId, onVariantChange]);

  useEffect(() => {
    // The ciphertext is graphics, so the string output channel carries
    // the copy-as-text legend in encrypt mode. In decrypt mode the input
    // is a sequence of glyph ids (letters standing for the clicked
    // glyphs); decoding them spells the message.
    const output = !input
      ? ''
      : isDecryptMode
        ? pigpenDecode(pigpenEncode(input, variantId), variantId)
        : pigpenLegend(variantId);

    onProcessingEnd({ output });
  }, [input, isDecryptMode, variantId]);

  const handleVariantChange = (event) => setVariantId(event.target.value);

  const appendLetter = (letter: string) => {
    onInputChange?.(`${input}${letter}`);
  };

  const deleteLast = () => {
    onInputChange?.(input.slice(0, -1));
  };

  const clearInput = () => {
    onInputChange?.('');
  };

  return {
    variantId,
    handleVariantChange,
    appendLetter,
    deleteLast,
    clearInput,
  };
};
