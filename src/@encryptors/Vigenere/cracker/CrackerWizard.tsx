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
import StepAlphabet from './StepAlphabet';
import StepAlphabetRecovery from './StepAlphabetRecovery';
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
  // Recovered key and the alphabet it is read in.
  onUseKey: (key: string, alphabet: string) => void;
  onSkip: () => void;
  // Locale subtree of the cipher reusing this wizard ('vigenere' default).
  scope?: string;
}> = ({ cracker, onUseKey, onSkip, scope = 'vigenere' }) => {
  const {
    step,
    setStep,
    steps,
    stepId,
    keyLength,
    lockedLetters,
    analysis,
    hintConfig,
    hasInputChanged,
    assembledKey,
    workingAlphabet,
  } = cracker;
  const { input: crackerInput } = cracker;
  const { t } = useTranslation('common');
  const base = useCrackerKey('');

  const stepNames = steps.map((id) => t(`${base}wizard.steps.${id}`));

  const allLettersSet = keyLength !== null
    && Array.from({ length: keyLength }).every((_, slice) => lockedLetters[slice]);

  const canGoNext = stepId === 'keyLength'
    ? keyLength !== null
    : stepId === 'alphabet'
      ? cracker.alphabetMode === 'recover' || workingAlphabet !== null
      : stepId === 'recovery'
        ? workingAlphabet !== null
        : stepId === 'keyLetters' ? allLettersSet : false;

  return (
    <CrackerScopeProvider scope={scope}>
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(step - 1)}
      onNext={() => setStep(step + 1)}
      canGoNext={canGoNext}
      useLabel={t('processing.cracker.wizard.useKey')}
      onUse={() => onUseKey(assembledKey, workingAlphabet ?? cracker.knownAlphabet)}
      useDisabled={!workingAlphabet}
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
      {stepId === 'keyLength' && (
        <StepKeyLength
          input={crackerInput}
          analysis={analysis}
          hints={hintConfig.hints}
          selectedKeyLength={keyLength}
          onSelectKeyLength={cracker.chooseKeyLength}
        />
      )}
      {stepId === 'alphabet' && <StepAlphabet cracker={cracker} />}
      {stepId === 'recovery' && <StepAlphabetRecovery cracker={cracker} />}
      {stepId === 'keyLetters' && <StepKeyLetters cracker={cracker} />}
      {stepId === 'done' && <StepKey cracker={cracker} />}

      {hintConfig.hints.livePreview && workingAlphabet && (stepId === 'keyLetters' || stepId === 'done') && (
        <DecryptPreview cracker={cracker} />
      )}
    </CrackerWizardFrame>
    </CrackerScopeProvider>
  );
};

CrackerWizard.displayName = 'CrackerWizard';

export default CrackerWizard;
