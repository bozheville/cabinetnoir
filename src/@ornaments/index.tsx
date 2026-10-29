import React from 'react';

/**
 * Deco ornament primitives. All SVG, stroke-based, `currentColor`,
 * aria-hidden. The parent sets `color`. See specs/leather-deco-redesign/04.
 */

interface OrnamentProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
}

/** Stepped (ziggurat) frame corner, 24px production size. Mirror for other corners. */
export const SteppedCorner: React.FC<OrnamentProps> = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="square" aria-hidden="true" focusable="false" {...rest}>
    <path d="M0.75 23.25 V8.75 H4.75 V4.75 H8.75 V0.75 H23.25" strokeWidth="1.5" />
    <path d="M4.75 23.25 V12.75 H8.75 V8.75 H12.75 V4.75 H23.25" strokeWidth="0.75" />
    <circle cx="4.75" cy="4.75" r="3" fill="currentColor" stroke="none" />
    <circle cx="4" cy="4" r="1" fill="white" fillOpacity="0.55" stroke="none" />
  </svg>
);

/** Lozenge (small rotated square): rule terminals, separators, bullets. */
export const Lozenge: React.FC<OrnamentProps & { filled?: boolean }> = ({ size = 7, filled = true, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 8 8" aria-hidden="true" focusable="false" {...rest}>
    <rect x="0.75" y="0.75" width="6.5" height="6.5" transform="rotate(45 4 4)" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1" />
  </svg>
);

/** Chevron: breadcrumb, dropdowns, steppers. Points right by default. */
export const Chevron: React.FC<OrnamentProps> = ({ size = 8, ...rest }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true" focusable="false" {...rest}>
    <path d="M1.5 1 L6 6 L10.5 1" />
  </svg>
);

/** Sunburst fan: hero and empty states. Static, never rotated. */
export const Sunburst: React.FC<OrnamentProps & { rays?: number; radius?: number }> = ({ size = 700, rays = 24, radius = 700, ...rest }) => {
  const paths: React.ReactElement[] = [];
  for (let k = 0; k <= rays; k++) {
    const a = (Math.PI * k) / rays;
    paths.push(
      <path
        key={k}
        d={`M0 0 L${(-Math.cos(a) * radius).toFixed(1)} ${(-Math.sin(a) * radius).toFixed(1)}`}
        strokeWidth={k % 2 ? 0.75 : 1.5}
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`} fill="none" stroke="currentColor" strokeOpacity="0.2" aria-hidden="true" focusable="false" {...rest}>
      {paths}
      <path d={`M-110 0 A110 110 0 0 1 110 0`} strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
};

/** Engraved icon set, 24px grid, 1.5px strokes, square caps. Replaces Blueprint icons. */
const icon = (d: string) => ({ size = 16, ...rest }: OrnamentProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true" focusable="false" {...rest}>
    <path d={d} />
  </svg>
);

export const SwapIcon = icon('M3 12 H21 M6 8 L3 12 L6 16 M18 8 L21 12 L18 16');
export const CopyIcon = icon('M9 9 H19 V19 H9 Z M5 15 V5 H15');
export const EraseIcon = icon('M4 16 L12 8 L20 16 M8 20 H20');
export const InfoIcon = icon('M12 10 V16 M12 7 V7.01 M4 4 H20 V20 H4 Z');
export const KeyIcon = icon('M14 10 A4 4 0 1 0 6 10 A4 4 0 0 0 14 10 M14 10 H21 M18 10 V14 M21 10 V13');
export const LampIcon = icon('M12 3 A6 6 0 0 1 18 9 C18 12 16 13 16 16 H8 C8 13 6 12 6 9 A6 6 0 0 1 12 3 M9 20 H15');
export const CoffeeIcon = icon('M4 8 H17 V14 A4 4 0 0 1 13 18 H8 A4 4 0 0 1 4 14 Z M17 9 H20 V12 A2 2 0 0 1 18 14 H17');
export const SealIcon = icon('M12 3 L15 6 L19 5 L18 9 L21 12 L18 15 L19 19 L15 18 L12 21 L9 18 L5 19 L6 15 L3 12 L6 9 L5 5 L9 6 Z M9 12 L11 14 L15 10');
