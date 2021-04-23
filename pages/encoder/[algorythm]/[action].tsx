import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Pane } from 'evergreen-ui';

import { Footer, Header, LanguageSelector } from '@molecues';
import { EncryptionInputs, EncryptionSettings } from '@organisms';

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useTranslation('common');
  const router = useRouter();

  const { algorythm } = router.query;

  return (
    <>
      <Head>
        <title>{t(`processing.${algorythm}.title`)} ~ Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={`${t('welcome')} / ${t(`processing.${algorythm}.title`)}`}>
        <LanguageSelector />
      </Header>
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        padding="16px"
        paddingBottom="48px"
        border="1px solid #aaa"
        borderRadius="8px"
        boxShadow="0px 2px 4px 0px #999"
        margin="24px"
      >
        <EncryptionSettings
          input={input}
          onOutputUpdate={({ output }) => {
            setOutput(output);
          }}
        />
        <EncryptionInputs
          onChange={setInput}
          output={output}
        />
      </Pane>
      <Footer />
    </>
  );
};

export const getStaticPaths = async () => ({
  paths: [], //indicates that no page needs be created at build time
  fallback: 'blocking' //indicates the type of fallback
});

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default Home;
