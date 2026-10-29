// Type tokens. Faces are self-hosted; scale follows 02-typography.md.
// Display face candidates need Cyrillic + French verification before swap.
export const type = {
  display: "'Roboto', Georgia, serif",
  engraved: "'Roboto', 'Arial Narrow', sans-serif",
  body: "'Roboto-Slab', Georgia, serif",
  mono: "'IBM Plex Mono', 'PT Mono', 'Courier New', monospace",
} as const;

export default type;
