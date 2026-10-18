import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector } from '@molecues';
import Identification from '@templates/Identification/Identification';

// The cipher identification tool: paste a ciphertext, get a ranked tree
// of candidate ciphers (spec: specs/cipher-identification/).
const IdentifyPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{`${t('identify.title')} • ${t('name')}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={t('identify.headerTitle')}>
        <LanguageSelector />
      </Header>
      <Identification />
      <Footer />
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default IdentifyPage;
