import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Pane, Text } from 'evergreen-ui';

import {
  CrackerInput,
  CrackerSettings,
  CrackerWizardFrame,
  ShortTextWarning,
  CandidateCards,
} from '@encryptors/shared/cracker';
import { usePendingExample } from '@learning/pendingExample';
import { setKeyHandoff } from '@learning/keyHandoff';

import {
  albertiDecryptLetters,
  normalizeAlbertiCipherText,
  rankPeriods,
  rankSteps,
  MAX_PERIOD,
} from './analysis/rank';
import { ALBERTI_DYNAMIC_DISC } from './alberti-crypt';

// Hint keys for the Alberti wizard; labels resolve from the shared
// cracker locale block. Only honest toggles: the cards always show
// their confidence bars, the live preview is optional.
const HINT_KEYS = ['livePreview'];

const DEFAULT_HINTS = HINT_KEYS.reduce(
  (hints, key) => ({ ...hints, [key]: true }),
  {} as Record<string, boolean>,
);

// Alberti cracker on the Cryptoanalysis tab. The discs are fixed, so the
// unknowns are the chunk period and the disc step: step 1 ranks the
// periods, step 2 the disc steps for the chosen period, step 3 assembles
// the key ("step/period", the tool's own format) and hands it to the
// Tool tab via the in-memory hand-off.
const AlbertiCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [step, setStep] = useState(1);
  const [period, setPeriod] = useState<number | null>(null);
  const [discStep, setDiscStep] = useState<number | null>(null);
  const [hints, setHints] = useState<Record<string, boolean>>(DEFAULT_HINTS);
  const router = useRouter();
  const { t } = useTranslation('common');

  const ciphertext = useMemo(() => normalizeAlbertiCipherText(input), [input]);
  const periods = useMemo(() => rankPeriods(ciphertext), [ciphertext]);
  const steps = useMemo(
    () => (period !== null ? rankSteps(ciphertext, period) : []),
    [ciphertext, period],
  );

  const pendingExample = usePendingExample();
  const appliedExample = React.useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    // The hint preset applies; the ciphertext arrives via the template.
    if (pendingExample.hintPreset) {
      const preset = pendingExample.hintPreset;
      setHints((current) => (
        preset === 'hard'
          ? { englishReference: true, livePreview: true }
          : current
      ));
    }
  }, [pendingExample]);

  const choosePeriod = (id: string) => {
    const value = parseInt(id, 10);
    setPeriod(value);
    setDiscStep(null);
    if (step > 1) {
      setStep(1);
    }
  };

  const chooseDiscStep = (id: string) => {
    setDiscStep(parseInt(id, 10));
  };

  const handleUseKey = () => {
    if (period === null || discStep === null) {
      return;
    }
    // keys: ['step/period' — the tool's example-key format, and the disc
    // alignment the crack assumes (the fixed default disc)].
    setKeyHandoff({
      cipher: 'alberti',
      input,
      keys: [`${discStep}/${period}`, ALBERTI_DYNAMIC_DISC],
    });
    router.push('/encoder/alberti/reverse?usedKey=1');
  };

  const handleSkip = () => {
    router.push('/encoder/alberti/direct');
  };

  const decrypted = period !== null && discStep !== null
    ? albertiDecryptLetters(ciphertext, period, discStep)
    : '';

  const stepNames = [
    t('processing.alberti.cracker.wizard.steps.period'),
    t('processing.alberti.cracker.wizard.steps.discStep'),
    t('processing.alberti.cracker.wizard.steps.done'),
  ];

  const canGoNext = step === 1 ? period !== null : step === 2 ? discStep !== null : false;

  return (
    <Pane display="flex" flexDirection="column" width="100%">
      <CrackerInput value={input} onChange={onInputChange} />
      <Pane
        display="flex"
        flexDirection="column"
        width="100%"
        padding="12px"
        marginX="16px"
        marginBottom="16px"
        border="muted"
        borderRadius="4px"
      >
        <CrackerSettings
          config={{ preset: 'custom', hints }}
          onChange={(config) => setHints(config.hints)}
          keys={HINT_KEYS}
          i18nScope="processing.cracker"
        />
        <CrackerWizardFrame
          steps={stepNames}
          step={step}
          onBack={() => setStep(step - 1)}
          onNext={() => setStep(step + 1)}
          canGoNext={canGoNext}
          useLabel={t('processing.cracker.wizard.useKey')}
          onUse={handleUseKey}
          useDisabled={period === null || discStep === null}
          onSkip={handleSkip}
          message={ciphertext && <ShortTextWarning letters={ciphertext} minLetters={150} />}
        >
          {step === 1 && (
            <Pane marginTop="12px">
              <Text size={300} display="block" marginBottom="4px">
                {t('processing.alberti.cracker.wizard.assumption')}
              </Text>
              <CandidateCards
                items={periods.map((candidate) => ({
                  id: String(candidate.value),
                  label: `period = ${candidate.value}`,
                  hint: t('processing.alberti.cracker.wizard.period.bestStep', { step: candidate.bestPartner }),
                  confidence: candidate.confidence,
                }))}
                selectedId={period !== null ? String(period) : null}
                onSelect={choosePeriod}
                matchLabel={t('processing.cracker.wizard.match')}
                tooltip={t('processing.alberti.cracker.tooltips.periodCards')}
                dataGuide="cracker-period"
              />
            </Pane>
          )}
          {step === 2 && period !== null && (
            <Pane marginTop="12px">
              <CandidateCards
                items={steps.map((candidate) => ({
                  id: String(candidate.value),
                  label: `step = ${candidate.value}`,
                  confidence: candidate.confidence,
                }))}
                selectedId={discStep !== null ? String(discStep) : null}
                onSelect={chooseDiscStep}
                matchLabel={t('processing.cracker.wizard.match')}
                tooltip={t('processing.alberti.cracker.tooltips.stepCards')}
                dataGuide="cracker-disc-step"
              />
            </Pane>
          )}
          {step === 3 && period !== null && discStep !== null && (
            <Pane marginTop="12px">
              <Text size={300} display="block">
                {t('processing.alberti.cracker.wizard.done.summary', { step: discStep, period })}
              </Text>
              <Text fontFamily="monospace" size={300} display="block" marginTop="8px" wordBreak="break-all">
                {decrypted.slice(0, 200)}
              </Text>
            </Pane>
          )}

          {hints.livePreview && period !== null && discStep !== null && step < 3 && (
            <Pane marginTop="12px">
              <Text size={300} display="block">{t('processing.cracker.wizard.previewTitle')}</Text>
              <Text fontFamily="monospace" size={300} display="block" wordBreak="break-all">
                {decrypted.slice(0, 200)}
              </Text>
            </Pane>
          )}
        </CrackerWizardFrame>
      </Pane>
    </Pane>
  );
};

AlbertiCryptoanalysis.displayName = 'AlbertiCryptoanalysis';

export default AlbertiCryptoanalysis;
