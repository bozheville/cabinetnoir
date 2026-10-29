import React from 'react';
import styled from 'styled-components';
import { metal, focusRing } from '@theme/mixins';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // aria-label, required
  size?: 'sm' | 'md';
  kind?: 'brass' | 'copper';
}

const Knob = styled.button<{ $kind: 'brass' | 'copper'; $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  ${({ theme, $size }) => ($size === 'sm' ? `width: 32px; height: 32px;` : `width: 36px; height: 36px;`)}
  ${({ theme }) => theme.breakpoints.small} {
    width: 40px;
    height: 40px;
  }
  ${({ $kind }) => metal($kind)}
  cursor: pointer;

  &:hover:not(:disabled) svg {
    transform: rotate(15deg);
  }
  svg { transition: transform 120ms ease-out; }
  ${focusRing}
`;

/** Round brass knob with an engraved icon. Always has a label (a11y). */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, size = 'md', kind = 'brass', children, ...rest }, ref) => (
    <Knob ref={ref} aria-label={label} title={label} $kind={kind} $size={size} {...rest}>
      {children}
    </Knob>
  )
);

IconButton.displayName = 'IconButton';

export default IconButton;
