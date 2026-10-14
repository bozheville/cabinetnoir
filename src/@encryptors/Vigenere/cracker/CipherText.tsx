import React from 'react';
import styled from 'styled-components';

import { NormalizedText } from '../analysis/normalize';

// Palette used across the cracker for repeats, slices and so on.
export const HIGHLIGHT_COLORS = [
  '#e5484d', // red
  '#30a46c', // green
  '#0091ff', // blue
  '#f5a623', // amber
  '#8e4ec6', // purple
  '#00a2c7', // cyan
  '#e5683c', // orange
  '#c738b8', // magenta
];

interface CipherTextProps {
  input: string;
  normalized: NormalizedText;
  // Color for a clean-text letter index, or undefined to leave plain.
  colorFor?: (cleanIndex: number) => string | undefined;
}

const Segment = styled.span<{ $color?: string }>`
  color: ${({ $color }) => $color || 'inherit'};
  font-weight: ${({ $color }) => ($color ? 700 : 400)};
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
`;

// Renders the original text with per-letter colors. Colors are keyed by
// clean-text letter index and mapped back through the normalization index
// map, so spaces and punctuation stay in place.
const CipherText: React.FC<CipherTextProps> = ({ input, normalized, colorFor }) => {
  const segments: { text: string; color?: string }[] = [];
  const colorByOriginal = new Map<number, string>();

  if (colorFor) {
    normalized.originalIndices.forEach((originalIndex, cleanIndex) => {
      const color = colorFor(cleanIndex);
      if (color) {
        colorByOriginal.set(originalIndex, color);
      }
    });
  }

  for (let i = 0; i < input.length; i += 1) {
    const color = colorByOriginal.get(i);
    const last = segments[segments.length - 1];
    if (last && last.color === color) {
      last.text += input[i];
    } else {
      segments.push({ text: input[i], color });
    }
  }

  return (
    <div>
      {segments.map((segment, index) => (
        <Segment key={index} $color={segment.color}>{segment.text}</Segment>
      ))}
    </div>
  );
};

export default CipherText;
