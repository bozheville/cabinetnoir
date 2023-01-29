import React from 'react';
import { Checkbox, Pane, Select } from 'evergreen-ui';
import { CrypterProps } from '../types';
import { useAlberti } from './useAlberti';
import { AlphabetInput } from '@molecues/AlphabetSelector/AlphabetInput';
import styled from 'styled-components';

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
    staticDisc,
    dynamicDisc,
    shift,
    iterationStep,
    rotateLeft,
    rotateRight,
    // handleKeepSpacesChange,
    // handleKeepCaseChange,
  } = useAlberti({
    input,
    onProcessingEnd,
    isDecryptMode
  });

  return (
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
  );
};

Alberti.displayName = 'Alberti';

export default Alberti;
