import React from 'react';
import styled from 'styled-components';

const StyledNumberInput = styled.input.attrs((props) => ({
  ...props,
  type: 'number',
}))`
  width: 100px;
`;


export default StyledNumberInput;
