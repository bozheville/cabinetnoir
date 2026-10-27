import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Pane } from 'evergreen-ui';

import useAutokeyCracker from './cracker/useAutokeyCracker';
import {
  DEFAULT_HINT_CONFIG,
  HintConfig,
  HINT_KEYS,
  applyPreset,
  PresetName,
} from './cracker/hintSettings';
import AutokeyCracker from './cracker/AutokeyCracker';
import { CrackerInput, CrackerSettings } from '@encryptors/shared/cracker';
import { usePendingExample } from '@learning/pendingExample';
import { setKeyHandoff } from '@learning/keyHandoff';

// Autokey cracker on the Cryptoanalysis tab: the guided crib-drag
// wizard owns the page. "Use this primer" hands the recovered key to
// the Tool tab (in-memory hand-off, nothing persisted).
const AutokeyCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [hintConfig, setHintConfig] = useState<HintConfig>(DEFAULT_HINT_CONFIG);
  const router = useRouter();

  const cracker = useAutokeyCracker({ input, enabled: true });

  // Challenges and examples: apply the hint preset and the challenge's
  // crib suggestion once.
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
    if (pendingExample.crib) {
      cracker.setWord(pendingExample.crib.toUpperCase());
    }
  }, [pendingExample]);

  const handleUseKey = (primer: string) => {
    setKeyHandoff({ cipher: 'autokey', input, keys: [primer] });
    router.push('/encoder/autokey/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/autokey/direct');
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
        flexDirection="column"
        width="100%"
        padding="12px"
        marginX="16px"
        marginBottom="16px"
        border="muted"
        borderRadius="4px"
      >
        <CrackerSettings config={hintConfig} onChange={setHintConfig} keys={HINT_KEYS} i18nScope="processing.autokey.cracker" />
        <AutokeyCracker
          cracker={cracker}
          hints={hintConfig.hints}
          onUseKey={handleUseKey}
          onSkip={handleSkip}
        />
      </Pane>
    </Pane>
  );
};

AutokeyCryptoanalysis.displayName = 'AutokeyCryptoanalysis';

export default AutokeyCryptoanalysis;
