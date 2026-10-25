import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Footer, Header, LanguageSelector } from '@molecues';
import Section from '@atoms/Section/Section';
import { GreatPrimer, Minion } from '@typography';
import { encodingsList, encryptorsList } from '@encryptors/algorithms';
import { buildSitemapEntries, localePrefix } from '@lib/sitemap-data';

const SitemapSection = styled(Section)`
  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: 720px;
  }
`;

const Group = styled.div`
  margin-top: 32px;
`;

const Grid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  background: ${({ theme }) => theme.colorScheme.white};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
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
  color: ${({ theme }) => theme.colorScheme.blue[600]};
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
            <GreatPrimer>{t('sitemap.groups.pages')}</GreatPrimer>
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
              <GreatPrimer>{t(`sitemap.groups.${group.key}`)}</GreatPrimer>
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
