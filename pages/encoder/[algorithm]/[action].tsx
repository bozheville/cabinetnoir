import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector } from '@molecues';
import { Encryptor } from '@templates';
import { encodingsList, encryptorsList } from '@encryptors';

const Home: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { algorithm, action } = router.query;

  return (
    <>
      <Head>
          <title>{`${t(`processing.${algorithm}.title`)} &bull; ${t('name')}`}</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={`${t(`processing.${algorithm}.${action}Action`)} / ${t(`processing.${algorithm}.title`)}`}>
        <LanguageSelector />
      </Header>
      <Encryptor />
      <Footer />
    </>
  );
};

const algorithms = [...encodingsList, ...encryptorsList];
const actions = ['direct', 'reverse'];

export const getStaticPaths = async ({ locales }) => ({
  paths: algorithms.flatMap((algorithm) =>
    actions.flatMap((action) =>
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
