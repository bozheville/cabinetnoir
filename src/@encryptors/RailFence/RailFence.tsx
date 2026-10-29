import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Select, Stack, Toggle } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { Minion } from '@typography';
import ZigzagFence from '../shared/transposition/ZigzagFence';
import { usePendingExample } from '@learning/pendingExample';
import { getKeyHandoff } from '@learning/keyHandoff';
import { useRailFence, parseHandoffKey } from './useRailFence';

const RAIL_OPTIONS = Array.from({ length: 9 }, (_, index) => index + 2);

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

const ZigzagHint = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
  margin-top: 4px;
`;

const ZigzagBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  width: 100%;
`;

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
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.railFence.rails')}>
            <Select
              data-guide="rails-picker"
              width="110px"
              value={String(rails)}
              onChange={(event) => handleRailsChange(Number(event.target.value))}
              options={RAIL_OPTIONS.map((count) => ({
                value: String(count),
                label: t('processing.railFence.settings.railsLabel', { count }),
              }))}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.railFence.offset')}>
            <Select
              data-guide="offset-picker"
              width="110px"
              value={String(offset)}
              onChange={(event) => handleOffsetChange(Number(event.target.value))}
              options={Array.from({ length: rails }, (_, value) => ({
                value: String(value),
                label: t('processing.railFence.settings.offsetLabel', { value }),
              }))}
            />
          </Tooltip>
        </ControlGroup>
        {!isDecryptMode && (
          <ControlGroup>
            <Tooltip content={t('learning.tooltips.railFence.keepSpaces')}>
              <Toggle
                data-guide="keep-spaces"
                label={t('processing.railFence.settings.keep_spaces')}
                checked={keepSpaces}
                onChange={handleKeepSpacesChange}
              />
            </Tooltip>
          </ControlGroup>
        )}
      </Cluster>
      {shownText.length > 0 && (
        <ZigzagBlock data-guide="zigzag-fence">
          <ZigzagFence text={shownText} rails={rails} offset={offset} />
          <ZigzagHint>
            {t('processing.railFence.settings.zigzagHint')}
          </ZigzagHint>
        </ZigzagBlock>
      )}
    </PaneStack>
  );
};

RailFence.displayName = 'RailFence';

export default RailFence;
