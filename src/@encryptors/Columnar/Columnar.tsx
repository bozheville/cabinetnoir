import React, { useEffect, useRef } from 'react';
import { Checkbox, Heading, Pane, TextInput } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import TranspositionGrid from '../shared/transposition/TranspositionGrid';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useColumnar } from './useColumnar';

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
      >
        <Tooltip content={t('learning.tooltips.columnar.keyword')}>
          <TextInput
            data-guide="keyword-input"
            width="160px"
            marginRight="8px"
            placeholder={t('processing.columnar.settings.keyword_placeholder')}
            value={keyword}
            onChange={handleKeywordChange}
          />
        </Tooltip>
        {double && (
          <Tooltip content={t('learning.tooltips.columnar.secondKeyword')}>
            <TextInput
              data-guide="second-keyword-input"
              width="160px"
              marginRight="8px"
              placeholder={t('processing.columnar.settings.second_keyword_placeholder')}
              value={secondKeyword}
              onChange={handleSecondKeywordChange}
            />
          </Tooltip>
        )}
        <Tooltip content={t('learning.tooltips.columnar.double')}>
          <Checkbox
            data-guide="double-toggle"
            marginLeft="6px"
            label={t('processing.columnar.settings.double_transposition')}
            checked={double}
            onChange={handleDoubleChange}
          />
        </Tooltip>
        <Tooltip content={t('learning.tooltips.columnar.irregular')}>
          <Checkbox
            data-guide="grid-toggle"
            marginLeft="6px"
            label={t('processing.columnar.settings.incomplete_row')}
            checked={irregular}
            onChange={handleIrregularChange}
          />
        </Tooltip>
        {!isDecryptMode && (
          <Tooltip content={t('learning.tooltips.columnar.keepSpaces')}>
            <Checkbox
              data-guide="keep-spaces"
              marginLeft="6px"
              label={t('processing.columnar.settings.keep_spaces')}
              checked={keepSpaces}
              onChange={handleKeepSpacesChange}
            />
          </Tooltip>
        )}
      </Pane>
      {order.length > 0 && (
        <Pane
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop="8px"
          data-guide="transposition-grid"
        >
          <TranspositionGrid
            order={order}
            keyword={keyword.toUpperCase().replace(/[^A-Z]/g, '')}
            letters={irregular || keepSpaces ? input.toUpperCase().replace(/[^A-Z ]/g, '').replace(/ +/g, ' ').trim() : input.toUpperCase().replace(/[^A-Z]/g, '')}
            padChar={irregular ? '' : 'X'}
            highlight
          />
          <Heading size={100} marginTop={8} opacity={0.7}>
            {t('processing.columnar.settings.gridHint')}
          </Heading>
        </Pane>
      )}
    </Pane>
  );
};

Columnar.displayName = 'Columnar';

export default Columnar;
