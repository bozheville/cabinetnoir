import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Stack, TextInput, Toggle } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { Minion } from '@typography';
import PolybiusSquare from '../shared/polybius/PolybiusSquare';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { usePolybius } from './usePolybius';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

const SquareHint = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
  margin-top: 6px;
`;

const SquareBlock = styled.div`
  margin-top: 8px;
`;

// The Polybius tool: letters in, digit pairs out, with the live square
// beside the controls — the highlighted cell (and its row and column)
// follows the latest letter of the output.
const Polybius: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    keyword,
    spaced,
    square,
    highlightLetter,
    handleKeywordChange,
    handleSpacedChange,
    applyHandoffKey,
  } = usePolybius({ input, onProcessingEnd, isDecryptMode });

  // "Try it in the tool": the example's key is the square keyword.
  const pendingExample = usePendingExample();
  const appliedExample = useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.key) {
      applyHandoffKey(pendingExample.key);
    }
  }, [pendingExample]);

  // "Use this result" from /identify: the recovered square keyword (or a
  // full square) travels in the in-memory hand-off.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'polybius' && handoff.keys[0]) {
      applyHandoffKey(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.polybius.squareKey')}>
            <TextInput
              data-guide="square-key-input"
              label={t('processing.polybius.squareKeyLabel')}
              mono
              width="160px"
              placeholder={t('processing.polybius.settings.keyword_placeholder')}
              value={keyword}
              onChange={handleKeywordChange}
            />
          </Tooltip>
        </ControlGroup>
        {!isDecryptMode && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.polybius.spaced')}>
              <Toggle
                data-guide="spaced-toggle"
                label={t('processing.polybius.settings.spaced')}
                checked={spaced}
                onChange={handleSpacedChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
      </Cluster>
      <SquareBlock data-guide="polybius-square">
        <PolybiusSquare square={square} highlightLetter={highlightLetter} />
        <SquareHint>
          {t('processing.polybius.settings.squareHint')}
        </SquareHint>
      </SquareBlock>
    </PaneStack>
  );
};

Polybius.displayName = 'Polybius';

export default Polybius;
