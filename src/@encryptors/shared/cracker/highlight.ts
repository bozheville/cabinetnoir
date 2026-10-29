import { css } from 'styled-components';

// The universal cell highlight: one visual language for "this exact
// cell is the one being decided on" across the assignment board, the
// square renderer and the frequency chart. Strong variant: copper
// fill, thick copper border, bold glyph. Filled: a decided cell —
// brass fill, thin brass border. Tint variant: the weak row/column
// wash that points at a cell through its coordinates. Everything that
// highlights a single cell renders from here, so the three views
// never drift apart. Levels per specs/leather-deco-redesign/01 §6.

export type CellHighlightLevel = 'strong' | 'filled' | 'tint' | 'none';

export const cellHighlight = (level: CellHighlightLevel) => css`
  ${({ theme }) => {
    if (level === 'strong') {
      return css`
        background: ${theme.metal.copper.light}73;
        border: 2px solid ${theme.metal.copper.dark};
        color: ${theme.ink.primary};
        font-weight: 700;
      `;
    }
    if (level === 'filled') {
      return css`
        background: ${theme.metal.brass.light}59;
        border: 1px solid ${theme.metal.brass.dark};
        color: ${theme.ink.primary};
        font-weight: 700;
      `;
    }
    if (level === 'tint') {
      return css`
        background: ${theme.metal.brass.light}26;
      `;
    }
    return css``;
  }}
`;
