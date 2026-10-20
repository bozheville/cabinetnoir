import React, { useEffect, useRef } from 'react';
import { Checkbox, Heading, Pane, TextInput } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import PolybiusSquare from '../shared/polybius/PolybiusSquare';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { usePolybius } from './usePolybius';

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
        <Heading size={100} marginRight="8px" data-guide="square-key">{t('processing.polybius.squareKeyLabel')}</Heading>
        <Tooltip content={t('learning.tooltips.polybius.squareKey')}>
          <TextInput
            data-guide="square-key-input"
            width="160px"
            marginRight="8px"
            placeholder={t('processing.polybius.settings.keyword_placeholder')}
            value={keyword}
            onChange={handleKeywordChange}
          />
        </Tooltip>
        {!isDecryptMode && (
          <Tooltip content={t('learning.tooltips.polybius.spaced')}>
            <Checkbox
              data-guide="spaced-toggle"
              label={t('processing.polybius.settings.spaced')}
              checked={spaced}
              onChange={handleSpacedChange}
            />
          </Tooltip>
        )}
      </Pane>
      <Pane marginTop="8px" data-guide="polybius-square">
        <PolybiusSquare square={square} highlightLetter={highlightLetter} />
        <Heading size={100} marginTop={6} opacity={0.7}>
          {t('processing.polybius.settings.squareHint')}
        </Heading>
      </Pane>
    </Pane>
  );
};

Polybius.displayName = 'Polybius';

export default Polybius;
