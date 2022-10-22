import React from 'react';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

// import { gql } from "@apollo/client";
// import client from '../apollo-client';

import { encodingsList, encryptorsList } from '@encryptors';
import { Footer } from '@molecues';
import { Canon, DoublePica, GreatPrimer } from '@typography';
import Section from '@atoms/Section/Section';

const HomeMenuSection = styled(Section)`
  flex: 1 0 auto;
  padding-top: 64px;

  & > div {
    text-align: center;
    margin: 0 auto;
    width: 100%;
    max-width: 640px;
  }
`;

const AlgorithmLink = styled.a`
  display: inline-block;
  padding: 1em;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colorScheme.red_violet[200]};
  }
`;

const AlgorithmList = styled.div`
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
      <HomeMenuSection stitch="bottom" color="homeMenu">
        <div>
          <Canon>{`${t('name')}`}</Canon>
          <DoublePica>{`${t('home.title')}`}</DoublePica>
        </div>
        <div>
          <GreatPrimer>{`${t('home.subtitle')}`}</GreatPrimer>
          <AlgorithmList>
          <GreatPrimer>Encodings</GreatPrimer>
          {encodingsList.map((algorithm) => (
            <Link key={algorithm} href={`/encoder/${algorithm}/direct`} passHref={true}>
              <AlgorithmLink>{`${t(`processing.${algorithm}.title`)}`}</AlgorithmLink>
            </Link>
          ))}
          <GreatPrimer>Encryptoins</GreatPrimer>
          {encryptorsList.map((algorithm) => (
            <Link key={algorithm} href={`/encoder/${algorithm}/direct`} passHref={true}>
              <AlgorithmLink>{`${t(`processing.${algorithm}.title`)}`}</AlgorithmLink>
            </Link>
          ))}
          </AlgorithmList>
        </div>
      </HomeMenuSection>
      <Footer />
    </>
  );
};

Index.displayName = 'Index';

export const getStaticProps = async ({ locale }) => {
  // const { data } = await client.query({
  //   query: gql`
  //     query User {
  //       user(id: 93561) {
  //         id
  //         name
  //         email
  //       }
  //     }
  //   `,
  // });

  return {
    props: {
      ...await serverSideTranslations(locale, ['common']),
    },
  };
};

export default Index;
