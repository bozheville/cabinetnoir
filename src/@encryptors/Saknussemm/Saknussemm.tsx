import React, { useEffect, useRef } from 'react';
import { Button, Pane, Select } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { CrypterProps } from '../types';
import Tooltip from '@atoms/Tooltip';
import { getKeyHandoff } from '@learning/keyHandoff';
import { usePendingExample } from '@learning/pendingExample';
import {
  SAKNUSSEMM_PARCHMENT_DICTATION,
  SAKNUSSEMM_PARCHMENT_PLAIN,
} from './saknussemm-crypt';
import { parseHandoffKey, useSaknussemm } from './useSaknussemm';

const WIDTH_OPTIONS = Array.from({ length: 11 }, (_, index) => index + 2);
const PER_LINE_OPTIONS = Array.from({ length: 5 }, (_, index) => index + 2);

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
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip content={t('learning.tooltips.saknussemm.clusterWidth')}>
          <Select
            data-guide="cluster-width-picker"
            width="150px"
            marginRight="8px"
            value={String(shape.clusterWidth)}
            onChange={(event) => setShape((current) => ({
              ...current,
              clusterWidth: Number(event.target.value),
            }))}
          >
            {WIDTH_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {t('processing.saknussemm.settings.clusterWidthLabel', { count })}
              </option>
            ))}
          </Select>
        </Tooltip>
        <Tooltip content={t('learning.tooltips.saknussemm.clustersPerLine')}>
          <Select
            data-guide="clusters-per-line-picker"
            width="150px"
            marginRight="8px"
            value={String(shape.clustersPerLine)}
            onChange={(event) => setShape((current) => ({
              ...current,
              clustersPerLine: Number(event.target.value),
            }))}
          >
            {PER_LINE_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {t('processing.saknussemm.settings.clustersPerLineLabel', { count })}
              </option>
            ))}
          </Select>
        </Tooltip>
        <Tooltip content={t('learning.tooltips.saknussemm.parchment')}>
          <Button
            data-guide="load-parchment"
            appearance="minimal"
            onClick={loadParchment}
          >
            {t('processing.saknussemm.settings.parchmentButton')}
          </Button>
        </Tooltip>
      </Pane>
    </Pane>
  );
};

Saknussemm.displayName = 'Saknussemm';

export default Saknussemm;
