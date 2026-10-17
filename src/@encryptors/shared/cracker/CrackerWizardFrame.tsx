import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';

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

interface CrackerWizardFrameProps {
  // Translated step names, e.g. ['Key length', 'Key letters', 'Done'].
  steps: string[];
  step: number;
  onBack: () => void;
  onNext: () => void;
  canGoNext: boolean;
  // Translated label of the final-step action ("Use this key").
  useLabel: string;
  onUse: () => void;
  useDisabled?: boolean;
  onSkip: () => void;
  // Optional line above the steps: input-changed note, warnings.
  message?: React.ReactNode;
  // The current step's content.
  children: React.ReactNode;
  // i18n scope for the frame's own strings (back/next/skip tooltips).
  // Defaults to the shared cracker block.
  i18nScope?: string;
}

// Shared wizard frame every cracker composes its steps into: step
// indicator, back/next navigation, the final "use this result" action and
// the always-visible skip escape hatch. Step content is cipher-specific.
const CrackerWizardFrame: React.FC<CrackerWizardFrameProps> = ({
  steps,
  step,
  onBack,
  onNext,
  canGoNext,
  useLabel,
  onUse,
  useDisabled,
  onSkip,
  message,
  children,
  i18nScope = 'processing.cracker',
}) => {
  const { t } = useTranslation('common');
  const lastStep = steps.length;

  return (
    <Pane width="100%">
      <StepIndicator>
        {steps.map((name, index) => (
          <React.Fragment key={name}>
            {index > 0 && <StepSeparator>|</StepSeparator>}
            <StepLabel $active={step === index + 1}>{`${index + 1}. ${name}`}</StepLabel>
          </React.Fragment>
        ))}
      </StepIndicator>

      {message}

      {children}

      <Pane display="flex" justifyContent="space-between" marginTop="12px" gap="8px">
        <Tooltip content={t(`${i18nScope}.tooltips.back`)}>
          <Button
            width={NAV_BUTTON_WIDTH}
            disabled={step === 1}
            onClick={onBack}
          >
            {t(`${i18nScope}.wizard.back`)}
          </Button>
        </Tooltip>
        {step < lastStep ? (
          <Tooltip content={t(`${i18nScope}.tooltips.next`)}>
            <Button
              width={NAV_BUTTON_WIDTH}
              appearance="primary"
              disabled={!canGoNext}
              onClick={onNext}
            >
              {t(`${i18nScope}.wizard.next`)}
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content={t(`${i18nScope}.tooltips.useThisKey`)}>
            <Button
              data-guide="use-this-key"
              width={NAV_BUTTON_WIDTH}
              appearance="primary"
              disabled={useDisabled}
              onClick={onUse}
            >
              {useLabel}
            </Button>
          </Tooltip>
        )}
      </Pane>

      <Pane display="flex" justifyContent="center" marginTop="8px">
        <Tooltip content={t(`${i18nScope}.tooltips.skip`)}>
          <Button onClick={onSkip}>{t(`${i18nScope}.wizard.skip`)}</Button>
        </Tooltip>
      </Pane>
    </Pane>
  );
};

CrackerWizardFrame.displayName = 'CrackerWizardFrame';

export default CrackerWizardFrame;
