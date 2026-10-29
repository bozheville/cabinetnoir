import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Chevron, Lozenge } from '@ornaments';
import Section from '@atoms/Section/Section';
import { Caption } from '@typography';

interface HeaderProps {
  title: string;
}

const StyledHeader = styled(Section)`
  /* Print: the header is site chrome, not article content (spec 08). */
  @media print {
    display: none;
  }
  padding: 16px 24px;
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.breakpoints.small} {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

// Wordmark plate: lozenge + engraved brass wordmark on the chestnut band.
const Wordmark = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.metal.brass.light};
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
  white-space: nowrap;
`;

const TitleCrumb = styled(Caption)`
  color: ${({ theme }) => theme.ink.cream};
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CrumbSeparator = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.metal.brass.base};
  flex: none;
`;

const RightCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: none;
`;

const IdentifyLink = styled(Link)`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.metal.brass.light};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.metal.brass.dark};
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.metal.copper.light};
    text-decoration-color: ${({ theme }) => theme.metal.copper.base};
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
      <Breadcrumb aria-label="Breadcrumb">
        <Wordmark href="/">
          <Lozenge size={7} />
          Cabinet Noir
        </Wordmark>
        <CrumbSeparator aria-hidden="true">
          <Chevron size={7} />
        </CrumbSeparator>
        <TitleCrumb>{title}</TitleCrumb>
      </Breadcrumb>
      <RightCluster>
        {!pathname.startsWith('/identify') && (
          <IdentifyLink href="/identify">
            {t('identify.headerEntry')}
          </IdentifyLink>
        )}
        {children}
      </RightCluster>
    </StyledHeader>
  );
};

Header.displayName = 'Header';

export default Header;
