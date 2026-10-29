import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import { Button } from '@atoms';
import { CipherText, Minion } from '@typography';
import {
  countSymbols,
  extractWords,
  findConflicts,
  findDoubles,
  findOneLetterWords,
  findPatternMatches,
  normalize,
  SymbolMapping,
} from '@encryptors/shared/analysis';
import {
  AssignmentBoard,
  CrackerWizardFrame,
  ShortTextWarning,
  useAssignmentHistory,
} from '@encryptors/shared/cracker';
import { keywordFromAlphabet, STANDARD_ALPHABET } from '../keyword-crypt';
import { HintConfig } from './hintSettings';

const ALPHABET = STANDARD_ALPHABET;

const StepText = styled(Minion)`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const InputChangedNote = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const HistoryRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const StepBlock = styled.div`
  margin-top: 12px;
`;

const DoneBlock = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WordRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const WordText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
`;

// A pattern-candidate chip: a brass-washed mono button.
const CandidateButton = styled.button`
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.cream};
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.metal.brass.dark};
  background: ${({ theme }) => `${theme.metal.brass.light}26`};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.metal.copper.dark};
  }
`;

const RecoveredAlphabet = styled(CipherText)`
  color: ${({ theme }) => theme.ink.cream};
  word-break: break-all;
`;

// The recovered keyword: engraved brass on the leather.
const KeywordGuess = styled(Minion)`
  color: ${({ theme }) => theme.metal.brass.light};
  font-size: 16px;
  font-weight: 700;
`;

const PlainNote = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const PreviewLabel = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

interface CrackerWizardProps {
  input: string;
  hintConfig: HintConfig;
  // "Use this key": hands the recovered 26-letter cipher alphabet over.
  onUseKey: (alphabet: string) => void;
  onSkip: () => void;
  // Undo/redo/clear controls, rendered by the wizard next to the steps.
  history: ReturnType<typeof useAssignmentHistory>;
}

