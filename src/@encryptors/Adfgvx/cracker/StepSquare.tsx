import React from 'react';
import { Heading, Pane, Text } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';

import useCracker from './useCracker';
import SquareDecipherStep from '@encryptors/shared/polybius/SquareDecipherStep';
import { SQUARE_ALPHABET } from '../adfgvx-encryption';
import { ENGLISH_FREQUENCY_ORDER } from '../analysis/frequency';
import type { SymbolMapping } from '@encryptors/shared/analysis/substitution';

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
    <Pane marginTop={12} display="flex" flexDirection="column" gap={10}>
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

      <Heading size={300}>
        {t('processing.adfgvx.cracker.wizard.square.yourKeys')}
      </Heading>
      <Pane>
        <Text size={300} display="block">
          {t('processing.adfgvx.cracker.wizard.square.transpositionKey')}
        </Text>
        <Text size={400} fontFamily="monospace">{cracker.assembledTranspositionKey}</Text>
      </Pane>
    </Pane>
  );
};

StepSquare.displayName = 'StepSquare';

export default StepSquare;
