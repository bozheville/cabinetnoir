import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { GreatPrimer, Minion } from '@typography';
import KeyStrip from './KeyStrip';
import { useCracker } from './useCracker';
import { useCrackerKey } from '@encryptors/shared/cracker';

const StepRoot = styled.div`
  width: 100%;
`;

const StepTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
  margin-top: 8px;
`;

const StepHint = styled(Minion)`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

interface StepKeyProps {
  cracker: ReturnType<typeof useCracker>;
}

const StepKey: React.FC<StepKeyProps> = ({ cracker }) => {
  const {
    keyLength,
    lockedLetters,
    setActiveSlice,
    setStep,
    setSliceLetter,
  } = cracker;
  const { t } = useTranslation('common');
  const base = useCrackerKey('wizard.keyLetters.');


  if (keyLength === null) {
    return null;
  }

  return (
    <StepRoot>
      <StepTitle>{t(`${base}yourKey`)}</StepTitle>
      <StepHint>
        {t(`${base}keyHint`)}
      </StepHint>
      <KeyStrip
        keyLength={keyLength}
        lockedLetters={lockedLetters}
        onJump={(slice) => {
          setActiveSlice(slice);
          setStep(2);
        }}
        onOverride={(slice, letter) => setSliceLetter(slice, letter, 'manual')}
        onClear={(slice) => setSliceLetter(slice, '')}
      />
      {/* Use this key button comes in task 25. */}
    </StepRoot>
  );
};

StepKey.displayName = 'StepKey';

export default StepKey;
