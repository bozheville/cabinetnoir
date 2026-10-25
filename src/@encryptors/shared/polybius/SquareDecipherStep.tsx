import React, { useEffect, useMemo, useState } from 'react';
import { Button, Pane, Text, TextInput } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import {
  DoubleSuggestion,
  DigraphSuggestion,
  SymbolMapping,
  TrigraphSuggestion,
} from '../analysis/substitution';
import {
  AssignmentBoard,
  CombinationStrip,
  PartialStream,
} from '../cracker';
import { assembleSquareFromMapping } from './assemble';
import PolybiusSquare from './PolybiusSquare';
import { squareLabels, SquareMerge, SquareSize } from './polybius';

// The shared "decipher the Polybius square" step: the worksheet every
// Polybius-based cracker ends on (Polybius itself, the Nihilist square
// step, the ADFGVX square step). The symbol stream is a plain
// substitution over coordinate pairs; the user assigns letters cell by
// cell on the assignment board — laid out as the square itself — and
// watches the preview become readable. Nothing is ever assigned
// automatically; every hint below is a suggestion only.
//
// Alphabet-agnostic: the grid side, the row/column labels and the
// assignable alphabet all come in through props, so the same step
// serves the 5x5 Latin square (J folded into I), the 6x6 ADFGVX square
// and any other alphabet the square core can hold.

const SCOPE = 'processing.cracker.squareDecipher';

const CribRow = styled(Pane)`
  display: flex;
  align-items: center;
  gap: 8px;
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

// The worksheet feedback meter: how English the draft reads under the
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
        {t(`${SCOPE}.englishness`, { score })}
      </Text>
      <MeterTrack>
        <MeterFill $ratio={Math.max(0, Math.min(1, score / 100))} />
      </MeterTrack>
    </Pane>
  );
};

// The optional frequency chart: symbols ranked most-frequent-first with
// their per-symbol letter suggestion — the reading order of the break.
// The board stays the working surface; the chart is a hint widget.
const ChartArea = styled(Pane)`
  padding: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
`;

const BarsRow = styled(Pane)`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 80px;
  flex-wrap: wrap;
`;

const BarSlot = styled(Pane)<{ $selected: boolean }>`
  width: 34px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  border-radius: 2px;
  border: 1px solid transparent;
  ${({ $selected, theme }) => ($selected ? `outline: 2px solid ${theme.colorScheme.blue[600]};` : '')}
`;

const Bar = styled.div<{ $fill: string }>`
  width: 100%;
  background: ${({ $fill }) => $fill};
  border-radius: 2px 2px 0 0;
`;

const SymbolRow = styled(Pane)`
  display: flex;
  gap: 3px;
  margin-top: 2px;
  flex-wrap: wrap;
`;

const SymbolCell = styled(Text)`
  width: 34px;
  text-align: center;
  font-size: 9px;
  font-family: monospace;
