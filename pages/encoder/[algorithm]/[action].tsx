import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector, Seo } from '@molecues';
import { Encryptor, LearningMaterial, Cryptanalysis } from '@templates';
import { encodingsList, encryptorsList } from '@encryptors';
import { LEARNING_TABS, CRYPTANALYSIS_TAB, hasTab, hasCryptanalysis } from '@learning/config';
import { MARKDOWN_TOPICS } from '@learning/content';
import { DEFAULT_LOCALE, ogImagePath } from '@lib/sitemap-data';

// The second URL segment is shared by the encryption modes (direct /
// reverse), the cryptanalysis tab and the learning tabs (learn /
// history / practice).
const isLearningTab = (action: string | string[] | undefined): boolean =>
  typeof action === 'string' && (LEARNING_TABS as string[]).includes(action);

const isCryptanalysisTab = (action: string | string[] | undefined): boolean =>
  action === CRYPTANALYSIS_TAB;

interface HomeProps {
  learningContent?: Record<string, string>;
}

const Home: React.FC<HomeProps> = ({ learningContent = {} }) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { algorithm, action } = router.query;
  const locale = router.locale || DEFAULT_LOCALE;
  const learningTab = isLearningTab(action);
  const cryptanalysisTab = isCryptanalysisTab(action);
  const cipherTitle = t(`processing.${algorithm as string}.title`);
  const kind = (encodingsList as string[]).includes(algorithm as string) ? 'encoding' : 'encryptor';

  const title = cryptanalysisTab
    ? `${t('learning.tabs.cryptanalysis')} • ${cipherTitle} • ${t('name')}`
    : learningTab
      ? `${t(`learning.tabs.${action as string}`)} • ${cipherTitle} • ${t('name')}`
      : `${t(`seo.toolTitle.${kind}.${action as string}`, { cipher: cipherTitle })} • ${t('name')}`;

  const description = learningTab || cryptanalysisTab
    ? `${cipherTitle}. ${t(`learning.metaDescription.${action as string}`)}`
    : `${t(`seo.toolDescription.${kind}.${action as string}`, { cipher: cipherTitle })} ${t(`learning.${algorithm as string}.description`)}`;

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={`/encoder/${algorithm as string}/${action as string}`}
        image={ogImagePath(algorithm as string, locale)}
        imageAlt={`${cipherTitle} • ${t('name')}`}
        jsonLd={[
          learningTab || cryptanalysisTab
            ? { '@type': 'LearningResource', name: title, description, learningResourceType: action }
            : {
              '@type': 'WebApplication',
              name: title,
              description,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              browserRequirements: 'Requires JavaScript',
              isAccessibleForFree: true,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
            },
        ]}
      />
      <Header
        title={
          cryptanalysisTab
            ? `${t('learning.tabs.cryptanalysis')} / ${t(`processing.${algorithm as string}.title`)}`
            : learningTab
              ? `${t(`learning.tabs.${action as string}`)} / ${t(`processing.${algorithm as string}.title`)}`
              : `${t(`processing.${algorithm as string}.${action as string}Action`)} / ${t(`processing.${algorithm as string}.title`)}`
        }
      >
        <LanguageSelector />
      </Header>
      {cryptanalysisTab ? (
        <Cryptanalysis />
      ) : learningTab ? (
        <LearningMaterial learningContent={learningContent} />
      ) : (
        <Encryptor />
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
  const topics = (MARKDOWN_TOPICS as Record<string, string[]>)[action as string];
  if (Array.isArray(topics) && typeof algorithm === 'string') {
    // Node-only loader: import inside getStaticProps so `fs` never reaches
    // the client bundle.
    const { loadTopicsForTab } = await import('@learning/loadContent');
    learningContent = loadTopicsForTab(algorithm, locale, topics);
  }

  return {
    props: {
      learningContent,
      ...await serverSideTranslations(locale, ['common']),
    },
  };
};

export default Home;
