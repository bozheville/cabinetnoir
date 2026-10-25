import React from 'react';
import { Heading, Pane } from 'evergreen-ui';
import styled from 'styled-components';

import { cellHighlight, CellHighlightLevel } from '../cracker/highlight';
import { coordinatesToIndex, foldForSquare, SquareMerge } from './polybius';

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

const SquareCell = styled(Pane)<{ $cell: number; $level: CellHighlightLevel }>`
  width: ${({ $cell }) => $cell}px;
  height: ${({ $cell }) => $cell}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  background: ${({ theme }) => theme.colors.background};
  font-weight: 400;
  border-radius: 3px;
  ${({ $level }) => cellHighlight($level)}
`;

interface PolybiusSquareProps {
  // The 25/36 square characters, row-major.
  square: string;
  // Row/column labels; default digits 1–5 (or 1–6 for a 6x6 square).
  labels?: string;
  // Grid side. Derived from the square's length when absent; pass it
  // for sparse squares (a custom alphabet shorter than the grid, e.g. a
  // Greek 24-letter 5x5 square, whose length alone implies the wrong 5).
  size?: number;
  // The merge the highlight folds through (J reads as I on an IJ
  // square). Defaults to the classic IJ.
  merge?: SquareMerge;
  // The letter to highlight: its cell lights up strongly, its row and
  // column weakly.
  highlightLetter?: string;
  // The coordinate pair to highlight (labels space, e.g. '34' or 'DG').
  // Position-based, so an unassigned cell lights up too — the decipher
  // worksheet's "this is the cell you are deciding about". Wins over
  // highlightLetter when both are given.
  highlightCell?: string;
  // Coordinate pairs already decided: every listed cell lights up with
  // the filled style, so the recovered square shows the assignment
  // progress at a glance. The selected cell (highlightCell) stays the
  // strongest mark.
  highlightCells?: string[];
  // Optional heading above the square.
  title?: string;
  // Cell size in px.
  cellSize?: number;
  dataGuide?: string;
}

const PolybiusSquare: React.FC<PolybiusSquareProps> = ({
  square,
  labels,
  size: sizeProp,
  merge = 'IJ',
  highlightLetter,
  highlightCell,
  highlightCells = [],
  title,
  cellSize = 26,
  dataGuide,
}) => {
  const size = sizeProp ?? (labels ? labels.length : Math.round(Math.sqrt(square.length)));
  const rowLabels = labels ?? Array.from({ length: size }, (_, i) => String(i + 1)).join('');

  const highlight = highlightLetter
    ? foldForSquare(highlightLetter.toUpperCase(), merge)
    : '';
  // A position-based highlight wins over a letter-based one: the
  // worksheet needs to light cells the square cannot name yet.
  const highlightIndex = highlightCell
    ? coordinatesToIndex(highlightCell, rowLabels)
    : highlight
      ? square.indexOf(highlight)
      : -1;
  const highlightRow = highlightIndex >= 0 ? Math.floor(highlightIndex / size) : -1;
  const highlightColumn = highlightIndex >= 0 ? highlightIndex % size : -1;
  // Decided cells: every assigned pair, resolved to cell indices.
  const filledIndices = new Set(
    highlightCells
      .map((pair) => coordinatesToIndex(pair, rowLabels))
      .filter((index) => index >= 0),
  );

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
                  $level={index === highlightIndex
                    ? 'strong'
                    : filledIndices.has(index)
                      ? 'filled'
                      : row === highlightRow || column === highlightColumn ? 'tint' : 'none'}
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
