import styled from "styled-components";

const Trafalgar = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  line-height: 40px;
  margin: 0;

  ${(props) => props.theme.breakpoints.small} {
    font-size: 24px;
    line-height: 28px;
  }

  ${(props) => props.theme.breakpoints.desktop} {
    font-size: 32px;
    line-height: 36px;
  }
`;

Trafalgar.displayName = 'Trafalgar';

export default Trafalgar;
