import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ChevronRightIcon } from 'evergreen-ui';
import { DoublePica } from '@typography';
import Section from '@atoms/Section/Section';

interface HeaderProps {
  title: string;
}

const StyledHeader = styled(Section)`
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

const IdentifyLink = styled(Link)`
  flex-shrink: 0;
  margin-right: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colorScheme.blue[500]};

  &:hover {
    color: ${({ theme }) => theme.colorScheme.blue[600]};
  }
`;

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  title,
  children,
}) => {
  const { t } = useTranslation('common');
  const { pathname } = useRouter();

  return (
    <StyledHeader color="header" stitch="bottom">
      <DoublePica>
        <Link href="/" passHref={true}>
          Cabinet Noir
        </Link>
        &gt;
        {title}
      </DoublePica>
      {!pathname.startsWith('/identify') && (
        <IdentifyLink href="/identify">
          {t('identify.headerEntry')}
        </IdentifyLink>
      )}
      {children}
    </StyledHeader>
  );
};

Header.displayName = 'Header';

export default Header;
