import { useTranslation } from 'next-i18next';
import React from 'react';
import { Text } from 'evergreen-ui';

import useCracker from './useCracker';
import { CrackerWizardFrame } from '@encryptors/shared/cracker';
import StepKeyLength from './StepKeyLength';
import StepColumns from './StepColumns';
import StepSquare from './StepSquare';

const CrackerWizard: React.FC<{
  cracker: ReturnType<typeof useCracker>;
  onUseKey: (squareKey: string, transpositionKey: string) => void;
  onSkip: () => void;
}> = ({ cracker, onUseKey, onSkip }) => {
  const {
    step,
    setStep,
    keyLength,
    mapping,
    hasInputChanged,
  } = cracker;
  const { t } = useTranslation('common');

  const stepNames = [
    t('processing.adfgvx.cracker.wizard.steps.keyLength'),
    t('processing.adfgvx.cracker.wizard.steps.columns'),
    t('processing.adfgvx.cracker.wizard.steps.square'),
  ];

  const enoughMapped = Object.keys(mapping).length >= 6;

  const canGoNext = step === 1 ? keyLength !== null : step === 2 ? true : false;

  return (
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(step - 1)}
      onNext={() => setStep(step + 1)}
      canGoNext={canGoNext}
      useLabel={t('processing.adfgvx.cracker.wizard.useKey')}
      onUse={() => onUseKey(cracker.assembledSquare, cracker.assembledTranspositionKey)}
      useDisabled={!enoughMapped}
      onSkip={onSkip}
      i18nScope="processing.adfgvx.cracker"
      message={hasInputChanged && (
        <Text size={300} display="block" marginTop="8px">
          {t('processing.adfgvx.cracker.wizard.inputChanged')}
        </Text>
      )}
    >
      {step === 1 && <StepKeyLength cracker={cracker} />}
      {step === 2 && <StepColumns cracker={cracker} />}
      {step === 3 && <StepSquare cracker={cracker} />}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'CrackerWizard';

export default CrackerWizard;
