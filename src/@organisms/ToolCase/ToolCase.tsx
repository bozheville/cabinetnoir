import React from 'react';
import styled from 'styled-components';
import DecoFrame from '@ornaments/DecoFrame';

export interface ToolCaseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tabs attached to the top edge; hide the keystone when present. */
  tabs?: React.ReactNode;
  /** Keystone nameplate, shown only when there are no tabs. */
  keystone?: React.ReactNode;
  children?: React.ReactNode;
}

const Case = styled.div`
  max-width: ${({ theme }) => theme.widths.tool};
  margin: 24px auto;
  ${({ theme }) => theme.breakpoints.small} {
    margin: 16px 12px;
  }
`;

const TabsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;
  position: relative;
  z-index: 1;
`;

/**
 * ToolCase: the brass DecoFrame that wraps every tool surface.
 * One component replaces the three copy-pasted tool wrappers.
 */
const ToolCase: React.FC<ToolCaseProps> = ({ tabs, keystone, children, ...rest }) => (
  <Case {...rest}>
    {tabs ? <TabsRow>{tabs}</TabsRow> : null}
    <DecoFrame keystone={tabs ? undefined : keystone}>{children}</DecoFrame>
  </Case>
);

ToolCase.displayName = 'ToolCase';

export default ToolCase;
