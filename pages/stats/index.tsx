import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { Footer, Header, LanguageSelector } from '@molecues';
import { StatisticalCryptanalysis } from '@templates';

const Stat: React.FC = () => {
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
      <StatisticalCryptanalysis />
      <Footer />
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default Stat;
