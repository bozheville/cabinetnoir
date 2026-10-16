import React from 'react';
import { Checkbox, Pane } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { alphabetCollection } from '../constants';
import useCaesar from './useCaesar';
import RotationPicker from './RotationPicker';
import AlphabetSelector from '@molecues/AlphabetSelector';
import Tooltip from '@atoms/Tooltip';

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
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip content={t('learning.tooltips.caesar.rotation')}>
          <RotationPicker
            dataGuide="key"
            label={t('processing.caesar.settings.rotation_label')}
            value={secretKey}
            onChange={handleKeyChange}
            max={alphabetLength}
          />
        </Tooltip>
        {!isDecryptMode && (
          <>
            <Tooltip content={t('learning.tooltips.caesar.keepSpaces')}>
              <Checkbox
                data-guide="keep-spaces"
                marginLeft="6px"
                label={t('processing.caesar.settings.keep_spaces')}
                checked={keepSpaces}
                onChange={handleKeepSpacesChange}
              />
            </Tooltip>
            <Tooltip content={t('learning.tooltips.caesar.keepCase')}>
              <Checkbox
                data-guide="keep-case"
                marginLeft="6px"
                label={t('processing.caesar.settings.keep_case')}
                checked={keepCase}
                onChange={handleKeepCaseChange}
              />
            </Tooltip>
          </>
        )}
      </Pane>
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <AlphabetSelector onChange={handleAlphabetChange} />
      </Pane>
    </Pane>
  );
};

Caesar.displayName = 'Caesar';

export default Caesar;
