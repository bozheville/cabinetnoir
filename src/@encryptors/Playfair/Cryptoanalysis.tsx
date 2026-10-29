import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { Button, Cluster, Stack, TextInput } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { CipherText, Minion } from '@typography';
import { engraved } from '@theme/mixins';
import { normalize } from '@encryptors/shared/analysis';
import { CrackerInput, CrackerWizardFrame, ShortTextWarning } from '@encryptors/shared/cracker';
import { setKeyHandoff } from '@learning/keyHandoff';

import { playfairDecrypt } from './playfair-encryption';
import { autoImprove, improveOnce, keyToSquare, randomSquare, scoreSquare, squareToKey } from './cracker/hillclimb';
import DigraphPanel from './cracker/DigraphPanel';
import SquareGrid from './cracker/SquareGrid';

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
  color: ${({ theme }) => theme.ink.cream};
  word-break: break-all;
`;

const MonoBlock = styled(CipherText)`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.ink.cream};
  word-break: break-all;
`;

const Row = styled(Cluster)`
  margin-top: 8px;
`;

// Playfair cracker on the Cryptoanalysis tab: digraph statistics first,
// then hill-climbing on the key square with the user watching (and
// correcting) every step. No silent auto-solve: each pass is triggered
// from the UI, manual swaps are always available.
const PlayfairCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [step, setStep] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [square, setSquare] = useState<string[] | null>(null);
  const [score, setScore] = useState(0);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [exhausted, setExhausted] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');

  // Ciphertext letters only; Playfair needs an even count, the trailing
  // letter would just be padding anyway.
  const normalized = useMemo(() => {
    const { letters } = normalize(input);
    return letters.length % 2 ? letters.slice(0, -1) : letters;
  }, [input]);

  const plaintext = useMemo(
    () => (square ? playfairDecrypt(normalized, squareToKey(square)) : ''),
    [square, normalized],
  );

  const start = () => {
    const initial = keyword.trim()
      ? keyToSquare(keyword)
      : randomSquare();
    setSquare(initial);
    setScore(scoreSquare(initial, normalized));
    setExhausted(false);
    setStep(2);
  };

  const runImprove = () => {
    if (!square) {
      return;
    }
    const result = improveOnce(square, normalized);
    setSquare(result.square);
    setScore(result.score);
    setExhausted(!result.improved);
  };

  const runAuto = () => {
    if (!square) {
      return;
    }
    const result = autoImprove(square, normalized);
    setSquare(result.square);
    setScore(result.score);
    setExhausted(true);
  };

  const selectCell = (index: number) => {
    if (selectedCells.length === 0) {
      setSelectedCells([index]);
      return;
    }
    const [first] = selectedCells;
    if (first === index) {
      setSelectedCells([]);
      return;
    }
    if (!square) {
      return;
    }
    const next = [...square];
    [next[first], next[index]] = [next[index], next[first]];
    setSquare(next);
    setScore(scoreSquare(next, normalized));
    setSelectedCells([]);
    setExhausted(false);
  };

  const handleUseKey = () => {
    if (!square) {
      return;
    }
    setKeyHandoff({ cipher: 'playfair', input, keys: [squareToKey(square)] });
    router.push('/encoder/playfair/reverse?usedKey=1');
  };

  const handleSkip = () => {
    router.push('/encoder/playfair/direct');
  };

  const stepNames = [
    t('processing.playfair.cracker.wizard.steps.digraphs'),
    t('processing.playfair.cracker.wizard.steps.improve'),
    t('processing.playfair.cracker.wizard.steps.done'),
  ];

  return (
    <PaneRoot>
      <CrackerInput value={input} onChange={onInputChange} />
      <WizardBox>
        <CrackerWizardFrame
          steps={stepNames}
          step={step}
          onBack={() => setStep(step - 1)}
          onNext={() => setStep(step + 1)}
          canGoNext={step === 1 ? !!square : true}
          useLabel={t('processing.cracker.wizard.useKey')}
          onUse={handleUseKey}
          useDisabled={!square}
          onSkip={handleSkip}
          message={normalized && <ShortTextWarning letters={normalized} minLetters={200} />}
        >
          {step === 1 && (
            <Block $marginTop={12}>
              <StepLabel>{t('processing.playfair.cracker.start.title')}</StepLabel>
              <Row gap={2} wrap>
                <Tooltip content={t('processing.playfair.cracker.tooltips.startKeyword')}>
                  <TextInput
                    data-guide="start-keyword"
                    mono
                    width="200px"
                    placeholder={t('processing.playfair.cracker.start.keywordPlaceholder')}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                </Tooltip>
                <Button variant="primary" onClick={start}>
                  {t('processing.playfair.cracker.start.startButton')}
                </Button>
                <Button variant="secondary" onClick={() => { setKeyword(''); setSquare(randomSquare()); setStep(2); setScore(0); setExhausted(false); }}>
                  {t('processing.playfair.cracker.start.randomButton')}
                </Button>
              </Row>
              {normalized && <DigraphPanel letters={normalized} />}
            </Block>
          )}

          {step === 2 && square && (
            <Block>
              <Note>
                {t('processing.playfair.cracker.improve.score', { score })}
              </Note>
              <Row gap={2} wrap>
                <Tooltip content={t('processing.playfair.cracker.tooltips.improve')}>
                  <Button variant="primary" data-guide="improve-square" onClick={runImprove}>
                    {t('processing.playfair.cracker.improve.improveButton')}
                  </Button>
                </Tooltip>
                <Tooltip content={t('processing.playfair.cracker.tooltips.auto')}>
                  <Button variant="secondary" onClick={runAuto}>
                    {t('processing.playfair.cracker.improve.autoButton')}
                  </Button>
                </Tooltip>
              </Row>
              {exhausted && (
                <Note>
                  {t('processing.playfair.cracker.improve.noImprovement')}
                </Note>
              )}
              <SquareGrid square={square} selected={selectedCells} onSelect={selectCell} />
              <Block $marginTop={12}>
                <Note>{t('processing.cracker.wizard.previewTitle')}</Note>
                <MonoText>
                  {plaintext.replace(/\s/g, ' ').slice(0, 200)}
                </MonoText>
              </Block>
            </Block>
          )}

          {step === 3 && square && (
            <Block $marginTop={12}>
              <Note>
                {t('processing.playfair.cracker.done.keyLabel')}
              </Note>
              <MonoText>
                {squareToKey(square)}
              </MonoText>
              <MonoBlock>
                {plaintext.slice(0, 200)}
              </MonoBlock>
            </Block>
          )}
        </CrackerWizardFrame>
      </WizardBox>
    </PaneRoot>
  );
};

PlayfairCryptoanalysis.displayName = 'PlayfairCryptoanalysis';

export default PlayfairCryptoanalysis;
