import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Button, Pane, Text } from 'evergreen-ui';
import styled from 'styled-components';

import Tooltip from '@atoms/Tooltip';
import { useCracker } from './useCracker';

// Palette for the column chips, matching the cracker highlight colors.
const CHIP_COLORS = [
  '#e5484d', '#30a46c', '#0091ff', '#f5a623',
  '#8e4ec6', '#00a2c7', '#e5683c', '#c738b8',
  '#b8860b', '#4682b4', '#9c6644', '#7f8c8d',
];

const SlotsRow = styled(Pane)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  align-items: center;
`;

const SlotChip = styled(Pane)<{ $selected: boolean; $color: string }>`
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  border: ${({ $selected }) => ($selected ? '2px' : '1px')} solid
    ${({ $color, $selected }) => ($selected ? $color : 'transparent')};
  background: ${({ $color, $selected }) => ($selected ? `${$color}22` : '#00000008')};
  font-family: monospace;
`;

const PairQualityBar = styled(Pane)`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colorScheme.gray[300]};
  margin-top: 8px;
  overflow: hidden;
  width: 100%;
`;

const PairQualityFill = styled(Pane)`
  height: 100%;
  background: ${({ theme }) => theme.colorScheme.blue[500]};
`;

const ColumnPreview = styled(Pane)`
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
  max-height: 120px;
  overflow-y: auto;
`;

interface StepColumnsProps {
  cracker: ReturnType<typeof useCracker>;
}

// Step 2: arrange the ciphertext chunks into grid slots. Click two chips
// to swap them; swapping the two chips of a pair flips its orientation.
const StepColumns: React.FC<StepColumnsProps> = ({ cracker }) => {
  const { t } = useTranslation('common');
  const {
    keyLength,
    arrangement,
    swapSlots,
    autoArrange,
    split,
    hintConfig,
    normalizeQuality,
  } = cracker;
  const hints = hintConfig.hints;
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  if (keyLength === null || !split || arrangement.length !== keyLength) {
    return null;
  }

  const chunkOf = (slot: number) => arrangement[slot];

  const clickSlot = (slot: number) => {
    if (selectedSlot === null) {
      setSelectedSlot(slot);
      return;
    }
    if (selectedSlot === slot) {
      setSelectedSlot(null);
      return;
    }
    swapSlots(selectedSlot, slot);
    setSelectedSlot(null);
  };

  return (
    <Pane width="100%">
      <Text size={300} display="block">
        {t('processing.adfgvx.cracker.wizard.columns.hint')}
      </Text>

      <Pane display="flex" alignItems="center" gap="8px" marginTop="8px">
        <Text size={300}>
          {t('processing.adfgvx.cracker.wizard.columns.splitInfo', {
            columns: keyLength,
            rows: split.rows,
          })}
        </Text>
        {hints.autoSuggest && (
          <Tooltip content={t('processing.adfgvx.cracker.tooltips.autoSuggest')}>
            <Button size="small" onClick={autoArrange}>
              {t('processing.adfgvx.cracker.wizard.columns.autoArrange')}
            </Button>
          </Tooltip>
        )}
      </Pane>

      <Tooltip content={t('learning.controls.column-chips')}>
        <SlotsRow data-guide="column-chips">
          {arrangement.map((chunk, slot) => {
            const isPairStart = keyLength % 2 === 0 && slot % 2 === 0;
            return (
              <React.Fragment key={slot}>
                {slot > 0 && keyLength % 2 === 0 && slot % 2 === 0 && (
                  <Text size={300} marginLeft="4px">|</Text>
                )}
                <SlotChip
                  $selected={selectedSlot === slot}
                  $color={CHIP_COLORS[chunk % CHIP_COLORS.length]}
                  onClick={() => clickSlot(slot)}
                >
                  <Text size={300} display="block">
                    {t('processing.adfgvx.cracker.wizard.columns.slotLabel', { index: slot + 1, chunk: chunk + 1 })}
                  </Text>
                </SlotChip>
              </React.Fragment>
            );
          })}
        </SlotsRow>
      </Tooltip>

      {hints.confidenceBars && keyLength % 2 === 0 && (
        <Pane marginTop="8px" display="grid" gridTemplateColumns={`repeat(${Math.ceil(keyLength / 2)}, 1fr)`} gap="8px">
          {Array.from({ length: Math.floor(keyLength / 2) }).map((_, pair) => {
            const quality = cracker.edgeQuality(pair);
            return (
              <Pane key={pair} paddingX="4px">
                <Text size={300} display="block">
                  {t('processing.adfgvx.cracker.wizard.columns.pairQuality', { pair: pair + 1 })}
                </Text>
                <PairQualityBar>
                  <PairQualityFill style={{ width: `${normalizeQuality(quality)}%` }} />
                </PairQualityBar>
              </Pane>
            );
          })}
        </Pane>
      )}

      <ColumnPreview>
        {split.columns.map((column, index) => (
          <Text key={index} size={300} display="block" fontFamily="monospace">
            {`${t('processing.adfgvx.cracker.wizard.columns.chunkLabel', { index: index + 1 })}: ${column}`}
          </Text>
        ))}
      </ColumnPreview>
    </Pane>
  );
};

StepColumns.displayName = 'StepColumns';

export default StepColumns;
