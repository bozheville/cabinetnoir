import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector } from '@molecues';
import { Encryptor, LearningMaterial } from '@templates';
import { encodingsList, encryptorsList } from '@encryptors';
import { LEARNING_TABS, hasTab } from '@learning/config';

// The second URL segment is shared by the encryption modes (direct /
// reverse) and the learning tabs (learn / history / practice).
const isLearningTab = (action: string | string[] | undefined): boolean =>
  typeof action === 'string' && (LEARNING_TABS as string[]).includes(action);

const Home: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { algorithm, action } = router.query;
  const learningTab = isLearningTab(action);

  return (
    <>
      <Head>
        <title>
          {learningTab
            ? `${t(`learning.tabs.${action as string}`)} • ${t(`processing.${algorithm as string}.title`)} • ${t('name')}`
            : `${t(`processing.${algorithm as string}.title`)} • ${t('name')}`}
        </title>
        <link rel="icon" href="/favicon.ico" />
        {learningTab && (
          <meta name="description" content={t(`learning.metaDescription.${action as string}`)} />
        )}
      </Head>
      <Header
        title={
          learningTab
            ? `${t(`learning.tabs.${action as string}`)} / ${t(`processing.${algorithm as string}.title`)}`
            : `${t(`processing.${algorithm as string}.${action as string}Action`)} / ${t(`processing.${algorithm as string}.title`)}`
        }
      >
        <LanguageSelector />
      </Header>
      {learningTab ? <LearningMaterial /> : <Encryptor />}
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
      ...(LEARNING_TABS as string[]).filter((tab) => hasTab(algorithm, tab as any)),
    ].flatMap((action) =>
      locales.map((locale) => ({ params: { algorithm, action }, locale }))
    )
  ),
  fallback: false,
});

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default Home;
