import React, { useEffect, useRef } from 'react';
import { Checkbox, Heading, Pane, Select, TextInput } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import ZigzagFence from '../shared/transposition/ZigzagFence';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useRailFence, parseHandoffKey } from './useRailFence';

const RAIL_OPTIONS = Array.from({ length: 9 }, (_, index) => index + 2);

// The Rail fence tool: rails and offset pickers above a live zigzag —
// the letters riding the fence re-draw with every change. The cracker
// hands over "rails/offset".
const RailFence: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    rails,
    offset,
    keepSpaces,
    handleRailsChange,
    handleOffsetChange,
    handleKeepSpacesChange,
    applyHandoffKey,
  } = useRailFence({ input, onProcessingEnd, isDecryptMode });

  // "Try it in the tool": the example's key is "rails/offset".
  const pendingExample = usePendingExample();
  const appliedExample = useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    const parsed = parseHandoffKey(pendingExample.key || '');
    if (parsed) {
      handleRailsChange(parsed.rails);
      handleOffsetChange(parsed.offset);
    }
  }, [pendingExample]);

  // "Use this result" on the Cryptoanalysis tab.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'railFence' && handoff.keys[0]) {
      applyHandoffKey(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  const shownText = keepSpaces
    ? input.toUpperCase().replace(/[^A-Z ]/g, '').replace(/ +/g, ' ').trim()
    : input.toUpperCase().replace(/[^A-Z]/g, '');

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
        <Tooltip content={t('learning.tooltips.railFence.rails')}>
          <Select
            data-guide="rails-picker"
            width="110px"
            marginRight="8px"
            value={String(rails)}
            onChange={(event) => handleRailsChange(Number(event.target.value))}
          >
            {RAIL_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {t('processing.railFence.settings.railsLabel', { count })}
              </option>
            ))}
          </Select>
        </Tooltip>
        <Tooltip content={t('learning.tooltips.railFence.offset')}>
          <Select
            data-guide="offset-picker"
            width="110px"
            marginRight="8px"
            value={String(offset)}
            onChange={(event) => handleOffsetChange(Number(event.target.value))}
          >
            {Array.from({ length: rails }, (_, value) => (
              <option key={value} value={value}>
                {t('processing.railFence.settings.offsetLabel', { value })}
              </option>
            ))}
          </Select>
        </Tooltip>
        {!isDecryptMode && (
          <Tooltip content={t('learning.tooltips.railFence.keepSpaces')}>
            <Checkbox
              data-guide="keep-spaces"
              marginLeft="6px"
              label={t('processing.railFence.settings.keep_spaces')}
              checked={keepSpaces}
              onChange={handleKeepSpacesChange}
            />
          </Tooltip>
        )}
      </Pane>
      {shownText.length > 0 && (
        <Pane
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop="8px"
          width="100%"
          data-guide="zigzag-fence"
        >
          <ZigzagFence text={shownText} rails={rails} offset={offset} />
          <Heading size={100} marginTop={4} opacity={0.7}>
            {t('processing.railFence.settings.zigzagHint')}
          </Heading>
        </Pane>
      )}
    </Pane>
  );
};

RailFence.displayName = 'RailFence';

export default RailFence;