`;

const FrequencyChart: React.FC<{
  symbols: string[];
  mapping: SymbolMapping;
  suggestions: SymbolMapping;
  onSelect: (symbol: string) => void;
  selected: string | null;
}> = ({ symbols, mapping, suggestions, onSelect, selected }) => {
  const { t } = useTranslation('common');
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    symbols.forEach((symbol) => map.set(symbol, (map.get(symbol) || 0) + 1));
    return map;
  }, [symbols]);
  const ranked = useMemo(
    () => [...counts.entries()].sort((a, b) => b[1] - a[1]),
    [counts],
  );
  const maxCount = ranked[0]?.[1] || 1;

  return (
    <Tooltip content={t(`${SCOPE}.chartTooltip`)}>
      <ChartArea data-guide="symbol-chart">
        <BarsRow>
          {ranked.map(([symbol, count]) => (
            <BarSlot
              key={symbol}
              $selected={selected === symbol}
              onClick={() => onSelect(symbol)}
            >
              <Bar
                $fill={mapping[symbol] ? '#30a46c' : '#a9a9a9cc'}
                style={{ height: `${(count / maxCount) * 100}%` }}
              />
            </BarSlot>
          ))}
        </BarsRow>
        <SymbolRow>
          {ranked.map(([symbol, count]) => (
            <SymbolCell key={symbol}>
              {symbol}
              {suggestions[symbol] ? (
                <span style={{ color: '#0091ff' }}>{suggestions[symbol]}</span>
              ) : ''}
              <span style={{ opacity: 0.6 }}>{count}</span>
            </SymbolCell>
          ))}
        </SymbolRow>
      </ChartArea>
    </Tooltip>
  );
};

interface SquareDecipherStepProps {
  // The cipher's symbol stream — coordinate pairs in text order.
  symbols: string[];
  // Current symbol → plain letter mapping.
  mapping: SymbolMapping;
  // Assign/clear a symbol. Called on every user decision only.
  onAssign: (symbol: string, letter: string | null) => void;
  // Square geometry: the grid side and the row/column labels the
  // symbols speak in. Defaults: 5x5 with digit labels 1–5.
  size?: number;
  labels?: string;
  // The plain letters the assignment picker draws from.
  alphabet: string;
  // Undo/redo/clear controls; the bar renders when provided.
  history?: {
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    clear: () => void;
  };
  // Hint gates and payloads, all optional.
  showSuggestions?: boolean;
  // External per-symbol suggestions; the board's own frequency ranking
  // applies when absent.
  suggestions?: SymbolMapping;
  // Per-symbol suggestions for the frequency chart (computed from raw
  // frequency, independent of the contextual board ranking).
  frequencySuggestions?: SymbolMapping;
  showFrequencyChart?: boolean;
  // Letter-combination hints (digraphs/trigraphs/doubles strip).
  combinationHints?: {
    digraphs: DigraphSuggestion[];
    trigraphs: TrigraphSuggestion[];
    doubles: DoubleSuggestion[];
  } | null;
  // The crib panel: a known plaintext fragment searched in the symbol
  // stream; applying a match assigns its letters across the span.
  cribs?: {
    value: string;
    onChange: (value: string) => void;
    matches: Array<{ start: number }>;
    onApply: (start: number) => void;
  } | null;
  // Worksheet fill: 'dots' leaves unknown cells as '·' (the guided
  // decipher view); 'auto' completes the square from the remaining
  // alphabet (the hand-off view).
  fill?: 'dots' | 'auto';
  // 0-100 trigram score of the partial plaintext; the meter renders
  // when provided.
  englishness?: number | null;
  merge?: SquareMerge;
}

const SquareDecipherStep: React.FC<SquareDecipherStepProps> = ({
  symbols,
  mapping,
  onAssign,
  size = 5,
  labels,
  alphabet,
  history,
  showSuggestions = false,
  suggestions,
  frequencySuggestions = {},
  showFrequencyChart = false,
  combinationHints = null,
  cribs = null,
  fill = 'dots',
  englishness = null,
  merge = 'IJ',
}) => {
  const { t } = useTranslation('common');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // The board's cells laid out as the square itself, in reading order —
  // including the cells the ciphertext never produces, which a short
  // text can lack but the square still needs for the hand-off.
  const boardOrder = useMemo(() => {
    const rowLabels = labels ?? squareLabels(size as SquareSize);
    return rowLabels.split('').flatMap((row) =>
      rowLabels.split('').map((column) => `${row}${column}`));
  }, [labels, size]);

  // The step highlights the three unassigned cells with the strongest
  // frequency evidence — the same signal the chart bars carry — not
  // merely the first ones in reading order.
  const highlighted = useMemo(() => {
    const counts = new Map<string, number>();
    symbols.forEach((symbol) => {
      counts.set(symbol, (counts.get(symbol) || 0) + 1);
    });
    return boardOrder
      .filter((symbol) => !mapping[symbol])
      .sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0))
      .slice(0, 3);
  }, [boardOrder, mapping, symbols]);

  // The recovered square: assigned cells from the mapping, untouched
  // cells per the fill mode.
  const recoveredSquare = useMemo(
    () => assembleSquareFromMapping(mapping, { size: size as SquareSize, labels, merge, fill }),
    [mapping, size, labels, merge, fill],
  );

  // The hovered hint row's symbol sequence: lights its occurrences up
  // in the preview. Cleared whenever the hints disappear. A selected
  // cell wins: every occurrence of that symbol lights up while it stays
  // selected, so the user can read its pattern straight off the stream.
  const [hoveredSequence, setHoveredSequence] = useState<string[] | null>(null);
  useEffect(() => {
    if (!combinationHints) {
      setHoveredSequence(null);
    }
  }, [combinationHints]);
  const highlightSequence = selectedSymbol ? [selectedSymbol] : hoveredSequence;

  const hasAssignments = Object.keys(mapping).length > 0;

  return (
    <Pane marginTop={12} display="flex" flexDirection="column" gap={10}>
      {history && (
        <Pane display="flex" gap={8}>
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

      {showFrequencyChart && (
        <FrequencyChart
          symbols={symbols}
          mapping={mapping}
          suggestions={frequencySuggestions}
          onSelect={(symbol) =>
            setSelectedSymbol((current) => (current === symbol ? null : symbol))}
          selected={selectedSymbol}
        />
      )}

      <AssignmentBoard
        symbols={symbols}
        mapping={mapping}
        onAssign={onAssign}
        alphabet={alphabet}
        order={boardOrder}
        highlighted={highlighted}
        onSelect={setSelectedSymbol}
        showSuggestions={showSuggestions}
        suggestions={suggestions}
      />

      {showSuggestions && combinationHints && (
        <CombinationStrip
          digraphs={combinationHints.digraphs}
          trigraphs={combinationHints.trigraphs}
          doubles={combinationHints.doubles}
          onHoverRow={setHoveredSequence}
        />
      )}

      {cribs && (
        <Pane display="flex" flexDirection="column" gap="6px">
          <CribRow>
            <Text size={300}>{t(`${SCOPE}.cribLabel`)}</Text>
            <Tooltip content={t(`${SCOPE}.cribTooltip`)}>
              <TextInput
                data-guide="crib-input"
                width="180px"
                value={cribs.value}
                placeholder={t(`${SCOPE}.cribPlaceholder`)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  cribs!.onChange(event.target.value)}
              />
            </Tooltip>
          </CribRow>
          {cribs.matches.slice(0, 8).map(({ start }) => (
            <CribRow key={start}>
              <Text size={300} fontFamily="monospace">
                {t(`${SCOPE}.cribAt`, { position: start })}
              </Text>
              <Button size="small" onClick={() => cribs!.onApply(start)}>
                {t(`${SCOPE}.cribApply`)}
              </Button>
            </CribRow>
          ))}
        </Pane>
      )}

      {hasAssignments && (
        <Pane display="flex" gap={16} alignItems="flex-start" flexWrap="wrap">
          <Pane>
            <Text size={300} display="block" marginBottom={4}>
              {t(`${SCOPE}.squareLabel`)}
            </Text>
            <PolybiusSquare
              square={recoveredSquare}
              labels={labels}
              size={size}
              merge={merge}
              highlightCells={Object.keys(mapping)}
              highlightCell={selectedSymbol ?? undefined}
            />
          </Pane>
          <Pane flex={1} minWidth={240}>
            <Text size={300} display="block" marginBottom={4}>
              {t('processing.cracker.wizard.previewTitle')}
            </Text>
            <PreviewBox data-guide="plaintext-preview">
              <PartialStream
                symbols={symbols}
                mapping={mapping}
                highlightSequence={highlightSequence ?? undefined}
              />
            </PreviewBox>
            {englishness !== null && <EnglishnessMeter score={englishness} />}
          </Pane>
        </Pane>
      )}
    </Pane>
  );
};

SquareDecipherStep.displayName = 'SquareDecipherStep';

export default SquareDecipherStep;
