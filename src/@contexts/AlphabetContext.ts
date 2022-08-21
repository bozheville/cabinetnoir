import React from 'react';
import { useLocalStorage } from '@hooks';

interface ContextValue {
  alphabet: string[];
  setAlphabet: (value: string) => void;
};

export const useAlphabetContext = () => {
  const [alphabet, setAlphabetValue] = useLocalStorage('alphabet', '');

  const setAlphabet = (value) => {
    setAlphabetValue(value);
  };

  return {
    alphabet,
    setAlphabet,
  };
};

const AlphabetContext = React.createContext<ContextValue>({
  alphabet: [],
  setAlphabet: (algorithm: string) => {}
});

export default AlphabetContext;
