import React from 'react';
import styled from 'styled-components';

import type { Checkerboard as CheckerboardModel } from './checkerboard';
import { cellHighlight } from '../cracker/highlight';

// The shared straddling-checkerboard renderer: the mixed digit header,
// the mnemonic top row with its blank cells, and the straddled lower
// rows with their row labels. The VIC tool and the worked example both
// draw their boards from this one component, so they can never disagree
// with the engine.

const BoardFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Grid = styled.div<{ $cell: number }>`
  display: inline-grid;
  gap: 2px;
  font-family: ${({ theme }) => theme.type.mono};
`;

const LabelCell = styled.div<{ $cell: number }>`
  width: ${({ $cell }) => $cell}px;
  height: ${({ $cell }) => $cell}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const Cell = styled.div<{ $cell: number; $blank: boolean; $highlight: boolean }>`
  width: ${({ $cell }) => $cell}px;
  height: ${({ $cell }) => $cell}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  background: ${({ theme, $blank }) => ($blank ? 'transparent' : theme.paper.ivory)};
  color: ${({ theme }) => theme.ink.primary};
  border-radius: 3px;
  ${({ $highlight }) => cellHighlight($highlight ? 'strong' : 'none')}
`;

interface CheckerboardProps {
  board: CheckerboardModel;
  // The letter to light up together with its row and column labels.
  highlightLetter?: string;
  cellSize?: number;
  dataGuide?: string;
}

const CheckerboardGrid: React.FC<CheckerboardProps> = ({
  board,
  highlightLetter,
  cellSize = 26,
  dataGuide,
}) => {
  const highlight = highlightLetter ? highlightLetter.toUpperCase() : null;
  const rows = [board.topRow, ...board.lowerRows.map((row) => row.map((char) => char as string | null))];

  return (
    <BoardFrame>
      <Grid
        $cell={cellSize}
        style={{ gridTemplateColumns: `repeat(11, ${cellSize}px)` }}
        data-guide={dataGuide}
      >
        {/* Header: an empty corner cell, then the ten column digits. */}
        <LabelCell $cell={cellSize} />
        {board.columns.map((label) => (
          <LabelCell key={`col-${label}`} $cell={cellSize}>{label}</LabelCell>
        ))}
        {rows.map((row, rowIndex) => {
          const rowLabel = rowIndex === 0 ? null : board.rowLabels[rowIndex - 1];
          return (
            <React.Fragment key={`row-${rowIndex}`}>
              <LabelCell $cell={cellSize}>{rowLabel}</LabelCell>
              {row.map((char, columnIndex) => {
                const isBlank = char === null;
                const isHighlight = char !== null && char === highlight;
                return (
                  <Cell
                    key={`cell-${rowIndex}-${columnIndex}`}
                    $cell={cellSize}
                    $blank={isBlank}
                    $highlight={isHighlight}
                  >
                    {isBlank ? '·' : char}
                  </Cell>
                );
              })}
            </React.Fragment>
          );
        })}
      </Grid>
    </BoardFrame>
  );
};

CheckerboardGrid.displayName = 'CheckerboardGrid';

export default CheckerboardGrid;
