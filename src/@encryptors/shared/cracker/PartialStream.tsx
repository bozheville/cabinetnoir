import React from 'react';
import { Text } from 'evergreen-ui';
import styled from 'styled-components';

import { SymbolMapping } from '../analysis/substitution';

// The partial-plaintext stream: the worksheet view of breaking a
// monoalphabetic substitution. Decided symbols render as their plain
// letters; still-encrypted ones render as the cipher symbols themselves
// — muted, slightly spaced — so the numbers/letters/patterns read like
// a paper break: "MEE 34 AT 11". A hovered hint row can pass its symbol
// sequence to light up exactly where it occurs. Symbol-agnostic:
// coordinates for Polybius-based ciphers, cipher letters for the
// Keyword cracker.

const StreamBox = styled.div`
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;

const PlainSegment = styled.span`
  font-weight: 700;
`;

const CipherSegment = styled.span<{ theme: { colors: { textLight: string } } }>`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 2px;
`;

// The amber the assignment board uses for highlighted cells.
const HIGHLIGHT = '#f5a623';

const HighlightedSegment = styled.span`
  font-weight: 700;
  color: ${HIGHLIGHT};
  margin: 0 2px;
`;

interface PartialStreamProps {
  // The cipher's clean symbol stream, in text order.
  symbols: string[];
  // Current symbol → plain letter mapping.
  mapping: SymbolMapping;
  // Optional symbol sequence (a hovered hint row): every overlapping
  // occurrence lights up, encrypted or already decrypted.
  highlightSequence?: string[];
}

const PartialStream: React.FC<PartialStreamProps> = ({
  symbols,
  mapping,
  highlightSequence,
}) => {
  // Does the token at `index` fall inside any occurrence of the
  // highlight sequence?
  const isHighlighted = (index: number): boolean => {
    if (!highlightSequence || highlightSequence.length === 0) {
      return false;
    }
    const length = highlightSequence.length;
    for (let start = Math.max(0, index - length + 1); start <= index; start += 1) {
      let matches = start + length <= symbols.length;
      for (let offset = 0; matches && offset < length; offset += 1) {
        matches = symbols[start + offset] === highlightSequence[offset];
      }
      if (matches) {
        return true;
      }
    }
    return false;
  };

  return (
    <StreamBox data-guide="partial-stream">
      {symbols.map((symbol, index) => {
        const letter = mapping[symbol];
        if (isHighlighted(index)) {
          return <HighlightedSegment key={index}>{letter || symbol}</HighlightedSegment>;
        }
        return letter
          ? <PlainSegment key={index}>{letter}</PlainSegment>
          : <CipherSegment key={index}>{symbol}</CipherSegment>;
      })}
    </StreamBox>
  );
};

PartialStream.displayName = 'PartialStream';

export default PartialStream;
