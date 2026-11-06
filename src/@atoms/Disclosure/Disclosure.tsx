import React, { useId, useState } from 'react';
import styled from 'styled-components';

import { Chevron } from '@ornaments';

// Open/closed choices the user made, kept while the page lives (module
// state: survives step changes and remounts, gone on reload).
const remembered = new Map<string, boolean>();

const Root = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: 4px;
`;

const Header = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.ink.cream};
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.metal.brass.light};
  }
`;

const Arrow = styled(Chevron)<{ $open: boolean }>`
  flex-shrink: 0;
  transition: transform 0.15s ease;
  transform: rotate(${({ $open }) => ($open ? '0deg' : '-90deg')});
`;

const Title = styled.span`
  font-size: 13px;
  font-style: italic;
`;

const Body = styled.div`
  padding: 4px 12px 10px 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme.ink.creamMuted};
  font-size: 13px;
  line-height: 1.5;
`;

export interface DisclosureProps {
  title: React.ReactNode;
  // Stable id for remembering the user's choice during the session.
  id: string;
  // Used until the user opens or closes it by hand.
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  'data-guide'?: string;
}

// A collapsible explanation: newcomers read it open, experienced users
// keep it shut and see only the title line.
const Disclosure: React.FC<DisclosureProps> = ({
  title,
  id,
  defaultOpen = false,
  children,
  className,
  'data-guide': dataGuide,
}) => {
  const [, rerender] = useState(0);
  const bodyId = useId();
  const open = remembered.get(id) ?? defaultOpen;

  const toggle = () => {
    remembered.set(id, !open);
    rerender((value) => value + 1);
  };

  return (
    <Root className={className} data-guide={dataGuide}>
      <Header type="button" aria-expanded={open} aria-controls={bodyId} onClick={toggle}>
        <Arrow $open={open} />
        <Title>{title}</Title>
      </Header>
      {open && <Body id={bodyId}>{children}</Body>}
    </Root>
  );
};

Disclosure.displayName = 'Disclosure';

export default Disclosure;
