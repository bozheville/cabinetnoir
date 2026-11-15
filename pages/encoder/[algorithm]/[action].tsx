import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector, Seo } from '@molecues';
import { Encryptor, LearningMaterial, Cryptanalysis } from '@templates';
import { encodingsList, encryptorsList } from '@encryptors';
import { LEARNING_TABS, CRYPTANALYSIS_TAB, hasTab, hasCryptanalysis } from '@learning/config';
import { MARKDOWN_TOPICS, TOOL_TOPICS } from '@learning/content';
import type { HistoryReviewInfo } from '@learning/review';
import { DEFAULT_LOCALE, SITE_URL, languageTag, ogImagePath, urlFor } from '@lib/sitemap-data';
import { primaryTrail } from '@hooks/useCipherTrail';
import { useCipherTrail } from '@hooks/useCipherTrail';

// The second URL segment is shared by the encryption modes (direct /
// reverse), the cryptanalysis tab and the learning tabs (learn /
// history / practice).
const isLearningTab = (action: string | string[] | undefined): boolean =>
  typeof action === 'string' && (LEARNING_TABS as string[]).includes(action);

const isCryptanalysisTab = (action: string | string[] | undefined): boolean =>
  action === CRYPTANALYSIS_TAB;

interface HomeProps {
  learningContent?: Record<string, string>;
  // History-tab review state (task 06); null on every other tab.
  review?: HistoryReviewInfo | null;
}

const Home: React.FC<HomeProps> = ({ learningContent = {}, review }) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { algorithm, action } = router.query;
  const locale = router.locale || DEFAULT_LOCALE;
  const learningTab = isLearningTab(action);
  const cryptanalysisTab = isCryptanalysisTab(action);
  const cipherTitle = t(`processing.${algorithm as string}.title`);
  const kind = (encodingsList as string[]).includes(algorithm as string) ? 'encoding' : 'encryptor';

  const tabTitleKey = `seo.tabTitle.${action as string}`;
  const baseTitle = learningTab || cryptanalysisTab
    ? t(tabTitleKey, { cipher: cipherTitle })
    : t(`seo.toolTitle.${kind}.${action as string}`, { cipher: cipherTitle });
  const title = `${baseTitle} • ${t('name')}`;

  // JSON-LD always shows the primary tree, never the remembered one.
  const categoryCrumbs = primaryTrail(algorithm as string, t);

  // Trail shown in the header: Cabinet Noir › <cipher> › this tab. Tool
  // pages sit directly under the cipher's landing page, so their trail is
  // two crumbs.
  const breadcrumbs = [
    { label: t('name'), path: '/' },
    ...categoryCrumbs,
    ...(learningTab || cryptanalysisTab
      ? [{ label: cipherTitle, path: `/encoder/${algorithm as string}/direct` }]
      : []),
    { label: baseTitle },
  ];

  // Every description carries the cipher's own one-liner (or, for
  // history, its era and origin), so no two pages share one.
  const { trail: cipherTrail } = useCipherTrail(algorithm as string);
  const cipherDescription = t(`learning.${algorithm as string}.description`);
  const description = action === 'history'
    ? t('seo.historyDescription', {
      cipher: cipherTitle,
      era: t(`learning.${algorithm as string}.era`),
      origin: t(`learning.${algorithm as string}.origin`),
    })
    : learningTab || cryptanalysisTab
      ? t(`seo.tabDescription.${action as string}`, { cipher: cipherTitle, oneLiner: cipherDescription })
      : `${t(`seo.toolDescription.${kind}.${action as string}`, { cipher: cipherTitle })} ${cipherDescription}`;

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={`/encoder/${algorithm as string}/${action as string}`}
        breadcrumbs={breadcrumbs}
        image={ogImagePath(algorithm as string, locale)}
        imageAlt={`${cipherTitle} • ${t('name')}`}
        // All entities link to the site graph by @id; Google merges them
        // with the Organization and WebSite the home page defines.
        // Reviewed history pages (task 06) get Article markup instead of
        // LearningResource: they carry a visible byline and an <article>
        // element, and the structured data must match what is visible.
        // Dates come from git at build time and are omitted, not faked,
        // when history is unavailable.
        jsonLd={[
          action === 'history' && review?.reviewed
            ? {
              '@type': 'Article',
              headline: t(`seo.heading.${action as string}`, { cipher: cipherTitle }),
              description,
              image: `${SITE_URL}${ogImagePath(algorithm as string, locale)}`,
              inLanguage: languageTag(locale),
              author: { '@id': `${SITE_URL}/about#author` },
              publisher: { '@id': `${SITE_URL}/#organization` },
              mainEntityOfPage: { '@type': 'WebPage', '@id': urlFor(`/encoder/${algorithm as string}/${action as string}`, locale) },
              isPartOf: { '@id': `${SITE_URL}/#website` },
              ...(review.datePublished && { datePublished: review.datePublished }),
              ...(review.dateModified && { dateModified: review.dateModified }),
            }
            : learningTab || cryptanalysisTab
            ? {
              '@type': 'LearningResource',
              name: baseTitle,
              description,
              learningResourceType:
                action === 'practice' ? 'exercise' : 'tutorial',
              about: { '@type': 'DefinedTerm', name: cipherTitle },
              url: urlFor(`/encoder/${algorithm as string}/${action as string}`, locale),
              image: `${SITE_URL}${ogImagePath(algorithm as string, locale)}`,
              isAccessibleForFree: true,
              isPartOf: { '@id': `${SITE_URL}/#website` },
              publisher: { '@id': `${SITE_URL}/#organization` },
            }
            : {
              '@type': 'WebApplication',
              name: baseTitle,
              description,
              url: urlFor(`/encoder/${algorithm as string}/${action as string}`, locale),
              image: `${SITE_URL}${ogImagePath(algorithm as string, locale)}`,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              browserRequirements: 'Requires JavaScript',
              isAccessibleForFree: true,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
              isPartOf: { '@id': `${SITE_URL}/#website` },
              publisher: { '@id': `${SITE_URL}/#organization` },
            },
        ]}
      />
      <Header
        title={
          learningTab || cryptanalysisTab
            ? t(`seo.heading.${action as string}`, { cipher: cipherTitle })
            : `${t(`processing.${algorithm as string}.${action as string}Action`)} / ${cipherTitle}`
        }
        trail={[...cipherTrail, { label: cipherTitle }]}
      >
        <LanguageSelector />
      </Header>
      {cryptanalysisTab ? (
        <Cryptanalysis />
      ) : learningTab ? (
        <LearningMaterial learningContent={learningContent} review={review} />
      ) : (
        <Encryptor toolContent={learningContent.tool} />
      )}
      <Footer />
    </>
  );
};

