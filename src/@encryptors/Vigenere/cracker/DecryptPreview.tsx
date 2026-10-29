import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { GreatPrimer } from '@typography';
import { paper } from '@theme/mixins';
import { LockedLetter, useCracker } from './useCracker';
import { decryptPartial } from './decryptPartial';
import { HIGHLIGHT_COLORS } from '@encryptors/shared/cracker';

const StepRoot = styled.div`
  width: 100%;
`;

const PreviewTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
`;

// Parchment reading box for the partial plaintext.
const PreviewBox = styled.div`
  ${paper('parchment')}
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};

  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.ink.secondary};
`;

const ColumnCell = styled.span<{ $color?: string; $active?: boolean }>`
  color: ${({ $color, $active }) => ($active && $color ? $color : 'inherit')};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

// Worksheet layout: rows of exactly keyLength letters (last row shorter),
// so column k holds slice k and picking a key letter visibly rewrites the
// whole column.
const DecryptPreview: React.FC<{ cracker: ReturnType<typeof useCracker> }> = ({ cracker }) => {
  const { input, analysis, keyLength, lockedLetters, alphabet, activeSlice, transform } = cracker;
  const { t } = useTranslation('common');


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
      transform,
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
  }, [input, analysis, keyLength, lockedLetters, alphabet, transform]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <StepRoot>
      <PreviewTitle>{t('processing.cracker.wizard.previewTitle')}</PreviewTitle>
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
    </StepRoot>
  );
};

DecryptPreview.displayName = 'DecryptPreview';

export default DecryptPreview;
