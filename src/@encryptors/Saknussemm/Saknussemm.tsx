import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { Button, Cluster, Select, Stack } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { getKeyHandoff } from '@learning/keyHandoff';
import { usePendingExample } from '@learning/pendingExample';
import {
  SAKNUSSEMM_PARCHMENT_DICTATION,
  SAKNUSSEMM_PARCHMENT_PLAIN,
} from './saknussemm-crypt';
import { parseHandoffKey, useSaknussemm } from './useSaknussemm';

const WIDTH_OPTIONS = Array.from({ length: 11 }, (_, index) => index + 2);
const PER_LINE_OPTIONS = Array.from({ length: 5 }, (_, index) => index + 2);

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

// The Saknussemm parchment tool (epic #104): a route transposition +
// reversal. Two shape knobs — letters per cluster and clusters per
// line — default to the novel's own 7×3. The "Load the parchment"
// button fills the page's famous text so the story can be replayed.
const Saknussemm: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  onInputChange,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { shape, setShape, applyHandoffKey } = useSaknussemm({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  // "Try it in the tool": the example's key is "width/perLine".
  const pendingExample = usePendingExample();
  const appliedExample = useRef(false);
  useEffect(() => {
    if (!pendingExample || appliedExample.current) {
      return;
    }
    appliedExample.current = true;
    const parsed = parseHandoffKey(pendingExample.key || '');
    if (parsed) {
      setShape(parsed);
    }
  }, [pendingExample]);

  // "Use this result" on /identify: the known-text match opens the tool
  // with the parchment loaded.
  useEffect(() => {
    if (router.query.usedKey !== '1') {
      return;
    }
    const handoff = getKeyHandoff();
    if (handoff?.cipher === 'saknussemm' && handoff.keys[0]) {
      applyHandoffKey(handoff.keys[0]);
    }
  }, [router.query.usedKey]);

  const loadParchment = () => {
    if (onInputChange) {
      onInputChange(isDecryptMode ? SAKNUSSEMM_PARCHMENT_DICTATION : SAKNUSSEMM_PARCHMENT_PLAIN);
    }
  };

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.saknussemm.clusterWidth')}>
            <Select
              data-guide="cluster-width-picker"
              width="150px"
              value={String(shape.clusterWidth)}
              onChange={(event) => setShape((current) => ({
                ...current,
                clusterWidth: Number(event.target.value),
              }))}
              options={WIDTH_OPTIONS.map((count) => ({
                value: String(count),
                label: t('processing.saknussemm.settings.clusterWidthLabel', { count }),
              }))}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.saknussemm.clustersPerLine')}>
            <Select
              data-guide="clusters-per-line-picker"
              width="150px"
              value={String(shape.clustersPerLine)}
              onChange={(event) => setShape((current) => ({
                ...current,
                clustersPerLine: Number(event.target.value),
              }))}
              options={PER_LINE_OPTIONS.map((count) => ({
                value: String(count),
                label: t('processing.saknussemm.settings.clustersPerLineLabel', { count }),
              }))}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.saknussemm.parchment')}>
            <Button
              data-guide="load-parchment"
              variant="primary"
              onClick={loadParchment}
            >
              {t('processing.saknussemm.settings.parchmentButton')}
            </Button>
          </Tooltip>
        </ControlGroup>
      </Cluster>
    </PaneStack>
  );
};

Saknussemm.displayName = 'Saknussemm';

export default Saknussemm;
