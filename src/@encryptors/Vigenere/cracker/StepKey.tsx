import { useTranslation } from 'next-i18next';
import React from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';

import KeyStrip from './KeyStrip';
import { useCracker } from './useCracker';
import { useCrackerKey } from '@encryptors/shared/cracker';

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
    <Pane width="100%">
      <Heading size={300} marginTop="8px">{t(`${base}yourKey`)}</Heading>
      <Text size={300} display="block" marginTop="4px">
        {t(`${base}keyHint`)}
      </Text>
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
    </Pane>
  );
};

StepKey.displayName = 'StepKey';

export default StepKey;
