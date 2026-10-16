import React, { useEffect, useState } from 'react';
import { Checkbox, Heading, Pane, Select } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import { useAdfgvx } from './useAdfgvx';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig } from './cracker/hintSettings';
import CrackerSettings from './cracker/CrackerSettings';
import CrackerWizard from './cracker/CrackerWizard';
import TextInput from '@atoms/TextInput/TextInput';
import Tooltip from '@atoms/Tooltip';
import { usePendingExample } from '@learning/pendingExample';

// "Try it in the tool": the example carries both keys in one string,
// square key first, transposition key second ("NIGHT GERMAN").
const SPLIT_EXAMPLE_KEY = (key: string): [string, string] => {
  const [square = '', transposition = ''] = key.split(' ');
  return [square, transposition];
};

const Adfgvx: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const {
    squareKey,
    setSquareKey,
    transpositionKey,
    setTranspositionKey,
    variant,
    setVariant,
  } = useAdfgvx({ input, onProcessingEnd, isDecryptMode });

  const [isUnknownKeys, setIsUnknownKeys] = useState(false);
  const [hintConfig, setHintConfig] = useState<HintConfig>(DEFAULT_HINT_CONFIG);

  // The cracker replaces both keys; it only exists in decrypt mode.
  const unknownKeys = isDecryptMode && isUnknownKeys;
  const cracker = useCracker({ input, enabled: unknownKeys, hintConfig, variant });

  const pendingExample = usePendingExample();
  useEffect(() => {
    if (pendingExample?.key) {
      const [square, transposition] = SPLIT_EXAMPLE_KEY(pendingExample.key);
      setSquareKey(square);
      setTranspositionKey(transposition);
    }
    if (pendingExample?.cracker) {
      setIsUnknownKeys(true);
    }
  }, [pendingExample]);

  // Leaving decrypt mode closes the cracker.
  useEffect(() => {
    if (!isDecryptMode && isUnknownKeys) {
      setIsUnknownKeys(false);
    }
  }, [isDecryptMode, isUnknownKeys]);

  const handleUseKey = (square: string, transposition: string) => {
    setSquareKey(square);
    setTranspositionKey(transposition);
    setIsUnknownKeys(false);
  };

  const handleSkipCracker = () => {
    setIsUnknownKeys(false);
  };

  return (
    <>
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        paddingX="16px"
        paddingBottom="16px"
        {...paneProps}
      >
        <Heading size={100} data-guide="variant">{t('processing.adfgvx.variantLabel')}</Heading>
        <Tooltip content={t('learning.tooltips.adfgvx.variant')}>
          <Select
            data-guide="variant-selector"
            width="160px"
            value={variant}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setVariant(event.target.value as typeof variant)
            }
          >
            <option value="adfgx">{t('processing.adfgvx.variants.adfgx')}</option>
            <option value="adfgvx">{t('processing.adfgvx.variants.adfgvx')}</option>
          </Select>
        </Tooltip>
        <Heading size={100} marginLeft="12px" data-guide="square-key">{t('processing.adfgvx.squareKeyLabel')}</Heading>
        <Tooltip content={t('learning.tooltips.adfgvx.square-key')}>
          <TextInput
            data-guide="square-key"
            width="150px"
            value={squareKey}
            onChange={(event) => setSquareKey(event.target.value)}
          />
        </Tooltip>
        <Heading size={100} marginLeft="12px" data-guide="transposition-key">{t('processing.adfgvx.transpositionKeyLabel')}</Heading>
        <Tooltip content={t('learning.tooltips.adfgvx.transposition-key')}>
          <TextInput
            data-guide="transposition-key"
            width="150px"
            value={transpositionKey}
            onChange={(event) => setTranspositionKey(event.target.value)}
          />
        </Tooltip>
        {isDecryptMode && (
          <Tooltip content={t('learning.tooltips.adfgvx.unknown-keys')}>
            <Checkbox
              data-guide="unknown-keys"
              marginLeft="6px"
              label={t('processing.adfgvx.unknownKeys')}
              checked={isUnknownKeys}
              onChange={(event) => setIsUnknownKeys(event.target.checked)}
            />
          </Tooltip>
        )}
      </Pane>
      {unknownKeys && (
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
          <CrackerSettings config={hintConfig} onChange={setHintConfig} />
          <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkipCracker} />
        </Pane>
      )}
    </>
  );
};

Adfgvx.displayName = 'Adfgvx';

export default Adfgvx;
