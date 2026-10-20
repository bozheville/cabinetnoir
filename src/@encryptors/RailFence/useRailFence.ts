import { useEffect, useMemo, useState } from 'react';

import { railFenceTransform } from '../shared/transposition';

export interface RailFenceKeyState {
  rails: number;
  offset: number;
}

export const parseHandoffKey = (key: string): RailFenceKeyState | null => {
  const match = key.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) {
    return null;
  }
  const rails = Number(match[1]);
  const offset = Number(match[2]);
  if (rails < 2 || rails > 10 || offset < 0 || offset >= rails) {
    return null;
  }
  return { rails, offset };
};

const cleanText = (text: string, keepSpaces: boolean): string => {
  const upper = text.toUpperCase();
  return keepSpaces
    ? upper.replace(/[^A-Z ]/g, '').replace(/ +/g, ' ').trim()
    : upper.replace(/[^A-Z]/g, '');
};

export const useRailFence = ({ input, onProcessingEnd, isDecryptMode }) => {
  const [rails, setRails] = useState(3);
  const [offset, setOffset] = useState(0);
  const [keepSpaces, setKeepSpaces] = useState(false);

  const output = useMemo(
    () => railFenceTransform(cleanText(input, keepSpaces), rails, isDecryptMode, { offset }),
    [input, rails, offset, keepSpaces, isDecryptMode],
  );

  useEffect(() => {
    onProcessingEnd({ output });
  }, [output]);

  const handleRailsChange = (value: number) => {
    setRails(value);
    setOffset((current) => Math.min(current, value - 1));
  };

  return {
    rails,
    offset,
    keepSpaces,
    handleRailsChange,
    handleOffsetChange: setOffset,
    handleKeepSpacesChange: (event) => setKeepSpaces(event.target.checked),
    applyHandoffKey: (key: string) => {
      const parsed = parseHandoffKey(key);
      if (parsed) {
        setRails(parsed.rails);
        setOffset(parsed.offset);
      }
    },
  };
};
