import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector, Seo } from '@molecues';
import { Patch } from '@atoms';
import HeadingRule from '@ornaments/HeadingRule';
import { BodyCopy } from '@typography';
import { DEFAULT_LOCALE, SITE_URL, urlFor } from '@lib/sitemap-data';

const ISSUES_URL = 'https://github.com/bozheville/cabinetnoir/issues/new';
const BUG_URL = `${ISSUES_URL}?labels=bug&template=bug_report.md`;

// Standard page anatomy (spec 06 §6): tan band, reading width, sections
// under heading rules.
const AboutSection = styled(Patch).attrs({ leather: 'tan', stitch: 'both' })`
  flex: 1 0 auto;

  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: ${({ theme }) => theme.widths.read};
    padding: 0 16px 32px;
  }
`;

const Block = styled.section`
  margin-top: 32px;

  ${BodyCopy} {
    margin-top: 12px;
  }
`;

const LinkList = styled.ul`
  margin: 12px 0 0;
  padding-left: 24px;
  font-family: ${({ theme }) => theme.type.body};
  color: ${({ theme }) => theme.ink.primary};

  a {
    color: ${({ theme }) => theme.metal.copper.dark};
  }
`;

// Paragraph keys per section, in reading order.
const SECTIONS: Array<{ key: string; paragraphs: string[] }> = [
  { key: 'who', paragraphs: ['p1', 'p2'] },
  { key: 'editorial', paragraphs: ['p1', 'p2', 'p3'] },
  { key: 'privacy', paragraphs: ['p1', 'p2'] },
  { key: 'sources', paragraphs: ['p1', 'p2'] },
  { key: 'corrections', paragraphs: ['p1'] },
];

// Who makes the site and how its content is made: the accountable author
// and the AI-use disclosure live here, not on every page.
const AboutPage: React.FC = () => {
  const { t } = useTranslation('common');
  const { locale = DEFAULT_LOCALE } = useRouter();
  const baseTitle = t('seo.about.title');

  return (
    <>
      <Seo
        title={`${baseTitle} • ${t('name')}`}
        description={t('seo.about.description')}
        path="/about"
        breadcrumbs={[
          { label: t('name'), path: '/' },
          { label: t('about.headerTitle') },
        ]}
        jsonLd={[
          {
            '@type': 'AboutPage',
            name: baseTitle,
            description: t('seo.about.description'),
            url: urlFor('/about', locale),
            mainEntity: {
              '@type': 'Person',
              '@id': `${SITE_URL}/about#author`,
              name: 'Denys Grybov',
              url: `${SITE_URL}/about`,
            },
            isPartOf: { '@id': `${SITE_URL}/#website` },
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
        ]}
      />
      <Header title={t('about.headerTitle')}>
        <LanguageSelector />
      </Header>
      <AboutSection>
        <div>
          {SECTIONS.map((section) => (
            <Block key={section.key}>
              <HeadingRule>{t(`about.${section.key}.title`)}</HeadingRule>
              {section.paragraphs.map((paragraph) => (
                <BodyCopy key={paragraph}>
                  {t(`about.${section.key}.${paragraph}`)}
                </BodyCopy>
              ))}
              {section.key === 'corrections' && (
                <LinkList>
                  <li>
                    <a href={BUG_URL} target="_blank" rel="noopener noreferrer">
                      {t('about.corrections.reportLink')}
                    </a>
                  </li>
                  <li>
                    <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
                      {t('about.corrections.suggestLink')}
                    </a>
                  </li>
                </LinkList>
              )}
            </Block>
          ))}
        </div>
      </AboutSection>
      <Footer />
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default AboutPage;
