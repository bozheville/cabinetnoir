import React, { useState } from 'react';
import { Pane, Text } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

// The transposition grid: columns of the text as vertical strips, shown
// in READING order (the first-read column is leftmost). Shared by the
// Columnar tool (static view) and the cracker (drag to rebuild the
// column order — the user's one big decision; the tool never reorders
// by itself).
//
// With `onReorder` the strips become draggable and keyboard-operable
// (‹ › buttons move the selected strip). Without it the grid is a plain
// illustration.

interface TranspositionGridProps {
  // Reading order: order[k] is the source column read k-th.
  order: number[];
  // Optional keyword letters for the header (same length as order,
  // indexed by SOURCE column — keyword[sourceColumn]).
  keyword?: string;
  // The letters written into the grid, row-major.
  letters: string;
  // Filler shown for pad cells ('X') or beyond the text end ('·').
  padChar?: string;
  // Show the reading-order badge (1, 2, 3…) on each strip header.
  highlight?: boolean;
  // When provided: draggable strips + keyboard ‹ › move buttons.
  onReorder?: (order: number[]) => void;
  // Source column to outline (the easy hint's best partner).
  highlightSource?: number | null;
  dataGuide?: string;
}

const GRID_COLUMNS = 12;
const CELL = 22;

const Grid = styled(Pane)`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const Strip = styled.div<{ $draggable: boolean; $selected: boolean; $dragging: boolean; $hinted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 34px;
  border-radius: 4px;
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colorScheme.blue[500] : theme.colorScheme.gray[300])};
  outline: ${({ $hinted }) => ($hinted ? '2px solid #f5a623' : 'none')};
  background: ${({ theme, $dragging }) => ($dragging ? theme.colorScheme.gray[100] : 'transparent')};
  cursor: ${({ $draggable }) => ($draggable ? 'grab' : 'default')};
  user-select: none;
`;

const Header = styled(Pane)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  padding-bottom: 2px;
  margin-bottom: 2px;
`;

const Cell = styled(Text)`
  font-family: monospace;
  font-size: 13px;
  line-height: ${CELL}px;
  height: ${CELL}px;
`;

const OrderBadge = styled(Text)`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const KeywordLetter = styled(Text)`
  font-family: monospace;
  font-weight: 700;
  font-size: 13px;
`;

const MoveButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colorScheme.blue[500]};
  font-size: 11px;
  padding: 0 4px;
`;

const TranspositionGrid: React.FC<TranspositionGridProps> = ({
  order,
  keyword,
  letters,
  padChar = 'X',
  highlight = false,
  onReorder,
  highlightSource = null,
  dataGuide,
}) => {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  const width = order.length;
  const rows = Math.ceil(letters.length / Math.max(width, 1));

  const cellAt = (sourceColumn: number, row: number): string => {
    const index = row * width + sourceColumn;
    if (index < letters.length) {
      return letters[index];
    }
    return padChar ? padChar : '·';
  };

  const move = (position: number, delta: number) => {
    const target = position + delta;
    if (!onReorder || target < 0 || target >= order.length) {
      return;
    }
    const next = [...order];
    [next[position], next[target]] = [next[target], next[position]];
    onReorder(next);
  };

  const dropOn = (position: number) => {
    if (!onReorder || dragging === null || dragging === position) {
      setDragging(null);
      setDropTarget(null);
      return;
    }
    const next = [...order];
    const [moved] = next.splice(dragging, 1);
    next.splice(position, 0, moved);
    onReorder(next);
    setDragging(null);
    setDropTarget(null);
  };

  return (
    <Grid data-guide={dataGuide}>
      {order.map((sourceColumn, position) => (
        <Strip
          key={sourceColumn}
          $draggable={Boolean(onReorder)}
          $selected={selected === position}
          $dragging={dragging === position || dropTarget === position}
          $hinted={highlightSource === sourceColumn}
          draggable={Boolean(onReorder)}
          onDragStart={() => setDragging(position)}
          onDragOver={(event) => {
            if (dragging !== null) {
              event.preventDefault();
              setDropTarget(position);
            }
          }}
          onDragLeave={() => setDropTarget(null)}
          onDrop={() => dropOn(position)}
          onDragEnd={() => { setDragging(null); setDropTarget(null); }}
          onClick={() => setSelected(position)}
          tabIndex={onReorder ? 0 : -1}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { move(position, -1); event.preventDefault(); }
            if (event.key === 'ArrowRight') { move(position, 1); event.preventDefault(); }
          }}
        >
          <Header>
            {highlight && <OrderBadge>{position + 1}</OrderBadge>}
            {keyword && <KeywordLetter>{keyword[sourceColumn] || '·'}</KeywordLetter>}
            {onReorder && (
              <Pane display="flex">
                <MoveButton
                  type="button"
                  aria-label={t('processing.cracker.grid.moveLeft')}
                  onClick={(event) => { event.stopPropagation(); move(position, -1); }}
                >
                  ‹
                </MoveButton>
                <MoveButton
                  type="button"
                  aria-label={t('processing.cracker.grid.moveRight')}
                  onClick={(event) => { event.stopPropagation(); move(position, 1); }}
                >
                  ›
                </MoveButton>
              </Pane>
            )}
          </Header>
          {Array.from({ length: rows }, (_, row) => (
            <Cell key={row}>{cellAt(sourceColumn, row)}</Cell>
          ))}
        </Strip>
      ))}
    </Grid>
  );
};

TranspositionGrid.displayName = 'TranspositionGrid';

export default TranspositionGrid;