// Keyword substitution cracker: five steps, each one kind of decision.
// The tool measures and highlights; every assignment is the user's click.
const CrackerWizard: React.FC<CrackerWizardProps> = ({
  input,
  hintConfig,
  onUseKey,
  onSkip,
  history,
}) => {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(1);
  const [hasInputChanged, setHasInputChanged] = useState(false);
  const {
    mapping,
    assign,
    replaceAll,
    reset,
  } = history;

  const normalized = useMemo(() => normalize(input), [input]);
  const symbols = useMemo(() => normalized.letters.split(''), [normalized]);
  const frequencies = useMemo(() => countSymbols(symbols), [symbols]);
  const words = useMemo(() => extractWords(input), [input]);

  // A new ciphertext invalidates the work done so far.
  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current !== input) {
      previousInput.current = input;
      reset();
      setHasInputChanged(true);
      setStep(1);
    }
  }, [input]);

  const hints = hintConfig.hints;

  const distinct = frequencies.length;
  const unassigned = frequencies.filter(({ symbol }) => !mapping[symbol]);
  const inverse = useMemo(() => {
    const result: Record<string, string> = {};
    for (const [symbol, letter] of Object.entries(mapping)) {
      result[letter] = symbol;
    }
    return result;
  }, [mapping]);
  const recoveredAlphabet = useMemo(() => {
    // Plain letters the ciphertext never reaches cannot be recovered;
    // fill them with the unused cipher letters in alphabetical order so
    // the hand-off alphabet stays a valid permutation (the fill is shown
    // and noted on the Done step).
    const boundSymbols = new Set(Object.keys(mapping));
    const freeSymbols = ALPHABET.split('').filter((letter) => !boundSymbols.has(letter));
    return ALPHABET.split('')
      .map((letter) => inverse[letter] || freeSymbols.shift() || '·')
      .join('');
  }, [inverse, mapping]);
  const complete = distinct > 0
    && unassigned.length === 0
    && findConflicts(mapping).length === 0;
  const all26 = Object.keys(inverse).length === 26;
  const keywordGuess = all26 ? keywordFromAlphabet(recoveredAlphabet) : null;

  const patternMatches = hints.patterns && step === 3
    ? findPatternMatches(words, mapping)
    : [];
  const doubles = hints.doubles && step === 3 ? findDoubles(symbols) : [];
  const oneLetterWords = hints.doubles && step === 3 ? findOneLetterWords(words) : [];
  const conflicts = findConflicts(mapping);

  const applyWord = (word: string, candidate: string) => {
    const next: SymbolMapping = { ...mapping };
    for (let i = 0; i < word.length; i += 1) {
      next[word[i]] = candidate[i];
    }
    replaceAll(next);
  };

  const highlighted = useMemo(() => {
    if (step === 2) {
      return unassigned.slice(0, 3).map(({ symbol }) => symbol);
    }
    if (step === 4) {
      return unassigned.map(({ symbol }) => symbol);
    }
    return [];
  }, [step, unassigned]);

  const stepNames = [
    t('processing.keyword.cracker.wizard.steps.count'),
    t('processing.keyword.cracker.wizard.steps.obvious'),
    t('processing.keyword.cracker.wizard.steps.words'),
    t('processing.keyword.cracker.wizard.steps.gaps'),
    t('processing.keyword.cracker.wizard.steps.done'),
  ];

  const canGoNext = step === 1 ? normalized.letters.length > 0 : step < 5;

  const board = (options: { readOnly?: boolean; showSuggestions?: boolean }) => (
    <AssignmentBoard
      symbols={symbols}
      mapping={mapping}
      onAssign={assign}
      alphabet={ALPHABET}
      input={input}
      normalized={normalized}
      highlighted={highlighted}
      showSuggestions={options.showSuggestions && hints.suggestions}
      readOnly={options.readOnly}
    />
  );

  return (
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(step - 1)}
      onNext={() => setStep(step + 1)}
      canGoNext={canGoNext}
      useLabel={t('processing.cracker.wizard.useKey')}
      onUse={() => onUseKey(recoveredAlphabet)}
      useDisabled={!complete}
      onSkip={onSkip}
      message={(
        <>
          {hasInputChanged && (
            <InputChangedNote>
              {t('processing.cracker.wizard.inputChanged')}
            </InputChangedNote>
          )}
          {normalized.letters.length > 0 && (
            <ShortTextWarning letters={normalized.letters} />
          )}
        </>
      )}
    >
      {step > 1 && (
        <HistoryRow>
          <Tooltip content={t('processing.cracker.tooltips.undo')}>
            <Button size="sm" variant="secondary" disabled={!history.canUndo} onClick={history.undo}>
              {t('processing.cracker.assignment.undo')}
            </Button>
          </Tooltip>
          <Tooltip content={t('processing.cracker.tooltips.redo')}>
            <Button size="sm" variant="secondary" disabled={!history.canRedo} onClick={history.redo}>
              {t('processing.cracker.assignment.redo')}
            </Button>
          </Tooltip>
          <Button size="sm" variant="secondary" onClick={history.clear}>
            {t('processing.cracker.assignment.clearAll')}
          </Button>
        </HistoryRow>
      )}
      {step === 1 && (
        <StepBlock>
          <StepText>
            {t('processing.keyword.cracker.wizard.count.summary', {
              letters: normalized.letters.length,
              distinct,
            })}
          </StepText>
          <StepText>
            {t('processing.keyword.cracker.wizard.count.hint')}
          </StepText>
          {board({ readOnly: true })}
        </StepBlock>
      )}
      {step === 2 && (
        <StepBlock>
          <StepText>
            {t('processing.keyword.cracker.wizard.obvious.hint')}
          </StepText>
          {board({ showSuggestions: true })}
        </StepBlock>
      )}
      {step === 3 && (
        <StepBlock>
          <StepText>
            {t('processing.keyword.cracker.wizard.words.hint')}
          </StepText>
          {hints.patterns && patternMatches.length === 0 && (
            <StepText>
              {t('processing.keyword.cracker.wizard.words.none')}
            </StepText>
          )}
          {hints.patterns && patternMatches.slice(0, 6).map(({ word, candidates }) => (
            <WordRow key={`${word}-${candidates[0]}`}>
              <WordText>{word} →</WordText>
              {candidates.slice(0, 5).map((candidate) => (
                <Tooltip
                  key={candidate}
                  content={t('processing.keyword.cracker.wizard.words.apply')}
                >
                  <CandidateButton
                    type="button"
                    data-guide="pattern-candidate"
                    onClick={() => applyWord(word, candidate)}
                  >
                    {candidate}
                  </CandidateButton>
                </Tooltip>
              ))}
            </WordRow>
          ))}
          {hints.doubles && doubles.length > 0 && (
            <StepText>
              {t('processing.keyword.cracker.wizard.words.doubles', {
                doubles: doubles.slice(0, 4)
                  .map(({ symbol }) => `${symbol}${symbol}`)
                  .join(', '),
              })}
            </StepText>
          )}
          {hints.doubles && oneLetterWords.length > 0 && (
            <StepText>
              {t('processing.keyword.cracker.wizard.words.oneLetter', {
                words: oneLetterWords.slice(0, 4).map(({ word }) => word).join(', '),
              })}
            </StepText>
          )}
          {board({ showSuggestions: false })}
        </StepBlock>
      )}
      {step === 4 && (
        <StepBlock>
          <StepText>
            {t('processing.keyword.cracker.wizard.gaps.hint')}
          </StepText>
          {board({ showSuggestions: true })}
        </StepBlock>
      )}
      {step === 5 && (
        <DoneBlock>
          <StepText>
            {t('processing.keyword.cracker.wizard.done.alphabet')}
          </StepText>
          <RecoveredAlphabet>{recoveredAlphabet}</RecoveredAlphabet>
          {keywordGuess && (
            <KeywordGuess>
              {t('processing.keyword.cracker.wizard.done.keyword', { keyword: keywordGuess })}
            </KeywordGuess>
          )}
          {!keywordGuess && complete && (
            <PlainNote>
              {t('processing.keyword.cracker.wizard.done.noKeyword')}
            </PlainNote>
          )}
          {!complete && (
            <PlainNote>
              {t('processing.keyword.cracker.wizard.done.incomplete')}
            </PlainNote>
          )}
          {complete && !all26 && (
            <PlainNote>
              {t('processing.keyword.cracker.wizard.done.fillNote')}
            </PlainNote>
          )}
        </DoneBlock>
      )}
      {hints.livePreview && !complete && step < 5 && (
        <StepBlock>
          <PreviewLabel>
            {t('processing.cracker.wizard.previewTitle')}
          </PreviewLabel>
          {board({ readOnly: true })}
        </StepBlock>
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'KeywordCrackerWizard';

export default CrackerWizard;
