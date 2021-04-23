import React, { useState } from 'react';
import Link from 'next/link'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Pane } from 'evergreen-ui';
import { Footer } from '@molecues';
import { Canon, DoublePica } from '@typography';

const Index: React.FC = () => {
  return (
    <>
    <Pane textAlign="center" paddingTop="64px" width="100%" maxWidth="640px" marginY="0" marginX="auto">

      <Pane>
        <Canon>Modern handy decoder for old-fashioned ways of hide a truth</Canon>
        <DoublePica>Here's what you can encrypt and descryot so far.</DoublePica>
      </Pane>
      <Pane>
        <ul>
          <li>
            <Link href="/encoder/caesar/direct" passHref={true}>
              caesar
            </Link>
          </li>
          <li>
            <Link href="/encoder/playfair/direct" passHref={true}>
              playfair
            </Link>
          </li>
          <li>
            <Link href="/encoder/morse/direct" passHref={true}>
              morse
            </Link>
          </li>
          <li>
            <Link href="/encoder/vigenere/direct" passHref={true}>
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
