import { useEffect, useMemo, useState } from 'react';

import {
  columnOrder,
  normalizeTranspositionKey,
  columnarEncrypt,
  columnarDecrypt,
  doubleColumnarEncrypt,
  doubleColumnarDecrypt,
} from '../shared/transposition';

export interface ColumnarKeyState {
  keyword: string;
  secondKeyword: string;
  double: boolean;
  irregular: boolean;
  // Direct numeric column order from the cracker's hand-off (overrides
  // the keyword when set).
  customOrder: number[] | null;
}

const cleanText = (text: string, keepSpaces: boolean): string => {
  const upper = text.toUpperCase();
  return keepSpaces
    ? upper.replace(/[^A-Z ]/g, '').replace(/ +/g, ' ').trim()
    : upper.replace(/[^A-Z]/g, '');
};

// The key as handed over by the cracker: either a keyword ("KRIEGS") or
// a numeric column order ("2,0,1"). The numeric form wins.
export const parseHandoffKey = (key: string): number[] | null => {
  const trimmed = key.trim();
  if (!/^[\d,\s]+$/.test(trimmed)) {
    return null;
  }
  const order = trimmed.split(/[,\s]+/).filter(Boolean).map(Number);
  return order.every(Number.isInteger) && order.length > 0 ? order : null;
};

export const useColumnar = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [keyword, setKeyword] = useState('');
  const [secondKeyword, setSecondKeyword] = useState('');
  const [double, setDouble] = useState(false);
  const [irregular, setIrregular] = useState(false);
  const [keepSpaces, setKeepSpaces] = useState(false);
  const [customOrder, setCustomOrder] = useState<number[] | null>(null);

  const { output, order } = useMemo(() => {
    const cleaned = cleanText(input, keepSpaces);
    const effectiveOrder = customOrder ?? columnOrder(normalizeTranspositionKey(keyword));
    if (!cleaned || effectiveOrder.length === 0) {
      return { output: '', order: effectiveOrder };
    }
    const second = normalizeTranspositionKey(secondKeyword);
    const options = { irregular };
    let result = '';
    if (isDecryptMode) {
      result = customOrder
        ? columnarDecrypt(cleaned, customOrder, options)
        : columnarDecryptTextSafe(cleaned, keyword, options);
      if (double && second) {
        // Decrypt undoes the second key first.
        result = customOrder
          ? columnarDecrypt(result, columnOrder(second), options)
          : columnarDecryptTextSafe(result, secondKeyword, options);
      }
    } else {
      result = customOrder
        ? columnarEncrypt(cleaned, customOrder, options)
        : columnarEncryptTextSafe(cleaned, keyword, options);
      if (double && second) {
        result = customOrder
          ? columnarEncrypt(result, columnOrder(second), options)
          : columnarEncryptTextSafe(result, secondKeyword, options);
      }
    }
    return { output: result, order: effectiveOrder };
  }, [input, keyword, secondKeyword, double, irregular, keepSpaces, isDecryptMode, customOrder]);

  useEffect(() => {
    onProcessingEnd({ output });
  }, [output]);

  const handleKeywordChange = (event) => {
    setCustomOrder(null);
    setKeyword(event.target.value);
  };
  const handleSecondKeywordChange = (event) => setSecondKeyword(event.target.value);
  const handleDoubleChange = (event) => setDouble(event.target.checked);
  const handleIrregularChange = (event) => setIrregular(event.target.checked);
  const handleKeepSpacesChange = (event) => setKeepSpaces(event.target.checked);

  return {
    keyword,
    secondKeyword,
    double,
    irregular,
    keepSpaces,
    order,
    handleKeywordChange,
    handleSecondKeywordChange,
    handleDoubleChange,
    handleIrregularChange,
    handleKeepSpacesChange,
    applyHandoffKey: (key: string) => {
      const order = parseHandoffKey(key);
      if (order) {
        setCustomOrder(order);
      } else {
        setKeyword(key);
      }
    },
  };
};

// Local helpers kept here so the hook never imports the wrapper module
// and the wrapper never imports this hook (no cycles).
const columnarEncryptTextSafe = (text: string, keyword: string, options) =>
  columnarEncrypt(text, columnOrder(normalizeTranspositionKey(keyword)), options);
const columnarDecryptTextSafe = (text: string, keyword: string, options) =>
  columnarDecrypt(text, columnOrder(normalizeTranspositionKey(keyword)), options);
