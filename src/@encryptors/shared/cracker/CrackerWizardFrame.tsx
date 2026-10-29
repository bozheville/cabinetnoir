import { useTranslation } from 'next-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { Button } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { Caption } from '@typography';
import { metal } from '@theme/mixins';

// Roman numerals for the step rings. Wizards have at most five steps;
// anything beyond the table falls back to arabic numerals.
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const toRoman = (index: number): string => ROMAN[index] ?? String(index + 1);

type StepState = 'done' | 'current' | 'upcoming';

const StepRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
`;

const StepCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: none;
`;

const Ring = styled.div<{ $state: StepState }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 11px;
  letter-spacing: 0.08em;

  ${({ $state }) => $state === 'done' && metal('brass')}

  ${({ $state, theme }) => $state === 'current' && css`
    ${metal('copper')}
    box-shadow: ${theme.shadow.metal}, 0 0 8px 2px ${theme.metal.copper.light}80;
  `}

  ${({ $state, theme }) => $state === 'upcoming' && css`
    background: transparent;
    border: 2px solid ${theme.metal.brass.patina};
    color: ${theme.ink.creamMuted};
    box-shadow: none;
    text-shadow: none;
  `}
`;

// The 2px brass rail joining the rings. Traversed rails are solid
// brass; rails ahead of the current step stay patina.
const Rail = styled.div<{ $reached: boolean }>`
  flex: 1;
  min-width: 12px;
  height: 2px;
  margin-top: 13px;
  background: ${({ theme, $reached }) => ($reached ? theme.metal.brass.base : theme.metal.brass.patina)};
`;

const StepName = styled(Caption)<{ $active: boolean }>`
  max-width: 96px;
  text-align: center;
  color: ${({ theme, $active }) => ($active ? theme.ink.cream : theme.ink.creamMuted)};
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
`;

const SkipRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;

const MIN_PRIMARY_WIDTH = 96;

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
    <div style={{ width: '100%' }}>
      <StepIndicator steps={steps} step={step} />

      {message}

      {children}

      <Nav>
        <Tooltip content={t(`${i18nScope}.tooltips.back`)}>
          <Button
            variant="secondary"
            size="sm"
            disabled={step === 1}
            onClick={onBack}
          >
            {t(`${i18nScope}.wizard.back`)}
          </Button>
        </Tooltip>
        {step < lastStep ? (
          <Tooltip content={t(`${i18nScope}.tooltips.next`)}>
            <Button
              variant="primary"
              size="sm"
              style={{ minWidth: MIN_PRIMARY_WIDTH }}
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
              variant="primary"
              size="sm"
              style={{ minWidth: MIN_PRIMARY_WIDTH }}
              disabled={useDisabled}
              onClick={onUse}
            >
              {useLabel}
            </Button>
          </Tooltip>
        )}
      </Nav>

      <SkipRow>
        <Tooltip content={t(`${i18nScope}.tooltips.skip`)}>
          <Button variant="quiet" size="sm" onClick={onSkip}>
            {t(`${i18nScope}.wizard.skip`)}
          </Button>
        </Tooltip>
      </SkipRow>
    </div>
  );
};

// The Roman-numeral rings joined by the brass rail: done steps are
// filled brass, the current step copper with a glow, upcoming steps
// patina outlines. The step name sits below each ring.
const StepIndicator: React.FC<{ steps: string[]; step: number }> = ({ steps, step }) => (
  <StepRow>
    {steps.map((name, index) => {
      const state: StepState = step > index + 1 ? 'done' : step === index + 1 ? 'current' : 'upcoming';
      return (
        <React.Fragment key={name}>
          {index > 0 && <Rail $reached={step - 1 >= index} />}
          <StepCol>
            <Ring $state={state}>{toRoman(index)}</Ring>
            <StepName $active={state === 'current'}>{name}</StepName>
          </StepCol>
        </React.Fragment>
      );
    })}
  </StepRow>
);

CrackerWizardFrame.displayName = 'CrackerWizardFrame';

export default CrackerWizardFrame;
