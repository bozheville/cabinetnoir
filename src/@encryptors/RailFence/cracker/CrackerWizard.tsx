import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pane, Text } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

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

const StepText = styled(Text)`
  display: block;
  margin-bottom: 8px;
`;

const PlaintextRows = styled(Text)`
  font-family: monospace;
  word-break: break-all;
  white-space: pre-wrap;
  background: ${({ theme }) => theme.colorScheme.gray[50]};
  border-radius: 6px;
  padding: 10px 12px;
  max-height: 200px;
  overflow-y: auto;
  display: block;
`;

const Slider = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.colorScheme.blue_green[500]};
`;

const MeterBar = styled.div<{ $score: number }>`
  height: 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colorScheme.gray[200]};
  overflow: hidden;
  flex: 1;
`;

const MeterFill = styled.div<{ $score: number }>`
  height: 100%;
  width: ${({ $score }) => $score}%;
  border-radius: 6px;
  background: ${({ $score }) => ($score >= 55 ? '#30a46c' : $score >= 35 ? '#f5a623' : '#e5695f')};
`;

const BestMark = styled.span`
  color: ${({ theme }) => theme.colorScheme.blue_green[600]};
  font-weight: 700;
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
            <Text size={300} color="amber500" display="block">
              {t('processing.cracker.wizard.inputChanged')}
            </Text>
          )}
          {ciphertext.length > 0 && <ShortTextWarning letters={ciphertext} />}
        </>
      )}
    >
      {step === 1 && (
        <Pane marginTop={12} display="flex" flexDirection="column" gap={10}>
          <StepText size={300}>
            {t('processing.railFence.cracker.wizard.try.hint')}
          </StepText>
          <Pane display="flex" flexDirection="column" gap={4} data-guide="rails-slider">
            <Text size={300}>
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
            </Text>
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
          </Pane>
          <Pane display="flex" flexDirection="column" gap={4} data-guide="offset-slider">
            <Text size={300}>
              {t('processing.railFence.cracker.wizard.try.offsetLabel', { value: offset })}
            </Text>
            <Slider
              type="range"
              min={0}
              max={rails - 1}
              value={offset}
              onChange={(event) => setOffset(Number(event.target.value))}
            />
          </Pane>
          <Pane display="flex" alignItems="center" gap={8} data-guide="score-meter">
            <Text size={300}>{t('processing.railFence.cracker.wizard.try.meterLabel')}</Text>
            <MeterBar $score={meter}>
              <MeterFill $score={meter} />
            </MeterBar>
            <Text size={300} fontFamily="monospace">{meter}</Text>
          </Pane>
          {plaintext && (
            <ZigzagFence text={plaintext} rails={rails} offset={offset} dataGuide="zigzag-fence" />
          )}
          {plaintext && (
            <PlaintextRows data-guide="plaintext-preview">{plaintext}</PlaintextRows>
          )}
        </Pane>
      )}
      {step === 2 && (
        <Pane marginTop={12} display="flex" flexDirection="column" gap={8}>
          <StepText size={300}>
            {t('processing.railFence.cracker.wizard.done.hint')}
          </StepText>
          <Text size={300} fontFamily="monospace">
            {t('processing.railFence.cracker.wizard.done.setting', { rails, offset })}
          </Text>
          {plaintext && (
            <PlaintextRows data-guide="plaintext-preview">{plaintext}</PlaintextRows>
          )}
        </Pane>
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'RailFenceCrackerWizard';

export default CrackerWizard;
