import React from 'react';
import styled from 'styled-components';
import { engraved, focusRing } from '@theme/mixins';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  /** Show the current value in a small brass window. */
  showValue?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const Field = styled.label`
  display: block;
  color: inherit;
`;

const Label = styled.span`
  display: block;
  ${engraved('leather')}
  font-size: 11px;
  margin-bottom: 6px;
`;

const Rail = styled.span`
  display: block;
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(180deg, ${({ theme }) => theme.metal.brass.light}, ${({ theme }) => theme.metal.brass.dark});
  border: 1px solid ${({ theme }) => theme.metal.brass.shadow};
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 24px;
    border-radius: 3px;
    background: linear-gradient(180deg, ${({ theme }) => theme.metal.copper.highlight}, ${({ theme }) => theme.metal.copper.dark});
    border: 1px solid ${({ theme }) => theme.metal.copper.shadow};
    box-shadow: 0 1px 0 rgba(0,0,0,.45);
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 24px;
    border-radius: 3px;
    background: linear-gradient(180deg, ${({ theme }) => theme.metal.copper.highlight}, ${({ theme }) => theme.metal.copper.dark});
    border: 1px solid ${({ theme }) => theme.metal.copper.shadow};
  }
  ${focusRing}
`;

const ValueWindow = styled.span`
  position: absolute;
  top: -24px;
  transform: translateX(-50%);
  min-width: 36px;
  padding: 0 6px;
  text-align: center;
  background-color: ${({ theme }) => theme.paper.vellum};
  border: 1px solid ${({ theme }) => theme.metal.brass.dark};
  border-radius: ${({ theme }) => theme.radius.paper};
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.ink.primary};
  pointer-events: none;
`;

/** Brass rail with tick marks and a copper lever thumb. Native range underneath. */
const Slider: React.FC<SliderProps> = ({ label, showValue, min = 0, max = 100, step = 1, value, ...rest }) => {
  const percentage = ((Number(value) - min) / (max - min)) * 100;
  return (
    <Field>
      {label ? <Label>{label}</Label> : null}
      <Rail>
        {showValue ? <ValueWindow style={{ left: `calc(${percentage}% + ${8 - (percentage / 100) * 16}px)` }}>{String(value)}</ValueWindow> : null}
        <Input type="range" min={min} max={max} step={step} value={value} {...rest} />
      </Rail>
    </Field>
  );
};

Slider.displayName = 'Slider';

export default Slider;
