// Shared material mixins. One place decides what leather, paper and metal look like.
// Usage: ${leather('chestnut')} inside a styled-component.
import { css } from 'styled-components';
export { css } from 'styled-components';
import { LeatherTone } from './materials';
import { ink, data } from './ink';

const THREAD_TILES: Record<string, string> = {
  cream: '#f3e9d2',
  linen: '#d9c4a0',
  brown: '#7a5a36',
  gold: '#e2c47a',
};

const stitchTile = (threadColor: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="3"><path d="M2 2 H8 M12 2 H18 M22 2 H28" stroke="#000" stroke-opacity=".35" stroke-width="1" stroke-linecap="round"/><path d="M2 1 H8 M12 1 H18 M22 1 H28" stroke="${threadColor}" stroke-width="1.5" stroke-linecap="round"/></svg>`
  )}")`;

/** Full leather finish for a patch: base, grain, vignette, seam. */
export const leather = (name: string, vignette = 0.18) => css`
  ${({ theme }) => {
    const tone = theme.leather[name as keyof typeof theme.leather] as LeatherTone;
    const light = ['beige', 'tan'].includes(name);
    return css`
      background-color: ${tone.base};
      background-image: radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06), rgba(0,0,0,${vignette}) 100%),
        url(/images/grain.png);
      background-blend-mode: ${light ? 'soft-light' : 'normal'}, ${light ? 'soft-light' : 'multiply'};
      box-shadow: inset 0 0 0 1px ${tone.seam}, inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 0 rgba(0,0,0,0.35);
    `;
  }}
`;

/** Dashed stitch as a border-image: visible on any surface, unlike
 * background stitches that blend modes can mute. */
export const stitchBorder = (threadColor: string, width = 3) => css`
  border: ${width}px dashed ${threadColor};
  border-image: ${stitchTile(threadColor)};
  border-image-slice: ${width};
`;
export const stitch = (sides: 'top' | 'bottom' | 'both' | 'all' | 'none', threadColor = 'cream', inset = 6) => css`
  position: relative;
  ${({ theme }) => {
    const color = THREAD_TILES[threadColor] || theme.thread[threadColor as keyof typeof theme.thread] || threadColor;
    const tile = stitchTile(color);
    const horizontal = sides === 'both' || sides === 'all';
    const vertical = sides === 'all';
    const showTop = sides === 'top' || sides === 'both' || sides === 'all';
    const showBottom = sides === 'bottom' || sides === 'both' || sides === 'all';
    return css`
      &::before,
      &::after {
        content: '';
        position: absolute;
        pointer-events: none;
      }
      ${horizontal ? css`
        &::before {
          inset: ${inset}px ${inset}px auto ${inset}px;
          height: 3px;
          background-image: ${tile};
          background-repeat: repeat-x;
          ${showTop ? '' : 'display: none;'}
        }
        &::after {
          inset: auto ${inset}px ${inset}px ${inset}px;
          height: 3px;
          background-image: ${tile};
          background-repeat: repeat-x;
          ${showBottom ? '' : 'display: none;'}
        }
      ` : ''}
      ${vertical ? css`
        background-image: ${tile}, ${tile}, radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06), rgba(0,0,0,0.18) 100%), url(/images/grain.png);
        background-repeat: repeat-y, repeat-y, no-repeat, repeat;
        background-size: 3px auto, 3px auto, auto, auto;
        background-position: ${inset}px 0, calc(100% - ${inset}px) 0, 0 0, 0 0;
      ` : ''}
      @media (forced-colors: active) {
        &::before, &::after { display: none; }
      }
    `;
  }}
`;

/** Paper sheet on leather: square corners, ruled edge, soft shadow. */
export const paper = (tone: 'vellum' | 'ivory' | 'parchment' = 'vellum', elevated = true) => css`
  background-color: ${({ theme }) => theme.paper[tone]};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: ${({ theme }) => theme.radius.paper};
  box-shadow: ${({ theme }) => (elevated ? theme.shadow.card : 'none')};
  color: ${({ theme }) => ink.primary};
`;

/** Brushed metal gradient with the shared state model.
 * `kind` picks the metal; the caller wires its own disabled/tarnish look. */
export const metal = (kind: 'brass' | 'copper') => css`
  ${({ theme }) => {
    const m = theme.metal[kind];
    return css`
      background: linear-gradient(180deg, ${m.highlight} 0%, ${m.light} 18%, ${m.base} 55%, ${m.dark} 100%);
      border: 1px solid ${m.shadow};
      color: ${ink.primary};
      text-shadow: 0 1px 0 rgba(255,255,255,0.35);
      box-shadow: ${theme.shadow.metal};
      transition: filter 120ms ease-out, transform 120ms ease-out, box-shadow 120ms ease-out;
      &:hover:not(:disabled) {
        filter: brightness(1.06);
      }
      &:active:not(:disabled) {
        transform: translateY(1px);
        box-shadow: ${theme.shadow.metalPressed};
      }
      &:disabled {
        background: ${m.patina};
        border-color: ${m.shadow};
        box-shadow: none;
        filter: saturate(0.3);
        cursor: not-allowed;
        color: rgba(42, 26, 18, 0.6);
      }
    `;
  }}
`;

/** Engraved caption: the shared label style on metal or dark leather. */
export const engraved = (on: 'metal' | 'leather') => css`
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  ${on === 'metal'
    ? css`
        color: ${ink.primary};
        text-shadow: 0 1px 0 rgba(255,255,255,0.35);
      `
    : css`
        color: ${({ theme }) => theme.metal.brass.light};
        text-shadow: 0 -1px 0 rgba(0,0,0,0.6);
      `}
`;

/** Focus ring: 2px copper with offset. Never remove without a replacement. */
export const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.metal.copper.light};
    outline-offset: 2px;
  }
`;

/** Data colour helper: outline + soft fill for grid cells. */
export const dataCell = (index: number) => css`
  ${({ theme }) => css`
    border-color: ${theme.data[index % theme.data.length]};
    background-color: ${theme.data[index % theme.data.length]}1f;
    color: ${ink.primary};
  `}
`;
