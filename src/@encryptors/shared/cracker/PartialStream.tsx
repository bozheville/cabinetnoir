import React from 'react';
import { Text } from 'evergreen-ui';
import styled from 'styled-components';

import { SymbolMapping } from '../analysis/substitution';

// The partial-plaintext stream: the worksheet view of breaking a
// monoalphabetic substitution. Decided symbols render as their plain
// letters; still-encrypted ones render as the cipher symbols themselves
// — muted, slightly spaced — so the numbers/letters/patterns read like
// a paper break: "MEE 34 AT 11". Symbol-agnostic: coordinates for
// Polybius-based ciphers, cipher letters for the Keyword cracker.

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

interface PartialStreamProps {
  // The cipher's clean symbol stream, in text order.
  symbols: string[];
  // Current symbol → plain letter mapping.
  mapping: SymbolMapping;
}

const PartialStream: React.FC<PartialStreamProps> = ({ symbols, mapping }) => (
  <StreamBox data-guide="partial-stream">
    {symbols.map((symbol, index) => {
      const letter = mapping[symbol];
      return letter
        ? <PlainSegment key={index}>{letter}</PlainSegment>
        : <CipherSegment key={index}>{symbol}</CipherSegment>;
    })}
  </StreamBox>
);

PartialStream.displayName = 'PartialStream';

export default PartialStream;
