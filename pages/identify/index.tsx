import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector, Seo } from '@molecues';
import Identification from '@templates/Identification/Identification';
import { DEFAULT_LOCALE, SITE_URL, urlFor } from '@lib/sitemap-data';
import { useRouter } from 'next/router';

// The cipher identification tool: paste a ciphertext, get a ranked tree
// of candidate ciphers (spec: specs/cipher-identification/).
const IdentifyPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { locale = DEFAULT_LOCALE } = useRouter();
  const baseTitle = t('seo.identify.title');
  const title = `${baseTitle} • ${t('name')}`;

  return (
    <>
      <Seo
        title={title}
        description={t('seo.identify.description')}
        path="/identify"
        breadcrumbs={[
          { label: t('name'), path: '/' },
          { label: t('seo.identify.title') },
        ]}
        jsonLd={[
          {
            '@type': 'WebApplication',
            name: baseTitle,
            description: t('seo.identify.description'),
            url: urlFor('/identify', locale),
            image: `${SITE_URL}/og-image.png`,
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
      <Header title={t('identify.headerTitle')} titleAs="span">
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
