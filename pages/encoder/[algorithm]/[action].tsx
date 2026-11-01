import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector } from '@molecues';
import { Encryptor, LearningMaterial, Cryptanalysis } from '@templates';
import { encodingsList, encryptorsList } from '@encryptors';
import { LEARNING_TABS, CRYPTANALYSIS_TAB, hasTab, hasCryptanalysis } from '@learning/config';
import { MARKDOWN_TOPICS } from '@learning/content';

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
  const learningTab = isLearningTab(action);
  const cryptanalysisTab = isCryptanalysisTab(action);

  return (
    <>
      <Head>
        <title>
          {cryptanalysisTab
            ? `${t('learning.tabs.cryptanalysis')} • ${t(`processing.${algorithm as string}.title`)} • ${t('name')}`
            : learningTab
              ? `${t(`learning.tabs.${action as string}`)} • ${t(`processing.${algorithm as string}.title`)} • ${t('name')}`
              : `${t(`processing.${algorithm as string}.title`)} • ${t('name')}`}
        </title>
        <link rel="icon" href="/favicon.ico" />
        {(learningTab || cryptanalysisTab) && (
          <meta
            name="description"
            content={t(learningTab
              ? `learning.metaDescription.${action as string}`
              : 'learning.metaDescription.cryptanalysis')}
          />
        )}
      </Head>
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
