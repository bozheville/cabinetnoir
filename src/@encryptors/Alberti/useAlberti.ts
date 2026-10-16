import { ChangeEventHandler, useEffect, useState } from 'react';
import {
  albertiEncrypt,
  rotateDisc,
  ALBERTI_STATIC_DISC,
  ALBERTI_DYNAMIC_DISC,
} from '@encryptors/Alberti/alberti-crypt';
import { useTranslation } from 'next-i18next';
import { usePendingExample } from '@learning/pendingExample';

export const useAlberti = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [staticDisc, setStaticDisc] = useState(ALBERTI_STATIC_DISC);
  const [dynamicDisc, setDynamicDisc] = useState(ALBERTI_DYNAMIC_DISC);
  const [startindex, setStartindex] = useState('m');
  const [iterationStep, setIterationStep] = useState(3);
  const [period, setPeriod] = useState(2);

  const { t } = useTranslation('common');

  useEffect(() => {
    onProcessingEnd({
      output: albertiEncrypt({
        input,
        isDecryptMode,
        staticDisc,
        dynamicDisc,
        iterationStep,
        period,
      }),
    });
  }, [input, dynamicDisc, staticDisc, isDecryptMode, iterationStep, period]);

  const rotateLeft = () => {
    const index = dynamicDisc.indexOf(startindex) + dynamicDisc.length - 1;
    setStartindex(dynamicDisc[index]);
    setDynamicDisc(rotateDisc(dynamicDisc, index));
  };

  const rotateRight = () => {
    const index = dynamicDisc.indexOf(startindex) + 1;
    setStartindex(dynamicDisc[index]);
    setDynamicDisc(rotateDisc(dynamicDisc, index));
  };

  const handlePeriodChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPeriod((parseInt(event.target?.value, 10)))
  };

  const handleIncrementChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setIterationStep((parseInt(event.target?.value, 10)))
  };

  // "Try it in the tool": the example's key carries "step/period".
  // The context is only non-null when the example targets this cipher;
  // the message itself is pre-filled by EncryptionInputs.
  const pendingExample = usePendingExample();
  useEffect(() => {
    if (!pendingExample) {
      return;
    }
    const [pendingStep, pendingPeriod] = (pendingExample.key ?? '').split('/');
    const step = parseInt(pendingStep, 10);
    if (!Number.isNaN(step)) {
      setIterationStep(step);
    }
    const parsedPeriod = parseInt(pendingPeriod, 10);
    if (!Number.isNaN(parsedPeriod)) {
      setPeriod(parsedPeriod);
    }
  }, [pendingExample]);

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