const algorithms = [...encodingsList, ...encryptorsList];
const actions = ['direct', 'reverse'];

export const getStaticPaths = async ({ locales }) => ({
  paths: algorithms.flatMap((algorithm) =>
    [
      ...actions,
      // Cryptanalysis is a first-class tab for ciphers with a cracker.
      ...(hasCryptanalysis(algorithm) ? [CRYPTANALYSIS_TAB] : []),
      ...(LEARNING_TABS as string[]).filter((tab) => hasTab(algorithm, tab as any)),
    ].flatMap((action) =>
      locales.map((locale) => ({ params: { algorithm, action }, locale }))
    )
  ),
  fallback: false,
});

export const getStaticProps = async ({ locale, params }) => {
  const { algorithm, action } = params;

  let learningContent: Record<string, string> = {};
  const topics = (actions as string[]).includes(action)
    ? TOOL_TOPICS
    : (MARKDOWN_TOPICS as Record<string, string[]>)[action as string];
  if (Array.isArray(topics) && typeof algorithm === 'string') {
    // Node-only loader: import inside getStaticProps so `fs` never reaches
    // the client bundle.
    const { loadTopicsForTab } = await import('@learning/loadContent');
    learningContent = loadTopicsForTab(algorithm, locale, topics);
  }

  // Review state + git dates for history pages (tasks 06 + 12). Also a
  // Node-only import: review.ts shells out to git.
  let review: HistoryReviewInfo | null = null;
  if (action === 'history' && typeof algorithm === 'string') {
    const { getHistoryReview } = await import('@learning/review');
    review = getHistoryReview(algorithm, locale);
  }

  return {
    props: {
      learningContent,
      review,
      ...await serverSideTranslations(locale, ['common']),
    },
  };
};

export default Home;
