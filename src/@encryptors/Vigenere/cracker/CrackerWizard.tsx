import React from 'react';
import { Button, Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import strings from '../strings';
import useCracker from './useCracker';
import StepKeyLength from './StepKeyLength';
import StepKeyLetters from './StepKeyLetters';
import StepKey from './StepKey';
import KeyStrip from './KeyStrip';
import DecryptPreview from './DecryptPreview';

const StepIndicator = styled(Pane)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const StepLabel = styled(Text)<{ $active?: boolean }>`
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.colors.text : theme.colors.textLight)};
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.04em;
`;

const StepSeparator = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 11px;
`;

const StepPlaceholder = styled(Pane)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  border: dotted 1px ${({ theme }) => theme.colors.textLight};
  border-radius: 4px;
  margin-top: 12px;
  padding: 12px;
`;

const NAV_BUTTON_WIDTH = 90;

const CrackerWizard: React.FC<{ cracker: ReturnType<typeof useCracker> }> = ({ cracker }) => {
  const {
    step,
    setStep,
    keyLength,
    lockedLetters,
    analysis,
    hintConfig,
    hasInputChanged,
  } = cracker;
  const { input: crackerInput } = cracker;

  const stepNames = [
    strings.wizard.steps.keyLength,
    strings.wizard.steps.keyLetters,
    strings.wizard.steps.done,
  ];

  const allLettersLocked = keyLength !== null
    && Array.from({ length: keyLength }).every((_, slice) => lockedLetters[slice]);

  const canGoNext = step === 1 ? keyLength !== null : step === 2 ? allLettersLocked : false;

  return (
    <Pane width="100%">
      <StepIndicator>
        {stepNames.map((name, index) => (
          <React.Fragment key={name}>
            {index > 0 && <StepSeparator>|</StepSeparator>}
            <StepLabel $active={step === index + 1}>{`${index + 1}. ${name}`}</StepLabel>
          </React.Fragment>
        ))}
      </StepIndicator>

      {hasInputChanged && (
        <Text size={300} display="block" marginTop="8px">
          {strings.wizard.inputChanged}
        </Text>
      )}

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

      <Pane display="flex" justifyContent="space-between" marginTop="12px">
        <Button
          width={NAV_BUTTON_WIDTH}
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
        >
          {strings.wizard.back}
        </Button>
        <Button
          width={NAV_BUTTON_WIDTH}
          appearance="primary"
          disabled={!canGoNext}
          onClick={() => setStep(step + 1)}
        >
          {strings.wizard.next}
        </Button>
      </Pane>

      {hintConfig.hints.livePreview && (
        <DecryptPreview cracker={cracker} />
      )}
    </Pane>
  );
};

CrackerWizard.displayName = 'CrackerWizard';

export default CrackerWizard;
