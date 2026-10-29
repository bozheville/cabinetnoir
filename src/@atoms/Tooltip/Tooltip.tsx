import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Trigger = styled.span<{ $clickable?: boolean }>`
  display: inline-flex;
  outline: none;
  ${({ $clickable }) => ($clickable ? 'cursor: pointer;' : '')}
`;

const InfoButton = styled.button`
  appearance: none;
  width: 15px;
  height: 15px;
  margin-left: 5px;
  padding: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const Bubble = styled.span<{
  $visible: boolean;
  $arrowLeft: number;
  $placement: 'above' | 'below';
}>`
  position: fixed;
  z-index: 1000;
  width: max-content;
  max-width: 260px;
  padding: 6px 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.paper.ivory};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  color: ${({ theme }) => theme.ink.primary};
  font-size: 12px;
  line-height: 1.4;
  text-align: left;
  white-space: normal;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

  /* small arrow pointing at the anchor */
  &::after {
    content: '';
    position: absolute;
    left: ${({ $arrowLeft }) => $arrowLeft}px;
    transform: translateX(-50%);
    border: 5px solid transparent;
    ${({ $placement, theme }) => ($placement === 'above'
      ? `top: 100%; border-top-color: ${({ theme }) => theme.paper.ivory};`
      : `bottom: 100%; border-bottom-color: ${({ theme }) => theme.paper.ivory};`)}
  }
`;

interface Position {
  top: number;
  left: number;
  arrowLeft: number;
  placement: 'above' | 'below';
}

interface TooltipProps {
  // Resolved text (callers pass their t() result).
  content: string;
  // The control being explained.
  children: React.ReactNode;
  // 'info' (default) renders a clickable [i] anchor next to the control;
  // 'children' makes the wrapped control itself the click trigger.
  trigger?: 'info' | 'children';
  // Passthrough for layout (e.g. flex/grid order on the wrapper).
  style?: React.CSSProperties;
}

// Click-triggered tooltip. The bubble is portalled to document.body and
// positioned with position:fixed, so ancestor overflow can never clip it.
// It opens on a click on the [i] anchor (or on the wrapped control when
// trigger="children") and closes on a second click, an outside click or
// Escape. Hover was dropped on purpose: it fired too aggressively while
// moving the pointer across controls.
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  trigger = 'info',
  style,
}) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState<Position | null>(null);
  const id = React.useId();
  const anchorRef = React.useRef<HTMLSpanElement | null>(null);
  const bubbleRef = React.useRef<HTMLSpanElement | null>(null);
  const isInfoTrigger = trigger === 'info';

  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return;

    const anchorRect = anchor.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();
    const margin = 8;
    const gap = 8;

    // Center horizontally on the anchor, clamped to the viewport.
    let left = anchorRect.left + anchorRect.width / 2 - bubbleRect.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - bubbleRect.width - margin));

    // Prefer above the anchor; fall back to below when there is no room.
    let top = anchorRect.top - bubbleRect.height - gap;
    let placement: Position['placement'] = 'above';
    if (top < margin) {
      top = anchorRect.bottom + gap;
      placement = 'below';
    }

    setPosition({
      top,
      left,
      arrowLeft: anchorRect.left + anchorRect.width / 2 - left,
      placement,
    });
  }, []);

  // Keep the bubble glued to the anchor while it is open.
  React.useLayoutEffect(() => {
    if (!open) return undefined;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  // Close on outside click or Escape.
  React.useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (bubbleRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const toggle = () => setOpen((value) => !value);

  return (
    <Wrapper style={style}>
      <Trigger
        ref={isInfoTrigger ? undefined : anchorRef}
        onClick={isInfoTrigger ? undefined : toggle}
        $clickable={!isInfoTrigger}
        aria-describedby={open ? id : undefined}
      >
        {children}
      </Trigger>
      {isInfoTrigger && (
        <InfoButton
          ref={anchorRef as unknown as React.Ref<HTMLButtonElement>}
          type="button"
          aria-label="More information"
          aria-expanded={open}
          onClick={toggle}
        >
          i
        </InfoButton>
      )}
      {open && createPortal(
        <Bubble
          id={id}
          role="tooltip"
          ref={bubbleRef}
          $visible={position !== null}
          $arrowLeft={position ? position.arrowLeft : 0}
          $placement={position ? position.placement : 'above'}
          style={position ? { top: position.top, left: position.left } : undefined}
        >
          {content}
        </Bubble>,
        document.body,
      )}
    </Wrapper>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
