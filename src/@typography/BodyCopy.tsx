import styled from 'styled-components';

const BodyCopy = styled.p`
  font-family: "Roboto-Slab";
  font-weight: 400;
  color: ${(props) => props.theme.colors.text};
  font-size: 18px;
  line-height: 24px;
  margin: 0;

  &+& {
    margin: 12px 0 0;
  }

  ${(props) => props.theme.breakpoints.small} {
    font-size: 16px;
    line-height: 22px;
  }

  ${(props) => props.theme.breakpoints.desktop} {
    font-size: 16px;
    line-height: 22px;
  }

  a {
    text-decoration: underline;
  }
`;

BodyCopy.displayName = 'BodyCopy';

export default BodyCopy;
