import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
`;

const Trigger = styled.span`
  display: inline-flex;
  outline: none;
`;

const Bubble = styled.span<{ $visible: boolean }>`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 260px;
  padding: 6px 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  font-size: 12px;
  line-height: 1.4;
  text-align: left;
  white-space: normal;
  z-index: 20;
  pointer-events: none;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

  /* small arrow */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.text};
  }
`;

interface TooltipProps {
  // Resolved text (callers pass their t() result).
  content: string;
  // The control being explained; must be focusable for keyboard users.
  children: React.ReactNode;
}

// CSS-only tooltip: shows on hover over the control and while the control
// has keyboard focus. No portal, no JS; the bubble lives in the DOM for
// screen readers via aria-describedby.
const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = React.useState(false);
  const id = React.useId();

  return (
    <Wrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <Trigger aria-describedby={id}>{children}</Trigger>
      <Bubble id={id} role="tooltip" $visible={visible}>
        {content}
      </Bubble>
    </Wrapper>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
