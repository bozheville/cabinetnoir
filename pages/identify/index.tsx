import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector, Seo } from '@molecues';
import Identification from '@templates/Identification/Identification';

// The cipher identification tool: paste a ciphertext, get a ranked tree
// of candidate ciphers (spec: specs/cipher-identification/).
const IdentifyPage: React.FC = () => {
  const { t } = useTranslation('common');
  const title = `${t('identify.title')} • ${t('name')}`;

  return (
    <>
      <Seo
        title={title}
        description={t('identify.subtitle')}
        path="/identify"
        jsonLd={[
          {
            '@type': 'WebApplication',
            name: title,
            description: t('identify.subtitle'),
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            browserRequirements: 'Requires JavaScript',
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          },
        ]}
      />
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
