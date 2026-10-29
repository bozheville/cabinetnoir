import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { normalize } from '@encryptors/shared/analysis';
import { CrackerInput, CrackerSettings, CrackerWizardFrame, FrequencyChart, ShortTextWarning } from '@encryptors/shared/cracker';
import { setKeyHandoff } from '@learning/keyHandoff';

import { MultiplierCandidate, affineDecryptLetters, rankMultipliers } from './analysis/rank';
import { CandidateCards } from '@encryptors/shared/cracker';
import { CipherText, Minion } from '@typography';
import { engraved } from '@theme/mixins';

const PaneRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WizardBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  margin: 0 16px 16px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: ${({ theme }) => theme.radius.metal};
`;

const Block = styled.div<{ $marginTop?: number }>`
  margin-top: ${({ $marginTop }) => ($marginTop ? `${$marginTop}px` : '0')};
`;

// Engraved brass step label on the leather band.
const StepLabel = styled.span`
  ${engraved('leather')}
  font-size: 11px;
  display: block;
`;

const Note = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const MonoText = styled(CipherText)`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.ink.cream};
  word-break: break-all;
`;

const PreviewMono = styled(CipherText)`
  display: block;
  color: ${({ theme }) => theme.ink.cream};
  word-break: break-all;
`;

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
    <PaneRoot>
      <CrackerInput value={input} onChange={onInputChange} />
      <WizardBox>
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
            <Block $marginTop={12}>
              <CandidateCards
                items={candidates.map((candidate: MultiplierCandidate) => ({
                  id: String(candidate.multiplier),
                  label: `a = ${candidate.multiplier}`,
                  confidence: candidate.confidence,
                }))}
                selectedId={multiplier !== null ? String(multiplier) : null}
                onSelect={(id) => chooseMultiplier(parseInt(id, 10))}
                matchLabel={t('processing.cracker.wizard.match')}
                tooltip={t('processing.affine.cracker.tooltips.multiplierCards')}
                dataGuide="cracker-multiplier"
              />
            </Block>
          )}
          {step === 2 && multiplier !== null && (
            <Block>
              <StepLabel>
                {t('processing.affine.cracker.wizard.shift.title')}
              </StepLabel>
              <FrequencyChart
                sliceLetters={normalized.letters}
                hints={hints}
                alphabet={ALPHABET}
                letter={shift !== null ? ALPHABET[shift] : undefined}
                onLetterChange={(letter) => setShift(ALPHABET.indexOf(letter))}
                mapIndex={(position, currentShift) => (multiplier * position + currentShift) % 26}
                keyLetterLabel={t('processing.affine.cracker.wizard.shift.keyLetter')}
              />
            </Block>
          )}
          {step === 3 && multiplier !== null && shift !== null && (
            <Block $marginTop={12}>
              <Note>
                {t('processing.affine.cracker.wizard.done.formula', { multiplier, shift })}
              </Note>
              <MonoText>
                {decrypted.slice(0, 200)}
              </MonoText>
            </Block>
          )}

          {hints.livePreview && multiplier !== null && shift !== null && step < 3 && (
            <Block $marginTop={12}>
              <Note>
                {t('processing.cracker.wizard.previewTitle')}
              </Note>
              <PreviewMono>
                {decrypted.slice(0, 200)}
              </PreviewMono>
            </Block>
          )}
        </CrackerWizardFrame>
      </WizardBox>
    </PaneRoot>
  );
};

AffineCryptoanalysis.displayName = 'AffineCryptoanalysis';

export default AffineCryptoanalysis;
