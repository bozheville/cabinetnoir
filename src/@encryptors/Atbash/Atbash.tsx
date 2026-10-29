import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

import { alphabetCollection } from '../constants';
import { CrypterProps } from '../types';
import { useAtbash } from './useAtbash';
import { Cluster, Select, Stack, Toggle } from '@atoms';
import Tooltip from '@atoms/Tooltip';
import { ControlGroup } from '@organisms/ControlPanel';

const PaneStack = styled(Stack)`
  width: 100%;
  padding: 0 16px 16px;
`;

const Atbash: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const {
    keepCase,
    keepSpaces,
    alphabetKey,
    handleKeepSpacesChange,
    handleKeepCaseChange,
    handleAphabetKeyChange,
  } = useAtbash({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <PaneStack {...paneProps}>
      <Cluster justify="center" gap={4} wrap>
        <ControlGroup>
          <Tooltip content={t('learning.tooltips.atbash.alphabet')}>
            <Select
              data-guide="alphabet"
              defaultValue={alphabetKey}
              onChange={handleAphabetKeyChange}
              options={alphabetCollection.map((item) => ({
                value: item.type,
                label: t(`alphabet.${item.type}`),
              }))}
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

Atbash.displayName = 'Atbash';

export default Atbash;
