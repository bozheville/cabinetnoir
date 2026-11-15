import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import styled from 'styled-components';

import { Patch } from '@atoms';
import { focusRing } from '@theme/mixins';
import { Caption, GreatPrimer, Minion } from '@typography';
import { categoryPath, getCategory, getChildren, getMembers, isIndexable } from '@learning/categories';

// One link per card: the name is the anchor, and a stretched ::after makes
// the whole leather patch clickable (specs/seo-indexing: one link target
// per visual object). Focus lands on the name link, so the ring shows there.
export interface CategoryCardProps {
  /** Category id. */
  id: string;
  /** Hub cards list their full sub-tree; category pages show the one-liner. */
  hub?: boolean;
}

const Card = styled(Patch)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px 16px;
  color: ${({ theme }) => theme.ink.cream};

  &[data-leather='tan'] {
    color: ${({ theme }) => theme.ink.primary};
  }

  a.stretched::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  &:focus-within {
    ${focusRing}
  }
`;

const CardTitle = styled(GreatPrimer)`
  color: inherit;
  margin: 0;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const OneLiner = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const Counts = styled(Caption)`
  color: ${({ theme }) => theme.metal.brass.light};
  margin-bottom: 4px;

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const MemberList = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const ChildRow = styled.li`
  margin-left: 16px;
`;

const CategoryCard: React.FC<CategoryCardProps> = ({ id, hub = false }) => {
  const { t } = useTranslation('common');
  const cat = getCategory(id);
  const { live, comingSoon } = getMembers(id, { includeDescendants: true });
  const kids = getChildren(id);

  return (
    <Card shape="card" leather={cat?.leather || 'tan'} data-leather={cat?.leather}>
      <Counts>
        {t('categories.labels.liveCount', { count: live.length })}
        {comingSoon.length > 0 && ` · ${t('categories.labels.comingSoon')}`}
        {hub && !isIndexable(id) && ` · ${t('categories.labels.comingSoon')}`}
      </Counts>
      <CardTitle>
        <Link className="stretched" href={categoryPath(id)}>
          {t(`categories.${id}.name`)}
        </Link>
      </CardTitle>
      <OneLiner>{t(`categories.${id}.oneLiner`)}</OneLiner>
      {hub && kids.length > 0 && (
        <ul>
          {kids.map((child) => (
            <ChildRow key={child}>
              <Link href={categoryPath(child)}>{t(`categories.${child}.name`)}</Link>
            </ChildRow>
          ))}
        </ul>
      )}
      <MemberList>
        {live
          .slice(0, 4)
          .map((cipher) => t(`processing.${cipher}.title`))
          .join(' · ')}
        {comingSoon.length > 0 && ` · ${t('categories.labels.comingSoon')}`}
      </MemberList>
    </Card>
  );
};

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
