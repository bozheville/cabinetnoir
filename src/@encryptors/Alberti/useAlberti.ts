import { ChangeEventHandler, useEffect, useState } from 'react';
import {
  monoalphabeticEncrypt,
} from '@encryptors/Monoalphabetic/monoalphabetic-crypt';
import { rotate } from '@encryptors/utils';
import { useTranslation } from 'next-i18next';

export const useAlberti = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [staticDisc, setStaticDisc] = useState('ABCDEFGILMNOPQRSTVXZ1234');
  const [dynamicDisc, setDynamicDisc] = useState('mqihfdbacegklnprtuz&xyso');
  const [startindex, setStartindex] = useState('m');
  const [iterationStep, setIterationStep] = useState(3);
  const [period, setPeriod] = useState(2);

  const { t } = useTranslation('common');

  useEffect(() => {
    let roundAlphabet = dynamicDisc;
    let mesage = input;
    let output = '';

    while (mesage) {
      output += monoalphabeticEncrypt({
        input: mesage.slice(0, period),
        alphabet: isDecryptMode ? roundAlphabet.toUpperCase() : staticDisc,
        targetAlphabet: isDecryptMode ? staticDisc : roundAlphabet,
        keepSpaces: isDecryptMode,
        keepCase: isDecryptMode,
      });

      mesage = mesage.slice(period);
      roundAlphabet = rotate(roundAlphabet, iterationStep);
    }

    onProcessingEnd({ output });
  }, [input, dynamicDisc, staticDisc, startindex]);

  const rotateLeft = () => {
    const index = dynamicDisc.indexOf(startindex) + dynamicDisc.length - 1;
    setStartindex(dynamicDisc[index]);
    setDynamicDisc(rotate(dynamicDisc, index));
  };

  const rotateRight = () => {
    const index = dynamicDisc.indexOf(startindex) + 1;
    setStartindex(dynamicDisc[index]);
    setDynamicDisc(rotate(dynamicDisc, index));
  };

  const handlePeriodChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPeriod((parseInt(event.target?.value, 10)))
  };

  const handleIncrementChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setIterationStep((parseInt(event.target?.value, 10)))
  };

  return {
    t,
    staticDisc,
    dynamicDisc,
    iterationStep,
    period,
    rotateLeft,
    rotateRight,
    handlePeriodChange,
    handleIncrementChange,
  };
};
