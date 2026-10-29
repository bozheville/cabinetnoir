import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import useEnigma from './useEnigma';
import { Paper } from '@atoms';
import TextInput from '@atoms/TextInput';
import Tooltip from '@atoms/Tooltip';
import { Caption, Minion } from '@typography';

// Enigma pane: key field plus rotor/reflector placeholders, laid on a
// sheet of paper pinned to the leather panel. The machine front is a
// later instrument task; the input structure stays exactly as it was.
const PaneStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Sheet = styled(Paper)`
  padding: 12px 16px;
`;

const KeyRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const KeyLabel = styled(Caption)`
  color: ${({ theme }) => theme.ink.secondary};
  margin-bottom: 6px;
`;

const PlaceholderLine = styled(Minion)`
  margin: 0;
`;

const Enigma: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const { t } = useTranslation('common');
  const {
    secretKey,
    handleKeyChange,
  } = useEnigma({
    input,
    onProcessingEnd,
    isDecryptMode,
  });

  return (
    <PaneStack {...paneProps}>
      <Sheet>
        <KeyRow>
          <KeyLabel>{t('processing.enigma.keyLabel')}</KeyLabel>
          <Tooltip content={t('learning.tooltips.enigma.key')}>
            <TextInput
              data-guide="key"
              mono
              width="100px"
              value={secretKey}
              onChange={handleKeyChange}
            />
          </Tooltip>
        </KeyRow>
        <PlaceholderLine>{t('processing.enigma.rotors')}</PlaceholderLine>
        <PlaceholderLine>{t('processing.enigma.reflector')}</PlaceholderLine>
      </Sheet>
    </PaneStack>
  );
};

Enigma.displayName = 'Enigma';

export default Enigma;
