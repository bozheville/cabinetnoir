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
  // Pages whose body carries a better <h1> render the crumb as a span.
  titleAs?: 'h1' | 'span';
}

const StyledHeader = styled(Section)`
  /* Print: the header is site chrome, not article content (spec 08). */
  @media print {
    display: none;
  }
  padding: 16px 24px;

  /* Mobile-first: three rows — brand + actions, the trail, the h1
     (task 05c, replaces the deprecated small column layout). */
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'brand actions'
    'trail trail'
    'title title';
  align-items: center;
  justify-items: start;

  ${({ theme }) => theme.breakpoints.tablet} {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
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

// The page's <h1> by default: the current page in the trail.
const TitleCrumb = styled(Caption)`
  grid-area: title;
  margin: 0;
  color: ${({ theme }) => theme.ink.cream};
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
  overflow-wrap: anywhere;

  ${({ theme }) => theme.breakpoints.tablet} {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CrumbSeparator = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.metal.brass.base};
  flex: none;
`;

const RightCluster = styled.div`
  grid-area: actions;
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
  titleAs = 'h1',
  children,
}) => {
  const { t } = useTranslation('common');
  const { pathname } = useRouter();

  return (
    <StyledHeader color="header" stitch="bottom">
      <Wordmark href="/">
        <Lozenge size={7} />
        Cabinet Noir
      </Wordmark>
      <TitleCrumb as={titleAs}>{title}</TitleCrumb>
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
