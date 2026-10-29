import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';

import { Button } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { Minion } from '@typography';
import theme from '@theme';
import { paper } from '@theme/mixins';
import { useCracker } from './useCracker';

// Each column chip wears the data ink of its chunk, cycled modulo 8
// (specs/leather-deco-redesign/01 §6).
const chipColor = (chunk: number): string => theme.data[chunk % theme.data.length];

const StepRoot = styled.div`
  width: 100%;
`;

const HintText = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const InfoText = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const SlotsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  align-items: center;
`;

// A slot chip: washed with its chunk's data ink when selected.
const SlotChip = styled.div<{ $selected: boolean; $color: string }>`
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  border: ${({ $selected }) => ($selected ? '2px' : '1px')} solid
    ${({ $color, $selected }) => ($selected ? $color : 'transparent')};
  background: ${({ $color, $selected }) => ($selected ? `${$color}22` : 'transparent')};
  font-family: ${({ theme }) => theme.type.mono};
`;

const SlotText = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.cream};
`;

const PairSeparator = styled(Minion)`
  margin-left: 4px;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const PairQualityGrid = styled.div<{ $pairs: number }>`
  margin-top: 8px;
  display: grid;
  grid-template-columns: ${({ $pairs }) => `repeat(${$pairs}, 1fr)`};
  gap: 8px;
`;

const PairCell = styled.div`
  padding: 0 4px;
`;

const PairText = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// Confidence: a brass rail with a copper fill.
const PairQualityBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.metal.brass.base};
  margin-top: 8px;
  overflow: hidden;
  width: 100%;
`;

const PairQualityFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.metal.copper.base};
`;

// Parchment reading box for the split columns.
const ColumnPreview = styled.div`
  ${paper('parchment')}
  font-family: ${({ theme }) => theme.type.mono};
  color: ${({ theme }) => theme.ink.primary};
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.paper};
  max-height: 120px;
  overflow-y: auto;
`;

const ColumnText = styled(Minion)`
  display: block;
  color: ${({ theme }) => theme.ink.primary};
  font-family: ${({ theme }) => theme.type.mono};
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
    <StepRoot>
      <HintText>
        {t('processing.adfgvx.cracker.wizard.columns.hint')}
      </HintText>

      <InfoRow>
        <InfoText>
          {t('processing.adfgvx.cracker.wizard.columns.splitInfo', {
            columns: keyLength,
            rows: split.rows,
          })}
        </InfoText>
        {hints.autoSuggest && (
          <Tooltip content={t('processing.adfgvx.cracker.tooltips.autoSuggest')}>
            <Button size="sm" variant="secondary" onClick={autoArrange}>
              {t('processing.adfgvx.cracker.wizard.columns.autoArrange')}
            </Button>
          </Tooltip>
        )}
      </InfoRow>

      <Tooltip content={t('learning.controls.column-chips')}>
        <SlotsRow data-guide="column-chips">
          {arrangement.map((chunk, slot) => {
            return (
              <React.Fragment key={slot}>
                {slot > 0 && keyLength % 2 === 0 && slot % 2 === 0 && (
                  <PairSeparator>|</PairSeparator>
                )}
                <SlotChip
                  $selected={selectedSlot === slot}
                  $color={chipColor(chunk)}
                  onClick={() => clickSlot(slot)}
                >
                  <SlotText>
                    {t('processing.adfgvx.cracker.wizard.columns.slotLabel', { index: slot + 1, chunk: chunk + 1 })}
                  </SlotText>
                </SlotChip>
              </React.Fragment>
            );
          })}
        </SlotsRow>
      </Tooltip>

      {hints.confidenceBars && keyLength % 2 === 0 && (
        <PairQualityGrid $pairs={Math.ceil(keyLength / 2)}>
          {Array.from({ length: Math.floor(keyLength / 2) }).map((_, pair) => {
            const quality = cracker.edgeQuality(pair);
            return (
              <PairCell key={pair}>
                <PairText>
                  {t('processing.adfgvx.cracker.wizard.columns.pairQuality', { pair: pair + 1 })}
                </PairText>
                <PairQualityBar>
                  <PairQualityFill style={{ width: `${normalizeQuality(quality)}%` }} />
                </PairQualityBar>
              </PairCell>
            );
          })}
        </PairQualityGrid>
      )}

      <ColumnPreview>
        {split.columns.map((column, index) => (
          <ColumnText key={index}>
            {`${t('processing.adfgvx.cracker.wizard.columns.chunkLabel', { index: index + 1 })}: ${column}`}
          </ColumnText>
        ))}
      </ColumnPreview>
    </StepRoot>
  );
};

StepColumns.displayName = 'StepColumns';

export default StepColumns;
