import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Paper } from '@atoms';
import { Minion } from '@typography';
import {
  BeaufortVariant,
  DEFAULT_ALPHABET,
} from './beaufort-crypt';

// A compact tabula recta: one row per distinct key letter. For classic
// Beaufort the row reads the alphabet backwards from the key letter
// (C = K − P); for the variant it is the ordinary shifted row (C = P − K).
// The cell where the first input letter meets the current key letter is
// highlighted with a copper frame, so the lookup the cipher performs is
// literally visible.
const Sheet = styled(Paper)`
  margin-top: 8px;
  padding: 8px;
  overflow-x: auto;
`;

// Secondary note on the leather panel reads cream, not the paper-ink grey.
const Note = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 26px repeat(26, 17px);
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 11px;
  line-height: 17px;
`;

const HeadCell = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 11px;
  text-align: center;
  color: ${({ theme }) => theme.ink.secondary};
`;

const RowLabel = styled.span`
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 11px;
  font-weight: 700;
  text-align: center;
`;

const Cell = styled.span<{ $highlight: boolean }>`
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 11px;
  text-align: center;
  background: ${({ $highlight, theme }) => ($highlight ? `${theme.metal.copper.light}40` : 'transparent')};
  border: 1px solid ${({ $highlight, theme }) => ($highlight ? theme.metal.copper.base : 'transparent')};
  border-radius: 2px;
`;

interface TabulaRectaProps {
  keyString: string;
  variant: BeaufortVariant;
  input: string;
  alphabet?: string;
}

const TabulaRecta: React.FC<TabulaRectaProps> = ({
  keyString,
  variant,
  input,
  alphabet = DEFAULT_ALPHABET,
}) => {
  const { t } = useTranslation('common');
  const length = alphabet.length;
  const mod = (value: number) => ((value % length) + length) % length;

  // Distinct key letters in order of first use.
  const keyLetters = keyString
    .toUpperCase()
    .split('')
    .filter((letter) => alphabet.includes(letter))
    .filter((letter, index, all) => all.indexOf(letter) === index)
    .slice(0, 12);

  const firstPlain = input
    .toUpperCase()
    .split('')
    .find((letter) => alphabet.includes(letter)) ?? '';
  const firstKey = keyLetters[0] ?? '';

  const rowIndexFor = (keyLetter: string, plainIndex: number): number => {
    const k = alphabet.indexOf(keyLetter);
    return variant === 'beaufort'
      ? mod(k - plainIndex)
      : mod(plainIndex - k);
  };

  return (
    <div>
      <Note>
        {variant === 'beaufort'
          ? t('processing.beaufort.tool.tabula.beaufort')
          : t('processing.beaufort.tool.tabula.variant')}
      </Note>
      <Sheet>
        <Grid>
          <span />
          {alphabet.split('').map((letter) => (
            <HeadCell key={`head-${letter}`}>{letter}</HeadCell>
          ))}
          {keyLetters.map((keyLetter) => (
            <React.Fragment key={`row-${keyLetter}`}>
              <RowLabel>{keyLetter}</RowLabel>
              {alphabet.split('').map((plainLetter, plainIndex) => {
                const highlight = keyLetter === firstKey && plainLetter === firstPlain;
                return (
                  <Cell key={`cell-${keyLetter}-${plainLetter}`} $highlight={highlight}>
                    {alphabet[rowIndexFor(keyLetter, plainIndex)]}
                  </Cell>
                );
              })}
            </React.Fragment>
          ))}
        </Grid>
      </Sheet>
    </div>
  );
};

export default TabulaRecta;
