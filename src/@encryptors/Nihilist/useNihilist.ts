import { useEffect, useMemo, useState } from 'react';

import {
  nihilistDecrypt,
  nihilistEncrypt,
  nihilistKeyNumbers,
} from './nihilist-crypt';
import { buildSquare } from '@encryptors/shared/polybius';

// The Nihilist tool's state: the square keyword, the additive key word,
// the spaced output toggle, and (from the cracker hand-off) a full
// 25-letter square that overrides the keyword.
export const useNihilist = ({ input, onProcessingEnd, isDecryptMode }) => {
  const [squareKey, setSquareKey] = useState('');
  const [key, setKey] = useState('');
  const [spaced, setSpaced] = useState(true);
  const [customSquare, setCustomSquare] = useState<string | null>(null);

  const square = useMemo(
    () => (customSquare && customSquare.length === 25
      ? customSquare
      : buildSquare(squareKey, { size: 5 })),
    [squareKey, customSquare],
  );

  const output = useMemo(
    () => (isDecryptMode
      ? nihilistDecrypt({ input, squareKey, key })
      : nihilistEncrypt({ input, squareKey, key, spaced })),
    [input, squareKey, key, spaced, isDecryptMode],
  );

  useEffect(() => {
    onProcessingEnd({ output });
  }, [output]);

  // The addition table: plain number + key number = cipher number for
  // the first letters of the text (encrypt side only — it teaches the
  // addition).
  const additionRows = useMemo(() => {
    if (isDecryptMode) {
      return [];
    }
    const plainNumbers = nihilistEncrypt({
      input, squareKey, key, spaced: true,
    }).split(' ').filter(Boolean);
    const letters = input.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '').split('');
    const keyNumbers = nihilistKeyNumbers(key, squareKey);
    if (keyNumbers.length === 0) {
      return [];
    }
    return letters
      .slice(0, Math.min(letters.length, 8))
      .map((letter, index) => ({
        letter,
        plain: Number(plainNumbers[index]) || 0,
        key: keyNumbers[index % keyNumbers.length],
        sum: Number(plainNumbers[index]) || 0,
      }));
  }, [input, key, squareKey, isDecryptMode]);

  return {
    squareKey,
    key,
    spaced,
    square,
    additionRows,
    handleSquareKeyChange: (event) => {
      setSquareKey(event.target.value);
      setCustomSquare(null);
    },
    handleKeyChange: (event) => setKey(event.target.value),
    handleSpacedChange: (event) => setSpaced(event.target.checked),
    applyHandoffKey: (keyValue: string) => {
      // Square key first, additive key second. A single token is the
      // additive key (the common case: an empty square key travels as
      // no token at all).
      const tokens = keyValue.trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 1) {
        const cleaned = tokens[0].toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 25 && new Set(cleaned).size === 25) {
          setCustomSquare(cleaned);
        } else {
          setKey(tokens[0]);
        }
        return;
      }
      const [squarePart = '', keyPart = ''] = tokens;
      const cleaned = squarePart.toUpperCase().replace(/[^A-Z]/g, '');
      if (cleaned.length === 25 && new Set(cleaned).size === 25) {
        setCustomSquare(cleaned);
      } else if (squarePart) {
        setSquareKey(squarePart);
      }
      if (keyPart) {
        setKey(keyPart);
      }
    },
  };
};
