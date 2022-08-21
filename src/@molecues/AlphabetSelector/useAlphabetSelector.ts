import { useState } from 'react';
import { useTranslation } from 'next-i18next';

import { getAlphabet } from '@encryptors/constants';
import { alphabetCollection } from '@encryptors/constants';


export const useAlphabetSelector = (onChange) => {
  const [alphabetKey, setAlphabetKey] = useState('latin');
  const [value, setValue] = useState(getAlphabet({ key: 'latin' }).value);
  const { t } = useTranslation('common');

  const options = [
    {type: 'custom', value: ''},
    ...alphabetCollection,
  ];

  const handleChange = (event) => {
    const newAlphabet = event.target.value;
    setAlphabetKey('custom');
    setValue(newAlphabet);

    if (!onChange) {
      return
    }

    onChange(newAlphabet);
  }

  const handleAphabetKeyChange = (event) => {
    const key = event.target.value;
    if (key !== 'custom') {
      const newAlphabet = getAlphabet({ key }).value;
      setAlphabetKey(key);
      setValue(newAlphabet);

      if (!onChange) {
        return
      }

      onChange(newAlphabet);
    }

  };

  return {
    value,
    options,
    alphabetKey,
    handleChange,
    handleAphabetKeyChange,
    t,
  };
};
