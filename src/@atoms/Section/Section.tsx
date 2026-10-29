import React from 'react';
import styled from 'styled-components';
import Patch, { legacyColorToZone, PatchProps } from '@atoms/Patch';
import { ZoneName } from '@theme/zones';

interface SectionProps extends Omit<PatchProps, 'zone' | 'leather'> {
  /** Legacy prop: old colour key (header|encryptor|description|footer|homeMenu). */
  color?: string;
  /** New prop: page zone picks the leather. */
  zone?: ZoneName;
}

/**
 * Section: the legacy full-width band. A thin wrapper around Patch until
 * all usages move to `<Patch zone="…">`. Fixes the old bug where the
 * default 'gray' key resolved to undefined: default is now 'description'.
 */
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ color, zone, stitch = 'both', ...rest }, ref) => (
    <Patch
      ref={ref}
      shape="band"
      zone={zone || legacyColorToZone[color || 'description'] || 'description'}
      stitch={stitch}
      {...rest}
    />
  )
);

Section.displayName = 'Section';

export default Section;
