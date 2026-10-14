import React, { useMemo } from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import strings from '../strings';
import { LockedLetter, useCracker } from './useCracker';
import { decryptPartial } from './decryptPartial';
import { HIGHLIGHT_COLORS } from './CipherText';

const PreviewBox = styled(Pane)`
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};

  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const ColumnCell = styled.span<{ $color?: string; $active?: boolean }>`
  color: ${({ $color, $active }) => ($active && $color ? $color : 'inherit')};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

// Worksheet layout: rows of exactly keyLength letters (last row shorter),
// so column k holds slice k and picking a key letter visibly rewrites the
// whole column.
const DecryptPreview: React.FC<{ cracker: ReturnType<typeof useCracker> }> = ({ cracker }) => {
  const { input, analysis, keyLength, lockedLetters, alphabet, activeSlice } = cracker;

  const rows = useMemo(() => {
    if (!analysis || keyLength === null) {
      return [];
    }
    const decrypted = decryptPartial(
      input,
      analysis.normalized,
      keyLength,
      lockedLetters as Record<number, LockedLetter>,
      alphabet,
    );
    const result: string[][] = [];
    for (let i = 0; i < decrypted.length; i += 1) {
      const row = Math.floor(i / keyLength);
      if (!result[row]) {
        result[row] = [];
      }
      result[row].push(decrypted[i]);
    }
    return result;
  }, [input, analysis, keyLength, lockedLetters, alphabet]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <Pane width="100%">
      <Heading size={300}>{strings.wizard.previewTitle}</Heading>
      <PreviewBox>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((char, columnIndex) => {
              const slice = (rowIndex * keyLength + columnIndex) % keyLength;
              const isActive = slice === activeSlice;
              return char === '_'
                ? <Placeholder key={columnIndex}>_</Placeholder>
                : <ColumnCell key={columnIndex} $color={HIGHLIGHT_COLORS[slice % HIGHLIGHT_COLORS.length]} $active={isActive}>{char}</ColumnCell>;
            })}
          </div>
        ))}
      </PreviewBox>
    </Pane>
  );
};

DecryptPreview.displayName = 'DecryptPreview';

export default DecryptPreview;
