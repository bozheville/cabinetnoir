import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Button } from '@atoms';
import { CipherText, GreatPrimer, Minion } from '@typography';
import { paper } from '@theme/mixins';
import {
  countSymbols,
  findConflicts,
  suggestByFrequency,
  SymbolMapping,
} from '../analysis/substitution';
import { NormalizedText } from '../analysis/normalize';
import { cellHighlight } from './highlight';

// The letter assignment board: the shared IKEA-effect UI for breaking
// any monoalphabetic substitution. One cell per cipher symbol (count,
// frequency bar, assigned plain letter); the user clicks a cell, picks a
// letter, and the partial plaintext updates. The tool only highlights —
// nothing is ever assigned automatically.

interface AssignmentBoardProps {
  // The ciphertext's clean symbols, in text order.
  symbols: string[];
  // Current symbol → plain letter mapping.
  mapping: SymbolMapping;
  // Assign/clear a symbol. Called on every user decision only.
  onAssign: (symbol: string, letter: string | null) => void;
  // The plain letters the assignments draw from (e.g. the Latin alphabet).
  alphabet: string;
  // Partial plaintext ingredients; rendered when provided.
  input?: string;
  normalized?: NormalizedText;
  // Show the frequency suggestion ("probably E?") under unassigned cells.
  showSuggestions?: boolean;
  // External suggestions (symbol → plain letter): when provided, the
  // board displays these instead of its own frequency ranking — for
  // crackers whose context knows better than raw frequency (e.g. the
  // Nihilist square, scored against the letters already assigned).
  // Still gated by showSuggestions.
  suggestions?: SymbolMapping;
  // Symbols the current step asks the user to look at (copper outline).
  highlighted?: string[];
  // Notifies the parent which cell got selected (or null on deselect),
  // so a wrapper can sync other views — e.g. the preview's occurrence
  // highlights — with the board's selection. Selection state itself
  // stays internal.
  onSelect?: (symbol: string | null) => void;
  // Fixed cell order (e.g. square coordinates '11'…'55'): the board
  // renders every listed symbol in this order as a grid, including
  // zero-count ones, instead of frequency-sorted. columns defaults to
  // the square side implied by the order's length.
  order?: string[];
  columns?: number;
  // Optional heading above the board.
  title?: string;
  // Read-only: counts and suggestions only, no letter picking (the
  // "look at the counts" step).
  readOnly?: boolean;
}

// Cells are typeset type-tray squares: ivory paper, 1px rule lines.
const Cell = styled.button<{ $selected: boolean; $assigned: boolean; $highlighted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 4px 6px;
  border-radius: ${({ theme }) => theme.radius.paper};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  background: ${({ theme }) => theme.paper.ivory};
  color: ${({ theme }) => theme.ink.primary};
  ${({ $selected, $assigned }) => cellHighlight($selected ? 'strong' : $assigned ? 'filled' : 'none')}
  outline: ${({ $highlighted, theme }) => ($highlighted ? `2px dashed ${theme.metal.copper.base}` : 'none')};
  outline-offset: 1px;
  cursor: pointer;
`;

const SymbolText = styled(CipherText)`
  font-weight: 700;
`;

const AssignedText = styled(CipherText)<{ $conflict: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme, $conflict }) => ($conflict ? theme.ink.red : theme.ink.primary)};
`;

const MutedText = styled.span`
  font-family: ${({ theme }) => theme.type.body};
  font-size: 12px;
  color: ${({ theme }) => theme.ink.secondary};
`;

// Frequency mini-bar: a brass rail with a brushed brass fill.
const BarFill = styled.div<{ $ratio: number }>`
  width: ${({ $ratio }) => Math.round($ratio * 100)}%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(180deg, ${({ theme }) => theme.metal.brass.light}, ${({ theme }) => theme.metal.brass.dark});
`;

const BarTrack = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.paper.rule};
  margin-top: 2px;
