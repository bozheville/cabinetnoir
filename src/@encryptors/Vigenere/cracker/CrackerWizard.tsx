import { useTranslation } from 'next-i18next';
import React from 'react';
import { Pane, Text } from 'evergreen-ui';

import useCracker from './useCracker';
import { CrackerWizardFrame, ShortTextWarning } from '@encryptors/shared/cracker';
import StepKeyLength from './StepKeyLength';
import StepKeyLetters from './StepKeyLetters';
import StepKey from './StepKey';
import DecryptPreview from './DecryptPreview';

const CrackerWizard: React.FC<{
  cracker: ReturnType<typeof useCracker>;
  onUseKey: (key: string) => void;
  onSkip: () => void;
}> = ({ cracker, onUseKey, onSkip }) => {
  const {
    step,
    setStep,
    keyLength,
    lockedLetters,
    analysis,
    hintConfig,
    hasInputChanged,
    assembledKey,
  } = cracker;
  const { input: crackerInput } = cracker;
  const { t } = useTranslation('common');

  const stepNames = [
    t('processing.vigenere.cracker.wizard.steps.keyLength'),
    t('processing.vigenere.cracker.wizard.steps.keyLetters'),
    t('processing.vigenere.cracker.wizard.steps.done'),
  ];

  const allLettersSet = keyLength !== null
    && Array.from({ length: keyLength }).every((_, slice) => lockedLetters[slice]);

  const canGoNext = step === 1 ? keyLength !== null : step === 2 ? allLettersSet : false;

  return (
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(step - 1)}
      onNext={() => setStep(step + 1)}
      canGoNext={canGoNext}
      useLabel={t('processing.cracker.wizard.useKey')}
      onUse={() => onUseKey(assembledKey)}
      onSkip={onSkip}
      message={(
        <>
          {hasInputChanged && (
            <Text size={300} display="block" marginTop="8px">
              {t('processing.cracker.wizard.inputChanged')}
            </Text>
          )}
          {analysis && <ShortTextWarning letters={analysis.normalized.letters} />}
        </>
      )}
    >
      {step === 1 && (
        <StepKeyLength
          input={crackerInput}
          analysis={analysis}
          hints={hintConfig.hints}
          selectedKeyLength={keyLength}
          onSelectKeyLength={cracker.chooseKeyLength}
        />
      )}
      {step === 2 && <StepKeyLetters cracker={cracker} />}
      {step === 3 && <StepKey cracker={cracker} />}

      {hintConfig.hints.livePreview && (
        <DecryptPreview cracker={cracker} />
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'CrackerWizard';

export default CrackerWizard;
