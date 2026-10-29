import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, TextInput } from '@atoms';
import { CipherText, GreatPrimer, Minion } from '@typography';
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

const InputChangedNote = styled(Minion)`
  display: block;
  margin-top: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const StepBlock = styled.div`
  width: 100%;
  padding: 0 16px;
  margin-top: 8px;
`;

const StepTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
`;

const StepHint = styled(Minion)`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const RowText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
`;

const RowHint = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const OffsetList = styled.div`
  max-height: 260px;
  overflow-y: auto;
  margin-top: 8px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: 4px;
`;

// One drag candidate per row: the selected offset gets a copper left
// marker and a brass wash; the best offset an ink.green one.
const OffsetRow = styled.div<{ $selected: boolean; $best: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 12px;
  cursor: pointer;
  border-left: 3px solid
    ${({ $selected, $best, theme }) => ($selected
    ? theme.metal.copper.dark
    : $best ? theme.ink.green : 'transparent')};
  background: ${({ $selected, theme }) => ($selected ? `${theme.metal.brass.light}26` : 'transparent')};

  &:hover {
    background: ${({ $selected, theme }) => ($selected ? `${theme.metal.brass.light}26` : `${theme.paper.vellum}14`)};
  }
`;

const OffsetText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
`;

const OffsetFragment = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
  font-weight: 600;
`;

// Score: a brass rail with a copper fill.
const ScoreBar = styled.div`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.metal.brass.base};
  overflow: hidden;
  flex: none;
`;

const ScoreFill = styled.div<{ $score: number }>`
  height: 100%;
  background: ${({ theme }) => theme.metal.copper.base};
  width: ${({ $score }) => `${$score}%`};
`;

const Worksheet = styled.div`
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.cream};
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
  margin-top: 8px;
`;

const CribSpan = styled.span`
  color: ${HIGHLIGHT_COLORS[0]};
  font-weight: 700;
`;

const PrimerFillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

// A missing primer letter's typewriter key.
const PrimerCell = styled(TextInput)`
  width: 40px;

  input {
    height: 34px;
    padding: 0;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
  }
`;

const PrimerKey = styled(CipherText)`
  color: ${({ theme }) => theme.ink.cream};
  font-size: 18px;
  font-weight: 700;
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
            <InputChangedNote>
              {t('processing.cracker.wizard.inputChanged')}
            </InputChangedNote>
          )}
          {normalized && <ShortTextWarning letters={normalized.letters} />}
        </>
      )}
    >
      {step === 1 && (
        <StepBlock>
          <StepTitle>{t('processing.autokey.cracker.wizard.word.title')}</StepTitle>
          <StepHint>
            {t('processing.autokey.cracker.wizard.word.hint')}
          </StepHint>
          <InputRow data-guide="crib-input">
            <TextInput
              mono
              width="180px"
              value={word}
              onChange={(event) => setWord(event.target.value.toUpperCase())}
            />
            {cracker.suggestedCrib && cracker.suggestedCrib !== word && (
              <Button size="sm" variant="secondary" onClick={() => setWord(cracker.suggestedCrib as string)}>
                {`${t('processing.autokey.cracker.wizard.word.suggested')}: ${cracker.suggestedCrib}`}
              </Button>
            )}
            {['THE', 'AND'].filter((common) => common !== word).map((common) => (
              <Button key={common} size="sm" variant="secondary" onClick={() => setWord(common)}>
                {common}
              </Button>
            ))}
          </InputRow>
          <InputRow data-guide="primer-length">
            <RowText>{t('processing.autokey.cracker.wizard.word.primerLength')}</RowText>
            <TextInput
              mono
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
            <RowHint>
              {t('processing.autokey.cracker.wizard.word.primerHint')}
            </RowHint>
          </InputRow>
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock>
          <StepTitle>{t('processing.autokey.cracker.wizard.drag.title')}</StepTitle>
          <StepHint>
            {t('processing.autokey.cracker.wizard.drag.hint')}
          </StepHint>
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
                  <OffsetText>{`${candidate.offset}`}</OffsetText>
                  <OffsetFragment>{candidate.fragment}</OffsetFragment>
                  {hints.offsetScores && (
                    <ScoreBar>
                      <ScoreFill $score={candidate.score} />
                    </ScoreBar>
                  )}
                  {isBest && <RowHint>{t('processing.autokey.cracker.wizard.drag.likely')}</RowHint>}
                </OffsetRow>
              );
            })}
          </OffsetList>
        </StepBlock>
      )}

      {step === 3 && unrolled && offset !== null && (
        <StepBlock>
          <StepTitle>{t('processing.autokey.cracker.wizard.unroll.title')}</StepTitle>
          <StepHint>
            {t('processing.autokey.cracker.wizard.unroll.hint')}
          </StepHint>
          <Worksheet data-guide="unroll-worksheet">
            {Array.from({ length: Math.ceil(unrolled.plain.length / primerLength) }).map((_, row) => (
              <div key={row}>
                {unrolled.plain
                  .slice(row * primerLength, row * primerLength + primerLength)
                  .map((letter, column) => {
                    const position = row * primerLength + column;
                    const fromCrib = position >= offset && position < offset + word.length;
                    return (
                      fromCrib
                        ? <CribSpan key={column}>{letter ?? '_'}</CribSpan>
                        : <span key={column}>{letter ?? '_'}</span>
                    );
                  })}
              </div>
            ))}
          </Worksheet>
          {missingPrimer > 0 && (
            <PrimerFillRow data-guide="primer-fill">
              <RowText>{t('processing.autokey.cracker.wizard.unroll.fillMissing')}</RowText>
              {unrolled.primer.map((letter, index) => (
                <PrimerCell
                  key={index}
                  mono
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
            </PrimerFillRow>
          )}
        </StepBlock>
      )}

      {step === 4 && (
        <StepBlock>
          <StepTitle>{t('processing.autokey.cracker.wizard.done.title')}</StepTitle>
          <div style={{ marginTop: 8 }}>
            <PrimerKey>{assembledPrimer}</PrimerKey>
          </div>
          {hints.livePreview && primerComplete && (
            <>
              <StepTitle style={{ marginTop: 12 }}>{t('processing.cracker.wizard.previewTitle')}</StepTitle>
              <Worksheet>{autokeyDecrypt(cracker.input, assembledPrimer)}</Worksheet>
            </>
          )}
        </StepBlock>
      )}
    </CrackerWizardFrame>
  );
};

AutokeyCracker.displayName = 'AutokeyCracker';

export default AutokeyCracker;
