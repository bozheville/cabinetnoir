import { Select } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CrypterProps } from '../types';
import { morseDecoding, morseEncoding } from './morse-encoding';

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
        <div>
          <span>{`${t('processing.morse.dot_symbol')}`}</span>
          <Select defaultValue="•" onChange={handleDotSymbolChnage}>
            {dotSymbols.split('').map((char) => <option value={char} key={`option-${char}`}>{char}</option>)}
          </Select>
        </div>
        <div>
          <Select defaultValue="-" onChange={handleDashSymbolChnage}>
            {dashSymbols.split('').map((char) => <option value={char} key={`option-${char}`}>{char}</option>)}
          </Select>
          <span>{`${t('processing.morse.dash_symbol')}`}</span>
        </div>
      </SignSelector>
    </MorseSettingsWrapper>
  ) : <div />;
};

Morse.displayName = 'Morse';

export default Morse;
