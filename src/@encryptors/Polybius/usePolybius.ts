import { useEffect, useMemo, useState } from 'react';

import {
  polybiusDecrypt,
  polybiusEncrypt,
  resolveSquare,
  polybiusHighlightLetter,
} from './polybius-crypt';

// The Polybius tool's state: the square keyword, the space-separated
// output toggle, and (from the cracker hand-off) a full 25-letter square
// that overrides the keyword.
export const usePolybius = ({ input, onProcessingEnd, isDecryptMode }) => {
  const [keyword, setKeyword] = useState('');
  const [spaced, setSpaced] = useState(true);
  const [customSquare, setCustomSquare] = useState<string | null>(null);

  const square = useMemo(
    () => resolveSquare({ keyword, square: customSquare ?? undefined }),
    [keyword, customSquare],
  );

  const output = useMemo(
    () => (isDecryptMode
      ? polybiusDecrypt({ input, keyword, square: customSquare ?? undefined })
      : polybiusEncrypt({ input, keyword, square: customSquare ?? undefined, spaced })),
    [input, keyword, customSquare, spaced, isDecryptMode],
  );

  useEffect(() => {
    onProcessingEnd({ output });
  }, [output]);

  const highlightLetter = useMemo(
    () => polybiusHighlightLetter(input, isDecryptMode, {
      keyword,
      square: customSquare ?? undefined,
    }),
    [input, keyword, customSquare, isDecryptMode],
  );

  return {
    keyword,
    spaced,
    square,
    highlightLetter,
    handleKeywordChange: (event) => {
      setKeyword(event.target.value);
      // A typed keyword replaces the hand-off square.
      setCustomSquare(null);
    },
    handleSpacedChange: (event) => setSpaced(event.target.checked),
    applyHandoffKey: (key: string) => {
      const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
      if (cleaned.length === 25 && new Set(cleaned).size === 25) {
        setCustomSquare(cleaned);
      } else {
        setKeyword(key);
      }
    },
  };
};
