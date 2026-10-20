import React, { useEffect, useRef } from 'react';
import { Heading, Pane, TextInput } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import PolybiusSquare from '../shared/polybius/PolybiusSquare';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useNihilist } from './useNihilist';

// The addition table: one row per letter — the plaintext number and the
// key number it absorbed, and their no-carry sum.
const AdditionTable = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
`;

const AdditionCell = styled(Pane)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: monospace;
  font-size: 12px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  border-radius: 4px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.background};
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
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      paddingX="16px"
      paddingBottom="16px"
      {...paneProps}
    >
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        <Heading size={100} marginRight="8px" data-guide="square-key">{t('processing.nihilist.squareKeyLabel')}</Heading>
        <Tooltip content={t('learning.tooltips.nihilist.squareKey')}>
          <TextInput
            data-guide="square-key-input"
            width="140px"
            marginRight="8px"
            placeholder={t('processing.nihilist.settings.square_placeholder')}
            value={squareKey}
            onChange={handleSquareKeyChange}
          />
        </Tooltip>
        <Heading size={100} marginRight="8px" data-guide="key">{t('processing.nihilist.keyLabel')}</Heading>
        <Tooltip content={t('learning.tooltips.nihilist.key')}>
          <TextInput
            data-guide="key-input"
            width="140px"
            marginRight="8px"
            placeholder={t('processing.nihilist.settings.key_placeholder')}
            value={key}
            onChange={handleKeyChange}
          />
        </Tooltip>
        {!isDecryptMode && (
          <Tooltip content={t('learning.tooltips.nihilist.spaced')}>
            <CheckboxWrap>
              <input
                type="checkbox"
                data-guide="spaced-toggle"
                checked={spaced}
                onChange={handleSpacedChange}
              />
              <span>{t('processing.nihilist.settings.spaced')}</span>
            </CheckboxWrap>
          </Tooltip>
        )}
      </Pane>
      <Pane marginTop="8px" data-guide="polybius-square">
        <PolybiusSquare square={square} />
        <Heading size={100} marginTop={6} opacity={0.7}>
          {t('processing.nihilist.settings.squareHint')}
        </Heading>
      </Pane>
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
    </Pane>
  );
};

const CheckboxWrap = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  cursor: pointer;
`;

Nihilist.displayName = 'Nihilist';

export default Nihilist;
