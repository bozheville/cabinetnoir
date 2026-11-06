import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Cluster, Select } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { engraved } from '@theme/mixins';
import Tooltip from '@atoms/Tooltip';
import {
  BeaufortVariant,
  DEFAULT_ALPHABET,
  isBeaufortVariant,
} from './beaufort-crypt';
import {
  BEAUFORT_TRANSFORM,
  SliceTransform,
  VARIANT_BEAUFORT_TRANSFORM,
} from '@encryptors/shared/analysis';
import { cleanAlphabet } from '../Vigenere/vigenere-encryption';
import useCracker from '../Vigenere/cracker/useCracker';
import {
  DEFAULT_HINT_CONFIG,
  HintConfig,
  HINT_KEYS,
  applyPreset,
  PresetName,
} from '../Vigenere/cracker/hintSettings';
import CrackerWizard from '../Vigenere/cracker/CrackerWizard';
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

// Beaufort cracker on the Cryptanalysis tab: the Vigenère wizard with
// the slice arithmetic swapped (reflected shifts). The variant select
// switches between the two transforms live; the alphabet is entered (or
// rebuilt) inside the wizard. "Use this result" hands the recovered key
// and alphabet to the Tool tab (in-memory hand-off, nothing persisted).
const BeaufortCryptanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [customAlphabet, setCustomAlphabet] = useState(DEFAULT_ALPHABET);
  const [variant, setVariant] = useState<BeaufortVariant>('beaufort');
  const [hintConfig, setHintConfig] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const router = useRouter();
  const { t } = useTranslation('common');

  const transform: SliceTransform = variant === 'beaufort'
    ? BEAUFORT_TRANSFORM
    : VARIANT_BEAUFORT_TRANSFORM;

  const cracker = useCracker({
    input,
    enabled: true,
    hintConfig,
    alphabet: customAlphabet,
    onAlphabetChange: setCustomAlphabet,
    transform,
  });

  // Challenges and examples: apply the hint preset (and alphabet) once.
  const pendingExample = usePendingExample();
  const appliedExample = React.useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.alphabet) {
      setCustomAlphabet(cleanAlphabet(pendingExample.alphabet));
    }
    if (pendingExample.hintPreset) {
      setHintConfig((current) => applyPreset(current, pendingExample.hintPreset as PresetName));
    }
  }, [pendingExample]);

  const handleVariantChange = (event) => {
    const next = event.target.value;
    if (isBeaufortVariant(next)) {
      setVariant(next);
    }
  };

  const handleUseKey = (key: string, alphabet: string) => {
    setKeyHandoff({ cipher: 'beaufort', input, keys: [key, alphabet, variant] });
    router.push('/encoder/beaufort/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/beaufort/direct');
  };

  return (
    <PaneRoot>
      <CrackerInput value={input} onChange={onInputChange} />
      <VariantRow justify="center" gap={4} wrap>
        <ControlGroup>
          <PaneLabel data-guide="variant">{t('processing.beaufort.tool.variantLabel')}</PaneLabel>
          <Tooltip content={t('processing.beaufort.tooltips.variant')}>
            <Select
              data-guide="variant-select"
              value={variant}
              onChange={handleVariantChange}
              options={[
                { value: 'beaufort', label: t('processing.beaufort.tool.variant.beaufort') },
                { value: 'variantBeaufort', label: t('processing.beaufort.tool.variant.variantBeaufort') },
              ]}
            />
          </Tooltip>
        </ControlGroup>
      </VariantRow>
      <WizardBox>
        <CrackerSettings config={hintConfig} onChange={setHintConfig} keys={HINT_KEYS} i18nScope="processing.beaufort.cracker" />
        <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkip} scope="beaufort" />
      </WizardBox>
    </PaneRoot>
  );
};

BeaufortCryptanalysis.displayName = 'BeaufortCryptanalysis';

export default BeaufortCryptanalysis;
