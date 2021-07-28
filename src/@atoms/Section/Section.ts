import React from 'react';
import styled from 'styled-components';

interface StitchProps extends React.HTMLAttributes<HTMLDivElement> {
  stitch?: 'top'|'bottom'|'both';
  color?: string;
}
//background-color: #4c5057;
//color: #F6EDD8;

const Section = styled.section<StitchProps>`
  padding: 28px 16px;
  background: url(/images/grain.png) repeat;
  background-color: ${({ color, theme }) => theme.colors.backgrounds[color || 'gray']};

  border-bottom: 1px solid rgba(0,0,0,0.2);

  ${({ stitch }) => stitch && `
    position: relative;

    &:before, &:after {
      display: block;
      position: absolute;
      margin: 0;
      border-top: 1px dashed rgba(0,0,0,0.25);
      border-bottom: 1px dashed rgba(255,255,255,0.25);
      background-color: transparent;
      width: 100%;
      height: 0;
      left: 0;
    }

    ${stitch === 'both' ? `
    &:before {
      content: '';
      top: 6px;
    }
    &:after {
      content: '';
      bottom: 6px;
    }
    ` : stitch === 'top' ? `
    &:before {
      content: '';
      top: 6px;
    }
    ` : `
    &:after {
      content: '';
      bottom: 6px;
    }
    ` }
  `}
`;

export default Section;
