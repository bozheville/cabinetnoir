import React from 'react';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import useCaesar from './useCaesar';
import RotationPicker from './RotationPicker';
import AlphabetSelector from '@molecues/AlphabetSelector';
import Tooltip from '@atoms/Tooltip';
import { Cluster, Stack, Toggle } from '@atoms';
import { ControlGroup } from '@organisms/ControlPanel';
import { engraved } from '@theme/mixins';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
  justify-content: center;
`;

// Engraved brass label on the leather control panel.
const PaneLabel = styled.span`
  ${engraved('leather')}
  font-size: 11px;
`;

const Caesar: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {
    t,
    alphabetLength,
    secretKey,
    keepCase,
    keepSpaces,
    handleKeyChange,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleAlphabetChange,
  } = useCaesar({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4}>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.caesar.rotation')}>
            <RotationPicker
              dataGuide="key"
              label={t('processing.caesar.settings.rotation_label')}
              value={secretKey}
              onChange={handleKeyChange}
              max={alphabetLength}
            />
          </Tooltip>
        </ControlGroup>
        <ControlGroup>
          <AlphabetSelector onChange={handleAlphabetChange} />
        </ControlGroup>
        {!isDecryptMode && (
          <>
            <ControlGroup>
              <Tooltip content={t('learning.tooltips.caesar.keepSpaces')}>
                <Toggle
                  data-guide="keep-spaces"
                  label={t('processing.caesar.settings.keep_spaces')}
                  checked={keepSpaces}
                  onChange={handleKeepSpacesChange}
                />
              </Tooltip>
            </ControlGroup>
            <ControlGroup>
              <Tooltip content={t('learning.tooltips.caesar.keepCase')}>
                <Toggle
                  data-guide="keep-case"
                  label={t('processing.caesar.settings.keep_case')}
                  checked={keepCase}
                  onChange={handleKeepCaseChange}
                />
              </Tooltip>
            </ControlGroup>
          </>
        )}
      </Cluster>
    </PaneStack>
  );
};

Caesar.displayName = 'Caesar';

export default Caesar;
