import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Heading, Pane, Text, TextInput } from 'evergreen-ui';

import Tooltip from '@atoms/Tooltip';
import { normalize } from '@encryptors/shared/analysis';
import { CrackerInput, CrackerWizardFrame, ShortTextWarning } from '@encryptors/shared/cracker';
import { setKeyHandoff } from '@learning/keyHandoff';

import { playfairDecrypt } from './playfair-encryption';
import { autoImprove, improveOnce, keyToSquare, randomSquare, scoreSquare, squareToKey } from './cracker/hillclimb';
import DigraphPanel from './cracker/DigraphPanel';
import SquareGrid from './cracker/SquareGrid';

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
            <Pane marginTop="12px">
              <Heading size={100}>{t('processing.playfair.cracker.start.title')}</Heading>
              <Pane display="flex" alignItems="center" gap="8px" marginTop="8px" flexWrap="wrap">
                <Tooltip content={t('processing.playfair.cracker.tooltips.startKeyword')}>
                  <TextInput
                    data-guide="start-keyword"
                    width="200px"
                    placeholder={t('processing.playfair.cracker.start.keywordPlaceholder')}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                </Tooltip>
                <Button appearance="primary" onClick={start}>
                  {t('processing.playfair.cracker.start.startButton')}
                </Button>
                <Button onClick={() => { setKeyword(''); setSquare(randomSquare()); setStep(2); setScore(0); setExhausted(false); }}>
                  {t('processing.playfair.cracker.start.randomButton')}
                </Button>
              </Pane>
              {normalized && <DigraphPanel letters={normalized} />}
            </Pane>
          )}

          {step === 2 && square && (
            <Pane>
              <Text size={300} display="block" marginTop="8px">
                {t('processing.playfair.cracker.improve.score', { score })}
              </Text>
              <Pane display="flex" gap="8px" marginTop="8px" flexWrap="wrap">
                <Tooltip content={t('processing.playfair.cracker.tooltips.improve')}>
                  <Button appearance="primary" data-guide="improve-square" onClick={runImprove}>
                    {t('processing.playfair.cracker.improve.improveButton')}
                  </Button>
                </Tooltip>
                <Tooltip content={t('processing.playfair.cracker.tooltips.auto')}>
                  <Button onClick={runAuto}>
                    {t('processing.playfair.cracker.improve.autoButton')}
                  </Button>
                </Tooltip>
              </Pane>
              {exhausted && (
                <Text size={300} display="block" marginTop="4px">
                  {t('processing.playfair.cracker.improve.noImprovement')}
                </Text>
              )}
              <SquareGrid square={square} selected={selectedCells} onSelect={selectCell} />
              <Pane marginTop="12px">
                <Text size={300} display="block">{t('processing.cracker.wizard.previewTitle')}</Text>
                <Text fontFamily="monospace" size={300} display="block" wordBreak="break-all">
                  {plaintext.replace(/\s/g, ' ').slice(0, 200)}
                </Text>
              </Pane>
            </Pane>
          )}

          {step === 3 && square && (
            <Pane marginTop="12px">
              <Text size={300} display="block">
                {t('processing.playfair.cracker.done.keyLabel')}
              </Text>
              <Text fontFamily="monospace" display="block">
                {squareToKey(square)}
              </Text>
              <Text fontFamily="monospace" size={300} display="block" marginTop="8px" wordBreak="break-all">
                {plaintext.slice(0, 200)}
              </Text>
            </Pane>
          )}
        </CrackerWizardFrame>
      </Pane>
    </Pane>
  );
};

PlayfairCryptoanalysis.displayName = 'PlayfairCryptoanalysis';

export default PlayfairCryptoanalysis;
