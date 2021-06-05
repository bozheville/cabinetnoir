import React from 'react';
import styled from 'styled-components';

const StyledTextInput = styled.input`
  width: 100%;
`;

const TextInput: React.FC<React.HTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return (
    <StyledTextInput {...props} />
  );
};

TextInput.displayName = 'TextInput';

export default TextInput;
