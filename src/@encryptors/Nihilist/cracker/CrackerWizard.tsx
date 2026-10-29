import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Button } from '@atoms';
import { CipherText, Minion } from '@typography';
import {
  findConflicts,
  scoreTrigrams,
  STANDARD_ALPHABET,
  suggestByContext,
  suggestDoubledSymbols,
  suggestSymbolDigraphs,
  suggestSymbolTrigraphs,
} from '@encryptors/shared/analysis';
import {
  CandidateCards,
  CrackerWizardFrame,
  ShortTextWarning,
  useAssignmentHistory,
} from '@encryptors/shared/cracker';
import PolybiusSquare from '@encryptors/shared/polybius/PolybiusSquare';
import {
  assembleSquareFromMapping,
  expandSquare,
  fromCoordinates,
  squareCoordinates,
} from '@encryptors/shared/polybius';
import SquareDecipherStep from '@encryptors/shared/polybius/SquareDecipherStep';
import { keywordFromAlphabet } from '@encryptors/Keyword/keyword-crypt';
import {
  parseNihilistNumbers,
  splitSum,
} from '../nihilist-crypt';
import {
  columnNumbers,
  consistentKeyNumbers,
  rankKeyLengths,
} from '../analysis';
import { HintConfig } from './hintSettings';

// The 25 possible key numbers: two digits, each 1–5.
const KEY_NUMBERS = [1, 2, 3, 4, 5].flatMap((row) =>
  [1, 2, 3, 4, 5].map((column) => row * 10 + column));

// The board's cells laid out as the square itself: 11–55 in reading order.
const SQUARE_COORDINATES = squareCoordinates(5);

const StepText = styled(Minion)`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const StepTextTop = styled(StepText)`
  margin-top: 12px;
`;

const InputChangedNote = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const StepBlock = styled.div`
  margin-top: 12px;
`;

const ColumnBlock = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColumnNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const KeyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 52px);
  gap: 6px;
  justify-content: center;
  margin: 8px 0;
`;

// One of the 25 possible key numbers: brass-filled when pinned
// (the shared cell-highlight language), parchment-dimmed when the
// range constraint rules it out.
const KeyButton = styled.button<{
  $pinned: boolean;
  $impossible: boolean;
}>`
  width: 52px;
  height: 34px;
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  font-weight: ${({ $pinned }) => ($pinned ? 700 : 400)};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  background: ${({ theme }) => theme.paper.ivory};
  opacity: ${({ $impossible }) => ($impossible ? 0.4 : 1)};
  cursor: pointer;

  ${({ theme, $pinned }) => ($pinned
    ? `background: ${theme.metal.brass.light}59; border-color: ${theme.metal.brass.dark};`
    : '')}
  ${({ theme, $impossible }) => ($impossible
    ? `background: ${theme.paper.parchment};`
    : '')}
`;

