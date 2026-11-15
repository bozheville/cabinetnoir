import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector, Seo } from '@molecues';
import { Patch } from '@atoms';
import { Category } from '@templates';
import { Breadcrumbs } from '@molecues';
import { DEFAULT_LOCALE, SITE_URL, SUPPORTED_LOCALES, languageTag, ogCategoryImagePath, urlFor } from '@lib/sitemap-data';
import {
  getAllCategoryPaths,
  categoryFromSegments,
  categoryPath,
  getAncestry,
  getChildren,
  getCipherCategories,
  getMembers,
  getPrimaryCategory,
  getRootCategories,
  isIndexable,
} from '@learning/categories';

// Task 03 skeleton: the real nameplate, sub-family cards, cipher grid and
// other-families row arrive in task 04. What is here is crawlable now:
// the heading, the intro text, sub-category links and member names, so the
// page is a real, indexable collection page for family-level queries.
const CategorySection = styled(Patch).attrs({ leather: 'tan', stitch: 'both' })`
  flex: 1 0 auto;

  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: ${({ theme }) => theme.widths.tool};
    padding: 0 16px 32px;
  }
`;


interface CategoryPageProps {
  categoryId: string | null;
  intro: string | null;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, intro }) => {
  const { t } = useTranslation('common');
  const { locale = DEFAULT_LOCALE } = useRouter();
  const tag = languageTag(locale);

  const isHub = categoryId === null;
  const category = isHub ? 'categories.hub' : `categories.${categoryId}`;
  const name = t(`${category}.name`);
  const path = isHub ? '/category' : `/category/${getAncestry(categoryId).join('/')}`;
  const indexable = isHub || isIndexable(categoryId);

  // Crawler-visible member list for the ItemList JSON-LD: live members of
  // this category and its descendants, direct ones first for ancestor pages.
  const live = getMembers(categoryId ?? 'substitution', { includeDescendants: !isHub }).live;
  const ciphers = [...new Set(live.map((cipher) => getPrimaryCategory(cipher) ?? cipher))];

  // Header trail: the ancestors above this category (task 05); the
  // page itself is the h1 in the body.
  const ancestorCrumbs = isHub
    ? []
    : getAncestry(categoryId)
        .slice(0, -1)
        .map((id) => ({
          label: t(`categories.${id}.shortName`),
          path: categoryPath(id),
        }));

  return (
    <>
      <Seo
        title={`${t('seo.category.title', { category: name })} • ${t('name')}`}
        description={isHub ? t('categories.hub.description') : t(`${category}.description`)}
        path={path}
        noindex={!indexable}
        image={ogCategoryImagePath(categoryId, locale)}
        imageAlt={name}
        breadcrumbs={[
          { label: t('name'), path: '/' },
          ...(isHub
            ? []
            : getAncestry(categoryId)
                .slice(0, -1)
                .map((ancestor) => ({
                  label: t(`categories.${ancestor}.shortName`),
                  path: `/category/${getAncestry(ancestor).join('/')}`,
                }))
          ),
          { label: name },
        ]}
        jsonLd={[
          {
            '@type': 'CollectionPage',
            name,
            description: isHub ? t('categories.hub.description') : t(`${category}.description`),
            url: urlFor(path, locale),
            isPartOf: { '@id': `${SITE_URL}/#website` },
            publisher: { '@id': `${SITE_URL}/#organization` },
            inLanguage: tag,
            ...(categoryId
              ? { about: { '@type': 'DefinedTerm', name, description: t(`${category}.oneLiner`) } }
              : {}
            ),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: ciphers.map((cipherOrFamily, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                // Live member ciphers link to their tool page; family ids
                // (hub) link to the family page.
                item: getCipherCategories(cipherOrFamily)
                  ? urlFor(`/encoder/${cipherOrFamily}/direct`, locale)
                  : urlFor(`/category/${cipherOrFamily}`, locale),
              })),
            },
          },
        ]}
      />
      <Header
        title={isHub ? t('categories.hub.headerTitle') : name}
        titleAs="span"
      >
        <LanguageSelector />
      </Header>
      <CategorySection>
        <div>
          <Breadcrumbs trail={[{ label: t('name'), path: '/' }, ...ancestorCrumbs]} />
          <Category categoryId={categoryId} intro={intro} />
        </div>
      </CategorySection>
      <Footer />
    </>
  );
};

export const getStaticPaths = () => ({
  paths: [
    ...SUPPORTED_LOCALES.flatMap(() => [{ params: { path: [] } }]),
    ...getAllCategoryPaths().map((segments) => ({
      params: { path: segments },
    })),
  ],
  fallback: false,
});

export const getStaticProps = async ({ params, locale = DEFAULT_LOCALE }) => {
  const { path: segments = [] } = params;
  const categoryId = segments.length === 0 ? null : categoryFromSegments(segments);

  if (segments.length > 0 && categoryId === null) {
    return { notFound: true };
  }

  // Import Node-only loaders only at build time: pulling `fs` into the
  // client bundle breaks the build (same pattern as encoder pages).
  const { loadCategoryIntro } = await import('@learning/loadContent');

  return {
    props: {
      categoryId,
      intro: loadCategoryIntro(categoryId, locale),
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default CategoryPage;
