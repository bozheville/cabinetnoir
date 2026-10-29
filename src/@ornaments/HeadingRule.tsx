import React from 'react';
import styled from 'styled-components';
import { Lozenge } from './index';

interface HeadingRuleProps {
  children: React.ReactNode;
  /** Text colour on paper (light) or leather/desk (dark). */
  on?: 'light' | 'dark';
  id?: string;
}

const Row = styled.div<{ $on: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  gap: 14px;
  color: ${({ theme, $on }) => ($on === 'dark' ? theme.metal.brass.light : theme.metal.brass.dark)};
`;

const Rule = styled.span`
  flex: 1;
  height: 1px;
  border-top: 0.75px solid currentColor;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &:first-of-type { justify-content: flex-start; }

  svg { display: block; }
  &:first-of-type svg { margin-right: 0; margin-left: 10px; }
  &:last-of-type svg { margin-left: 0; margin-right: 10px; }

  @media (max-width: 640px) {
    border-top: none;
    svg { margin: 0; }
  }
`;

const Title = styled.h2<{ $on: 'light' | 'dark' }>`
  margin: 0;
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme, $on }) => ($on === 'dark' ? theme.metal.brass.light : theme.ink.primary)};
  text-align: center;
`;

/** `──◆──  HEADING  ──◆──`: top-level section title inside a band. */
const HeadingRule: React.FC<HeadingRuleProps> = ({ children, on = 'light', id }) => (
  <Row $on={on} id={id}>
    <Rule aria-hidden="true">
      <Lozenge size={7} />
    </Rule>
    <Title $on={on}>{children}</Title>
    <Rule aria-hidden="true">
      <Lozenge size={7} />
    </Rule>
  </Row>
);

HeadingRule.displayName = 'HeadingRule';

export default HeadingRule;
