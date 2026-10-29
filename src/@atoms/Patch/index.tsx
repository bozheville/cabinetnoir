import React from 'react';
import styled from 'styled-components';
import { leather as leatherMixin, stitch } from '@theme/mixins';
import { ZoneName } from '@theme/zones';

export interface PatchProps extends React.HTMLAttributes<HTMLElement> {
  /** Page zone picks the leather: header, tool, learn, identify… */
  zone?: ZoneName;
  /** Direct leather name overrides the zone. */
  leather?: string;
  shape?: 'band' | 'card';
  stitch?: 'none' | 'top' | 'bottom' | 'both' | 'all';
  /** Thread colour override: cream | linen | brown | gold. */
  thread?: string;
  vignette?: number;
}

// Legacy `Section` color prop keys -> zones, until migration ends.
export const legacyColorToZone: Record<string, ZoneName> = {
  header: 'header',
  encryptor: 'tool',
  description: 'description',
  footer: 'footer',
  homeMenu: 'homeMenu',
};

const Base = styled.section<PatchProps>`
  position: relative;
  display: block;
  ${({ shape = 'band' }) => (shape === 'card' ? `border-radius: ${({ theme }) => theme.radius.leather};` : '')}
  ${({ leather: leatherName, zone, theme }) =>
    leatherMixin(leatherName || theme.zones[zone || 'description'])}
  ${({ vignette }) => (vignette !== undefined ? '' : '')}
`;

/**
 * Patch: a piece of leather. Band (full-width page zone) or card.
 * Material recipe lives in @theme/mixins; this component only maps props.
 */
const Patch = React.forwardRef<HTMLElement, PatchProps>(
  (
    {
      shape = 'band',
      stitch: stitchSides = shape === 'card' ? 'all' : 'bottom',
      thread,
      zone,
      leather,
      ...rest
    },
    ref
  ) => {
    return (
      <Base
        ref={ref}
        shape={shape}
        zone={zone}
        leather={leather}
        {...(stitchSides !== 'none' ? stitch(stitchSides, thread || 'cream', shape === 'card' ? 5 : 6) : {})}
        {...rest}
      />
    );
  }
);

Patch.displayName = 'Patch';

export default Patch;
