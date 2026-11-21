import { useEffect, useMemo, useState } from 'react';

import {
  deriveVicKeys,
  parseVicHandoff,
  randomKeygroup,
  VicError,
  vicDecrypt,
  vicEncryptDetailed,
  vicSplitKeygroup,
  type VicAlphabet,
  type VicKeys,
  type VicErrorCode,
} from './vic-crypt';

export interface UseVicProps {
  input: string;
  onProcessingEnd: (props: { output: string }) => void;
  isDecryptMode: boolean;
}

// The VIC tool's state: the four secrets (phrase, date, personal
// number, keygroup), the board alphabet, the bisection toggle with its
// agreed cut index, and the workings toggle. Nothing is persisted.
export const useVic = ({ input, onProcessingEnd, isDecryptMode }: UseVicProps) => {
  const [phrase, setPhrase] = useState('');
  const [date, setDate] = useState('');
  const [personalNumber, setPersonalNumber] = useState('');
  const [keygroup, setKeygroup] = useState('');
  const [alphabet, setAlphabet] = useState<VicAlphabet>('latin');
  const [bisect, setBisect] = useState(false);
  const [cutIndex, setCutIndex] = useState('10');
  const [showWorkings, setShowWorkings] = useState(false);

  const options = useMemo(
    () => ({
      alphabet,
      bisectAt: bisect ? Number(cutIndex) : undefined,
    }),
    [alphabet, bisect, cutIndex],
  );

  const result = useMemo(() => {
    const personalNumberValue = Number(personalNumber);
    const empty = !phrase && !date && !personalNumber && !keygroup && !input.trim();
    if (empty) {
      return { output: '', error: null as VicErrorCode | null, keys: null as VicKeys | null };
    }
    try {
      if (isDecryptMode) {
        // The keygroup rides inside the ciphertext — extract it, then
        // the worksheet renders for exactly the keys in play.
        const { keygroup: extracted } = vicSplitKeygroup(input, date);
        const keys = deriveVicKeys(
          { phrase, date, personalNumber: personalNumberValue, keygroup: extracted },
          options,
        );
        const output = vicDecrypt(
          input,
          { phrase, date, personalNumber: personalNumberValue },
          options,
        );
        return { output, error: null, keys };
      }
      const detail = vicEncryptDetailed(
        input,
        { phrase, date, personalNumber: personalNumberValue, keygroup },
        options,
      );
      return { output: detail.ciphertext, error: null, keys: detail.keys };
    } catch (error) {
      const code = error instanceof VicError ? error.code : null;
      return { output: '', error: code, keys: null };
    }
  }, [input, phrase, date, personalNumber, keygroup, options, isDecryptMode]);

  useEffect(() => {
    onProcessingEnd({ output: result.output });
  }, [result.output]);

  return {
    phrase,
    setPhrase,
    date,
    setDate,
    personalNumber,
    setPersonalNumber,
    keygroup,
    setKeygroup,
    alphabet,
    setAlphabet,
    bisect,
    setBisect,
    cutIndex,
    setCutIndex,
    showWorkings,
    setShowWorkings,
    error: result.error,
    keys: result.keys,
    // "Try it in the tool": the example/challenge key carries all four
    // secrets in one hand-off string "PHRASE||DATE||PN||KEYGROUP".
    applyHandoffKey: (keyValue: string) => {
      const secrets = parseVicHandoff(keyValue);
      setPhrase(secrets.phrase);
      setDate(secrets.date);
      setPersonalNumber(String(secrets.personalNumber));
      setKeygroup(secrets.keygroup);
    },
    rollKeygroup: () => setKeygroup(randomKeygroup()),
  };
};
