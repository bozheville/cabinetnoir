import React from 'react';
import styled from 'styled-components';
import { metal, focusRing } from '@theme/mixins';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
}

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
`;

const Box = styled.span`
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.radius.metal};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${metal('brass')}
  svg { opacity: 0; }
`;

const Wrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: inherit;
  ${focusRing}
  input:focus-visible ~ ${Box} {
    outline: 2px solid ${({ theme }) => theme.metal.copper.light};
    outline-offset: 2px;
  }
  input:checked + ${Box} svg { opacity: 1; }
  input:disabled ~ * { opacity: 0.5; cursor: not-allowed; }
`;

/** Small brass tick box. For multi-select lists; use Toggle for behaviour switches. */
const Checkbox: React.FC<CheckboxProps> = ({ label, children, ...rest }) => (
  <Wrapper>
    <HiddenInput type="checkbox" {...rest} />
    <Box>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#2a1a12" strokeWidth="2" aria-hidden="true">
        <path d="M1.5 5.5 L4 8 L8.5 2" />
      </svg>
    </Box>
    <span>{label ?? children}</span>
  </Wrapper>
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
