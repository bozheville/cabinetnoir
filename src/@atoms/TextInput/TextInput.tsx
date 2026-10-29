import React from 'react';
import styled from 'styled-components';
import { css, focusRing, engraved } from '@theme/mixins';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Engraved caption above the field. */
  label?: React.ReactNode;
  error?: boolean;
  mono?: boolean;
  width?: string;
}

const Field = styled.label<{ $error?: boolean; $width?: string; $mono?: boolean }>`
  display: block;
  ${({ $width }) => ($width ? `width: ${$width};` : '')}
  color: inherit;
`;

const Label = styled.span`
  display: block;
  ${engraved('leather')}
  font-size: 11px;
  margin-bottom: 6px;
`;

const Input = styled.input<{ $error?: boolean; $mono?: boolean }>`
  display: block;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  background-color: ${({ theme }) => theme.paper.vellum};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.18);
  color: ${({ theme }) => theme.ink.primary};
  font-family: ${({ theme, $mono }) => ($mono ? theme.type.mono : theme.type.body)};
  font-size: 15px;

  &::placeholder { color: ${({ theme }) => theme.ink.faded}; }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.metal.copper.light};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.metal.copper.dark};
  }
  ${({ theme, $error }) =>
    $error &&
    css`
      border-color: ${theme.ink.red};
      &:focus { outline-color: ${theme.ink.red}; }
    `}
  ${focusRing}
`;

/** Inset paper field on leather. */
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, mono, width, ...rest }, ref) => (
    <Field $width={width}>
      {label ? <Label>{label}</Label> : null}
      <Input ref={ref} $error={error} $mono={mono} {...rest} />
    </Field>
  )
);

TextInput.displayName = 'TextInput';

export default TextInput;
