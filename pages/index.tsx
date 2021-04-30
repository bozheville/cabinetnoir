import React from 'react';
import Link from 'next/link'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Pane } from 'evergreen-ui';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { encryptorsList } from '@encryptors';
import { Footer } from '@molecues';
import { Canon, DoublePica, GreatPrimer } from '@typography';


const AlgorythmLink = styled.a`
  display: inline-block;
  padding: 1em;

  &:hover {
    background-color: ${({ theme }) => theme.colorScheme.red_violet[50]};
  }
`;

const AlgorythmList = styled.div`
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(4, 25% [col-start]);
  row-gap: 16px;

  ${({ theme }) => theme.breakpoints.small} {
    grid-template-columns: repeat(2, 50% [col-start]);
  }
`;

const Index: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Pane
        textAlign="center"
        paddingTop="64px"
        width="100%"
        maxWidth="640px"
        marginY="0"
        marginX="auto"
      >
        <Pane>
          <Canon>{t('name')}</Canon>
          <DoublePica>{t('home.title')}</DoublePica>
        </Pane>
        <div>
          <GreatPrimer>{t('home.subtitle')}</GreatPrimer>
          <AlgorythmList>
          {encryptorsList.map((algorythm) => (
            <Link key={algorythm} href={`/encoder/${algorythm}/direct`} passHref={true}>
              <AlgorythmLink>{t(`processing.${algorythm}.title`)}</AlgorythmLink>
            </Link>
          ))}
          </AlgorythmList>
        </div>
      </Pane>
      <Footer />;
    </>
  );
};

Index.displayName = 'Index';

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default Index;
