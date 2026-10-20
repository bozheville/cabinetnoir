import React from 'react';
import { Heading, Pane } from 'evergreen-ui';
import styled from 'styled-components';

import { foldForSquare } from './polybius';

// The shared Polybius square renderer: the grid with its row/column
// labels and an optional highlight that lights up a cell together with
// its row and column — the worked-example, tool and cracker visuals all
// come from this one component.

const SquareGrid = styled(Pane)<{ $cell: number; $gap: number }>`
  display: inline-grid;
  gap: ${({ $gap }) => $gap}px;
  font-family: monospace;
`;

const LabelCell = styled(Pane)<{ $cell: number }>`
  width: ${({ $cell }) => $cell}px;
  height: ${({ $cell }) => $cell}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const SquareCell = styled(Pane)<{ $cell: number; $highlighted: boolean; $inLine: boolean }>`
  width: ${({ $cell }) => $cell}px;
  height: ${({ $cell }) => $cell}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border: 1px solid ${({ $highlighted, theme }) => (
    $highlighted ? theme.colorScheme.blue[500] : theme.colorScheme.gray[300]
  )};
  background: ${({ $highlighted, $inLine, theme }) => (
    $highlighted ? theme.colorScheme.blue[100]
      : $inLine ? theme.colorScheme.blue[50]
        : theme.colors.background
  )};
  font-weight: ${({ $highlighted }) => ($highlighted ? 700 : 400)};
  border-radius: 3px;
`;

interface PolybiusSquareProps {
  // The 25/36 square characters, row-major.
  square: string;
  // Row/column labels; default digits 1–5 (or 1–6 for a 6x6 square).
  labels?: string;
  // The letter to highlight: its cell lights up strongly, its row and
  // column weakly.
  highlightLetter?: string;
  // Optional heading above the square.
  title?: string;
  // Cell size in px.
  cellSize?: number;
  dataGuide?: string;
}

const PolybiusSquare: React.FC<PolybiusSquareProps> = ({
  square,
  labels,
  highlightLetter,
  title,
  cellSize = 26,
  dataGuide,
}) => {
  const size = labels ? labels.length : Math.round(Math.sqrt(square.length));
  const rowLabels = labels ?? Array.from({ length: size }, (_, i) => String(i + 1)).join('');

  const highlight = highlightLetter
    ? foldForSquare(highlightLetter.toUpperCase())
    : '';
  const highlightIndex = highlight ? square.indexOf(highlight) : -1;
  const highlightRow = highlightIndex >= 0 ? Math.floor(highlightIndex / size) : -1;
  const highlightColumn = highlightIndex >= 0 ? highlightIndex % size : -1;

  return (
    <Pane display="flex" flexDirection="column" alignItems="center" gap={6}>
      {title && <Heading size={400}>{title}</Heading>}
      <SquareGrid
        $cell={cellSize}
        $gap={2}
        gridTemplateColumns={`repeat(${size + 1}, ${cellSize}px)`}
        data-guide={dataGuide}
      >
        <LabelCell $cell={cellSize} />
        {rowLabels.split('').map((label) => (
          <LabelCell key={`col-${label}`} $cell={cellSize}>{label}</LabelCell>
        ))}
        {Array.from({ length: size }, (_, row) => (
          <React.Fragment key={`row-${row}`}>
            <LabelCell $cell={cellSize}>{rowLabels[row]}</LabelCell>
            {Array.from({ length: size }, (_, column) => {
              const index = row * size + column;
              const letter = square[index] ?? '';
              return (
                <SquareCell
                  key={`cell-${index}`}
                  $cell={cellSize}
                  $highlighted={index === highlightIndex}
                  $inLine={row === highlightRow || column === highlightColumn}
                >
                  {letter}
                </SquareCell>
              );
            })}
          </React.Fragment>
        ))}
      </SquareGrid>
    </Pane>
  );
};

PolybiusSquare.displayName = 'PolybiusSquare';

export default PolybiusSquare;
