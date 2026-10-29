import React from 'react';
import styled from 'styled-components';
import DecoFrame from '@ornaments/DecoFrame';
import { Lozenge } from '@ornaments';

export interface ToolCaseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tabs attached to the top edge; hide the keystone when present. */
  tabs?: React.ReactNode;
  /** Keystone nameplate, shown only when there are no tabs. */
  keystone?: React.ReactNode;
  /**
   * full: the complete DecoFrame (tool, cryptoanalysis).
   * lintel: only the double top rule with a centre lozenge — the
   * delimiter the storytelling tabs dock onto (learn/history/practice).
   */
  variant?: 'full' | 'lintel';
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

// The lintel: the DecoFrame's top rule alone, with a lozenge at the
// centre where the keystone would sit on the full frame.
const Lintel = styled.div`
  position: relative;
  border-top: 1.5px solid currentColor;
  color: ${({ theme }) => theme.metal.brass.light};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 0;
    right: 0;
    border-top: 0.75px solid currentColor;
    opacity: 0.8;
  }

  > .lintel-lozenge {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    color: inherit;
  }

  @media (forced-colors: active) {
    &::after { display: none; }
  }
`;

/**
 * ToolCase: the brass DecoFrame that wraps every tool surface, or a
 * lintel-only delimiter for storytelling tabs. One component replaces
 * the three copy-pasted tool wrappers.
 */
const ToolCase: React.FC<ToolCaseProps> = ({ tabs, keystone, variant = 'full', children, ...rest }) => (
  <Case {...rest}>
    {tabs ? <TabsRow>{tabs}</TabsRow> : null}
    {variant === 'lintel' ? (
      <Lintel>
        <Lozenge className="lintel-lozenge" size={9} aria-hidden="true" />
        {children}
      </Lintel>
    ) : (
      <DecoFrame keystone={tabs ? undefined : keystone}>{children}</DecoFrame>
    )}
  </Case>
);

ToolCase.displayName = 'ToolCase';

export default ToolCase;
