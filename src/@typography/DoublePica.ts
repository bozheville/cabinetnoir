import styled from "styled-components";

const DoublePica = styled.h2`
  font-family: "Roboto";
  color: ${(props) => props.theme.colors.text};
  font-size: 26px;
  line-height: 30px;
  margin: 0;

  ${(props) => props.theme.breakpoints.small} {
    font-size: 20px;
    line-height: 24px;
  }

  ${(props) => props.theme.breakpoints.desktop} {
    font-size: 24px;
    line-height: 28px;
  }
`;

DoublePica.displayName = 'DoublePica';

export default DoublePica;
