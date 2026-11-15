import React, { useId, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import styled from 'styled-components';

import { Button, Paper, Patch } from '@atoms';
import { focusRing } from '@theme/mixins';
import { BodyCopy, Caption, GreatPrimer, Minion } from '@typography';
import HeadingRule from '@ornaments/HeadingRule';
import MarkdownContent from '@molecues/MarkdownContent';
import CipherCard from '@molecues/CipherCard';
import ComingSoonCard from '@molecues/ComingSoonCard';
import CategoryCard from '@molecues/CategoryCard';
import CategoryChips from '@molecues/CategoryChips';
import {
  COMING_SOON,
  categoryPath,
  getAncestry,
  getCategory,
  getChildren,
  getCipherCategories,
  getMembers,
  getRootCategories,
} from '@learning/categories';

export interface CategoryProps {
  /** null = the hub. */
  categoryId: string | null;
  /** Markdown from content/categories/<id>/<locale>/intro.md (build time). */
  intro: string | null;
}

// ---------------------------------------------------------------------------
// Nameplate: the page <h1>, a leather plate with a double brass rule.
// ---------------------------------------------------------------------------
const Nameplate = styled(Patch).attrs({ shape: 'card', stitch: 'none' })`
  max-width: 760px;
  width: 100%;
  margin: 24px auto 0;
  padding: 28px 24px;
  text-align: center;
  position: relative;
  color: ${({ theme }) => theme.ink.cream};

  &[data-leather='tan'] {
    color: ${({ theme }) => theme.ink.primary};
  }

  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1.5px solid ${({ theme }) => theme.metal.brass.light};
    border-radius: 6px;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 14px;
    border: 0.75px solid ${({ theme }) => theme.metal.brass.light};
    border-radius: 4px;
    pointer-events: none;
  }
`;

const NameplateKicker = styled(Caption)`
  color: ${({ theme }) => theme.ink.creamMuted};
  letter-spacing: 0.2em;
  text-transform: uppercase;

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const NameplateTitle = styled.h1`
  margin: 8px 0 0;
  font-family: ${({ theme }) => theme.type.display};
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  color: inherit;

  ${({ theme }) => theme.breakpoints.small} {
    font-size: 26px;
    line-height: 32px;
  }
`;

const NameplateLine = styled(Minion)`
  margin-top: 8px;
  font-style: italic;
  color: ${({ theme }) => theme.ink.creamMuted};

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

// ---------------------------------------------------------------------------
// Grids: 1 / 2 / 3 / 4 columns at base / tablet / desktop / wide — the same
// ladder as CipherLadder, so cards never stretch below their home size.
// ---------------------------------------------------------------------------
const Grid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  ${({ theme }) => theme.breakpoints.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${({ theme }) => theme.breakpoints.wide} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// Sub-family cards are wider: 1 / 2 columns.
const SubGrid = styled(Grid)`
  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.breakpoints.wide} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// ---------------------------------------------------------------------------
// Intro sheet: paper, reading width, pinned. Mobile: collapsed behind a
// copper "Read more" so the cards are reachable without scrolling past 400
// words. The full text stays in the server HTML (max-height + fade), so it
// is crawlable (task 01 settled point).
// ---------------------------------------------------------------------------
const IntroSheet = styled(Paper)`
  max-width: ${({ theme }) => theme.widths.sheet};
  width: 100%;
  margin: 32px auto 0;
  padding: 32px 24px;
`;

const Clamp = styled.div<{ $open: boolean }>`
  overflow: hidden;
  position: relative;
  max-height: ${({ $open }) => ($open ? 'none' : 'calc(15px * 1.6 * 9)')};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70px;
    background: linear-gradient(180deg, transparent, ${({ theme }) => theme.paper.ivory});
    opacity: ${({ $open }) => ($open ? 0 : 1)};
    pointer-events: none;
  }

  ${({ theme }) => theme.breakpoints.tablet} {
    max-height: none;
    &::after {
      opacity: 0;
      display: none;
    }
  }
`;

const ReadMoreButton = styled.button`
  display: block;
  margin: 16px auto 0;
  height: 44px;
  padding: 0 24px;
  border-radius: 4px;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.metal.copper.highlight} 0%,
    ${({ theme }) => theme.metal.copper.dark} 100%
  );
  border: 1px solid ${({ theme }) => theme.metal.copper.shadow};
  color: ${({ theme }) => theme.ink.primary};
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    filter: brightness(1.06);
  }

  &:focus-visible {
    ${focusRing}
  }

  ${({ theme }) => theme.breakpoints.tablet} {
    display: none;
  }
`;

const SectionHead = styled.div`
  text-align: center;
  margin-top: 32px;

  ${BodyCopy} {
    margin-top: 8px;
    color: ${({ theme }) => theme.ink.creamMuted};
  }
