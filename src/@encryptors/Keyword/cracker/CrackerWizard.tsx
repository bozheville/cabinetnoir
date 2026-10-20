import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Pane, Text, Tooltip } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import {
  countSymbols,
  extractWords,
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

const StepText = styled(Text)`
  display: block;
  margin-bottom: 8px;
`;

const WordRow = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const CandidateButton = styled.button`
  font-family: monospace;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue[300]};
  background: ${({ theme }) => theme.colorScheme.blue[50]};
  cursor: pointer;
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
  const recoveredAlphabet = useMemo(
    () => ALPHABET.split('').map((letter) => inverse[letter] || '·').join(''),
    [inverse],
  );
  const complete = distinct > 0
    && unassigned.length === 0
    && Object.keys(inverse).length === 26;
  const keywordGuess = complete ? keywordFromAlphabet(recoveredAlphabet) : null;

  const patternMatches = hints.patterns && step === 3
    ? findPatternMatches(words, mapping)
    : [];
  const doubles = hints.doubles && step === 3 ? findDoubles(symbols) : [];
  const oneLetterWords = hints.doubles && step === 3 ? findOneLetterWords(words) : [];

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
            <Text size={300} color="amber500" display="block">
              {t('processing.cracker.wizard.inputChanged')}
            </Text>
          )}
          {normalized.letters.length > 0 && (
            <ShortTextWarning letters={normalized.letters} />
          )}
        </>
      )}
    >
      {step > 1 && (
        <Pane display="flex" gap={8} marginBottom={8}>
          <Tooltip content={t('processing.cracker.tooltips.undo')}>
            <Button size="small" disabled={!history.canUndo} onClick={history.undo}>
              {t('processing.cracker.assignment.undo')}
            </Button>
          </Tooltip>
          <Tooltip content={t('processing.cracker.tooltips.redo')}>
            <Button size="small" disabled={!history.canRedo} onClick={history.redo}>
              {t('processing.cracker.assignment.redo')}
            </Button>
          </Tooltip>
          <Button size="small" onClick={history.clear}>
            {t('processing.cracker.assignment.clearAll')}
          </Button>
        </Pane>
      )}
      {step === 1 && (
        <Pane marginTop={12}>
          <StepText size={300}>
            {t('processing.keyword.cracker.wizard.count.summary', {
              letters: normalized.letters.length,
              distinct,
            })}
          </StepText>
          <StepText size={300}>
            {t('processing.keyword.cracker.wizard.count.hint')}
          </StepText>
          {board({ readOnly: true })}
        </Pane>
      )}
      {step === 2 && (
        <Pane marginTop={12}>
          <StepText size={300}>
            {t('processing.keyword.cracker.wizard.obvious.hint')}
          </StepText>
          {board({ showSuggestions: true })}
        </Pane>
      )}
      {step === 3 && (
        <Pane marginTop={12}>
          <StepText size={300}>
            {t('processing.keyword.cracker.wizard.words.hint')}
          </StepText>
          {hints.patterns && patternMatches.length === 0 && (
            <StepText size={300}>
              {t('processing.keyword.cracker.wizard.words.none')}
            </StepText>
          )}
          {hints.patterns && patternMatches.slice(0, 6).map(({ word, candidates }) => (
            <WordRow key={`${word}-${candidates[0]}`}>
              <Text fontFamily="monospace" size={300}>{word} →</Text>
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
            <StepText size={300}>
              {t('processing.keyword.cracker.wizard.words.doubles', {
                doubles: doubles.slice(0, 4)
                  .map(({ symbol }) => `${symbol}${symbol}`)
                  .join(', '),
              })}
            </StepText>
          )}
          {hints.doubles && oneLetterWords.length > 0 && (
            <StepText size={300}>
              {t('processing.keyword.cracker.wizard.words.oneLetter', {
                words: oneLetterWords.slice(0, 4).map(({ word }) => word).join(', '),
              })}
            </StepText>
          )}
          {board({ showSuggestions: false })}
        </Pane>
      )}
      {step === 4 && (
        <Pane marginTop={12}>
          <StepText size={300}>
            {t('processing.keyword.cracker.wizard.gaps.hint')}
          </StepText>
          {board({ showSuggestions: true })}
        </Pane>
      )}
      {step === 5 && (
        <Pane marginTop={12} display="flex" flexDirection="column" gap={8}>
          <StepText size={300}>
            {t('processing.keyword.cracker.wizard.done.alphabet')}
          </StepText>
          <Text fontFamily="monospace" wordBreak="break-all">{recoveredAlphabet}</Text>
          {keywordGuess && (
            <Text size={400} color="green600">
              {t('processing.keyword.cracker.wizard.done.keyword', { keyword: keywordGuess })}
            </Text>
          )}
          {!keywordGuess && complete && (
            <Text size={300}>
              {t('processing.keyword.cracker.wizard.done.noKeyword')}
            </Text>
          )}
          {!complete && (
            <Text size={300} color="amber500">
              {t('processing.keyword.cracker.wizard.done.incomplete')}
            </Text>
          )}
        </Pane>
      )}
      {hints.livePreview && !complete && step < 5 && (
        <Pane marginTop={12}>
          <Text size={300} display="block">
            {t('processing.cracker.wizard.previewTitle')}
          </Text>
          {board({ readOnly: true })}
        </Pane>
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'KeywordCrackerWizard';

export default CrackerWizard;
