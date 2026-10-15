import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import useCracker from './useCracker';
import Tooltip from '@atoms/Tooltip';
import StepKeyLength from './StepKeyLength';
import StepKeyLetters from './StepKeyLetters';
import StepKey from './StepKey';
import KeyStrip from './KeyStrip';
import DecryptPreview from './DecryptPreview';
import ShortTextWarning from './ShortTextWarning';

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
          {t('processing.vigenere.cracker.wizard.inputChanged')}
        </Text>
      )}

      {analysis && <ShortTextWarning letters={analysis.normalized.letters} />}

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

      <Pane display="flex" justifyContent="space-between" marginTop="12px" gap="8px">
        <Tooltip content={t('processing.vigenere.cracker.tooltips.back')}>
          <Button
            width={NAV_BUTTON_WIDTH}
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
          >
            {t('processing.vigenere.cracker.wizard.back')}
          </Button>
        </Tooltip>
        {step < 3 ? (
          <Tooltip content={t('processing.vigenere.cracker.tooltips.next')}>
            <Button
              width={NAV_BUTTON_WIDTH}
              appearance="primary"
              disabled={!canGoNext}
              onClick={() => setStep(step + 1)}
            >
              {t('processing.vigenere.cracker.wizard.next')}
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content={t('processing.vigenere.cracker.tooltips.useThisKey')}>
            <Button
              data-guide="use-this-key"
              width={NAV_BUTTON_WIDTH}
              appearance="primary"
              onClick={() => onUseKey(assembledKey)}
            >
              {t('processing.vigenere.cracker.wizard.useKey')}
            </Button>
          </Tooltip>
        )}
      </Pane>

      <Pane display="flex" justifyContent="center" marginTop="8px">
        <Tooltip content={t('processing.vigenere.cracker.tooltips.skip')}>
          <Button onClick={onSkip}>{t('processing.vigenere.cracker.wizard.skip')}</Button>
        </Tooltip>
      </Pane>

      {hintConfig.hints.livePreview && (
        <DecryptPreview cracker={cracker} />
      )}
    </Pane>
  );
};

CrackerWizard.displayName = 'CrackerWizard';

export default CrackerWizard;
