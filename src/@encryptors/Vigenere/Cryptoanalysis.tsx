import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Cluster, TextInput } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import Tooltip from '@atoms/Tooltip';
import { DEFAULT_ALPHABET, cleanAlphabet, isEnglishAlphabet } from './vigenere-encryption';
import useCracker from './cracker/useCracker';
import { DEFAULT_HINT_CONFIG, HintConfig, HINT_KEYS, applyPreset, PresetName } from './cracker/hintSettings';
import CrackerWizard from './cracker/CrackerWizard';
import { CrackerInput, CrackerSettings } from '@encryptors/shared/cracker';
import { usePendingExample } from '@learning/pendingExample';
import { setKeyHandoff } from '@learning/keyHandoff';
import { Minion } from '@typography';

const PaneRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AlphabetRow = styled(Cluster)`
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

const UnsupportedNote = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const FallbackBlock = styled.div`
  padding: 16px;
`;

// Vigenère cracker on the Cryptoanalysis tab: the guided wizard owns the
// page. "Use this key" hands the recovered key to the Tool tab (in-memory
// hand-off, nothing persisted).
const VigenereCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [customAlphabet, setCustomAlphabet] = useState(DEFAULT_ALPHABET);
  const [hintConfig, setHintConfig] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const router = useRouter();
  const { t } = useTranslation('common');

  const cracker = useCracker({ input, enabled: true, hintConfig, alphabet: customAlphabet });

  // The cracker handles any reshuffling of the 26 English letters, but not
  // foreign letters (its frequency tables are English).
  const canCrack = isEnglishAlphabet(customAlphabet);

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

  const handleAlphabetChange = (event) => {
    setCustomAlphabet(cleanAlphabet(event.target.value));
  };

  const handleUseKey = (key: string) => {
    setKeyHandoff({ cipher: 'vigenere', input, keys: [key] });
    router.push('/encoder/vigenere/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/vigenere/direct');
  };

  return (
    <PaneRoot>
      <CrackerInput value={input} onChange={onInputChange} />
      <AlphabetRow justify="center" gap={4}>
        <ControlGroup>
          <Tooltip content={t('processing.vigenere.cracker.tooltips.alphabet')}>
            <TextInput
              data-guide="alphabet"
              label={t('processing.vigenere.cracker.alphabetLabel')}
              mono
              width="280px"
              value={customAlphabet}
              onChange={handleAlphabetChange}
            />
          </Tooltip>
        </ControlGroup>
      </AlphabetRow>
      {canCrack ? (
        <WizardBox>
          <CrackerSettings config={hintConfig} onChange={setHintConfig} keys={HINT_KEYS} i18nScope="processing.vigenere.cracker" />
          <CrackerWizard cracker={cracker} onUseKey={handleUseKey} onSkip={handleSkip} />
        </WizardBox>
      ) : (
        <FallbackBlock>
          <UnsupportedNote>{t('processing.vigenere.cracker.alphabetUnsupported')}</UnsupportedNote>
        </FallbackBlock>
      )}
    </PaneRoot>
  );
};

VigenereCryptoanalysis.displayName = 'VigenereCryptoanalysis';

export default VigenereCryptoanalysis;
