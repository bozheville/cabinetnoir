import React from 'react';
import styled from 'styled-components';
import { paper as paperMixin, leather as leatherMixin } from '@theme/mixins';

export interface ControlPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Panel = styled.div`
  ${leatherMixin('saddle', 0.1)}
  border-radius: ${({ theme }) => theme.radius.leather};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 5px;
    border-radius: 6px;
    pointer-events: none;
    border: 1.2px dashed ${({ theme }) => theme.leather.saddle.thread};
    border-color: ${({ theme }) => theme.leather.saddle.thread};
    opacity: 0.7;
  }
  position: relative;
  @media (forced-colors: active) { &::before, &::after { display: none; } }
`;

/** ControlGroup: [caption label][control][info] — the settings row unit. */
export const ControlGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
`;

/** ControlPanel: the saddle-leather inset at the top of a tool. */
const ControlPanel: React.FC<ControlPanelProps> = ({ children, ...rest }) => (
  <Panel {...rest}>{children}</Panel>
);

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
