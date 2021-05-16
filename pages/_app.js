import React from 'react';
import { appWithTranslation } from 'next-i18next';
import { RecentlyUsedContext, useRecentlyUsedContext } from '@contexts';

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
      <RecentlyUsedContext.Provider value={useRecentlyUsedContext()}>
        <GlobalCSS />
        <Component {...pageProps} />
      </RecentlyUsedContext.Provider>
    </ThemeProvider>
  );
};

export default appWithTranslation(MyApp);
