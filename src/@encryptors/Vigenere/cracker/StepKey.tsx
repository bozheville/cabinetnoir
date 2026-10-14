import React from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';

import strings from '../strings';
import KeyStrip from './KeyStrip';
import { useCracker } from './useCracker';

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

  if (keyLength === null) {
    return null;
  }

  return (
    <Pane width="100%">
      <Heading size={300} marginTop="8px">{strings.wizard.keyLetters.yourKey}</Heading>
      <Text size={300} display="block" marginTop="4px">
        {strings.wizard.keyLetters.keyHint}
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
