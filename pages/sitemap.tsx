import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector } from '@molecues';
import { Patch } from '@atoms';
import HeadingRule from '@ornaments/HeadingRule';
import { GreatPrimer, Minion } from '@typography';
import { encodingsList, encryptorsList } from '@encryptors/algorithms';
import { buildSitemapEntries, localePrefix } from '@lib/sitemap-data';

// Standard page anatomy (spec 06 §6): tan band, sheet width, groups as
// drawers with heading rules, links as paper index cards.
const SitemapSection = styled(Patch).attrs({ leather: 'tan', stitch: 'both' })`
  flex: 1 0 auto;

  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: ${({ theme }) => theme.widths.sheet};
    padding: 0 16px 32px;
  }
`;

const Group = styled.div`
  margin-top: 32px;
`;

const Grid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;

  ${({ theme }) => theme.breakpoints.tablet} {
    grid-template-columns: 1fr 1fr;
  }
  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.paper};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  background-color: ${({ theme }) => theme.paper.vellum};
  box-shadow: ${({ theme }) => theme.shadow.card};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageLink = styled(Link)`
  color: ${({ theme }) => theme.ink.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CardHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const CardLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const CardLink = styled(Link)`
  font-size: 13px;
  color: ${({ theme }) => theme.metal.copper.dark};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// Labels for the per-encoder URL segments: the tool modes use the same
// action wording as the tool itself, the learning tabs reuse the tab names.
const segmentLabel = (
  t: (key: string) => string,
  algorithm: string,
  segment: string,
): string => {
  if (segment === 'direct') return t(`processing.${algorithm}.directAction`);
  if (segment === 'reverse') return t(`processing.${algorithm}.reverseAction`);
  return t(`learning.tabs.${segment}`);
};

// The human-readable sitemap: a flat, grouped list of every crawlable page,
// built from the same sitemap-data module that generates sitemap.xml, so
// the two listings are always in sync.
const SitemapPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const prefix = localePrefix(locale);

  const { staticPages, encoders } = buildSitemapEntries();
  const encodings = encoders.filter(
    (encoder) => encodingsList.indexOf(encoder.algorithm) !== -1,
  );
  const encryptors = encoders.filter(
    (encoder) => encryptorsList.indexOf(encoder.algorithm) !== -1,
  );

  const staticLabel = (path: string): string => {
    if (path === '/') return t('sitemap.pages.home');
    if (path === '/identify') return t('identify.title');
    return t('sitemap.title');
  };

  const staticHref = (path: string): string =>
    path === '/' ? prefix || '/' : `${prefix}${path}`;

  return (
    <>
      <Head>
        <title>{`${t('sitemap.title')} • ${t('name')}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={t('sitemap.headerTitle')}>
        <LanguageSelector />
      </Header>
      <SitemapSection>
        <div>
          <Minion>{t('sitemap.subtitle')}</Minion>
          <Group>
            <HeadingRule>{t('sitemap.groups.pages')}</HeadingRule>
            <Grid>
              {staticPages.map((page) => (
                <Card key={page.path}>
                  <PageLink href={staticHref(page.path)}>
                    <GreatPrimer>{staticLabel(page.path)}</GreatPrimer>
                  </PageLink>
                </Card>
              ))}
            </Grid>
          </Group>
          {[
            { key: 'encodings', entries: encodings },
            { key: 'encryptors', entries: encryptors },
          ].map((group) => (
            <Group key={group.key}>
              <HeadingRule>{t(`sitemap.groups.${group.key}`)}</HeadingRule>
              <Grid>
                {group.entries.map((entry) => (
                  <Card key={entry.algorithm}>
                    <CardHead>
                      <GreatPrimer>{t(`processing.${entry.algorithm}.title`)}</GreatPrimer>
                      <CardLinks>
                        {entry.segments.map((segment) => (
                          <CardLink
                            key={segment}
                            href={`${prefix}/encoder/${entry.algorithm}/${segment}`}
                          >
                            {segmentLabel(t, entry.algorithm, segment)}
                          </CardLink>
                        ))}
                      </CardLinks>
                    </CardHead>
                  </Card>
                ))}
              </Grid>
            </Group>
          ))}
        </div>
      </SitemapSection>
      <Footer />
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default SitemapPage;
