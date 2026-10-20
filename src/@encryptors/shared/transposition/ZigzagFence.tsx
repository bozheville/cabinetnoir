import React from 'react';
import styled from 'styled-components';

// The zigzag drawn: letters placed on their rails, the fence path
// underneath. Shared by the RailFence tool and its cracker, where the
// picture must re-draw as the user changes the settings.
//
// The pattern walk mirrors the shared railFence engine exactly, so the
// drawing never disagrees with the ciphertext.

interface ZigzagFenceProps {
  text: string;
  rails: number;
  offset?: number;
  // Letters actually drawn (the fence scrolls instead of shrinking);
  // the pane notes when the text is longer.
  maxLetters?: number;
  dataGuide?: string;
}

const Wrapper = styled.div`
  overflow-x: auto;
  padding: 4px 2px;
`;

const Note = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const RAIL_HEIGHT = 22;
const LETTER_WIDTH = 15;
const PADDING = 10;

export const railsPattern = (length: number, rails: number, offset: number): number[] => {
  const pattern: number[] = [];
  let row = Math.min(Math.max(offset, 0), rails - 1);
  let direction = row === rails - 1 ? -1 : 1;
  for (let index = 0; index < length; index += 1) {
    pattern.push(row);
    row += direction;
    if (row === rails - 1 || row === 0) {
      direction = -direction;
    }
  }
  return pattern;
};

const ZigzagFence: React.FC<ZigzagFenceProps> = ({
  text,
  rails,
  offset = 0,
  maxLetters = 42,
  dataGuide,
}) => {
  const shown = text.slice(0, maxLetters);
  const pattern = railsPattern(shown.length, rails, offset);
  const width = PADDING * 2 + Math.max(shown.length, 8) * LETTER_WIDTH;
  const height = RAIL_HEIGHT * rails + PADDING * 2;
  const x = (index: number) => PADDING + index * LETTER_WIDTH + LETTER_WIDTH / 2;
  const y = (rail: number) => PADDING + rail * RAIL_HEIGHT + RAIL_HEIGHT / 2;

  const pathPoints = pattern.map((rail, index) => `${x(index)},${y(rail)}`).join(' ');

  return (
    <Wrapper data-guide={dataGuide}>
      <svg width={width} height={height} role="img">
        {/* the rails */}
        {Array.from({ length: rails }, (_, rail) => (
          <line
            key={rail}
            x1={PADDING}
            y1={y(rail)}
            x2={width - PADDING}
            y2={y(rail)}
            stroke="#d4d4d8"
            strokeWidth={1}
          />
        ))}
        {/* the zigzag path */}
        <polyline
          points={pathPoints}
          fill="none"
          stroke="#30a46c"
          strokeWidth={1.5}
          opacity={0.7}
        />
        {/* the letters on their rails */}
        {shown.split('').map((letter, index) => (
          <text
            key={index}
            x={x(index)}
            y={y(pattern[index]) - 5}
            textAnchor="middle"
            fontSize={12}
            fontFamily="monospace"
            fontWeight={700}
            fill="#1f2937"
          >
            {letter}
          </text>
        ))}
      </svg>
      {text.length > maxLetters && (
        <Note>
          {`… +${text.length - maxLetters}`}
        </Note>
      )}
    </Wrapper>
  );
};

ZigzagFence.displayName = 'ZigzagFence';

export default ZigzagFence;