`;

// Fixed-order layout (square coordinates): a strict grid so the board
// reads as the square itself, cells in coordinate order.
const CellGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 52px);
  gap: 6px;
  justify-content: center;
`;

const LetterPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  max-width: 640px;
`;

const LetterButton = styled(Button)<{ $used: boolean }>`
  width: 34px;
  padding: 0;
  font-family: ${({ theme }) => theme.type.mono};
  opacity: ${({ $used }) => ($used ? 0.4 : 1)};
`;

const PartialBox = styled.div`
  ${paper('parchment')}
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  max-height: 200px;
  overflow: auto;
`;

const PartialSegment = styled.span<{ $muted: boolean }>`
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme, $muted }) => ($muted ? theme.ink.secondary : theme.ink.primary)};
  white-space: pre-wrap;
  word-break: break-all;
`;

const BoardTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
`;

const ConflictText = styled(Minion)`
  color: ${({ theme }) => theme.ink.red};
`;

// The partial plaintext: assigned letters shown, unassigned cipher
// symbols shown muted so spacing and punctuation stay readable.
const PartialText: React.FC<{
  input: string;
  normalized: NormalizedText;
  mapping: SymbolMapping;
}> = ({ input, normalized, mapping }) => {
  const mutedByOriginal = new Set<number>();
  normalized.letters.split('').forEach((symbol, cleanIndex) => {
    if (!mapping[symbol]) {
      mutedByOriginal.add(normalized.originalIndices[cleanIndex]);
    }
  });

  const segments: { text: string; muted: boolean }[] = [];
  for (let i = 0; i < input.length; i += 1) {
    const cleanIndex = normalized.originalIndices.indexOf(i);
    const replacement = cleanIndex !== -1
      ? (mapping[normalized.letters[cleanIndex]] || normalized.letters[cleanIndex])
      : null;
    const muted = cleanIndex !== -1 && mutedByOriginal.has(i);
    const last = segments[segments.length - 1];
    if (last && last.muted === muted) {
      last.text += replacement ?? input[i];
    } else {
      segments.push({ text: replacement ?? input[i], muted });
    }
  }

  return (
    <PartialBox>
      {segments.map(({ text, muted }, index) => (
        <PartialSegment key={index} $muted={muted}>{text}</PartialSegment>
      ))}
    </PartialBox>
  );
};

// One board cell: the cipher symbol, its assigned letter, a frequency
// bar and the optional suggestion. Pure display — every state comes in
// through props so the frequency-sorted and fixed-order layouts share it.
const BoardCell: React.FC<{
  symbol: string;
  count: number;
  maxCount: number;
  assigned?: string;
  suggestion?: string;
  conflict: boolean;
  highlighted: boolean;
  selected: boolean;
  readOnly: boolean;
  showSuggestions: boolean;
  onSelect: (symbol: string) => void;
}> = ({
  symbol,
  count,
  maxCount,
  assigned,
  suggestion,
  conflict,
  highlighted,
  selected,
  readOnly,
  showSuggestions,
  onSelect,
}) => {
  const { t } = useTranslation('common');
  return (
    <Cell
      type="button"
      data-guide="assignment-cell"
      $selected={selected}
      $assigned={Boolean(assigned)}
      $highlighted={highlighted}
      onClick={() => !readOnly && onSelect(symbol)}
      title={t('processing.cracker.assignment.clickCell')}
    >
      <SymbolText>{symbol}</SymbolText>
      <AssignedText $conflict={conflict}>
        {assigned || '·'}
      </AssignedText>
      <BarTrack>
        <BarFill $ratio={count / maxCount} />
      </BarTrack>
      <MutedText>{count}</MutedText>
      {showSuggestions && suggestion && !assigned && (
        <MutedText>
          {t('processing.cracker.assignment.suggestion', { suggestion })}
        </MutedText>
      )}
    </Cell>
  );
};

