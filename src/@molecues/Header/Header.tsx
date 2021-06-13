import React from 'react';
import styled from 'styled-components';
import { DoublePica } from '@typography';
import Link from 'next/link';
import { ChevronRightIcon } from 'evergreen-ui';

interface HeaderProps {
  title: string;
}

const StyledHeader = styled.div`
  margin-bottom: 36px;
  padding: 16px 24px;
  display: flex;
  box-shadow: 0px 0px 3px 0px #999;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.breakpoints.small} {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ${({ theme }) => theme.breakpoints.desktop} {

  }
`;

const Header: React.FC<HeaderProps> = ({
  title,
  children,
}) => {
  return (
    <StyledHeader>
      <DoublePica>
        <Link href="/" passHref={true}>
          Cabinet Noir
        </Link>
        <ChevronRightIcon marginX="12px" />
        {title}
      </DoublePica>
      {children}
    </StyledHeader>
  );
};

Header.displayName = 'Header';

export default Header;