const ColumnText = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
`;

const PinnedRow = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ValueRow = styled(Minion)<{ $ok: boolean }>`
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ $ok, theme }) => ($ok ? theme.metal.brass.base : theme.ink.red)};
`;

const DoneBlock = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DoneRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const DoneKeyLabel = styled(Minion)`
  display: block;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const DoneKeyStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DoneKey = styled(Minion)`
  color: ${({ theme }) => theme.ink.cream};
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 16px;
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

interface CrackerWizardProps {
  input: string;
  hintConfig: HintConfig;
  // "Use this result": hands the square (keyword or full square) and the
  // additive key over, square first.
  onUseKey: (keys: string[]) => void;
  onSkip: () => void;
  // Undo/redo/clear controls for the assignment-board step.
  history: ReturnType<typeof useAssignmentHistory>;
}

// The Nihilist cracker: four steps, one decision each.
// 1. Key length — candidate cards from the stream's periodicity.
// 2. Key numbers — column by column, the 1–5 range constraint lights up
//    red/green; the user tries values until the column clicks.
// 3. The square — the stripped stream is a plain Polybius substitution;
//    the assignment board rebuilds it letter by letter.
// 4. Done — the recovered square and key hand back to the tool.
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
  const [keyLength, setKeyLength] = useState<number | null>(null);
  const [pinned, setPinned] = useState<Record<number, number>>({});
  const [column, setColumn] = useState(0);
  const {
    mapping,
    assign,
    reset,
  } = history;

  const numbers = useMemo(() => parseNihilistNumbers(input), [input]);

  // A new ciphertext invalidates the work done so far.
  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current !== input) {
      previousInput.current = input;
      reset();
      setHasInputChanged(true);
      setStep(1);
      setKeyLength(null);
      setPinned({});
      setColumn(0);
    }
  }, [input]);

  const hints = hintConfig.hints;

  const candidates = useMemo(
    () => rankKeyLengths(numbers).slice(0, 6),
    [numbers],
  );

  const length = keyLength ?? 0;
  const allPinned = length > 0
    && Array.from({ length }, (_, index) => index)
      .every((index) => typeof pinned[index] === 'number');

  // The stripped stream: each number minus its pinned key number lands
  // back in the square (both digits 1–5) — plain Polybius coordinates.
  const coordinates = useMemo(() => {
    if (!allPinned) {
      return [];
    }
    return numbers.map((value, index) => {
      const [sumRow, sumColumn] = splitSum(value);
      const [keyRow, keyColumn] = splitSum(pinned[index % length]);
      return `${sumRow - keyRow}${sumColumn - keyColumn}`;
    });
  }, [numbers, pinned, length, allPinned]);

  const symbols = useMemo(() => {
    const seen: string[] = [];
    coordinates.forEach((pair) => {
      if (pair.length === 2 && !seen.includes(pair)) {
        seen.push(pair);
      }
    });
    return seen;
  }, [coordinates]);

  const conflicts = findConflicts(mapping);
  // Every cell of the square is assignable — including pairs the
  // ciphertext never produces, which a short text can lack but the
  // square still needs for the hand-off.
  const unassigned = SQUARE_COORDINATES.filter((symbol) => !mapping[symbol]);
  const complete = allPinned
    && symbols.length > 0
    && unassigned.length === 0
    && conflicts.length === 0;

  // The recovered square, row-major; unassigned cells stay dots. The
  // hand-off stays disabled until every one of the 25 cells is decided
  // — a text can lack a rare letter's pair, and a half-known square
  // would decode wrongly in the tool.
  const recoveredSquare = useMemo(
    () => assembleSquareFromMapping(mapping, { size: 5, fill: 'dots' }),
    [mapping],
  );
  const squareComplete = !recoveredSquare.includes('·');
  // The additive key word, read back through the recovered square.
  // Keyword bonus: re-expand the 25-letter square into a 26-letter
  // alphabet (J rides in right after I) and let the keyword engine
  // recognise the pattern — same trick the Keyword cracker uses.
  const keywordGuess = useMemo(
    () => (squareComplete ? keywordFromAlphabet(expandSquare(recoveredSquare)) : null),
    [recoveredSquare, squareComplete],
  );

  // The additive key word, read back through the recovered square.
  const recoveredKey = useMemo(() => {
    if (!squareComplete) {
      return '';
    }
    return Array.from({ length }, (_, index) => {
      const keyNumber = pinned[index];
      const [row, column] = splitSum(keyNumber);
      return fromCoordinates(`${row}${column}`, recoveredSquare) || '·';
    }).join('');
  }, [pinned, length, recoveredSquare, squareComplete]);

  const partialPlaintext = useMemo(
    () => coordinates
      .map((pair) => mapping[pair] || '·')
      .join(''),
    [coordinates, mapping],
  );

  // Feedback for step 3: how English the draft reads. The unassigned
  // dots are skipped — only decided letters count.
  const englishScore = useMemo(
    () => scoreTrigrams(partialPlaintext.replace(/[^A-Z]/g, '')),
    [partialPlaintext],
  );

  // The letter-combination hints: frequent coordinate pairs and
  // triples with the plaintext digraphs/trigraphs they could be, plus
  // the doubled-symbol tell — consistent with what's placed.
  const combinationHints = useMemo(
    () => suggestSymbolDigraphs(coordinates, mapping),
    [coordinates, mapping],
  );
  const trigraphHints = useMemo(
    () => suggestSymbolTrigraphs(coordinates, mapping),
    [coordinates, mapping],
  );
  const doubleHints = useMemo(
    () => suggestDoubledSymbols(coordinates, mapping),
    [coordinates, mapping],
  );

  // Contextual suggestions for step 3: candidate letters scored by
  // digram/trigram fit with the letters the user already placed around
  // each occurrence — frequency ranking is the prior until then.
  const contextualSuggestions = useMemo(
    () => suggestByContext(coordinates, mapping, STANDARD_ALPHABET),
    [coordinates, mapping],
  );

  // --- Step 2 helpers ---
  const currentColumn = useMemo(
    () => columnNumbers(numbers, length, column),
    [numbers, length, column],
  );
  const pinnedValue = pinned[column];
  const impossible = useMemo(() => {
    if (!hints.greyImpossible) {
      return new Set<number>();
    }
    const possible = new Set(consistentKeyNumbers(currentColumn));
    return new Set(KEY_NUMBERS.filter((value) => !possible.has(value)));
  }, [currentColumn, hints.greyImpossible]);

  const feedback = useMemo(() => {
    if (typeof pinnedValue !== 'number') {
      return null;
    }
    const [keyRow, keyColumn] = splitSum(pinnedValue);
    return currentColumn.map((value) => {
      const [sumRow, sumColumn] = splitSum(value);
      const row = sumRow - keyRow;
      const col = sumColumn - keyColumn;
      return { value, ok: row >= 1 && row <= 5 && col >= 1 && col <= 5 };
    });
  }, [pinnedValue, currentColumn]);

  const pin = (value: number) => {
    setPinned((current) => ({ ...current, [column]: value }));
  };

  const stepNames = [
    t('processing.nihilist.cracker.wizard.steps.length'),
    t('processing.nihilist.cracker.wizard.steps.key'),
    t('processing.nihilist.cracker.wizard.steps.square'),
    t('processing.nihilist.cracker.wizard.steps.done'),
  ];

  const canGoNext = step === 1
    ? keyLength !== null
    : step === 2 ? allPinned : step < 4;

  return (
    <CrackerWizardFrame
      steps={stepNames}
      step={step}
      onBack={() => setStep(step - 1)}
      onNext={() => setStep(step + 1)}
      canGoNext={canGoNext}
      useLabel={t('processing.cracker.wizard.useKey')}
      onUse={() => onUseKey([
        keywordGuess || recoveredSquare,
        recoveredKey,
      ])}
      useDisabled={!squareComplete}
      onSkip={onSkip}
      message={(
        <>
          {hasInputChanged && (
            <InputChangedNote>
              {t('processing.cracker.wizard.inputChanged')}
            </InputChangedNote>
          )}
          {numbers.length > 0 && (
            <ShortTextWarning letters={'x'.repeat(Math.min(numbers.length, 200))} />
          )}
        </>
      )}
    >
      {step === 1 && (
        <StepBlock>
          <StepText>
            {t('processing.nihilist.cracker.wizard.length.hint', { count: numbers.length })}
          </StepText>
          {candidates.length === 0 ? (
            <StepText>{t('processing.nihilist.cracker.wizard.length.tooShort')}</StepText>
          ) : (
            <CandidateCards
              items={candidates.map((candidate) => ({
                id: String(candidate.length),
                label: String(candidate.length),
                confidence: candidate.confidence,
              }))}
              selectedId={keyLength === null ? null : String(keyLength)}
              onSelect={(id) => {
                setKeyLength(Number(id));
                setPinned({});
                setColumn(0);
              }}
              matchLabel={t('processing.cracker.wizard.match')}
              dataGuide="key-length-cards"
            />
          )}
        </StepBlock>
      )}

      {step === 2 && (
        <ColumnBlock>
          <StepText>
            {t('processing.nihilist.cracker.wizard.key.hint')}
          </StepText>
          <ColumnNav>
            <Button
              size="sm"
              variant="secondary"
              disabled={column === 0}
              onClick={() => setColumn(column - 1)}
            >
              ←
            </Button>
            <ColumnText>
              {t('processing.nihilist.cracker.wizard.key.column', {
                current: column + 1,
                total: length,
              })}
            </ColumnText>
            <Button
              size="sm"
              variant="secondary"
              disabled={column >= length - 1}
              onClick={() => setColumn(column + 1)}
            >
              →
            </Button>
            <PinnedRow>
              {Array.from({ length }, (_, index) => (
                typeof pinned[index] === 'number'
                  ? String(pinned[index]).padStart(2, '0')
                  : '··'
              )).join(' ')}
            </PinnedRow>
          </ColumnNav>
          <KeyGrid data-guide="key-number-grid">
            {KEY_NUMBERS.map((value) => (
              <KeyButton
                key={value}
                type="button"
                data-guide="key-number"
                $pinned={pinnedValue === value}
                $impossible={impossible.has(value)}
                disabled={impossible.has(value)}
                onClick={() => pin(value)}
              >
                {value}
              </KeyButton>
            ))}
          </KeyGrid>
          {feedback && (
            <FeedbackList data-guide="column-feedback">
              {feedback.map(({ value, ok }) => (
                <ValueRow key={value} $ok={ok}>
                  {ok ? '✓' : '✗'} {value}
                </ValueRow>
              ))}
            </FeedbackList>
          )}
          <StepText>
            {t('processing.nihilist.cracker.wizard.key.feedback')}
          </StepText>
        </ColumnBlock>
      )}

      {step === 3 && (
        <>
          <StepTextTop>
            {t('processing.nihilist.cracker.wizard.square.hint')}
          </StepTextTop>
          <SquareDecipherStep
            symbols={coordinates}
            mapping={mapping}
            onAssign={assign}
            size={5}
            alphabet={STANDARD_ALPHABET}
            history={history}
            showSuggestions={hints.suggestions}
            suggestions={contextualSuggestions}
            combinationHints={hints.suggestions ? {
              digraphs: combinationHints,
              trigraphs: trigraphHints,
              doubles: doubleHints,
            } : null}
            fill="dots"
            englishness={englishScore}
          />
        </>
      )}

      {step === 4 && (
        <DoneBlock>
          <StepText>
            {t('processing.nihilist.cracker.wizard.done.hint')}
          </StepText>
          <DoneRow>
            <div>
              <DoneKeyLabel>
                {t('processing.nihilist.cracker.wizard.done.square')}
              </DoneKeyLabel>
              <PolybiusSquare square={recoveredSquare} />
            </div>
            <DoneKeyStack>
              <DoneKeyLabel>
                {t('processing.nihilist.cracker.wizard.done.keyLabel')}
              </DoneKeyLabel>
              <DoneKey>{recoveredKey}</DoneKey>
              {keywordGuess && (
                <KeywordGuess>
                  {t('processing.nihilist.cracker.wizard.done.keyword', { keyword: keywordGuess })}
                </KeywordGuess>
              )}
              {!complete && (
                <PlainNote>
                  {t('processing.nihilist.cracker.wizard.done.incomplete')}
                </PlainNote>
              )}
            </DoneKeyStack>
          </DoneRow>
        </DoneBlock>
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'NihilistCrackerWizard';

export default CrackerWizard;