`;

// ---------------------------------------------------------------------------
// Identify call-out (hub): a way out for visitors who arrive with a
// ciphertext, not a family (mock-up: navy leather band).
// ---------------------------------------------------------------------------
const CallOut = styled(Patch).attrs({ shape: 'card', leather: 'navy', stitch: 'both' })`
  max-width: ${({ theme }) => theme.widths.tool};
  width: 100%;
  margin: 32px auto 0;
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  color: ${({ theme }) => theme.ink.cream};
`;

const CallOutCopy = styled.div`
  ${GreatPrimer} {
    color: inherit;
    margin: 0;
  }

  ${Minion} {
    color: ${({ theme }) => theme.ink.creamMuted};
    font-style: italic;
  }
`;

const ReadMore: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const contentId = useId();

  // Text stays in the DOM either way: crawlable, no layout shift on open.
  return (
    <>
      <Clamp $open={open} id={contentId}>
        {children}
      </Clamp>
      <ReadMoreButton
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
      >
        {open ? t('categories.labels.showLess') : t('categories.labels.readMore')}
      </ReadMoreButton>
    </>
  );
};

const Category: React.FC<CategoryProps> = ({ categoryId, intro }) => {
  const { t } = useTranslation('common');
  const isHub = categoryId === null;
  const cat = isHub ? null : getCategory(categoryId);
  const leather = cat?.leather || 'espresso';
  const ancestors = isHub ? [] : getAncestry(categoryId).slice(0, -1);
  const { live, comingSoon } = isHub
    ? {
        live: [...new Set(
          getRootCategories().flatMap((root) =>
            getMembers(root, { includeDescendants: true }).live,
          ),
        )],
        comingSoon: Object.keys(COMING_SOON),
      }
    : getMembers(categoryId, { includeDescendants: true });
  const kids = isHub ? [] : getChildren(categoryId);
  const parent = isHub ? null : getCategory(cat?.parent ?? null);
  const siblings = parent ? getChildren(parent.id).filter((child) => child !== categoryId) : [];
  const otherRoots = getRootCategories().filter(
    (root) => root !== (isHub ? null : ancestors[0]),
  );

  return (
    <>
      <Nameplate leather={leather} data-leather={leather}>
        <NameplateKicker>
          {isHub ? t('categories.hub.headerTitle') : t('categories.labels.kicker')}
        </NameplateKicker>
        <NameplateTitle>
          {isHub ? t('categories.hub.headerTitle') : t(`categories.${categoryId}.name`)}
        </NameplateTitle>
        <NameplateLine>
          {isHub
            ? t('categories.labels.hubStats', {
                live: live.length,
                families: getRootCategories().length,
              })
            : t(`categories.${categoryId}.oneLiner`)}
        </NameplateLine>
      </Nameplate>
      {intro && (
        <IntroSheet tone="ivory">
          <ReadMore>
            <MarkdownContent source={intro} />
          </ReadMore>
        </IntroSheet>
      )}
      {!isHub && kids.length > 0 && (
        <SectionHead>
          <HeadingRule on="dark">{t('categories.labels.subcategories')}</HeadingRule>
        </SectionHead>
      )}
      <SubGrid>
        {(isHub ? getRootCategories() : kids).map((id) => (
          <CategoryCard key={id} id={id} hub={isHub} />
        ))}
      </SubGrid>
      {!isHub && siblings.length > 0 && (
        <CategoryChips ids={siblings} />
      )}
      <SectionHead>
        <HeadingRule on="dark">
          {isHub ? t('categories.labels.families') : t('categories.labels.ciphers')}
        </HeadingRule>
      </SectionHead>
      <Grid>
        {live.map((cipher) => (
          <CipherCard
            key={cipher}
            cipher={cipher}
            categoryId={isHub ? null : categoryId}
            secondaryOf={
              !isHub && !getCipherCategories(cipher)?.includes(categoryId)
            }
          />
        ))}
        {comingSoon.map((cipher) => (
          <ComingSoonCard key={cipher} cipher={cipher} />
        ))}
      </Grid>
      {!isHub && (
        <>
          <SectionHead>
            <HeadingRule on="dark">{t('categories.labels.otherFamilies')}</HeadingRule>
          </SectionHead>
          <CategoryChips ids={otherRoots} seeAllPath="/category" />
        </>
      )}
      {isHub && (
        <CallOut>
          <CallOutCopy>
            <GreatPrimer as="p">{t('categories.labels.identifyTitle')}</GreatPrimer>
            <Minion as="p">{t('categories.labels.identifyLine')}</Minion>
          </CallOutCopy>
          <Button href="/identify" variant="primary" size="md">
            {t('identify.headerTitle')}
          </Button>
        </CallOut>
      )}
    </>
  );
};

Category.displayName = 'Category';

export default Category;
