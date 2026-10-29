import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { Minion } from '@typography';
import useCracker from './useCracker';
import {
  CrackerScopeProvider,
  CrackerWizardFrame,
  ShortTextWarning,
  useCrackerKey,
} from '@encryptors/shared/cracker';
import StepKeyLength from './StepKeyLength';
import StepKeyLetters from './StepKeyLetters';
import StepKey from './StepKey';
import DecryptPreview from './DecryptPreview';

const InputChangedNote = styled(Minion)`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const CrackerWizard: React.FC<{
  cracker: ReturnType<typeof useCracker>;
  onUseKey: (key: string) => void;
  onSkip: () => void;
  // Locale subtree of the cipher reusing this wizard ('vigenere' default).
  scope?: string;
}> = ({ cracker, onUseKey, onSkip, scope = 'vigenere' }) => {
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
  const base = useCrackerKey('');

  const stepNames = [
    t(`${base}wizard.steps.keyLength`),
    t(`${base}wizard.steps.keyLetters`),
    t(`${base}wizard.steps.done`),
  ];

  const allLettersSet = keyLength !== null
    && Array.from({ length: keyLength }).every((_, slice) => lockedLetters[slice]);

  const canGoNext = step === 1 ? keyLength !== null : step === 2 ? allLettersSet : false;

  return (
    <CrackerScopeProvider scope={scope}>
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
            <InputChangedNote>
              {t('processing.cracker.wizard.inputChanged')}
            </InputChangedNote>
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
    </CrackerScopeProvider>
  );
};

CrackerWizard.displayName = 'CrackerWizard';

export default CrackerWizard;
