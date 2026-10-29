import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Minion } from '@typography';
import { paper } from '@theme/mixins';
import {
  railFenceDecrypt,
} from '@encryptors/shared/transposition';
import ZigzagFence from '@encryptors/shared/transposition/ZigzagFence';
import { scoreDigraphs } from '@encryptors/shared/analysis';
import {
  CrackerWizardFrame,
  ShortTextWarning,
} from '@encryptors/shared/cracker';
import { HintConfig } from './hintSettings';

const MAX_RAILS = 10;

const StepText = styled(Minion)`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const InputChangedNote = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// Parchment reading box for the plaintext candidate.
const PlaintextRows = styled.div`
  ${paper('parchment')}
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  word-break: break-all;
  white-space: pre-wrap;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  max-height: 200px;
  overflow-y: auto;
`;

// A brass rail slider (native range input underneath).
const Slider = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.metal.brass.base};
`;

const SliderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SliderLabel = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
`;

// The digraph meter: a brass rail, the fill green when the setting
// reads like English, copper in the maybe band, red ink when it doesn't.
const MeterBar = styled.div`
  height: 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.metal.brass.base};
  overflow: hidden;
  flex: 1;
`;

const MeterFill = styled.div<{ $score: number }>`
  height: 100%;
  width: ${({ $score }) => $score}%;
  border-radius: 6px;
  background: ${({ $score, theme }) => ($score >= 55
    ? theme.ink.green
    : $score >= 35 ? theme.metal.copper.base : theme.ink.red)};
`;

const BestMark = styled.span`
  color: ${({ theme }) => theme.metal.brass.base};
  font-weight: 700;
`;

const MeterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MeterValue = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
`;

const SettingText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
`;

const StepBlock = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DoneBlock = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface CrackerWizardProps {
  input: string;
  hintConfig: HintConfig;
  // "Use this result": hands "rails/offset" over.
  onUseKey: (rails: number, offset: number) => void;
  onSkip: () => void;
}

// The rail fence cracker: one decision. A slider over the rail counts
// (and the offset); the zigzag re-draws and the plaintext candidate
// updates live, with a digraph-score meter judging each setting.
// Nothing auto-selects — the easy preset only marks where the meter
// peaks; moving the slider stays the user's job.
const CrackerWizard: React.FC<CrackerWizardProps> = ({
  input,
  hintConfig,
  onUseKey,
  onSkip,
}) => {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(1);
  const [rails, setRails] = useState(3);
  const [offset, setOffset] = useState(0);
  const [hasInputChanged, setHasInputChanged] = useState(false);

  const ciphertext = useMemo(
    () => input.toUpperCase().replace(/[^A-Z]/g, ''),
    [input],
  );

  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current !== input) {
      previousInput.current = input;
      setHasInputChanged(true);
      setStep(1);
    }
  }, [input]);

  const hints = hintConfig.hints;

  const plaintext = useMemo(
    () => (ciphertext.length >= 2 ? railFenceDecrypt(ciphertext, rails, { offset }) : ''),
    [ciphertext, rails, offset],
  );

  const meter = useMemo(() => {
    if (!plaintext) {
      return 0;
    }
    // Digraph scores are negative log-likelihoods; map the useful band
    // (-2.5 worst-ish … 0 best) onto 0…100.
    const raw = scoreDigraphs(plaintext);
    return Math.max(0, Math.min(100, Math.round(((raw + 2.5) / 2.5) * 100)));
  }, [plaintext]);

  // Easy hint: where the meter peaks over every rail/offset setting.
  const best = useMemo(() => {
    if (ciphertext.length < 4) {
      return null;
    }
    let bestSetting = { rails: 2, offset: 0, score: -Infinity };
    for (let r = 2; r <= MAX_RAILS; r += 1) {
      if (ciphertext.length < r) {
        break;
      }
      for (let o = 0; o < r; o += 1) {
        const score = scoreDigraphs(railFenceDecrypt(ciphertext, r, { offset: o }));
        if (score > bestSetting.score) {
          bestSetting = { rails: r, offset: o, score };
        }
      }
    }
    return bestSetting;
  }, [ciphertext]);

  const stepNames = [
    t('processing.railFence.cracker.wizard.steps.try'),
    t('processing.railFence.cracker.wizard.steps.done'),
  ];

  return (
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(step - 1)}
      onNext={() => setStep(step + 1)}
      canGoNext={ciphertext.length >= 2}
      useLabel={t('processing.cracker.wizard.useKey')}
      onUse={() => onUseKey(rails, offset)}
      useDisabled={ciphertext.length < 2}
      onSkip={onSkip}
      message={(
        <>
          {hasInputChanged && (
            <InputChangedNote>
              {t('processing.cracker.wizard.inputChanged')}
            </InputChangedNote>
          )}
          {ciphertext.length > 0 && <ShortTextWarning letters={ciphertext} />}
        </>
      )}
    >
      {step === 1 && (
        <StepBlock>
          <StepText>
            {t('processing.railFence.cracker.wizard.try.hint')}
          </StepText>
          <SliderBlock data-guide="rails-slider">
            <SliderLabel>
              {t('processing.railFence.cracker.wizard.try.railsLabel', { value: rails })}
              {hints.bestMark && best && (
                <BestMark>
                  {' · '}
                  {t('processing.railFence.cracker.wizard.try.best', {
                    rails: best.rails,
                    offset: best.offset,
                  })}
                </BestMark>
              )}
            </SliderLabel>
            <Slider
              type="range"
              min={2}
              max={MAX_RAILS}
              value={rails}
              onChange={(event) => {
                const value = Number(event.target.value);
                setRails(value);
                setOffset((current) => Math.min(current, value - 1));
              }}
            />
          </SliderBlock>
          <SliderBlock data-guide="offset-slider">
            <SliderLabel>
              {t('processing.railFence.cracker.wizard.try.offsetLabel', { value: offset })}
            </SliderLabel>
            <Slider
              type="range"
              min={0}
              max={rails - 1}
              value={offset}
              onChange={(event) => setOffset(Number(event.target.value))}
            />
          </SliderBlock>
          <MeterRow data-guide="score-meter">
            <SliderLabel>{t('processing.railFence.cracker.wizard.try.meterLabel')}</SliderLabel>
            <MeterBar>
              <MeterFill $score={meter} />
            </MeterBar>
            <MeterValue>{meter}</MeterValue>
          </MeterRow>
          {plaintext && (
            <ZigzagFence text={plaintext} rails={rails} offset={offset} dataGuide="zigzag-fence" />
          )}
          {plaintext && (
            <PlaintextRows data-guide="plaintext-preview">{plaintext}</PlaintextRows>
          )}
        </StepBlock>
      )}
      {step === 2 && (
        <DoneBlock>
          <StepText>
            {t('processing.railFence.cracker.wizard.done.hint')}
          </StepText>
          <SettingText>
            {t('processing.railFence.cracker.wizard.done.setting', { rails, offset })}
          </SettingText>
          {plaintext && (
            <PlaintextRows data-guide="plaintext-preview">{plaintext}</PlaintextRows>
          )}
        </DoneBlock>
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'RailFenceCrackerWizard';

export default CrackerWizard;
