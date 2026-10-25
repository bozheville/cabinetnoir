import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pane, Text } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import {
  CrackerInput,
  CrackerSettings,
  CrackerWizardFrame,
  ShortTextWarning,
  useAssignmentHistory,
} from '@encryptors/shared/cracker';
import {
  findConflicts,
  scoreTrigrams,
  STANDARD_ALPHABET,
  suggestByContext,
  suggestDoubledSymbols,
  suggestSymbolDigraphs,
  suggestSymbolTrigraphs,
} from '@encryptors/shared/analysis';
import {
  assembleSquareFromMapping,
  expandSquare,
} from '@encryptors/shared/polybius';
import { findCribMatches } from '@encryptors/shared/polybius/cribs';
import SquareDecipherStep from '@encryptors/shared/polybius/SquareDecipherStep';
import { keywordFromAlphabet } from '@encryptors/Keyword/keyword-crypt';
import { setKeyHandoff } from '@learning/keyHandoff';
import { usePendingExample } from '@learning/pendingExample';

import { parsePolybiusPairs } from './polybius-crypt';
import {
  DEFAULT_HINT_CONFIG,
  HINT_KEYS,
  applyPreset,
  PresetName,
} from './cracker/hintSettings';

// Polybius cracker on the Cryptoanalysis tab: the stripped ciphertext is
// a plain substitution over coordinate pairs whose square is unknown —
// the shared square-decipher step rebuilds it letter by letter. "Use
// this result" hands the recovered square (or its keyword) to the Tool
// tab (in-memory hand-off, nothing persisted).
const PolybiusCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [hintConfig, setHintConfig] = useState(DEFAULT_HINT_CONFIG);
  const history = useAssignmentHistory();
  const router = useRouter();
  const { t } = useTranslation('common');

  // Challenges and examples: apply the hint preset once.
  const pendingExample = usePendingExample();
  const appliedExample = React.useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.hintPreset) {
      setHintConfig((current) => applyPreset(current, pendingExample.hintPreset as PresetName));
    }
  }, [pendingExample]);

  const { mapping, assign, reset, replaceAll } = history;
  const hints = hintConfig.hints;

  // The digit pairs of the ciphertext, read consecutively — the symbols
  // of the substitution the square hides.
  const pairs = useMemo(() => parsePolybiusPairs(input), [input]);

  // The crib panel: a known plaintext fragment, matched against the
  // pair stream under the current partial mapping. Applying a match
  // lands as one undo-able step.
  const [cribValue, setCribValue] = useState('');
  const cribMatches = useMemo(
    () => (cribValue.trim()
      ? findCribMatches(pairs, cribValue.toUpperCase().replace(/[^A-Z]/g, ''), mapping)
      : []),
    [pairs, cribValue, mapping],
  );
  const applyCribMatch = (start: number) => {
    const cleanCrib = cribValue.toUpperCase().replace(/[^A-Z]/g, '');
    const next = { ...mapping };
    for (let offset = 0; offset < cleanCrib.length; offset += 1) {
      next[pairs[start + offset]] = cleanCrib[offset];
    }
    replaceAll(next);
  };

  // A new ciphertext invalidates the work done so far.
  const previousInput = useRef(input);
  useEffect(() => {
    if (previousInput.current !== input) {
      previousInput.current = input;
      reset();
    }
  }, [input, reset]);

  // Contextual suggestions: candidate letters scored by digram/trigram
  // fit with the letters the user already placed around each occurrence
  // — frequency ranking is the prior until then.
  const contextualSuggestions = useMemo(
    () => suggestByContext(pairs, mapping, STANDARD_ALPHABET),
    [pairs, mapping],
  );

  // The letter-combination hints: frequent coordinate pairs and triples
  // with the plaintext digraphs/trigraphs they could be, plus the
  // doubled-symbol tell — consistent with what's placed.
  const combinationHints = useMemo(() => ({
    digraphs: suggestSymbolDigraphs(pairs, mapping),
    trigraphs: suggestSymbolTrigraphs(pairs, mapping),
    doubles: suggestDoubledSymbols(pairs, mapping),
  }), [pairs, mapping]);

  // The draft plaintext under the current partial square.
  const partialPlaintext = useMemo(
    () => pairs.map((pair) => mapping[pair] || '·').join(''),
    [pairs, mapping],
  );
  const englishScore = useMemo(
    () => scoreTrigrams(partialPlaintext.replace(/[^A-Z]/g, '')),
    [partialPlaintext],
  );

  // The recovered square and, when complete, the keyword that could have
  // keyed it (J rides back in after I before the keyword engine reads
  // the square).
  const recoveredSquare = useMemo(
    () => assembleSquareFromMapping(mapping, { size: 5, fill: 'dots' }),
    [mapping],
  );
  const squareComplete = pairs.length > 0 && !recoveredSquare.includes('·');
  const complete = squareComplete && findConflicts(mapping).length === 0;
  const keywordGuess = useMemo(
    () => (squareComplete ? keywordFromAlphabet(expandSquare(recoveredSquare)) : null),
    [recoveredSquare, squareComplete],
  );

  const handleUseKey = () => {
    setKeyHandoff({
      cipher: 'polybius',
      input,
      keys: [keywordGuess || recoveredSquare],
    });
    router.push('/encoder/polybius/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/polybius/direct');
  };

  return (
    <Pane display="flex" flexDirection="column" width="100%">
      <CrackerInput value={input} onChange={onInputChange} />
      <Pane
        display="flex"
        flexDirection="column"
        width="100%"
        padding="12px"
        marginX="16px"
        marginBottom="16px"
        border="muted"
        borderRadius="4px"
      >
        <CrackerSettings
          config={hintConfig}
          onChange={setHintConfig}
          keys={HINT_KEYS}
          i18nScope="processing.polybius.cracker"
        />
        <CrackerWizardFrame
          steps={[t('processing.polybius.cracker.wizard.steps.square')]}
          step={1}
          onBack={() => {}}
          onNext={() => {}}
          canGoNext={false}
          useLabel={t('processing.cracker.wizard.useKey')}
          onUse={handleUseKey}
          useDisabled={!complete}
          onSkip={handleSkip}
          message={pairs.length > 0 && (
            <ShortTextWarning letters={'x'.repeat(Math.min(pairs.length, 200))} />
          )}
        >
          <Text size={300} display="block" marginTop={12} marginBottom={8}>
            {t('processing.polybius.cracker.wizard.square.hint')}
          </Text>
          <SquareDecipherStep
            symbols={pairs}
            mapping={mapping}
            onAssign={assign}
            size={5}
            alphabet={STANDARD_ALPHABET}
            history={history}
            showSuggestions={hints.suggestions}
            suggestions={contextualSuggestions}
            combinationHints={hints.suggestions ? combinationHints : null}
            cribs={hints.cribs ? {
              value: cribValue,
              onChange: setCribValue,
              matches: cribMatches,
              onApply: applyCribMatch,
            } : null}
            fill="dots"
            englishness={englishScore}
          />
        </CrackerWizardFrame>
      </Pane>
    </Pane>
  );
};

PolybiusCryptoanalysis.displayName = 'PolybiusCryptoanalysis';

export default PolybiusCryptoanalysis;
