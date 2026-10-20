import React, { useState } from 'react';
import { Button, Heading, Pane, Text } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import {
  countSymbols,
  findConflicts,
  suggestByFrequency,
  SymbolMapping,
} from '../analysis/substitution';
import { NormalizedText } from '../analysis/normalize';

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
  // Symbols the current step asks the user to look at (amber outline).
  highlighted?: string[];
  // Optional heading above the board.
  title?: string;
  // Read-only: counts and suggestions only, no letter picking (the
  // "look at the counts" step).
  readOnly?: boolean;
}

const Cell = styled.button<{ $selected: boolean; $highlighted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid ${({ theme, $selected }) => (
    $selected ? theme.colorScheme.blue_green[500] : theme.colorScheme.gray[300]
  )};
  outline: ${({ $highlighted }) => ($highlighted ? '2px solid #f5a623' : 'none')};
  background: ${({ theme, $selected }) => (
    $selected ? theme.colorScheme.blue_green[100] : theme.colorScheme.gray[50]
  )};
  cursor: pointer;
`;

const SymbolText = styled(Text)`
  font-family: monospace;
  font-weight: 700;
`;

const AssignedText = styled(Text)`
  font-family: monospace;
  font-size: 18px;
  font-weight: 700;
`;

const MutedText = styled(Text)`
  color: ${({ theme }) => theme.colors.textLight};
`;

const BarTrack = styled(Pane)`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.gray[200]};
  margin-top: 2px;
`;

const BarFill = styled(Pane)<{ $ratio: number }>`
  width: ${({ $ratio }) => Math.round($ratio * 100)}%;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
`;

const LetterPicker = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  max-width: 640px;
`;

const LetterButton = styled(Button)<{ $used: boolean }>`
  width: 34px;
  height: 30px;
  font-family: monospace;
  opacity: ${({ $used }) => ($used ? 0.4 : 1)};
`;

const PartialSegment = styled.span<{ $muted: boolean }>`
  font-family: monospace;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textLight : 'inherit')};
  white-space: pre-wrap;
  word-break: break-all;
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
    <Pane background="tint1" borderRadius={6} padding={12} maxHeight={200} overflow="auto">
      {segments.map(({ text, muted }, index) => (
        <PartialSegment key={index} $muted={muted}>{text}</PartialSegment>
      ))}
    </Pane>
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
  highlighted = [],
  title,
  readOnly = false,
}) => {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<string | null>(null);

  const frequencies = countSymbols(symbols);
  const maxCount = frequencies[0]?.count || 1;
  const suggestions = showSuggestions
    ? suggestByFrequency(frequencies, mapping)
    : {};
  const conflicts = findConflicts(mapping);
  const conflictSymbols = new Set(conflicts.flatMap(({ symbols: group }) => group));
  const usedLetters = new Set(Object.values(mapping));

  return (
    <Pane display="flex" flexDirection="column" gap={12}>
      {title && <Heading size={400}>{title}</Heading>}
      <Pane display="flex" flexWrap="wrap" gap={6} justifyContent="center">
        {frequencies.map(({ symbol, count }) => {
          const assigned = mapping[symbol];
          const suggestion = suggestions[symbol];
          return (
            <Cell
              key={symbol}
              type="button"
              data-guide="assignment-cell"
              $selected={symbol === selected}
              $highlighted={highlighted.includes(symbol)}
              onClick={() => !readOnly && setSelected(symbol)}
              title={t('processing.cracker.assignment.clickCell')}
            >
              <SymbolText size={400}>{symbol}</SymbolText>
              <AssignedText color={conflictSymbols.has(symbol) ? 'red500' : 'dark'}>
                {assigned || '·'}
              </AssignedText>
              <BarTrack>
                <BarFill $ratio={count / maxCount} />
              </BarTrack>
              <MutedText size={200}>{count}</MutedText>
              {showSuggestions && suggestion && !assigned && (
                <MutedText size={200}>
                  {t('processing.cracker.assignment.suggestion', { suggestion })}
                </MutedText>
              )}
            </Cell>
          );
        })}
      </Pane>
      {!readOnly && (
        <LetterPicker>
          {alphabet.split('').map((letter) => (
            <LetterButton
              key={letter}
              type="button"
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
        <Text size={300} color="red500">
          {t('processing.cracker.assignment.conflict', { letter: conflicts[0].letter })}
        </Text>
      )}
      {input && normalized && (
        <PartialText input={input} normalized={normalized} mapping={mapping} />
      )}
    </Pane>
  );
};

AssignmentBoard.displayName = 'AssignmentBoard';

export default AssignmentBoard;
