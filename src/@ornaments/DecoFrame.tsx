import React from 'react';
import styled, { css } from 'styled-components';
import { SteppedCorner } from './index';
import { metal, focusRing, engraved } from '@theme/mixins';

export interface DecoFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Frame metal: brass default, copper = active/selected. */
  tone?: 'brass' | 'copper';
  /** Tone for the inner surface label rules on paper vs dark. */
  color?: 'light' | 'dark';
  /** Keystone nameplate text at the top centre. Hidden when tabs are used. */
  keystone?: React.ReactNode;
  corners?: 'stepped' | 'rivet';
  /** Frame padding: mobile 12, desktop 24/32. */
  padding?: 'tight' | 'default';
  children?: React.ReactNode;
}

const Frame = styled.div<DecoFrameProps>`
  position: relative;
  padding: ${({ padding }) => (padding === 'tight' ? '12px' : '12px')};
  color: ${({ theme, tone }) =>
    tone === 'copper' ? theme.metal.copper.light : theme.metal.brass.light};

  ${({ theme }) => theme.breakpoints.tablet} {
    padding: 24px;
  }
  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 32px;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border: 1.5px solid currentColor;
  }
  &::after {
    inset: 4px;
    border-width: 0.75px;
  }
  /* leave gaps for tabs attached to the top edge */
  &::before { border-top-color: transparent; }
  &::after { border-top-color: transparent; }

  > .deco-frame-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    color: inherit;
  }
  > .deco-frame-corner.tl { top: -1.5px; left: -1.5px; }
  > .deco-frame-corner.tr { top: -1.5px; right: -1.5px; transform: scaleX(-1); }
  > .deco-frame-corner.bl { bottom: -1.5px; left: -1.5px; transform: scaleY(-1); }
  > .deco-frame-corner.br { bottom: -1.5px; right: -1.5px; transform: scale(-1, -1); }

  ${({ theme }) => theme.breakpoints.tablet} {
    > .deco-frame-corner { width: 24px; height: 24px; }
  }
  @media (forced-colors: active) {
    &::before { border: 1px solid CanvasText; border-top-color: transparent; }
    &::after, > .deco-frame-corner { display: none; }
  }
`;

const Keystone = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  padding: 6px 24px;
  ${metal('brass')};
  ${focusRing}
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%);
  ${engraved('metal')}
  font-size: 13px;
  white-space: nowrap;
`;

/**
 * DecoFrame: thin brass double rule with stepped corners around the tool,
 * cryptoanalysis wizard, identify panel and hero nameplate.
 */
const DecoFrame: React.FC<DecoFrameProps> = ({
  tone = 'brass',
  keystone,
  corners = 'stepped',
  children,
  ...rest
}) => (
  <Frame tone={tone} {...rest}>
    {corners === 'stepped' && (
      <>
        <SteppedCorner className="deco-frame-corner tl" aria-hidden="true" />
        <SteppedCorner className="deco-frame-corner tr" aria-hidden="true" />
        <SteppedCorner className="deco-frame-corner bl" aria-hidden="true" />
        <SteppedCorner className="deco-frame-corner br" aria-hidden="true" />
      </>
    )}
    {keystone ? <Keystone>{keystone}</Keystone> : null}
    {children}
  </Frame>
);

DecoFrame.displayName = 'DecoFrame';

export default DecoFrame;
