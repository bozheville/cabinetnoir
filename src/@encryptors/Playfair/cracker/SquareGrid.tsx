import { useTranslation } from 'next-i18next';
import React from 'react';
import { Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

// The 5×5 key square. Click two cells to swap them — every swap is
// manual and reversible; the auto-improve passes stay separate.
const Grid = styled(Pane)`
  display: grid;
  grid-template-columns: repeat(5, 44px);
  gap: 4px;
  margin-top: 8px;
`;

const Cell = styled.button<{ $selected: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 4px;
  border: 1px solid ${({ theme, $selected }) => ($selected ? theme.colorScheme.blue[500] : theme.colorScheme.gray[300])};
  background: ${({ theme, $selected }) => ($selected ? theme.colorScheme.blue[100] : theme.colors.background)};
  font-family: monospace;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colorScheme.blue[500]};
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
    <Pane marginTop="12px">
      <Text size={300}>{t('processing.playfair.cracker.improve.swapHint')}</Text>
      <Grid data-guide="square-grid">
        {square.map((letter, index) => (
          <Cell
            key={`${letter}-${index}`}
            $selected={selected.includes(index)}
            onClick={() => onSelect(index)}
          >
            {letter}
          </Cell>
        ))}
      </Grid>
    </Pane>
  );
};

SquareGrid.displayName = 'SquareGrid';

export default SquareGrid;
