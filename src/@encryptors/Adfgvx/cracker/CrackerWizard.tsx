import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import useCracker from './useCracker';
import Tooltip from '@atoms/Tooltip';
import StepKeyLength from './StepKeyLength';
import StepColumns from './StepColumns';
import StepSquare from './StepSquare';

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

const NAV_BUTTON_WIDTH = 90;

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
          {t('processing.adfgvx.cracker.wizard.inputChanged')}
        </Text>
      )}

      {step === 1 && <StepKeyLength cracker={cracker} />}
      {step === 2 && <StepColumns cracker={cracker} />}
      {step === 3 && <StepSquare cracker={cracker} />}

      <Pane display="flex" justifyContent="space-between" marginTop="12px" gap="8px">
        <Tooltip content={t('processing.adfgvx.cracker.tooltips.back')}>
          <Button
            width={NAV_BUTTON_WIDTH}
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
          >
            {t('processing.adfgvx.cracker.wizard.back')}
          </Button>
        </Tooltip>
        {step < 3 ? (
          <Tooltip content={t('processing.adfgvx.cracker.tooltips.next')}>
            <Button
              width={NAV_BUTTON_WIDTH}
              appearance="primary"
              disabled={!canGoNext}
              onClick={() => setStep(step + 1)}
            >
              {t('processing.adfgvx.cracker.wizard.next')}
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content={t('processing.adfgvx.cracker.tooltips.useThisKey')}>
            <Button
              data-guide="use-this-key"
              width={NAV_BUTTON_WIDTH}
              appearance="primary"
              disabled={!enoughMapped}
              onClick={() => onUseKey(cracker.assembledSquare, cracker.assembledTranspositionKey)}
            >
              {t('processing.adfgvx.cracker.wizard.useKey')}
            </Button>
          </Tooltip>
        )}
      </Pane>

      <Pane display="flex" justifyContent="center" marginTop="8px">
        <Tooltip content={t('processing.adfgvx.cracker.tooltips.skip')}>
          <Button onClick={onSkip}>{t('processing.adfgvx.cracker.wizard.skip')}</Button>
        </Tooltip>
      </Pane>
    </Pane>
  );
};

CrackerWizard.displayName = 'CrackerWizard';

export default CrackerWizard;
