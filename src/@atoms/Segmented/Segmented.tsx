import React from 'react';
import styled, { css } from 'styled-components';
import { metal, focusRing, engraved } from '@theme/mixins';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  'aria-label'?: string;
  size?: 'sm' | 'md';
}

const Group = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
`;

const Plate = styled.button<{ $active: boolean; $kind: 'brass' | 'copper' }>`
  ${engraved('metal')}
  border-radius: ${({ theme }) => theme.radius.metal};
  font-size: 13px;
  height: 36px;
  padding: 0 16px;
  cursor: pointer;
  white-space: nowrap;
  ${({ $kind }) => metal($kind)}
  ${({ $active }) =>
    $active &&
    css`
      transform: translateY(1px);
      box-shadow: ${({ theme }) => theme.shadow.metalPressed};
    `}
  ${focusRing}
`;

/** Joined metal plates, like typewriter tab stops. Selected is pressed in. */
function Segmented<T extends string>({ options, value, onChange, name, size = 'md', ...rest }: SegmentedProps<T>) {
  return (
    <Group role="radiogroup" {...rest}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Plate
            key={option.value}
            role="radio"
            aria-checked={active}
            $active={active}
            $kind={active ? 'copper' : 'brass'}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              const index = options.findIndex((o) => o.value === value);
              if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                event.preventDefault();
                const next = options[(index + 1) % options.length];
                if (!next.disabled) onChange(next.value);
              }
              if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                event.preventDefault();
                const prev = options[(index - 1 + options.length) % options.length];
                if (!prev.disabled) onChange(prev.value);
              }
            }}
          >
            {option.label}
          </Plate>
        );
      })}
    </Group>
  );
}

Segmented.displayName = 'Segmented';

export default Segmented;
