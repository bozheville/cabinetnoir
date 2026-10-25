import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Pane, Text } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import {
  findConflicts,
  scoreTrigrams,
  STANDARD_ALPHABET,
  suggestByContext,
} from '@encryptors/shared/analysis';
import {
  AssignmentBoard,
  CandidateCards,
  CrackerWizardFrame,
  ShortTextWarning,
  useAssignmentHistory,
} from '@encryptors/shared/cracker';
import PolybiusSquare from '@encryptors/shared/polybius/PolybiusSquare';
import { fromCoordinates, squareCoordinates } from '@encryptors/shared/polybius';
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

const StepText = styled(Text)`
  display: block;
  margin-bottom: 8px;
`;

const KeyGrid = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(5, 52px);
  gap: 6px;
  justify-content: center;
  margin: 8px 0;
`;

const KeyButton = styled.button<{
  $pinned: boolean;
  $impossible: boolean;
}>`
  width: 52px;
  height: 34px;
  font-family: monospace;
  font-weight: ${({ $pinned }) => ($pinned ? 700 : 400)};
  border-radius: 4px;
  border: 1px solid ${({ $pinned, theme }) => (
    $pinned ? theme.colorScheme.blue[500] : theme.colorScheme.gray[300]
  )};
  background: ${({ $pinned, $impossible, theme }) => (
    $pinned ? theme.colorScheme.blue[100]
      : $impossible ? theme.colorScheme.gray[100]
        : theme.colors.background
  )};
  opacity: ${({ $impossible }) => ($impossible ? 0.4 : 1)};
  cursor: pointer;
`;

const ValueRow = styled(Text)<{ $ok: boolean }>`
  font-family: monospace;
  font-size: 13px;
  color: ${({ $ok, theme }) => ($ok ? theme.colorScheme.blue_green[600] : theme.colorScheme.red[600])};
`;

const PreviewBox = styled(Pane)`
  padding: 10px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 140px;
  overflow-y: auto;
`;

// The step-3 feedback meter: how English the draft looks under the
// current partial square, 0-100 from the trigram scorer. Feedback only
// — the meter never assigns or solves anything.
const MeterTrack = styled(Pane)`
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colorScheme.gray[200]};
  margin-top: 4px;
`;

const MeterFill = styled(Pane)<{ $ratio: number }>`
  width: ${({ $ratio }) => Math.round($ratio * 100)}%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
  transition: width 0.15s ease-out;
