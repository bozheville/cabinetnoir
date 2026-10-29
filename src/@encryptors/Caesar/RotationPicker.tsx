import React from 'react';
import styled from 'styled-components';
import { Slider } from '@atoms';

const RailWrap = styled.div`
  width: 150px;
`;

interface RotationPickerProps {
  max?: number;
  label: string;
  // data-guide anchor for tooltip wiring and the (later) interactive tour.
  dataGuide?: string;
}

// The rotation control: a brass rail with a copper lever, the current
// value in a small brass window. Native range underneath, so keyboard
// and screen readers behave exactly as before.
const RotationPicker: React.FC<React.InputHTMLAttributes<HTMLInputElement> & RotationPickerProps> = ({
  value,
  label,
  onChange,
  max = 26,
  dataGuide,
}) => {
  return (
    <RailWrap data-guide={dataGuide}>
      <Slider
        label={label}
        showValue
        min={1}
        max={max - 1}
        value={value}
        onChange={onChange}
      />
    </RailWrap>
  );
};

export default RotationPicker;
