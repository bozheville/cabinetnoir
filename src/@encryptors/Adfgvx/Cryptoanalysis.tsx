import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Heading, Pane, Select } from 'evergreen-ui';

import Tooltip from '@atoms/Tooltip';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig, HINT_KEYS, applyPreset, PresetName } from './cracker/hintSettings';
import CrackerWizard from './cracker/CrackerWizard';
import { CrackerInput, CrackerSettings } from '@encryptors/shared/cracker';
import { usePendingExample } from '@learning/pendingExample';
import { setKeyHandoff } from '@learning/keyHandoff';

// ADFGVX cracker on the Cryptoanalysis tab: variant picker + the guided
// wizard (columns, square). "Use these keys" hands both recovered keys
// to the Tool tab via the in-memory hand-off.
const AdfgvxCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [variant, setVariant] = useState<'adfgx' | 'adfgvx'>('adfgvx');
  const [hintConfig, setHintConfig] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const router = useRouter();
  const { t } = useTranslation('common');

  const cracker = useCracker({ input, enabled: true, hintConfig, variant });

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

  const handleUseKey = (squareKey: string, transpositionKey: string) => {
    setKeyHandoff({ cipher: 'adfgvx', input, keys: [squareKey, transpositionKey] });
    router.push('/encoder/adfgvx/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/adfgvx/direct');
  };

  return (
    <Pane
      display="flex"
      flexDirection="column"
      width="100%"
    >
      <CrackerInput value={input} onChange={onInputChange} />
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingX="16px"
        paddingY="12px"
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
      </Pane>
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
        <CrackerSettings config={hintConfig} onChange={setHintConfig} keys={HINT_KEYS} i18nScope="processing.adfgvx.cracker" />
        <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkip} />
      </Pane>
    </Pane>
  );
};

AdfgvxCryptoanalysis.displayName = 'AdfgvxCryptoanalysis';

export default AdfgvxCryptoanalysis;
