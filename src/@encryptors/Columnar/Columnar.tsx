import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Stack, TextInput, Toggle } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { Minion } from '@typography';
import TranspositionGrid from '../shared/transposition/TranspositionGrid';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useColumnar } from './useColumnar';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

const GridHint = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const GridBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

// The Columnar tool: keyword columnar transposition with a live grid.
// The grid shows the ciphertext's columns in reading order; the cracker
// hands over a recovered column order (numeric) or a keyword.
const Columnar: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    keyword,
    secondKeyword,
    double,
    irregular,
    keepSpaces,
    order,
    handleKeywordChange,
    handleSecondKeywordChange,
    handleDoubleChange,
    handleIrregularChange,
    handleKeepSpacesChange,
    applyHandoffKey,
  } = useColumnar({ input, onProcessingEnd, isDecryptMode });

  // "Try it in the tool": the example's key is the keyword (a second
  // keyword after a slash for double transposition).
  const pendingExample = usePendingExample();
  const appliedExample = useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    const [first, second] = (pendingExample.key || '').split('/');
    if (first) {
      handleKeywordChange({ target: { value: first } });
    }
    if (second) {
      setSecondKeywordExternal(second);
    }
  }, [pendingExample]);

  // Local setter shim: useColumnar owns the second keyword state.
  function setSecondKeywordExternal(value: string) {
    handleSecondKeywordChange({ target: { value } });
  }

  // "Use this result" on the Cryptoanalysis tab: the recovered column
  // order (numeric) or keyword travels in the in-memory hand-off.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'columnar' && handoff.keys[0]) {
      applyHandoffKey(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.columnar.keyword')}>
            <TextInput
              data-guide="keyword-input"
              mono
              width="160px"
              placeholder={t('processing.columnar.settings.keyword_placeholder')}
              value={keyword}
              onChange={handleKeywordChange}
            />
          </Tooltip>
        </ControlGroup>
        {double && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.columnar.secondKeyword')}>
              <TextInput
                data-guide="second-keyword-input"
                mono
                width="160px"
                placeholder={t('processing.columnar.settings.second_keyword_placeholder')}
                value={secondKeyword}
                onChange={handleSecondKeywordChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.columnar.double')}>
            <Toggle
              data-guide="double-toggle"
              label={t('processing.columnar.settings.double_transposition')}
              checked={double}
              onChange={handleDoubleChange}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.columnar.irregular')}>
            <Toggle
              data-guide="grid-toggle"
              label={t('processing.columnar.settings.incomplete_row')}
              checked={irregular}
              onChange={handleIrregularChange}
            />
          </Tooltip>
        </ControlGroup>
        {!isDecryptMode && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.columnar.keepSpaces')}>
              <Toggle
                data-guide="keep-spaces"
                label={t('processing.columnar.settings.keep_spaces')}
                checked={keepSpaces}
                onChange={handleKeepSpacesChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
      </Cluster>
      {order.length > 0 && (
        <GridBlock data-guide="transposition-grid">
          <TranspositionGrid
            order={order}
            keyword={keyword.toUpperCase().replace(/[^A-Z]/g, '')}
            letters={irregular || keepSpaces ? input.toUpperCase().replace(/[^A-Z ]/g, '').replace(/ +/g, ' ').trim() : input.toUpperCase().replace(/[^A-Z]/g, '')}
            padChar={irregular ? '' : 'X'}
            highlight
          />
          <GridHint>
            {t('processing.columnar.settings.gridHint')}
          </GridHint>
        </GridBlock>
      )}
    </PaneStack>
  );
};

Columnar.displayName = 'Columnar';

export default Columnar;