const AssignmentBoard: React.FC<AssignmentBoardProps> = ({
  symbols,
  mapping,
  onAssign,
  alphabet,
  input,
  normalized,
  showSuggestions = false,
  suggestions,
  highlighted = [],
  onSelect,
  order,
  columns,
  title,
  readOnly = false,
}) => {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<string | null>(null);

  // Clicking a cell selects it; clicking it again deselects. The parent
  // hears the same decision so its views stay in sync.
  const handleCellSelect = (symbol: string) => {
    const next = symbol === selected ? null : symbol;
    setSelected(next);
    onSelect?.(next);
  };

  const frequencies = countSymbols(symbols);
  const maxCount = frequencies[0]?.count || 1;
  // External suggestions win when a cracker supplies them; the plain
  // frequency ranking is the default.
  const shownSuggestions = suggestions
    ?? (showSuggestions ? suggestByFrequency(frequencies, mapping) : {});
  const suggestionsFor = (symbol: string): string | undefined =>
    shownSuggestions[symbol];
  const conflicts = findConflicts(mapping);
  const conflictSymbols = new Set(conflicts.flatMap(({ symbols: group }) => group));
  const usedLetters = new Set(Object.values(mapping));

  // Fixed order: every listed cell renders, zero-count ones included,
  // so an empty square cell stays assignable. Otherwise: frequency sort.
  const countOf = new Map(frequencies.map(({ symbol, count }) => [symbol, count]));
  const cells = order
    ? order.map((symbol) => ({ symbol, count: countOf.get(symbol) || 0 }))
    : frequencies;
  const gridColumns = columns ?? (order ? Math.round(Math.sqrt(order.length)) : 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {title && <BoardTitle>{title}</BoardTitle>}
      {order ? (
        <CellGrid $columns={gridColumns}>
          {cells.map(({ symbol, count }) => (
            <BoardCell
              key={symbol}
              symbol={symbol}
              count={count}
              maxCount={maxCount}
              assigned={mapping[symbol]}
              suggestion={suggestionsFor(symbol)}
              conflict={conflictSymbols.has(symbol)}
              highlighted={highlighted.includes(symbol)}
              selected={symbol === selected}
              readOnly={readOnly}
              showSuggestions={showSuggestions}
              onSelect={handleCellSelect}
            />
          ))}
        </CellGrid>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          {cells.map(({ symbol, count }) => (
            <BoardCell
              key={symbol}
              symbol={symbol}
              count={count}
              maxCount={maxCount}
              assigned={mapping[symbol]}
              suggestion={suggestionsFor(symbol)}
              conflict={conflictSymbols.has(symbol)}
              highlighted={highlighted.includes(symbol)}
              selected={symbol === selected}
              readOnly={readOnly}
              showSuggestions={showSuggestions}
              onSelect={handleCellSelect}
            />
          ))}
        </div>
      )}
      {!readOnly && (
        <LetterPicker>
          {alphabet.split('').map((letter) => (
            <LetterButton
              key={letter}
              type="button"
              size="sm"
              data-guide="assignment-letter"
              $used={usedLetters.has(letter)}
              disabled={!selected}
              onClick={() => selected && onAssign(selected, letter)}
            >
              {letter}
            </LetterButton>
          ))}
          <LetterButton
            type="button"
            size="sm"
            data-guide="assignment-clear"
            $used={false}
            disabled={!selected || !mapping[selected]}
            onClick={() => selected && onAssign(selected, null)}
          >
            {t('processing.cracker.assignment.clear')}
          </LetterButton>
        </LetterPicker>
      )}
      {conflicts.length > 0 && (
        <ConflictText>
          {t('processing.cracker.assignment.conflict', { letter: conflicts[0].letter })}
        </ConflictText>
      )}
      {input && normalized && (
        <PartialText input={input} normalized={normalized} mapping={mapping} />
      )}
    </div>
  );
};

AssignmentBoard.displayName = 'AssignmentBoard';

export default AssignmentBoard;
