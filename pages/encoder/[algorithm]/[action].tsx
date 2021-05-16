import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector } from '@molecues';
import { Encryptor } from '@templates';

const Home: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { algorithm, action } = router.query;

  return (
    <>
      <Head>
        <title>{t(`processing.${algorithm}.title`)} ~ Create Next App</title>
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

export const getStaticPaths = async () => ({
  paths: [], //indicates that no page needs be created at build time
  fallback: 'blocking' //indicates the type of fallback
});

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default Home;
