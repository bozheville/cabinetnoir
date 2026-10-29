import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Cluster, Select } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { engraved } from '@theme/mixins';
import Tooltip from '@atoms/Tooltip';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig, HINT_KEYS, applyPreset, PresetName } from './cracker/hintSettings';
import CrackerWizard from './cracker/CrackerWizard';
import { CrackerInput, CrackerSettings } from '@encryptors/shared/cracker';
import { usePendingExample } from '@learning/pendingExample';
import { setKeyHandoff } from '@learning/keyHandoff';

const PaneRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Engraved brass label on the leather band.
const PaneLabel = styled.span`
  ${engraved('leather')}
  font-size: 11px;
`;

const VariantRow = styled(Cluster)`
  padding: 12px 16px;
`;

const WizardBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  margin: 0 16px 16px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: ${({ theme }) => theme.radius.metal};
`;

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
    <PaneRoot>
      <CrackerInput value={input} onChange={onInputChange} />
      <VariantRow justify="center" gap={4}>
        <ControlGroup>
          <PaneLabel data-guide="variant">{t('processing.adfgvx.variantLabel')}</PaneLabel>
          <Tooltip content={t('learning.tooltips.adfgvx.variant')}>
            <Select
              data-guide="variant-selector"
              width="160px"
              value={variant}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setVariant(event.target.value as typeof variant)
              }
              options={[
                { value: 'adfgx', label: t('processing.adfgvx.variants.adfgx') },
                { value: 'adfgvx', label: t('processing.adfgvx.variants.adfgvx') },
              ]}
            />
          </Tooltip>
        </ControlGroup>
      </VariantRow>
      <WizardBox>
        <CrackerSettings config={hintConfig} onChange={setHintConfig} keys={HINT_KEYS} i18nScope="processing.adfgvx.cracker" />
        <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkip} />
      </WizardBox>
    </PaneRoot>
  );
};

AdfgvxCryptoanalysis.displayName = 'AdfgvxCryptoanalysis';

export default AdfgvxCryptoanalysis;
