import { useState } from 'react';

export const useAlberti = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [staticDisc, setStaticDisc] = useState('ABCDEFGILMNOPQRSTVXZ1234');
  const [dynamicDisc, setDynamicDisc] = useState('usqomkhfdbacegilnprtxz&y');
  const [shift, setShift] = useState(0);
  const [iterationStep, setIterationStep] = useState(1);






  return {};
};
