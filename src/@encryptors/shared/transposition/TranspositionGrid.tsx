import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { paper } from '@theme/mixins';

// The transposition grid: columns of the text as vertical paper strips,
// shown in READING order (the first-read column is leftmost). Shared by
// the Columnar tool (static view) and the cracker (drag to rebuild the
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

const Grid = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 6px 0 4px;
`;

// A paper slip with a metal clip at the top as the grab handle.
const Strip = styled.div<{ $draggable: boolean; $selected: boolean; $dragging: boolean; $hinted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 34px;
  border-radius: ${({ theme }) => theme.radius.paper};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.metal.copper.dark : theme.paper.rule)};
  outline: ${({ $hinted, theme }) => ($hinted ? `2px dashed ${theme.metal.copper.base}` : 'none')};
  outline-offset: 1px;
  background: ${({ theme }) => theme.paper.vellum};
  box-shadow: ${({ theme, $dragging }) => ($dragging ? theme.shadow.metal : 'none')};
  cursor: ${({ $draggable }) => ($draggable ? 'grab' : 'default')};
  user-select: none;
`;

// The clip: a small metal fitting straddling the slip's top edge.
const Clip = styled.div<{ $selected: boolean }>`
  width: 18px;
  height: 6px;
  margin: -3px 0 4px;
  border-radius: 2px;
  background: linear-gradient(180deg, ${({ theme, $selected }) => ($selected
    ? theme.metal.copper.highlight
    : theme.metal.brass.highlight)} 0%, ${({ theme, $selected }) => ($selected
    ? theme.metal.copper.base
    : theme.metal.brass.base)} 100%);
  border: 1px solid ${({ theme, $selected }) => ($selected
    ? theme.metal.copper.shadow
    : theme.metal.brass.shadow)};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.paper.rule};
  padding-bottom: 2px;
  margin-bottom: 2px;
`;

const Cell = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  font-size: 13px;
  line-height: ${CELL}px;
  height: ${CELL}px;
`;

const OrderBadge = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 9px;
  color: ${({ theme }) => theme.ink.secondary};
`;

const KeywordLetter = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  font-weight: 700;
  font-size: 13px;
`;

const MoveButtons = styled.div`
  display: flex;
`;

const MoveButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.metal.copper.dark};
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
          <Clip $selected={selected === position} />
          <Header>
            {highlight && <OrderBadge>{position + 1}</OrderBadge>}
            {keyword && <KeywordLetter>{keyword[sourceColumn] || '·'}</KeywordLetter>}
            {onReorder && (
              <MoveButtons>
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
              </MoveButtons>
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
