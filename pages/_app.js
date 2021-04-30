import React from 'react';
import { appWithTranslation } from 'next-i18next';

import '../styles/globals.css';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from '@theme';

const GlobalCSS = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background}
  }
`;


const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalCSS />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default appWithTranslation(MyApp);
