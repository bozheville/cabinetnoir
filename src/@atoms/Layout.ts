import styled from 'styled-components';

/** Vertical flex layout with a gap from the space scale. Replaces evergreen Pane stacks. */
export const Stack = styled.div<{
  gap?: keyof typeof import('@theme/space').space;
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end';
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ align = 'stretch' }) => align};
  gap: ${({ theme, gap = '4' }) => theme.space[gap]};
`;

/** Horizontal wrapping flex row. Replaces evergreen Pane rows. */
export const Cluster = styled.div<{
  gap?: keyof typeof import('@theme/space').space;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
  wrap?: boolean;
}>`
  display: flex;
  flex-wrap: ${({ wrap = true }) => (wrap ? 'wrap' : 'nowrap')};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'center' }) => align};
  gap: ${({ theme, gap = '3' }) => theme.space[gap]};
`;
