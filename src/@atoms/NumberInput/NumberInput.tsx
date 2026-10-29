import React from 'react';
import styled from 'styled-components';
import { focusRing, engraved } from '@theme/mixins';
import { Chevron } from '@ornaments';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
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

const Wrap = styled.span`
  display: inline-flex;
  align-items: stretch;
`;

const Input = styled.input`
  width: 100px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-right: none;
  border-radius: ${({ theme }) => theme.radius.paper} 0 0 ${({ theme }) => theme.radius.paper};
  background-color: ${({ theme }) => theme.paper.vellum};
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.18);
  color: ${({ theme }) => theme.ink.primary};
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  ${focusRing}
`;

const Steppers = styled.span`
  display: flex;
  flex-direction: column;
`;

const Stepper = styled.button`
  flex: 1;
  width: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, ${({ theme }) => theme.metal.copper.light}, ${({ theme }) => theme.metal.copper.dark});
  border: 1px solid ${({ theme }) => theme.metal.copper.shadow};
  color: #2a1a12;
  cursor: pointer;
  &:active { box-shadow: inset 0 2px 3px rgba(0,0,0,.35); }
  ${focusRing}
  svg { transform: rotate(90deg); }
  &:last-child svg { transform: rotate(-90deg); }
`;

/** Paper field with copper counter-wheel steppers. */
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, onChange, ...rest }, ref) => {
    const stepBy = (delta: number) => {
      const input = rest as React.InputHTMLAttributes<HTMLInputElement> & { value?: string | number };
      const current = Number(input.value ?? 0);
      const next = current + delta;
      const synthetic = { target: { value: String(next) } } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange?.(synthetic);
    };
    return (
      <Field>
        {label ? <Label>{label}</Label> : null}
        <Wrap>
          <Input ref={ref} type="number" inputMode="numeric" onChange={onChange} {...rest} />
          <Steppers>
            <Stepper type="button" tabIndex={-1} aria-hidden="true" onClick={() => stepBy(1)}>
              <Chevron size={5} />
            </Stepper>
            <Stepper type="button" tabIndex={-1} aria-hidden="true" onClick={() => stepBy(-1)}>
              <Chevron size={5} />
            </Stepper>
          </Steppers>
        </Wrap>
      </Field>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
