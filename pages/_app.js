import React from 'react';
import { appWithTranslation } from 'next-i18next';

import '../styles/globals.css';
import { ThemeProvider } from 'styled-components';
import theme from '@theme';


const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default appWithTranslation(MyApp);
