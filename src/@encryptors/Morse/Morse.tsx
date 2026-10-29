import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import { morseDecoding, morseEncoding } from './morse-encoding';
import Tooltip from '@atoms/Tooltip';
import { Select } from '@atoms';
import { engraved } from '@theme/mixins';

const dotSymbols = '.*•';
const dashSymbols = '-_~';

const MorseSettingsWrapper = styled.div`
  width: 100%;
  padding: 0 16px 16px;
`;

const SignSelector = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.breakpoints.small} {
    flex-direction: column;
  }
`;

// Engraved brass label on the leather control panel.
const PaneLabel = styled.span`
  ${engraved('leather')}
  font-size: 11px;
`;

const SignGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
`;

const Morse: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
}) => {
  const [ dotSymbol, setDotSymbol ] = useState('•');
  const [ dashSymbol, setDashSymbol ] = useState('-');
  const { t } = useTranslation('common');

  useEffect(() => {
    const output = isDecryptMode
      ? morseDecoding(input, {dashSymbols, dotSymbols})
      : morseEncoding(input, {dashSymbol, dotSymbol});

      onProcessingEnd({ output });
  }, [input, isDecryptMode, dashSymbol, dotSymbol]);

  const handleDotSymbolChnage = (event) => setDotSymbol(event.target.value);
  const handleDashSymbolChnage = (event) => setDashSymbol(event.target.value);

  return !isDecryptMode ? (
    <MorseSettingsWrapper>
      <SignSelector>
        <SignGroup>
          <PaneLabel>{`${t('processing.morse.dot_symbol')}`}</PaneLabel>
          <Tooltip content={t('learning.tooltips.morse.dot')}>
            <Select
              data-guide="dot-symbol"
              defaultValue="•"
              onChange={handleDotSymbolChnage}
              options={dotSymbols.split('').map((char) => ({ value: char, label: char }))}
            />
          </Tooltip>
        </SignGroup>
        <SignGroup>
          <Tooltip content={t('learning.tooltips.morse.dash')}>
            <Select
              data-guide="dash-symbol"
              defaultValue="-"
              onChange={handleDashSymbolChnage}
              options={dashSymbols.split('').map((char) => ({ value: char, label: char }))}
            />
          </Tooltip>
          <PaneLabel>{`${t('processing.morse.dash_symbol')}`}</PaneLabel>
        </SignGroup>
      </SignSelector>
    </MorseSettingsWrapper>
  ) : <div />;
};

Morse.displayName = 'Morse';

export default Morse;
