import React, { useState } from 'react';
import Link from 'next/link'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Heading, Pane } from 'evergreen-ui';
import { Footer } from '../components';

const Index: React.FC = () => {
  return (
    <>
    <Pane textAlign="center" paddingTop="64px" width="100%" maxWidth="640px" marginY="0" marginX="auto">

      <Pane>
        <Heading paddingBottom="24px" size={900}>Modern handy decoder for old-fashioned ways of hide a truth</Heading>
        <Heading paddingBottom="24px" size={700}>Here's what you can encrypt and descryot so far.</Heading>
      </Pane>
      <Pane>
        <ul>
          <li>
            <Link href="/encoder/caesar/encrypt" passHref={true}>
              caesar
            </Link>
          </li>
          <li>
            <Link href="/encoder/playfair/encrypt" passHref={true}>
              playfair
            </Link>
          </li>
          <li>
            <Link href="/encoder/morse/encrypt" passHref={true}>
              morse
            </Link>
          </li>
          <li>
            <Link href="/encoder/vigenere/encrypt" passHref={true}>
              vigenere
            </Link>
          </li>
        </ul>
      </Pane>
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
