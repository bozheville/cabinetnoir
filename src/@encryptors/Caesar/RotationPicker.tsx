import React, { InputHTMLAttributes } from 'react';
import { TextInputField } from 'evergreen-ui';
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

interface RotationPickerProps {
  max?: number;
  label: string;
}

const RotationPicker: React.FC<React.InputHTMLAttributes<HTMLInputElement> & RotationPickerProps> = ({
  value,
  label,
  onChange,
  max = 26,
}) => {
  return (
    <RotationWrapper>
      <TextInputField
        label={label}
        description={value}
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
