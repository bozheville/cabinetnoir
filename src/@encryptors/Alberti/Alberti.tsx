import React from 'react';
import { Pane } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { useAlberti } from './useAlberti';
import styled from 'styled-components';
import RotationPicker from '@encryptors/Caesar/RotationPicker';


const AlbertiSettings = styled.div<{size: number}>`
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(${({size}) => size}, calc(100%/${({size}) => size}) [col-start]);
  row-gap: 16px;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: repeat(2, 50% [col-start]);
  }
`;

const Alberti: React.FC<CrypterProps> = ({
  input,
  onProcessingEnd,
  isDecryptMode,
  ...paneProps
}) => {
  const {
    t,
    staticDisc,
    dynamicDisc,
    iterationStep,
    period,
    rotateLeft,
    rotateRight,
    handlePeriodChange,
    handleIncrementChange,
  } = useAlberti({
    input,
    onProcessingEnd,
    isDecryptMode
  });

  return (
    <Pane>
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        paddingX="16px"
        paddingBottom="16px"
        {...paneProps}
      >
        <Pane
          display="flex"
          flexDirection="column"
          width="100%"
        >
          <AlbertiSettings
          size={staticDisc.length + 2}
          >
            <span />
            {staticDisc.split('').map((char) => (
              <span key={`static-${char}`}>{char}</span>
            ))}
            <span />
          </AlbertiSettings>
          <AlbertiSettings
            size={staticDisc.length + 2}
          >
            <button onClick={rotateLeft}>&lt;</button>
            {dynamicDisc.split('').map((char) => (
              <span key={`dynamic-${char}`}>{char}</span>
            ))}
            <button onClick={rotateRight}>&gt;</button>
          </AlbertiSettings>
        </Pane>

      </Pane>
      <Pane display="flex" flexDirection="row" justifyContent="center">
        <RotationPicker
          label={t('processing.alberti.settings.increment_label')}
          value={iterationStep}
          onChange={handleIncrementChange}
        />
        <RotationPicker
          label={t('processing.alberti.settings.period_label')}
          value={period}
          onChange={handlePeriodChange}
        />
      </Pane>
    </Pane>
  );
};

Alberti.displayName = 'Alberti';

export default Alberti;
