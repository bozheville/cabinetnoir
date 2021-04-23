import styled from 'styled-components';

const Canon = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 44px;
  line-height: 48px;
  margin: 0;

  ${(props) => props.theme.breakpoints.small} {
    font-size: 32px;
    line-height: 36px;
  }

  ${(props) => props.theme.breakpoints.desktop} {
    font-size: 52px;
    line-height: 56px;
  }
`;

Canon.displayName = 'Canon';

export default Canon;