`;

const EnglishnessMeter: React.FC<{ score: number }> = ({ score }) => {
  const { t } = useTranslation('common');
  return (
    <Pane marginTop={8} data-guide="englishness-meter">
      <Text size={200}>
        {t('processing.nihilist.cracker.wizard.square.englishness', { score })}
      </Text>
      <MeterTrack>
        <MeterFill $ratio={Math.max(0, Math.min(1, score / 100))} />
      </MeterTrack>
    </Pane>
  );
};

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
  // The step highlights the three unassigned cells with the strongest
  // frequency evidence — the same signal the bars carry — not merely
  // the first ones in reading order.
  const highlighted = useMemo(() => {
    const counts = new Map<string, number>();
    coordinates.forEach((pair) => {
      counts.set(pair, (counts.get(pair) || 0) + 1);
    });
    return unassigned
      .slice()
      .sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0))
      .slice(0, 3);
  }, [unassigned, coordinates]);
  const complete = allPinned
    && symbols.length > 0
    && unassigned.length === 0
    && conflicts.length === 0;

  // The recovered square, row-major; unassigned cells stay dots. The
  // hand-off stays disabled until every one of the 25 cells is decided
  // — a text can lack a rare letter's pair, and a half-known square
  // would decode wrongly in the tool.
  const recoveredSquare = useMemo(() => {
    const cells = new Array(25).fill('·');
    for (const [pair, letter] of Object.entries(mapping)) {
      const row = Number(pair[0]);
      const column = Number(pair[1]);
      if (row >= 1 && row <= 5 && column >= 1 && column <= 5) {
        cells[(row - 1) * 5 + (column - 1)] = letter;
      }
    }
    return cells.join('');
  }, [mapping]);

  const squareComplete = !recoveredSquare.includes('·');
  // The additive key word, read back through the recovered square.
  // Keyword bonus: re-expand the 25-letter square into a 26-letter
  // alphabet (J rides in right after I) and let the keyword engine
  // recognise the pattern — same trick the Keyword cracker uses.
  const keywordGuess = useMemo(() => {
    if (!squareComplete) {
      return null;
    }
    const i = recoveredSquare.indexOf('I');
    const alphabet26 = i === -1
      ? recoveredSquare
      : `${recoveredSquare.slice(0, i + 1)}J${recoveredSquare.slice(i + 1)}`;
    return keywordFromAlphabet(alphabet26);
  }, [recoveredSquare, squareComplete]);

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
            <Text size={300} color="amber500" display="block">
              {t('processing.cracker.wizard.inputChanged')}
            </Text>
          )}
          {numbers.length > 0 && (
            <ShortTextWarning letters={'x'.repeat(Math.min(numbers.length, 200))} />
          )}
        </>
      )}
    >
      {step === 3 && (
        <Pane display="flex" gap={8} marginBottom={8}>
          <Button size="small" disabled={!history.canUndo} onClick={history.undo}>
            {t('processing.cracker.assignment.undo')}
          </Button>
          <Button size="small" disabled={!history.canRedo} onClick={history.redo}>
            {t('processing.cracker.assignment.redo')}
          </Button>
          <Button size="small" onClick={history.clear}>
            {t('processing.cracker.assignment.clearAll')}
          </Button>
        </Pane>
      )}

      {step === 1 && (
        <Pane marginTop={12}>
          <StepText size={300}>
            {t('processing.nihilist.cracker.wizard.length.hint', { count: numbers.length })}
          </StepText>
          {candidates.length === 0 ? (
            <StepText size={300}>{t('processing.nihilist.cracker.wizard.length.tooShort')}</StepText>
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
        </Pane>
      )}

      {step === 2 && (
        <Pane marginTop={12} display="flex" flexDirection="column" gap={8}>
          <StepText size={300}>
            {t('processing.nihilist.cracker.wizard.key.hint')}
          </StepText>
          <Pane display="flex" alignItems="center" gap={8}>
            <Button
              size="small"
              disabled={column === 0}
              onClick={() => setColumn(column - 1)}
            >
              ←
            </Button>
            <Text size={300}>
              {t('processing.nihilist.cracker.wizard.key.column', {
                current: column + 1,
                total: length,
              })}
            </Text>
            <Button
              size="small"
              disabled={column >= length - 1}
              onClick={() => setColumn(column + 1)}
            >
              →
            </Button>
            <Text size={300} fontFamily="monospace">
              {Array.from({ length }, (_, index) => (
                typeof pinned[index] === 'number'
                  ? String(pinned[index]).padStart(2, '0')
                  : '··'
              )).join(' ')}
            </Text>
          </Pane>
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
            <Pane display="flex" flexDirection="column" gap={2} data-guide="column-feedback">
              {feedback.map(({ value, ok }) => (
                <ValueRow key={value} $ok={ok}>
                  {ok ? '✓' : '✗'} {value}
                </ValueRow>
              ))}
            </Pane>
          )}
          <StepText size={300}>
            {t('processing.nihilist.cracker.wizard.key.feedback')}
          </StepText>
        </Pane>
      )}

      {step === 3 && (
        <Pane marginTop={12} display="flex" flexDirection="column" gap={10}>
          <StepText size={300}>
            {t('processing.nihilist.cracker.wizard.square.hint')}
          </StepText>
          <AssignmentBoard
            symbols={coordinates}
            mapping={mapping}
            onAssign={assign}
            alphabet={STANDARD_ALPHABET}
            order={SQUARE_COORDINATES}
            highlighted={highlighted}
            showSuggestions={hints.suggestions}
            suggestions={contextualSuggestions}
          />
          {Object.keys(mapping).length > 0 && (
            <Pane display="flex" gap={16} alignItems="flex-start" flexWrap="wrap">
              <Pane>
                <Text size={300} display="block" marginBottom={4}>
                  {t('processing.nihilist.cracker.wizard.square.squareLabel')}
                </Text>
                <PolybiusSquare square={recoveredSquare || '·························'} />
              </Pane>
              <Pane flex={1} minWidth={240}>
                <Text size={300} display="block" marginBottom={4}>
                  {t('processing.cracker.wizard.previewTitle')}
                </Text>
                <PreviewBox data-guide="plaintext-preview">{partialPlaintext || '·'}</PreviewBox>
                <EnglishnessMeter score={englishScore} />
              </Pane>
            </Pane>
          )}
        </Pane>
      )}

      {step === 4 && (
        <Pane marginTop={12} display="flex" flexDirection="column" gap={8}>
          <StepText size={300}>
            {t('processing.nihilist.cracker.wizard.done.hint')}
          </StepText>
          <Pane display="flex" gap={16} flexWrap="wrap">
            <Pane>
              <Text size={300} display="block" marginBottom={4}>
                {t('processing.nihilist.cracker.wizard.done.square')}
              </Text>
              <PolybiusSquare square={recoveredSquare} />
            </Pane>
            <Pane display="flex" flexDirection="column" gap={6}>
              <Text size={300} display="block">
                {t('processing.nihilist.cracker.wizard.done.keyLabel')}
              </Text>
              <Text size={400} fontFamily="monospace">{recoveredKey}</Text>
              {keywordGuess && (
                <Text size={400} color="green600">
                  {t('processing.nihilist.cracker.wizard.done.keyword', { keyword: keywordGuess })}
                </Text>
              )}
              {!complete && (
                <Text size={300} color="amber500">
                  {t('processing.nihilist.cracker.wizard.done.incomplete')}
                </Text>
              )}
            </Pane>
          </Pane>
        </Pane>
      )}
    </CrackerWizardFrame>
  );
};

CrackerWizard.displayName = 'NihilistCrackerWizard';

export default CrackerWizard;
