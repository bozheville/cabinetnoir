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

  /* Mobile-first: stacked rows — wordmark, links + language, the h1.
     The trail lives in the page content, not here. */
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'brand'
    'actions'
    'title';
  gap: 8px;
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
  grid-area: brand;
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
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  min-width: 0;

  ${({ theme }) => theme.breakpoints.tablet} {
    flex: none;
    flex-wrap: nowrap;
  }
`;

// "Cipher families" header link (task 06), styled like IdentifyLink.
const CategoriesLink = styled(Link)`
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

  /* Shorter label below tablet so row 1 fits at 375 px in every locale. */
  .long { display: none; }
  ${({ theme }) => theme.breakpoints.tablet} {
    .short { display: none; }
    .long { display: inline; }
  }
`;

const IdentifyLink = styled(Link)`
  min-width: 0;
  overflow-wrap: anywhere;

  ${({ theme }) => theme.breakpoints.tablet} {
    flex-shrink: 0;
  }

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
        {!pathname.startsWith('/category') && (
          <CategoriesLink href="/category">
            <span className="short">{t('categories.labels.familiesShort')}</span>
            <span className="long">{t('categories.labels.families')}</span>
          </CategoriesLink>
        )}
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
