import { css } from 'styled-components';

// The universal cell highlight: one visual language for "this exact
// cell is the one being decided on" across the assignment board, the
// square renderer and the frequency chart. Strong variant: saturated
// blue fill, thick blue border, bold glyph. Tint variant: the weak
// row/column wash that points at a cell through its coordinates.
// Everything that highlights a single cell renders from here, so the
// three views never drift apart.

export type CellHighlightLevel = 'strong' | 'filled' | 'tint' | 'none';

export const cellHighlight = (level: CellHighlightLevel) => css`
  ${({ theme }) => {
    if (level === 'strong') {
      return css`
        background: ${theme.colorScheme.blue[200]};
        border: 2px solid ${theme.colorScheme.blue[600]};
        font-weight: 700;
      `;
    }
    if (level === 'filled') {
      return css`
        background: ${theme.colorScheme.blue[100]};
        border: 1px solid ${theme.colorScheme.blue[500]};
        font-weight: 700;
      `;
    }
    if (level === 'tint') {
      return css`
        background: ${theme.colorScheme.blue[50]};
      `;
    }
    return css``;
  }}
`;
