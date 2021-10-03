import React, { InputHTMLAttributes } from 'react';
import { TextInput } from 'evergreen-ui';
import styled from 'styled-components';

const RotationWrapper = styled.div`
  position: relative;

  span:first-of-type {
    position: absolute;
    top: -14px;
    left: 0;
    font-size: 12px;
  }

  span:last-of-type {
    position: absolute;
    top: -14px;
    right: 0;
    font-size: 12px;
  }
`;

const RotationPicker: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {max: number}> = ({
  value,
  onChange,
  max = 26,
}) => {
  return (
    <RotationWrapper>
      <span>Rotation size</span>
      <span>{value}</span>
      <TextInput
        type="range"
        min="1"
        max={max - 1}
        width="150px"
        value={value}
        marginY="0"
        onChange={onChange}
      />
    </RotationWrapper>
  );
};

export default RotationPicker;
