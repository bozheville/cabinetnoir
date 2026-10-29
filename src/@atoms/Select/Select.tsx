import React from 'react';
import styled from 'styled-components';
import { metal, focusRing, engraved } from '@theme/mixins';
import { Chevron } from '@ornaments';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  width?: string;
}

const Shell = styled.span<{ $width?: string }>`
  display: inline-flex;
  position: relative;
  ${({ $width }) => ($width ? `width: ${$width};` : '')}
`;

const NativeSelect = styled.select`
  appearance: none;
  width: 100%;
  height: 36px;
  padding: 0 36px 0 16px;
  ${metal('brass')}
  ${engraved('metal')}
  font-size: 13px;
  cursor: pointer;

  &:disabled { cursor: not-allowed; }
  &:-moz-focusring { outline: none; }
  ${focusRing}
`;

const ChevronWrap = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  color: ${({ theme }) => theme.ink.primary};
  pointer-events: none;
`;

/** Brass plate select with a deco chevron. Native <select> underneath. */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, width, children, ...rest }, ref) => (
    <Shell $width={width}>
      <NativeSelect ref={ref} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </NativeSelect>
      <ChevronWrap aria-hidden="true">
        <Chevron size={6} />
      </ChevronWrap>
    </Shell>
  )
);

Select.displayName = 'Select';

export default Select;
