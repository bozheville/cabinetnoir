import { useEffect, useMemo, useState } from 'react';

import {
  SAKNUSSEMM_DEFAULTS,
  saknussemmTransform,
} from './saknussemm-crypt';

export interface SaknussemmShapeState {
  clusterWidth: number;
  clustersPerLine: number;
}

// "Try it in the tool" / identify hand-off key: "width/perLine".
export const parseHandoffKey = (key: string): SaknussemmShapeState | null => {
  const match = key.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    clusterWidth: Number(match[1]),
    clustersPerLine: Number(match[2]),
  };
};

export const useSaknussemm = ({ input, onProcessingEnd, isDecryptMode }) => {
  const [shape, setShape] = useState<SaknussemmShapeState>(SAKNUSSEMM_DEFAULTS);

  // The engine needs the raw ciphertext: whitespace is the cluster
  // delimiter on the way in, so the text is never pre-cleaned here.
  const output = useMemo(
    () => saknussemmTransform(input, isDecryptMode, shape),
    [input, shape, isDecryptMode],
  );

  useEffect(() => {
    onProcessingEnd({ output });
  }, [output]);

  return {
    shape,
    setShape,
    applyHandoffKey: (key: string) => {
      const parsed = parseHandoffKey(key);
      if (parsed) {
        setShape(parsed);
      }
    },
  };
};
