import styled from 'styled-components';

const Minion = styled.p`
  font-family: Roboto, Sans-Serif;
  font-weight: 400;
  color: ${(props) => props.theme.colors.textLight};
  font-size: 13px;
  line-height: 16px;
  margin: 0;

  &+& {
    margin: 12px 0 0;
  }

  ${(props) => props.theme.breakpoints.small} {
    font-size: 12px;
    line-height: 16px;
  }

  ${(props) => props.theme.breakpoints.desktop} {
    font-size: 12px;
    line-height: 16px;
  }

  a {
    text-decoration: underline;
  }
`;

Minion.displayName = 'Minion';

export default Minion;
