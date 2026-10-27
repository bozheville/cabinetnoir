import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { Button, Heading, Pane, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';

import {
  MAX_PRIMER_LENGTH,
  MIN_PRIMER_LENGTH,
  dragOffsets,
  unrollCrib,
  useAutokeyCracker,
} from './useAutokeyCracker';
import { autokeyDecrypt } from '../autokey-crypt';
import { CrackerWizardFrame, HIGHLIGHT_COLORS, ShortTextWarning } from '@encryptors/shared/cracker';
import { HintSettings } from './hintSettings';

const MAX_SHOWN_OFFSETS = 40;

const OffsetList = styled(Pane)`
  max-height: 260px;
  overflow-y: auto;
  margin-top: 8px;
  border: muted;
  border-radius: 4px;
`;

const OffsetRow = styled(Pane)<{ $selected: boolean; $best: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
  border-left: 3px solid
    ${({ $selected, $best, theme }) => ($selected
    ? theme.colorScheme.blue[500]
    : $best ? theme.colorScheme.green[500] : 'transparent')};
  background: ${({ $selected, theme }) => ($selected ? theme.colorScheme.blue[50] : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme.colorScheme.gray[50]};
  }
`;

const ScoreBar = styled(Pane)`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.gray[300]};
  overflow: hidden;
  flex: none;
`;

const ScoreFill = styled(Pane)<{ $score: number }>`
  height: 100%;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
  width: ${({ $score }) => `${$score}%`};
`;

const Worksheet = styled(Pane)`
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
  margin-top: 8px;
`;

const PrimerCell = styled(TextInput)`
  width: 34px;
  height: 34px;
  text-align: center;
  font-family: monospace;
  font-weight: 700;
  font-size: 16px;
`;

interface AutokeyCrackerProps {
  cracker: ReturnType<typeof useAutokeyCracker>;
  hints: HintSettings;
  onUseKey: (primer: string) => void;
  onSkip: () => void;
}

// The autokey crib-drag wizard: 1. guess a word → 2. drag it along →
// 3. unroll the key → 4. done. The user does every decision (word,
// placement, missing primer letters); the arithmetic only unrolls what
// the placement implies — nothing is auto-placed.
const AutokeyCracker: React.FC<AutokeyCrackerProps> = ({ cracker, hints, onUseKey, onSkip }) => {
  const { t } = useTranslation('common');
  const {
    step,
    setStep,
    letters,
    normalized,
    word,
    setWord,
    primerLength,
    setPrimerLength,
    offset,
    setOffset,
    manualPrimer,
    setManualPrimer,
    hasInputChanged,
  } = cracker;

  const stepNames = [
    t('processing.autokey.cracker.wizard.steps.word'),
    t('processing.autokey.cracker.wizard.steps.drag'),
    t('processing.autokey.cracker.wizard.steps.unroll'),
    t('processing.autokey.cracker.wizard.steps.done'),
  ];

  const offsets = useMemo(
    () => (letters ? dragOffsets(letters, word) : []),
    [letters, word],
  );

  const unrolled = useMemo(
    () => (offset !== null && letters
      ? unrollCrib(letters, word, offset, primerLength)
      : null),
    [letters, word, offset, primerLength],
  );

  const missingPrimer = unrolled
    ? unrolled.primer.filter((letter) => letter === null).length
    : 0;
  const assembledPrimer = unrolled
    ? unrolled.primer.map((letter, index) => letter ?? manualPrimer[index] ?? '').join('')
    : '';
  const primerComplete = unrolled !== null && missingPrimer === 0
    && assembledPrimer.length === primerLength;

  const canGoNext = step === 1
    ? word.length > 0 && letters.length > word.length
    : step === 2
      ? offset !== null
      : step === 3
        ? primerComplete
        : false;

  const bestOffset = useMemo(() => {
    if (!hints.bestOffsetGlow || offsets.length === 0) {
      return null;
    }
    return offsets.reduce((best, candidate) => (candidate.score > best.score ? candidate : best));
  }, [offsets, hints.bestOffsetGlow]);

  const shownOffsets = useMemo(
    () => (hints.bestOffsetGlow
      ? [...offsets].sort((a, b) => b.score - a.score)
      : offsets),
    [offsets, hints.bestOffsetGlow],
  );

  return (
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(Math.max(1, step - 1))}
      onNext={() => setStep(step + 1)}
      canGoNext={canGoNext}
      useLabel={t('processing.cracker.wizard.useKey')}
      onUse={() => onUseKey(assembledPrimer)}
      onSkip={onSkip}
      message={(
        <>
          {hasInputChanged && (
            <Text size={300} display="block" marginTop="8px">
              {t('processing.cracker.wizard.inputChanged')}
            </Text>
          )}
          {normalized && <ShortTextWarning letters={normalized.letters} />}
        </>
      )}
    >
      {step === 1 && (
        <Pane width="100%" paddingX="16px" marginTop="8px">
          <Heading size={300}>{t('processing.autokey.cracker.wizard.word.title')}</Heading>
          <Text size={300} display="block" marginTop="4px">
            {t('processing.autokey.cracker.wizard.word.hint')}
          </Text>
          <Pane display="flex" alignItems="center" gap="8px" marginTop="8px" data-guide="crib-input">
            <TextInput
              width="180px"
              fontFamily="monospace"
              value={word}
              onChange={(event) => setWord(event.target.value.toUpperCase())}
            />
            {cracker.suggestedCrib && cracker.suggestedCrib !== word && (
              <Button size="small" onClick={() => setWord(cracker.suggestedCrib as string)}>
                {`${t('processing.autokey.cracker.wizard.word.suggested')}: ${cracker.suggestedCrib}`}
              </Button>
            )}
            {['THE', 'AND'].filter((common) => common !== word).map((common) => (
              <Button key={common} size="small" onClick={() => setWord(common)}>
                {common}
              </Button>
            ))}
          </Pane>
          <Pane display="flex" alignItems="center" gap="8px" marginTop="12px" data-guide="primer-length">
            <Text size={300}>{t('processing.autokey.cracker.wizard.word.primerLength')}</Text>
            <TextInput
              width="80px"
              type="number"
              min={MIN_PRIMER_LENGTH}
              max={MAX_PRIMER_LENGTH}
              value={primerLength}
              onChange={(event) => {
                const value = parseInt((event.target as HTMLInputElement).value, 10);
                if (!Number.isNaN(value) && value >= MIN_PRIMER_LENGTH && value <= MAX_PRIMER_LENGTH) {
                  setPrimerLength(value);
                }
              }}
            />
            <Text size={300} color="muted">
              {t('processing.autokey.cracker.wizard.word.primerHint')}
            </Text>
          </Pane>
        </Pane>
      )}

      {step === 2 && (
        <Pane width="100%" paddingX="16px" marginTop="8px">
          <Heading size={300}>{t('processing.autokey.cracker.wizard.drag.title')}</Heading>
          <Text size={300} display="block" marginTop="4px">
            {t('processing.autokey.cracker.wizard.drag.hint')}
          </Text>
          <OffsetList data-guide="offset-list">
            {shownOffsets.slice(0, MAX_SHOWN_OFFSETS).map((candidate) => {
              const isBest = bestOffset !== null && candidate.offset === bestOffset.offset;
              return (
                <OffsetRow
                  key={candidate.offset}
                  $selected={offset === candidate.offset}
                  $best={isBest}
                  onClick={() => setOffset(candidate.offset)}
                >
                  <Text size={300} fontFamily="monospace">{`${candidate.offset}`}</Text>
                  <Text size={300} fontFamily="monospace" fontWeight={600}>{candidate.fragment}</Text>
                  {hints.offsetScores && (
                    <ScoreBar>
                      <ScoreFill $score={candidate.score} />
                    </ScoreBar>
                  )}
                  {isBest && <Text size={300}>{t('processing.autokey.cracker.wizard.drag.likely')}</Text>}
                </OffsetRow>
              );
            })}
          </OffsetList>
        </Pane>
      )}

      {step === 3 && unrolled && offset !== null && (
        <Pane width="100%" paddingX="16px" marginTop="8px">
          <Heading size={300}>{t('processing.autokey.cracker.wizard.unroll.title')}</Heading>
          <Text size={300} display="block" marginTop="4px">
            {t('processing.autokey.cracker.wizard.unroll.hint')}
          </Text>
          <Worksheet data-guide="unroll-worksheet">
            {Array.from({ length: Math.ceil(unrolled.plain.length / primerLength) }).map((_, row) => (
              <div key={row}>
                {unrolled.plain
                  .slice(row * primerLength, row * primerLength + primerLength)
                  .map((letter, column) => {
                    const position = row * primerLength + column;
                    const fromCrib = position >= offset && position < offset + word.length;
                    return (
                      <span
                        key={column}
                        style={fromCrib
                          ? { color: HIGHLIGHT_COLORS[0], fontWeight: 700 }
                          : undefined}
                      >
                        {letter ?? '_'}
                      </span>
                    );
                  })}
              </div>
            ))}
          </Worksheet>
          {missingPrimer > 0 && (
            <Pane display="flex" alignItems="center" gap="6px" marginTop="12px" flexWrap="wrap" data-guide="primer-fill">
              <Text size={300}>{t('processing.autokey.cracker.wizard.unroll.fillMissing')}</Text>
              {unrolled.primer.map((letter, index) => (
                <PrimerCell
                  key={index}
                  maxLength={1}
                  value={letter ?? manualPrimer[index] ?? ''}
                  placeholder="_"
                  disabled={letter !== null}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value.toUpperCase().slice(-1);
                    if (!value || /[A-Z]/.test(value)) {
                      setManualPrimer((current) => ({ ...current, [index]: value }));
                    }
                  }}
                />
              ))}
            </Pane>
          )}
        </Pane>
      )}

      {step === 4 && (
        <Pane width="100%" paddingX="16px" marginTop="8px">
          <Heading size={300}>{t('processing.autokey.cracker.wizard.done.title')}</Heading>
          <Text size={300} fontFamily="monospace" fontSize={18} fontWeight={700} display="block" marginTop="8px">
            {assembledPrimer}
          </Text>
          {hints.livePreview && primerComplete && (
            <>
              <Heading size={300} marginTop="12px">{t('processing.cracker.wizard.previewTitle')}</Heading>
              <Worksheet>{autokeyDecrypt(cracker.input, assembledPrimer)}</Worksheet>
            </>
          )}
        </Pane>
      )}
    </CrackerWizardFrame>
  );
};

AutokeyCracker.displayName = 'AutokeyCracker';

export default AutokeyCracker;
