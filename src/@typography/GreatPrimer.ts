import styled from "styled-components";

const GreatPrimer = styled.h3`
  color: ${(props) => props.theme.colors.text};
  font-size: 21px;
  line-height: 24px;
  margin: 0;

  ${(props) => props.theme.breakpoints.small} {
    font-size: 18px;
    line-height: 22px;
  }

  ${(props) => props.theme.breakpoints.desktop} {
    font-size: 20px;
    line-height: 24px;
  }
`;

GreatPrimer.displayName = 'GreatPrimer';

export default GreatPrimer;
