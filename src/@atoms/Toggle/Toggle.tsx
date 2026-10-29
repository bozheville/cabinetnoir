import React from 'react';
import styled from 'styled-components';
import { metal, focusRing, engraved } from '@theme/mixins';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
}

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
`;

const Housing = styled.span`
  flex: none;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  transition: background 120ms ease-out;
  background: linear-gradient(180deg, ${({ theme }) => theme.metal.brass.light}, ${({ theme }) => theme.metal.brass.dark});
  border: 1px solid ${({ theme }) => theme.metal.brass.shadow};
  box-shadow: ${({ theme }) => theme.shadow.metal};
`;

const Lever = styled.span<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(180deg, ${({ theme }) => theme.metal.copper.highlight}, ${({ theme }) => theme.metal.copper.dark});
  border: 1px solid ${({ theme }) => theme.metal.copper.shadow};
  box-shadow: 0 1px 0 rgba(0,0,0,.35);
  transition: transform 150ms ease-in-out;
  transform: translateX(${({ $checked }) => ($checked ? '20px' : '0')});
`;

const Label = styled.span`
  ${engraved('leather')}
  font-size: 13px;
`;

const Wrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: inherit;
  ${focusRing}
  input:focus-visible ~ ${Housing} {
    outline: 2px solid ${({ theme }) => theme.metal.copper.light};
    outline-offset: 2px;
  }
  input:disabled ~ * { opacity: 0.5; cursor: not-allowed; }
`;

/** Brass toggle switch (old light switch). For booleans that act immediately. */
const Toggle: React.FC<ToggleProps> = ({ label, ...rest }) => (
  <Wrapper>
    <HiddenInput type="checkbox" role="switch" {...rest} />
    <Housing>
      <Lever $checked={rest.checked ?? rest.defaultChecked ?? false} />
    </Housing>
    <Label>{label}</Label>
  </Wrapper>
);

Toggle.displayName = 'Toggle';

export default Toggle;
