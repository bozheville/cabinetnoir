import React from 'react';
import styled from 'styled-components';
import { BadgeTone } from '@theme/badge';

export type { BadgeTone };
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: React.ReactNode;
}

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
  background-color: ${({ theme, $tone }) => theme.badge[$tone].bg};
  color: ${({ theme, $tone }) => theme.badge[$tone].fg};
  white-space: nowrap;
`;

/** Small enamel tag: difficulty, confidence, counts. */
const Badge: React.FC<BadgeProps> = ({ tone = 'brass', children, ...rest }) => (
  <Pill $tone={tone} {...rest}>{children}</Pill>
);

Badge.displayName = 'Badge';

export default Badge;
