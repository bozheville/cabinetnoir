import React from 'react';
import styled, { css } from 'styled-components';
import { paper as paperMixin } from '@theme/mixins';

export interface PaperProps extends React.HTMLAttributes<HTMLElement> {
  tone?: 'vellum' | 'ivory' | 'parchment';
  elevated?: boolean;
  /** Faint ruled lines, for text areas only. */
  ruled?: boolean;
}

const PaperStyled = styled.div<PaperProps>`
  ${({ tone = 'vellum', elevated = true }) => paperMixin(tone, elevated)}
  ${({ theme, ruled }) =>
    ruled
      ? css`
          background-image: repeating-linear-gradient(
            180deg,
            transparent,
            transparent calc(1em * 1.5 - 1px),
            ${theme.paper.rule} calc(1em * 1.5 - 1px),
            ${theme.paper.rule} calc(1em * 1.5)
          );
          background-origin: content-box;
        `
      : ''}
`;

const Paper: React.FC<PaperProps> = ({ tone, elevated, ruled, ...rest }) => (
  <PaperStyled tone={tone} elevated={elevated} ruled={ruled} {...rest} />
);

Paper.displayName = 'Paper';

export default Paper;
