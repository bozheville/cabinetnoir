import React from 'react';
import { appWithTranslation } from 'next-i18next';
import { RecentlyUsedContext, useRecentlyUsedContext } from '@contexts';

import '../styles/globals.css';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from '@theme';

const GlobalCSS = createGlobalStyle`

@font-face {
  font-family: "Roboto";
  src: url("/fonts/Roboto/Roboto-Medium.ttf");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Roboto";
  src: url("/fonts/Roboto/Roboto-Bold.ttf");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: "Roboto";
  src: url("/fonts/Roboto/Roboto-Black.ttf");
  font-style: normal;
  font-weight: 900;
  font-display: swap;
}

@font-face {
  font-family: "Roboto-Slab";
  src: url("/fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

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
