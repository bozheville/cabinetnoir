import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import styled from 'styled-components';

import { focusRing } from '@theme/mixins';
import { getCategory } from '@learning/categories';

// Brass-engraved link chips for family cross-links. Desktop: rows wrap.
// Mobile: one scroll-snap row with a hidden scrollbar and a right-edge fade,
// the page's only horizontal scroll container (task 04).
export interface CategoryChipsProps {
  /** Category ids to list. */
  ids: string[];
  /** Locale-free path of the trailing "All families" link; omit to hide it. */
  seeAllPath?: string;
  /** Full-path tooltips per id (AtGlanceCard, task 06). */
  titles?: Record<string, string>;
  /** Live member counts per id (home BrowseByFamily strip, task 06). */
  counts?: Record<string, number>;
}

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;

  ${({ theme }) => theme.breakpoints.small} {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x proximity;

    &::-webkit-scrollbar {
      display: none;
    }

    /* Fade hint that the row continues past the edge. */
    mask-image: linear-gradient(to right, black 0%, black 85%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 0%, black 85%, transparent 100%);
  }
`;

const Chip = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.metal.brass.highlight} 0%,
    ${({ theme }) => theme.metal.brass.light} 18%,
    ${({ theme }) => theme.metal.brass.base} 55%,
    ${({ theme }) => theme.metal.brass.dark} 100%
  );
  border: 1px solid ${({ theme }) => theme.metal.brass.shadow};
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.ink.primary};
  text-decoration: none;
  white-space: nowrap;
  scroll-snap-align: start;

  ${({ theme }) => theme.breakpoints.small} {
    height: 44px;
  }

  &:hover {
    filter: brightness(1.06);
  }

  &:focus-visible {
    ${focusRing}
  }
`;

const Swatch = styled.span<{ $leather: string }>`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: ${({ theme, $leather }) => theme.leather[$leather].base};
  border: 1px solid rgba(42, 26, 18, 0.5);
`;

const CategoryChips: React.FC<CategoryChipsProps> = ({ ids, seeAllPath, titles, counts }) => {
  const { t } = useTranslation('common');

  return (
    <Row>
      {ids.map((id) => {
        const cat = getCategory(id);
        return (
          <Chip
            key={id}
            href={`/category/${id}`}
            title={titles?.[id]}
          >
            {cat && <Swatch $leather={cat.leather} />}
            {t(`categories.${id}.shortName`)}
            {counts?.[id] !== undefined && ` · ${counts[id]}`}
          </Chip>
        );
      })}
      {seeAllPath && <Chip href={seeAllPath}>{t('categories.labels.seeAll')}</Chip>}
    </Row>
  );
};

CategoryChips.displayName = 'CategoryChips';

export default CategoryChips;
