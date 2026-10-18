import React from 'react';
import { Pane, Select } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import { usePigpen } from './usePigpen';
import { PIGPEN_VARIANT_IDS, getPigpenVariant } from './variants';
import Tooltip from '@atoms/Tooltip';
import GlyphLegend from '@molecues/GlyphLegend';
import GlyphKeyboard from '@molecues/GlyphKeyboard';

const PigpenWrapper = styled(Pane)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 0 16px 12px;
`;

const ControlsRow = styled(Pane)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
    <PigpenWrapper {...paneProps}>
        <ControlsRow>
          <Tooltip content={t('learning.tooltips.pigpen.variant')}>
            <Select
              data-guide="variant-selector"
              value={variantId}
              onChange={handleVariantChange}
            >
              {PIGPEN_VARIANT_IDS.map((id) => (
                <option value={id} key={id}>
                  {t(getPigpenVariant(id).nameKey)}
                </option>
              ))}
            </Select>
          </Tooltip>
        </ControlsRow>
        {/* The letter-to-glyph key sheet sits above the text areas —
            the mapping is the cipher's whole key, drawn openly. */}
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
