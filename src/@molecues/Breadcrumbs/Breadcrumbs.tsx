import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Chevron } from '@ornaments';
import type { Crumb } from '@lib/breadcrumbs';
import { focusRing } from '@theme/mixins';

// Classic visible breadcrumb trail: home › category › subcategories › …crumbs.
// All crumbs render in the server HTML; a crumb without a path (the
// algorithm on cipher pages) renders as plain text.
export interface BreadcrumbsProps {
  trail?: Crumb[];
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  margin-top: 24px;
`;

const CrumbLink = styled(Link)`
  color: ${({ theme }) => theme.metal.brass.light};
  text-decoration: none;
  white-space: nowrap;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.ink.cream};
    ${focusRing}
  }
`;

const CrumbText = styled.span`
  color: ${({ theme }) => theme.ink.cream};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CrumbSeparator = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.metal.brass.base};
  flex: none;
`;

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ trail }) => {
  const { t } = useTranslation('common');

  if (!trail || trail.length === 0) return null;

  return (
    <Nav aria-label={t('categories.labels.breadcrumb')}>
      {trail.map((crumb, index) => (
        <React.Fragment key={`${crumb.label}-${index}`}>
          {index > 0 && (
            <CrumbSeparator aria-hidden="true">
              <Chevron size={7} />
            </CrumbSeparator>
          )}
          {crumb.path ? (
            <CrumbLink href={crumb.path}>{crumb.label}</CrumbLink>
          ) : (
            <CrumbText>{crumb.label}</CrumbText>
          )}
        </React.Fragment>
      ))}
    </Nav>
  );
};

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
