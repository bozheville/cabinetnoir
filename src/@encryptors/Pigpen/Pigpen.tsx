import React from 'react';
import { Pane, Select } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { CrypterProps } from '../types';
import { usePigpen } from './usePigpen';
import { PIGPEN_VARIANT_IDS, getPigpenVariant } from './variants';
import Tooltip from '@atoms/Tooltip';
import GlyphRenderer from '@molecues/GlyphRenderer';
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

const StripWrapper = styled(Pane)`
  width: 100%;
  min-height: 34px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colorScheme.white};
  color: ${({ theme }) => theme.colorScheme.black};
  overflow-x: auto;
`;

const Pigpen: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  onInputChange,
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
      {isDecryptMode ? (
        <GlyphKeyboard
          variant={variantId}
          onKey={appendLetter}
          onDelete={deleteLast}
          onClear={clearInput}
        />
      ) : (
        <StripWrapper>
          <GlyphRenderer text={input} variant={variantId} size={30} />
        </StripWrapper>
      )}
    </PigpenWrapper>
  );
};

Pigpen.displayName = 'Pigpen';

export default Pigpen;
