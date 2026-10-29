import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CipherText, GreatPrimer, Minion } from '@typography';
import useCracker from './useCracker';
import SquareDecipherStep from '@encryptors/shared/polybius/SquareDecipherStep';
import { SQUARE_ALPHABET } from '../adfgvx-encryption';
import { ENGLISH_FREQUENCY_ORDER } from '../analysis/frequency';
import type { SymbolMapping } from '@encryptors/shared/analysis/substitution';

const StepRoot = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const KeysTitle = styled(GreatPrimer)`
  color: ${({ theme }) => theme.ink.cream};
`;

const KeyLabel = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const KeyValue = styled(CipherText)`
  color: ${({ theme }) => theme.ink.cream};
`;

interface StepSquareProps {
  cracker: ReturnType<typeof useCracker>;
}

// Step 3: restore the square. The symbols are the "letters" of a plain
// substitution; assign letters by frequency, confirm with cribs, watch the
// preview become readable. The board, chart, cribs and preview are the
// shared square-decipher step; only the per-symbol frequency suggestion
// ranking and the recovered-keys footer stay ADFGVX-specific.
const StepSquare: React.FC<StepSquareProps> = ({ cracker }) => {
  const { t } = useTranslation('common');
  const {
    fractionChars,
    symbols,
    frequencies,
    mapping,
    setSymbolLetter,
    crib,
    setCrib,
    cribMatches,
    applyCribMatch,
    hintConfig,
    variant,
  } = cracker;
  const hints = hintConfig.hints;

  // English frequency suggestion: rank order for unmapped symbols,
  // computed once so the chart rows agree.
  const usedLetters = new Set(Object.values(mapping));
  let suggestionRank = 0;
  const frequencySuggestions: SymbolMapping = {};
  for (const { symbol } of frequencies) {
    if (mapping[symbol]) {
      frequencySuggestions[symbol] = mapping[symbol];
      continue;
    }
    while (usedLetters.has(ENGLISH_FREQUENCY_ORDER[suggestionRank % ENGLISH_FREQUENCY_ORDER.length])) {
      suggestionRank += 1;
    }
    frequencySuggestions[symbol] = ENGLISH_FREQUENCY_ORDER[suggestionRank % ENGLISH_FREQUENCY_ORDER.length];
    suggestionRank += 1;
  }

  return (
    <StepRoot>
      <SquareDecipherStep
        symbols={symbols}
        mapping={mapping}
        onAssign={(symbol, letter) => setSymbolLetter(symbol, letter ?? '')}
        size={fractionChars.length}
        labels={fractionChars}
        alphabet={SQUARE_ALPHABET[variant]}
        showFrequencyChart
        frequencySuggestions={frequencySuggestions}
        cribs={hints.cribs ? {
          value: crib,
          onChange: setCrib,
          matches: cribMatches,
          onApply: applyCribMatch,
        } : null}
        fill="auto"
      />

      <KeysTitle>
        {t('processing.adfgvx.cracker.wizard.square.yourKeys')}
      </KeysTitle>
      <div>
        <KeyLabel>
          {t('processing.adfgvx.cracker.wizard.square.transpositionKey')}
        </KeyLabel>
        <KeyValue>{cracker.assembledTranspositionKey}</KeyValue>
      </div>
    </StepRoot>
  );
};

StepSquare.displayName = 'StepSquare';

export default StepSquare;
