import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Heading, Pane, Text } from 'evergreen-ui';

import { normalize } from '@encryptors/shared/analysis';
import { CrackerInput, CrackerSettings, CrackerWizardFrame, FrequencyChart, ShortTextWarning } from '@encryptors/shared/cracker';
import { setKeyHandoff } from '@learning/keyHandoff';

import { MultiplierCandidate, affineDecryptLetters, rankMultipliers } from './analysis/rank';
import MultiplierCards from './cracker/MultiplierCards';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Hint keys for the Affine wizard; labels resolve from the shared
// cracker locale block.
const HINT_KEYS = ['englishReference', 'matchScore', 'mostLikelyGlow', 'livePreview'];

const DEFAULT_HINTS = HINT_KEYS.reduce(
  (hints, key) => ({ ...hints, [key]: true }),
  {} as Record<string, boolean>,
);

// Affine cracker on the Cryptoanalysis tab. The key space is tiny
// (12 × 26), so the wizard teaches *why* a candidate is right instead of
// brute-forcing silently: step 1 ranks the multipliers by English
// likeness, step 2 reads the shift off the frequency chart, step 3
// assembles the key.
const AffineCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [step, setStep] = useState(1);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [shift, setShift] = useState<number | null>(null);
  const [hints, setHints] = useState<Record<string, boolean>>(DEFAULT_HINTS);
  const router = useRouter();
  const { t } = useTranslation('common');

  const normalized = useMemo(() => normalize(input), [input]);
  const candidates = useMemo<MultiplierCandidate[]>(
    () => (normalized.letters ? rankMultipliers(normalized.letters) : []),
    [normalized],
  );

  // Challenges and examples: the ciphertext arrives via the template's
  // input; affine has no extra state to pre-fill.

  const chooseMultiplier = (value: number) => {
    setMultiplier(value);
    setShift(null);
    if (step > 1) {
      setStep(1);
    }
  };

  const handleUseKey = () => {
    if (multiplier === null || shift === null) {
      return;
    }
    setKeyHandoff({ cipher: 'affine', input, keys: [`${multiplier}/${shift}`] });
    router.push('/encoder/affine/reverse?usedKey=1');
  };

  const handleSkip = () => {
    router.push('/encoder/affine/direct');
  };

  const decrypted = multiplier !== null && shift !== null
    ? affineDecryptLetters(normalized.letters, multiplier, shift)
    : '';

  const stepNames = [
    t('processing.affine.cracker.wizard.steps.multiplier'),
    t('processing.affine.cracker.wizard.steps.shift'),
    t('processing.affine.cracker.wizard.steps.done'),
  ];

  const canGoNext = step === 1 ? multiplier !== null : step === 2 ? shift !== null : false;

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
          useDisabled={multiplier === null || shift === null}
          onSkip={handleSkip}
          message={(
            <>
              {normalized.letters && normalized.letters.length < 100 && (
                <ShortTextWarning letters={normalized.letters} />
              )}
            </>
          )}
        >
          {step === 1 && (
            <MultiplierCards
              candidates={candidates}
              selected={multiplier}
              onSelect={chooseMultiplier}
            />
          )}
          {step === 2 && multiplier !== null && (
            <Pane>
              <Heading size={100} marginTop="12px">
                {t('processing.affine.cracker.wizard.shift.title')}
              </Heading>
              <FrequencyChart
                sliceLetters={normalized.letters}
                hints={hints}
                alphabet={ALPHABET}
                letter={shift !== null ? ALPHABET[shift] : undefined}
                onLetterChange={(letter) => setShift(ALPHABET.indexOf(letter))}
                mapIndex={(position, currentShift) => (multiplier * position + currentShift) % 26}
                keyLetterLabel={t('processing.affine.cracker.wizard.shift.keyLetter')}
              />
            </Pane>
          )}
          {step === 3 && multiplier !== null && shift !== null && (
            <Pane marginTop="12px">
              <Text size={300} display="block">
                {t('processing.affine.cracker.wizard.done.formula', { multiplier, shift })}
              </Text>
              <Text fontFamily="monospace" marginTop="8px" display="block" wordBreak="break-all">
                {decrypted.slice(0, 200)}
              </Text>
            </Pane>
          )}

          {hints.livePreview && multiplier !== null && shift !== null && step < 3 && (
            <Pane marginTop="12px">
              <Text size={300} display="block">
                {t('processing.cracker.wizard.previewTitle')}
              </Text>
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

AffineCryptoanalysis.displayName = 'AffineCryptoanalysis';

export default AffineCryptoanalysis;
