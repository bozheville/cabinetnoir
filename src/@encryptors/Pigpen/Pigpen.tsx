import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import { usePigpen } from './usePigpen';
import { PIGPEN_VARIANT_IDS, getPigpenVariant } from './variants';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Select, Stack } from '@atoms';
import GlyphKeyDiagram from '@molecues/GlyphKeyDiagram';
import GlyphLegend from '@molecues/GlyphLegend';
import GlyphKeyboard from '@molecues/GlyphKeyboard';

const PigpenWrapper = styled(Stack)`
  width: 100%;
  gap: 8px;
  padding: 0 16px 12px;
`;

const ControlsRow = styled(Cluster)`
  width: 100%;
`;

const Pigpen: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  onInputChange,
  onVariantChange,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const {
    variantId,
    handleVariantChange,
    appendLetter,
    deleteLast,
    clearInput,
  } = usePigpen({
    input,
    onProcessingEnd,
    isDecryptMode,
    onInputChange,
    onVariantChange,
  });

  return (
    <PigpenWrapper {...paneProps} align="center">
        <ControlsRow justify="center">
          <Tooltip content={t('learning.tooltips.pigpen.variant')}>
            <Select
              data-guide="variant-selector"
              value={variantId}
              onChange={handleVariantChange}
              options={PIGPEN_VARIANT_IDS.map((id) => ({
                value: id,
                label: t(getPigpenVariant(id).nameKey),
              }))}
            />
          </Tooltip>
        </ControlsRow>
        {/* The key figure shows WHY the glyphs look the way they do —
            every glyph is one pen of these shapes — and the key sheet
            below keeps the flat letter-to-glyph mapping for clarity. */}
        <GlyphKeyDiagram variant={variantId} />
        <GlyphLegend variant={variantId} />
        {isDecryptMode && (
          <GlyphKeyboard
            variant={variantId}
            onKey={appendLetter}
            onDelete={deleteLast}
            onClear={clearInput}
          />
        )}
      </PigpenWrapper>
  );
};

Pigpen.displayName = 'Pigpen';

export default Pigpen;
