import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pane } from 'evergreen-ui';

import {
  CrackerInput,
  CrackerSettings,
} from '@encryptors/shared/cracker';
import { useAssignmentHistory } from '@encryptors/shared/cracker';
import { setKeyHandoff } from '@learning/keyHandoff';
import { usePendingExample } from '@learning/pendingExample';

import {
  DEFAULT_HINT_CONFIG,
  HINT_KEYS,
  applyPreset,
  PresetName,
} from './cracker/hintSettings';
import CrackerWizard from './cracker/CrackerWizard';

// Nihilist cracker on the Cryptoanalysis tab: the guided wizard owns
// the page. "Use this result" hands the recovered square and the
// additive key to the Tool tab (in-memory hand-off, nothing persisted).
const NihilistCryptoanalysis: React.FC<{
  input: string;
  onInputChange: (value: string) => void;
}> = ({ input, onInputChange }) => {
  const [hintConfig, setHintConfig] = useState(DEFAULT_HINT_CONFIG);
  const history = useAssignmentHistory();
  const router = useRouter();

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

  const handleUseKey = (keys: string[]) => {
    setKeyHandoff({ cipher: 'nihilist', input, keys });
    router.push('/encoder/nihilist/reverse?usedKey=1');
  };

  // The escape hatch: back to the Tool tab without using anything.
  const handleSkip = () => {
    router.push('/encoder/nihilist/direct');
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
          i18nScope="processing.nihilist.cracker"
        />
        <CrackerWizard
          input={input}
          hintConfig={hintConfig}
          history={history}
          onUseKey={handleUseKey}
          onSkip={handleSkip}
        />
      </Pane>
    </Pane>
  );
};

NihilistCryptoanalysis.displayName = 'NihilistCryptoanalysis';

export default NihilistCryptoanalysis;
