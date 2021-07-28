// import React from 'react';
import styled from 'styled-components';

const StyledTextInput = styled.input`
  width: 200px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue_green[400]};
  font-size: 16px;
  padding: 4px;
  border-radius: 3px;

  &:focus {
    border: 1px solid ${({ theme }) => theme.colorScheme.blue_green[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colorScheme.blue_green[300]};
    outline: none;
  }
`;

StyledTextInput.displayName = 'TextInput';

export default StyledTextInput;
