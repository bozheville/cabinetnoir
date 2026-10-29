import React from 'react';
import styled from 'styled-components';

export type BadgeTone = 'easy' | 'medium' | 'hard' | 'copper' | 'brass' | 'patina';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: React.ReactNode;
}

const toneColors: Record<BadgeTone, { bg: string; fg: string }> = {
  easy: { bg: '#2f6b4f', fg: '#f3e9d2' },
  medium: { bg: '#8a6212', fg: '#f3e9d2' },
  hard: { bg: '#9e2b25', fg: '#f3e9d2' },
  copper: { bg: '#c58052', fg: '#2a1a12' },
  brass: { bg: '#c9a04f', fg: '#2a1a12' },
  patina: { bg: '#8f8a6a', fg: '#2a1a12' },
};

const Pill = styled.span<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 10px;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background-color: ${({ $tone }) => toneColors[$tone].bg};
  color: ${({ $tone }) => toneColors[$tone].fg};
  white-space: nowrap;
`;

/** Small enamel tag: difficulty, confidence, counts. */
const Badge: React.FC<BadgeProps> = ({ tone = 'brass', children, ...rest }) => (
  <Pill $tone={tone} {...rest}>{children}</Pill>
);

Badge.displayName = 'Badge';

export default Badge;
