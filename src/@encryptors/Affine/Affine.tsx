import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { CrypterProps } from '../types';
import useAffine from './useAffine';
import { Cluster, NumberInput, Stack, Toggle } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { ControlGroup } from '@organisms/ControlPanel';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

const Affine: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const {
    secretKey,
    keepCase,
    keepSpaces,
    multiplier,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleMultiplierChange,
  } = useAffine({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.affine.multiplier')}>
            <NumberInput
              data-guide="multiplier"
              value={multiplier}
              onChange={handleMultiplierChange}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.affine.shift')}>
            <NumberInput
              data-guide="shift"
              value={secretKey}
              onChange={handleKeyChange}
            />
          </Tooltip>
        </ControlGroup>
        {!isDecryptMode && (
          <>
            <ControlGroup>
              <Toggle
                label="Keep spaces"
                checked={keepSpaces}
                onChange={handleKeepSpacesChange}
              />
            </ControlGroup>
            <ControlGroup>
              <Toggle
                label="Keep case"
                checked={keepCase}
                onChange={handleKeepCaseChange}
              />
            </ControlGroup>
          </>
        )}
      </Cluster>
    </PaneStack>
  );
};

Affine.displayName = 'Affine';

export default Affine;
