import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import {
  DEFAULT_LOCALE,
  OG_LOCALES,
  alternatesFor,
  languageTag,
  urlFor,
} from '@lib/sitemap-data';

interface SeoProps {
  title: string;
  description: string;
  // Locale-free page path, e.g. `/encoder/caesar/direct` or `/`.
  path: string;
  // schema.org objects, rendered as JSON-LD.
  jsonLd?: Record<string, unknown>[];
}

// Per-page head tags search engines rely on: title, description,
// self-canonical, hreflang alternates for every locale, Open Graph and
// optional structured data.
const Seo: React.FC<SeoProps> = ({ title, description, path, jsonLd = [] }) => {
  const { t } = useTranslation('common');
  const { locale = DEFAULT_LOCALE } = useRouter();
  const canonical = urlFor(path, locale);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={canonical} />
      {alternatesFor(path).map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={t('name')} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={OG_LOCALES[locale] || OG_LOCALES[DEFAULT_LOCALE]} />
      <meta name="twitter:card" content="summary" />
      {jsonLd.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              inLanguage: languageTag(locale),
              ...data,
            }).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </Head>
  );
};

Seo.displayName = 'Seo';

export default Seo;
