import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Paper, Stack, TextInput, Toggle } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { Minion } from '@typography';
import PolybiusSquare from '../shared/polybius/PolybiusSquare';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useNihilist } from './useNihilist';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

// The addition table: one row per letter — the plaintext number and the
// key number it absorbed, and their no-carry sum.
const AdditionTable = styled(Cluster)`
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

const AdditionCell = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 8px;
  font-family: ${({ theme }) => theme.type.mono};
  font-size: 12px;
  box-shadow: none;
`;

const SquareHint = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
  margin-top: 6px;
`;

const SquareBlock = styled.div`
  margin-top: 8px;
`;

// The Nihilist tool: square keyword + additive key, the live square and
// an addition table under the text showing plain + key = cipher. The
// cracker hands over both keys ("SQUARE KEY ADDITIVEKEY").
const Nihilist: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    squareKey,
    key,
    spaced,
    square,
    additionRows,
    handleSquareKeyChange,
    handleKeyChange,
    handleSpacedChange,
    applyHandoffKey,
  } = useNihilist({ input, onProcessingEnd, isDecryptMode });

  // "Try it in the tool": the example's key carries both keys, square
  // key first ("NIGHT RUSSIA" — an empty square key is a leading space).
  const pendingExample = usePendingExample();
  const appliedExample = useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    if (pendingExample.key !== undefined) {
      applyHandoffKey(pendingExample.key);
    }
  }, [pendingExample]);

  // "Use this result" on the Cryptoanalysis tab.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'nihilist' && handoff.keys.length > 0) {
      applyHandoffKey(handoff.keys.join(' '));
    }
  }, [router.query.usedKey]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.nihilist.squareKey')}>
            <TextInput
              data-guide="square-key-input"
              label={t('processing.nihilist.squareKeyLabel')}
              mono
              width="140px"
              placeholder={t('processing.nihilist.settings.square_placeholder')}
              value={squareKey}
              onChange={handleSquareKeyChange}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.nihilist.key')}>
            <TextInput
              data-guide="key-input"
              label={t('processing.nihilist.keyLabel')}
              mono
              width="140px"
              placeholder={t('processing.nihilist.settings.key_placeholder')}
              value={key}
              onChange={handleKeyChange}
            />
          </Tooltip>
        </ControlGroup>
        {!isDecryptMode && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.nihilist.spaced')}>
              <Toggle
                data-guide="spaced-toggle"
                label={t('processing.nihilist.settings.spaced')}
                checked={spaced}
                onChange={handleSpacedChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
      </Cluster>
      <SquareBlock data-guide="polybius-square">
        <PolybiusSquare square={square} />
        <SquareHint>
          {t('processing.nihilist.settings.squareHint')}
        </SquareHint>
      </SquareBlock>
      {additionRows.length > 0 && (
        <AdditionTable data-guide="addition-table">
          {additionRows.map((row, index) => (
            <AdditionCell key={index}>
              <span style={{ fontWeight: 700 }}>{row.letter}</span>
              <span>{row.plain} + {row.key} = {row.sum}</span>
            </AdditionCell>
          ))}
        </AdditionTable>
      )}
    </PaneStack>
  );
};

Nihilist.displayName = 'Nihilist';

export default Nihilist;
