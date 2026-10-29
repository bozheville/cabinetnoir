import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { Minion } from '@typography';
import { cellHighlight } from '@encryptors/shared/cracker/highlight';

// The 5×5 key square. Click two cells to swap them — every swap is
// manual and reversible; the auto-improve passes stay separate.
const PanelRoot = styled.div`
  margin-top: 12px;
`;

const SwapHint = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 44px);
  gap: 4px;
  margin-top: 8px;
`;

// Type-tray cells: ivory paper, rule lines; the selected cells light up
// with the shared filled highlight.
const Cell = styled.button<{ $selected: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  background: ${({ theme }) => theme.paper.ivory};
  color: ${({ theme }) => theme.ink.primary};
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 16px;
  cursor: pointer;
  ${({ $selected }) => cellHighlight($selected ? 'filled' : 'none')}

  &:hover {
    border-color: ${({ theme }) => theme.metal.copper.dark};
  }
`;

interface SquareGridProps {
  square: string[];
  // Indices of the two currently selected cells (for a manual swap).
  selected: number[];
  onSelect: (index: number) => void;
}

const SquareGrid: React.FC<SquareGridProps> = ({ square, selected, onSelect }) => {
  const { t } = useTranslation('common');

  return (
    <PanelRoot>
      <SwapHint>{t('processing.playfair.cracker.improve.swapHint')}</SwapHint>
      <Grid data-guide="square-grid">
        {square.map((letter, index) => (
          <Cell
            key={`${letter}-${index}`}
            type="button"
            $selected={selected.includes(index)}
            onClick={() => onSelect(index)}
          >
            {letter}
          </Cell>
        ))}
      </Grid>
    </PanelRoot>
  );
};

SquareGrid.displayName = 'SquareGrid';

export default SquareGrid;
